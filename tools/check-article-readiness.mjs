import {catHeroArticle} from '../src/cat-hero-article.js';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {articleSnapshot} from '../src/article-snapshot.js';
import {validateArticleDraft} from './validate-article-draft.mjs';

const service='https://akkigo-boja.ansqhd5774.workers.dev/internal/articles/preflight';
export async function probeSnapshots(keys,{transport=fetch,token,sleep=ms=>new Promise(r=>setTimeout(r,ms)),attempts=1,delayMs=2500}={}){
  if(!token)throw Error('GITHUB_OIDC_TOKEN_MISSING');
  const keysToCheck=[...new Set(keys)];
  const snapshots=await Promise.all(keysToCheck.map(k=>articleSnapshot(k,[...primary,...supplemental,catHeroArticle])));
  if(snapshots.some(x=>!x.approved))throw Error('LOCAL_ARTICLE_NOT_APPROVED');
  for(const key of keysToCheck)validateArticleDraft([...primary,...supplemental,catHeroArticle].find(x=>x.articleKey===key));
  for(let attempt=1;attempt<=attempts;attempt++){
    let matching=0;
    let detail='REMOTE_SNAPSHOT_NOT_READY';
    for(const local of snapshots){
      try{
        const response=await transport(service,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({articleKey:local.articleKey}),signal:AbortSignal.timeout(10000)});
        if(response.status===401 || response.status===403)throw Error('PREFLIGHT_AUTH_FAILED');
        const result=await response.json().catch(()=>({}));
        if(response.ok && result.approved===true && result.articleKey===local.articleKey && result.postSha256===local.postSha256){matching++;continue;}
        detail=response.ok?'SNAPSHOT_MISMATCH':'REMOTE_HTTP_'+response.status;
      }catch(error){
        if(error.message==='PREFLIGHT_AUTH_FAILED')throw error;
        detail='REMOTE_PREFLIGHT_UNAVAILABLE';
      }
    }
    if(matching===snapshots.length)return {ready:true,attempt,checked:matching};
    if(attempt<attempts)await sleep(delayMs);
    else return {ready:false,attempt,checked:matching,reason:detail};
  }
  return {ready:false,checked:0,reason:'NO_ATTEMPT'};
}
async function main(){
  const wait=process.argv.includes('--wait');
  const temp=process.env.RUNNER_TEMP;
  if(!temp)throw Error('GITHUB_RUNNER_TEMP_MISSING');
  const raw=await readFile(join(temp,'publish-article-paths.txt'),'utf8');
  const hubRaw=await readFile(join(temp,'publish-hub-paths.txt'),'utf8');
  const fileNames=raw.split(/\r?\n/).filter(Boolean);
  if(fileNames.some(x=>!/^publish-requests\/[a-z0-9-]+\.json$/.test(x)))throw Error('INVALID_PUBLISH_REQUEST_PATH');
  if(fileNames.length===0){console.log('PREFLIGHT_SKIPPED_NO_ARTICLES');return;}
  const names=[];
  for(const file of fileNames){
    const request=JSON.parse(await readFile(file,'utf8'));
    if(request.approved!==true || typeof request.articleKey!=='string')throw Error('LOCAL_REQUEST_NOT_APPROVED');
    names.push(request.articleKey);
  }
  const result=await probeSnapshots(names,{token:process.env.GITHUB_OIDC_TOKEN,attempts:wait?9:1});
  console.log('ARTICLE_SNAPSHOT_PREFLIGHT',JSON.stringify(result));
  if(wait && !result.ready)throw Error('ARTICLE_SNAPSHOT_NOT_READY_ABORT');
  if(!wait){
    const {appendFileSync}=await import('node:fs');
    if(!process.env.GITHUB_OUTPUT)throw Error('GITHUB_OUTPUT_MISSING');
    const hasHubRequests=hubRaw.trim().length>0;
    appendFileSync(process.env.GITHUB_OUTPUT,'worker_ready='+(result.ready&&!hasHubRequests?'true':'false')+'\n');
  }
}
if(process.argv[1]?.endsWith('check-article-readiness.mjs'))await main();
