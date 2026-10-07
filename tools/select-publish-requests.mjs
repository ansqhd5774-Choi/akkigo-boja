import {execFileSync} from 'node:child_process';
import {appendFileSync,existsSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const SHA=/^[a-f0-9]{40}$/i;
const ARTICLE=/^publish-requests\/[a-z0-9-]+\.json$/;
const HUB=/^publish-requests\/hub-refresh-[a-z0-9-]+\.json$/;

export function classifyChangedRequestPaths(paths) {
  const articlePaths=[];
  const hubPaths=[];
  for (const path of new Set(paths)) {
    if (HUB.test(path)) hubPaths.push(path);
    else if (ARTICLE.test(path)) articlePaths.push(path);
    else if (path.startsWith('publish-requests/') && path.endsWith('.json')) {
      throw new Error('INVALID_PUBLISH_REQUEST_PATH');
    }
  }
  return {articlePaths:articlePaths.sort(),hubPaths:hubPaths.sort()};
}

export function changedRequestPaths(before,head,{cwd=process.cwd()}={}) {
  if (!SHA.test(before||'') || !SHA.test(head||'')) throw new Error('INVALID_PUSH_RANGE_SHA');
  execFileSync('git',['cat-file','-e',before+'^{commit}'],{cwd,stdio:'pipe'});
  execFileSync('git',['cat-file','-e',head+'^{commit}'],{cwd,stdio:'pipe'});
  const output=execFileSync('git',['diff','--name-only','--diff-filter=ACMR','-z',before,head,'--','publish-requests/'],{cwd,encoding:'utf8'});
  const paths=output.split('\0').filter(Boolean);
  for (const path of paths) if (!existsSync(resolve(cwd,path))) throw new Error('CHANGED_REQUEST_FILE_MISSING');
  return classifyChangedRequestPaths(paths);
}

function main() {
  const [before,head]=process.argv.slice(2);
  const selected=changedRequestPaths(before,head);
  if (!process.env.RUNNER_TEMP || !process.env.GITHUB_OUTPUT) throw new Error('GITHUB_ACTIONS_ENV_REQUIRED');
  writeFileSync(resolve(process.env.RUNNER_TEMP,'publish-article-paths.txt'),selected.articlePaths.join('\n')+(selected.articlePaths.length?'\n':''));
  writeFileSync(resolve(process.env.RUNNER_TEMP,'publish-hub-paths.txt'),selected.hubPaths.join('\n')+(selected.hubPaths.length?'\n':''));
  const count=selected.articlePaths.length+selected.hubPaths.length;
  appendFileSync(process.env.GITHUB_OUTPUT,'has_requests='+(count?'true':'false')+'\n');
  console.log('PUBLISH_REQUEST_RANGE_COUNT',count,'articles',selected.articlePaths.length,'hubs',selected.hubPaths.length);
  if (!count) console.log('NO_NEW_PUBLISH_REQUESTS');
}

if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) main();
