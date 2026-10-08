import {appendFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export function makeSummary(env) {
  const reused = env.VERIFY_REUSED === 'true';
  const deploy = env.DEPLOY_NEEDED === 'true';
  return `### Actions execution\n\n| Item | Value |\n|---|---|\n| Source SHA | ${env.SOURCE_SHA || env.GITHUB_SHA} |\n| Verification | ${reused ? 'REUSED' : 'LOCAL'} |\n| Reason | ${env.VERIFY_REASON || 'FULL_VERIFY'} |\n| Full check sets scheduled | ${reused ? 0 : 1} |\n| Dependency install scheduled | ${reused && !deploy ? 0 : 1} |\n| Worker deploy needed | ${deploy} |\n| Job result | ${env.JOB_RESULT || 'unknown'} |\n\nActual step outcomes are recorded in the job timeline. Runner savings are not GitHub billed minutes.\n`;
}
if(process.argv[1] === fileURLToPath(import.meta.url) && process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, makeSummary(process.env));
