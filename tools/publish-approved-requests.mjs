import {catHeroArticle} from '../src/cat-hero-article.js';
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
  const source=await articleSnapshot(request.articleKey,[...primary,...supplemental,catHeroArticle]);
  if(!source.approved)throw new Error('LOCAL_ARTICLE_NOT_APPROVED');
  const catalog=[...primary,...supplemental,catHeroArticle];
  validateArticleDraft(catalog.find(x=>x.articleKey===request.articleKey));
  const publishUrl='https://akkigo-boja.ansqhd5774.workers.dev/internal/articles/publish';
  const requireUnchanged=process.env.READONLY_PUBLISH_TEST==='true';
  const payload=JSON.stringify({articleKey:request.articleKey,postSha256:source.postSha256,...(requireUnchanged?{requireUnchanged:true}:{}),...(request.existingOnly===true?{existingOnly:true}:{})});
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
    if(request.existingOnly===true&&response.status===409&&body.error==='ARTICLE_NOT_LIVE_UPDATE_ONLY'){
      console.log('EXISTING_ONLY_NOT_LIVE_SKIPPED',request.articleKey);break;
    }
    throw new Error(`ARTICLE_PUBLISH_HTTP_${response.status}_${body.error || 'UNKNOWN'}`);
  }
  if(request.existingOnly===true&&body.error==='ARTICLE_NOT_LIVE_UPDATE_ONLY')continue;
  if (body.status!=='LIVE' || typeof body.url!=='string' || new URL(body.url).hostname!=='lsifl.blogspot.com') throw new Error('ARTICLE_PUBLISH_RESPONSE_INVALID');
  if(requireUnchanged && (body.alreadyLive!==true || body.updated!==false))throw Error('UNCHANGED_PUBLISH_PROBE_RESPONSE_INVALID');
  if(requireUnchanged && (body.postId!==process.env.UNCHANGED_EXPECTED_POST_ID || body.url!==process.env.UNCHANGED_EXPECTED_URL))throw Error('UNCHANGED_PUBLISH_PROBE_IDENTITY_CHANGED');
  if(requireUnchanged)console.log('UNCHANGED_PUBLISH_CLIENT_PASS',JSON.stringify({postId:body.postId,url:body.url,updated:body.updated}));
  // The Blogger API LIVE response is the publication handoff boundary.
  // The reader performs visual / interactive inspection after receiving the URL.
  // A best-effort public content-marker probe is diagnostic only: it must not
  // make an already-LIVE publication appear failed or provoke another publish.
  if (body.publicVerified!==true) console.log('PUBLIC_CONTENT_MARKER_UNCONFIRMED_USER_REVIEW',request.articleKey);
  // Do not launch additional browser/viewport QA here. The operator reviews
  // the published Blogger URL; visual QA is run only for an explicit defect.
  console.log(JSON.stringify({articleKey:request.articleKey,status:body.status,url:body.url,postId:body.postId,publicVerified:body.publicVerified,alreadyLive:Boolean(body.alreadyLive),userReviewRequired:true,visualQa:"USER_REVIEW"}));
  console.log('BLOGGER_LIVE_USER_REVIEW_URL',body.url);
  processed++;
}
if (!processed) throw new Error('NO_APPROVED_REQUESTS');
