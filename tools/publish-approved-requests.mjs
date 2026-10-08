import {readFile} from 'node:fs/promises';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {articleSnapshot} from '../src/article-snapshot.js';
import {validateArticleDraft} from './validate-article-draft.mjs';

const token=process.env.GITHUB_OIDC_TOKEN;
if (!token) throw new Error('GITHUB_OIDC_TOKEN_MISSING');
const dir=new URL('../publish-requests/',import.meta.url);
const requested=process.argv.slice(2).map(x=>x.replace(/^publish-requests\//,''));
if(requested.some(x=>!/^[-a-z0-9]+\.json$/.test(x)))throw Error('INVALID_REQUEST_FILE');
if (!requested.length) throw new Error('NO_EXPLICIT_PUBLISH_REQUESTS');
const names=[...new Set(requested)].sort();
const processedKeys=new Set();
let processed=0;
for (const name of names) {
  const request=JSON.parse(await readFile(new URL(name,dir),'utf8'));
  if (request.approved!==true || typeof request.articleKey!=='string') continue;
  if (processedKeys.has(request.articleKey)) {
    console.log('DUPLICATE_ARTICLE_REQUEST_SKIPPED',request.articleKey);
    continue;
  }
  processedKeys.add(request.articleKey);
  const source=await articleSnapshot(request.articleKey,[...primary,...supplemental]);
  if(!source.approved)throw new Error('LOCAL_ARTICLE_NOT_APPROVED');
  const catalog=[...primary,...supplemental];
  validateArticleDraft(catalog.find(x=>x.articleKey===request.articleKey));
  const publishUrl='https://akkigo-boja.ansqhd5774.workers.dev/internal/articles/publish';
  const payload=JSON.stringify({articleKey:request.articleKey,postSha256:source.postSha256});
  let response,body;
  for(let attempt=1;attempt<=2;attempt++){
    response=await fetch(publishUrl,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:payload});
    body=await response.json().catch(()=>({error:'INVALID_RESPONSE'}));
    if(response.ok)break;
    // This error is raised before any Blogger or D1 mutation, so exactly one retry is safe.
    // Never retry ambiguous network errors, 5xx, reconciliation errors or other 409 responses.
    if(attempt===1&&response.status===409&&body.error==='ARTICLE_NOT_APPROVED'){
      console.log('PRE_MUTATION_NOT_APPROVED_WAIT_RETRY_ONCE',request.articleKey);
      await new Promise(resolve=>setTimeout(resolve,2500));
      continue;
    }
    throw new Error(`ARTICLE_PUBLISH_HTTP_${response.status}_${body.error || 'UNKNOWN'}`);
  }
  if (body.status!=='LIVE' || typeof body.url!=='string' || new URL(body.url).hostname!=='lsifl.blogspot.com') throw new Error('ARTICLE_PUBLISH_RESPONSE_INVALID');
  if (body.publicVerified!==true) throw new Error('PUBLIC_VERIFY_FAILED_AFTER_PUBLISH');
  console.log(JSON.stringify({articleKey:request.articleKey,status:body.status,url:body.url,postId:body.postId,publicVerified:body.publicVerified,alreadyLive:Boolean(body.alreadyLive)}));
  processed++;
}
if (!processed) throw new Error('NO_APPROVED_REQUESTS');
