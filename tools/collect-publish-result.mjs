import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export function extractLiveResults(log) {
  const results = new Map();
  for (const line of log.split(/\r?\n/)) {
    const start = line.indexOf('{"articleKey":');
    if (start < 0) continue;
    let value;
    try { value = JSON.parse(line.slice(start)); } catch { continue; }
    if (value.status !== 'LIVE' || value.publicVerified !== true) continue;
    let url;
    try { url = new URL(value.url); } catch { continue; }
    if (url.protocol !== 'https:' || url.hostname !== 'lsifl.blogspot.com' || url.search || url.hash) continue;
    results.set(value.articleKey, {articleKey:value.articleKey, status:'LIVE', url:url.href,
      postId:value.postId, publicVerified:true});
  }
  return [...results.values()];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [runId, articleKey] = process.argv.slice(2);
  if (!/^\d+$/.test(runId || '') || !/^[a-z0-9-]+$/.test(articleKey || ''))
    throw Error('Usage: node tools/collect-publish-result.mjs RUN_ID ARTICLE_KEY');
  const repo = 'ansqhd5774-Choi/akkigo-boja';
  const gh = args => execFileSync('gh', args, {encoding:'utf8', maxBuffer:16*1024*1024});
  const run = JSON.parse(gh(['run','view',runId,'--repo',repo,'--json','status,conclusion,headSha,url']));
  const results = run.status === 'completed'
    ? extractLiveResults(gh(['run','view',runId,'--repo',repo,'--log'])).filter(row=>row.articleKey===articleKey) : [];
  console.log(JSON.stringify({run, result:results[0] || null,
    state:run.status !== 'completed' ? 'RUNNING'
      : run.conclusion !== 'success' ? 'ACTION_FAILED'
      : results.length ? 'LIVE_CONFIRMED' : 'LIVE_UNCONFIRMED'}, null, 2));
  if (run.status === 'completed' && (run.conclusion !== 'success' || !results.length)) process.exitCode = 1;
}
