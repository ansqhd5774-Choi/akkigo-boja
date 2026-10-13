import {appendFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {expectedCertificate, matchesCertificate, parseCertificate} from './verification-certificate.mjs';

export const requiredSteps = ['Source tests', 'Worker dry-run build', 'Regenerate Blogger theme and require clean diff', 'Validate Blogger XML', 'Mark exact verified source'];
export const isPublishRequestPath = path => /^publish-requests\/[a-z0-9-]+\.json$/.test(path || '');
export function publishRequestOnlyFiles(files = []) {
  return files.length > 0 && files.every(file => isPublishRequestPath(file?.filename) && (!file?.previous_filename || isPublishRequestPath(file.previous_filename)));
}
export function eligibleRun(run, sha, repository) {
  return /^[a-f0-9]{40}$/.test(sha || '') && run.head_sha === sha && run.status === 'completed' && run.conclusion === 'success' && run.head_branch === 'codex/blogger-worker-r1' && ['push', 'workflow_dispatch'].includes(run.event) && run.head_repository?.full_name === repository;
}
export function completeCoverage(jobs) {
  return jobs.some(job => job.name === 'verify' && job.conclusion === 'success' && requiredSteps.every(name => job.steps?.some(step => step.name === name && step.status === 'completed' && step.conclusion === 'success')));
}
const headers = token => ({...(token ? {Authorization: `Bearer ${token}`} : {}), Accept: 'application/vnd.github+json'});
export async function findVerification({repository, sha, token, request = fetch, expected = expectedCertificate(sha), budgetMs = 15000}) {
  if(repository !== 'ansqhd5774-Choi/akkigo-boja') throw Error('REPOSITORY_TARGET_MISMATCH');
  const signal = AbortSignal.timeout(budgetMs);
  const get = async (path, text = false) => {
    signal.throwIfAborted();
    const response = await request(`https://api.github.com/repos/${repository}/${path}`, {headers: headers(token), signal});
    if(!response.ok) throw Error(`VERIFY_LOOKUP_HTTP_${response.status}`);
    return text ? response.text() : response.json();
  };
  const result = await get(`actions/workflows/verify.yml/runs?head_sha=${sha}&per_page=20`);
  for(const run of result.workflow_runs || []) {
    if(!eligibleRun(run, sha, repository)) continue;
    const {jobs} = await get(`actions/runs/${run.id}/jobs?filter=latest&per_page=100`);
    if(completeCoverage(jobs || [])) {
      const job = jobs.find(job => completeCoverage([job]));
      const certificate = parseCertificate(await get(`actions/jobs/${job.id}/logs`, true));
      if(matchesCertificate(certificate, expected)) return run.id;
    }
  }
  return null;
}
export async function isPublishRequestOnlyDescendant({repository, baseSha, sha, token, request = fetch, budgetMs = 10000}) {
  if(repository !== 'ansqhd5774-Choi/akkigo-boja') throw Error('REPOSITORY_TARGET_MISMATCH');
  if(!/^[a-f0-9]{40}$/.test(baseSha || '') || !/^[a-f0-9]{40}$/.test(sha || '') || baseSha === sha) return false;
  const response = await request(`https://api.github.com/repos/${repository}/compare/${baseSha}...${sha}`, {
    headers: headers(token),
    signal: AbortSignal.timeout(budgetMs)
  });
  if(!response.ok) throw Error(`VERIFY_COMPARE_HTTP_${response.status}`);
  const compared = await response.json();
  if(compared.merge_base_commit?.sha !== baseSha) return false;
  return publishRequestOnlyFiles(compared.files || []);
}
export async function findReusableVerification({repository, sha, baseSha, token, request = fetch}) {
  const exact = await findVerification({repository, sha, token, request});
  if(exact) return {id: exact, verifiedSha: sha, reason: 'EXACT_SHA_ENVIRONMENT_COVERAGE_MATCH', mode: 'exact'};
  if(await isPublishRequestOnlyDescendant({repository, baseSha, sha, token, request})) {
    const base = await findVerification({repository, sha: baseSha, token, request});
    if(base) return {id: base, verifiedSha: baseSha, reason: 'VERIFIED_BASE_PUBLISH_REQUEST_ONLY', mode: 'publish-request-only'};
  }
  return null;
}
async function main() {
  let match = null;
  let reason = 'NO_COMPLETE_MATCH';
  const sha = process.env.SOURCE_SHA || process.env.GITHUB_SHA;
  try {
    match = await findReusableVerification({
      repository: process.env.GITHUB_REPOSITORY,
      sha,
      baseSha: process.env.VERIFY_BASE_SHA,
      token: process.env.GH_TOKEN
    });
  } catch {
    reason = 'LOOKUP_UNAVAILABLE_OR_TIMEOUT';
    console.log('VERIFY_LOOKUP_UNAVAILABLE_LOCAL_CHECKS_REQUIRED');
  }
  if(!process.env.GITHUB_OUTPUT) throw Error('GITHUB_OUTPUT_MISSING');
  appendFileSync(process.env.GITHUB_OUTPUT,
    `reused=${Boolean(match)}\nverified_sha=${match?.verifiedSha || ''}\nreason=${match?.reason || reason}\nreuse_mode=${match?.mode || ''}\n`);
  console.log(match ? `FULL_VERIFY_REUSED run=${match.id} source=${match.verifiedSha} mode=${match.mode}` : 'LOCAL_FULL_VERIFY_REQUIRED');
}
if(process.argv[1] === fileURLToPath(import.meta.url)) await main();
