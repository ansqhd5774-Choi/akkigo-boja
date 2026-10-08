import {appendFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

export const requiredSteps = ['Source tests', 'Worker dry-run build', 'Regenerate Blogger theme and require clean diff', 'Validate Blogger XML', 'Mark exact verified source'];
export function eligibleRun(run, sha, repository) {
  return /^[a-f0-9]{40}$/.test(sha || '') && run.head_sha === sha && run.status === 'completed' && run.conclusion === 'success' && run.head_branch === 'codex/blogger-worker-r1' && ['push', 'workflow_dispatch'].includes(run.event) && run.head_repository?.full_name === repository;
}
export function completeCoverage(jobs) {
  return jobs.some(job => job.name === 'verify' && job.conclusion === 'success' && requiredSteps.every(name => job.steps?.some(step => step.name === name && step.status === 'completed' && step.conclusion === 'success')));
}
export async function findVerification({repository, sha, token, request = fetch}) {
  if(repository !== 'ansqhd5774-Choi/akkigo-boja') throw Error('REPOSITORY_TARGET_MISMATCH');
  const get = async path => {
    const response = await request(`https://api.github.com/repos/${repository}/${path}`, {headers: {Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json'}, signal: AbortSignal.timeout(20000)});
    if(!response.ok) throw Error(`VERIFY_LOOKUP_HTTP_${response.status}`);
    return response.json();
  };
  const result = await get(`actions/workflows/verify.yml/runs?head_sha=${sha}&per_page=20`);
  for(const run of result.workflow_runs || []) {
    if(!eligibleRun(run, sha, repository)) continue;
    const {jobs} = await get(`actions/runs/${run.id}/jobs?filter=latest&per_page=100`);
    if(completeCoverage(jobs || [])) return run.id;
  }
  return null;
}
async function main() {
  let id = null;
  try { id = await findVerification({repository: process.env.GITHUB_REPOSITORY, sha: process.env.GITHUB_SHA, token: process.env.GH_TOKEN}); }
  catch { console.log('VERIFY_LOOKUP_UNAVAILABLE_LOCAL_CHECKS_REQUIRED'); }
  if(!process.env.GITHUB_OUTPUT) throw Error('GITHUB_OUTPUT_MISSING');
  appendFileSync(process.env.GITHUB_OUTPUT, `reused=${Boolean(id)}\nverified_sha=${id ? process.env.GITHUB_SHA : ''}\n`);
  console.log(id ? `EXACT_SHA_FULL_VERIFY_REUSED run=${id}` : 'LOCAL_FULL_VERIFY_REQUIRED');
}
if(process.argv[1] === fileURLToPath(import.meta.url)) await main();
