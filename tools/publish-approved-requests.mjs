import {readdir,readFile} from 'node:fs/promises';

const token=process.env.GITHUB_OIDC_TOKEN;
if (!token) throw new Error('GITHUB_OIDC_TOKEN_MISSING');
const dir=new URL('../publish-requests/',import.meta.url);
const names=(await readdir(dir)).filter(x=>x.endsWith('.json')).sort();
if (!names.length) throw new Error('NO_PUBLISH_REQUESTS');

let processed=0;
for (const name of names) {
  const request=JSON.parse(await readFile(new URL(name,dir),'utf8'));
  if (request.approved!==true || typeof request.articleKey!=='string') continue;
  const response=await fetch('https://akkigo-boja.ansqhd5774.workers.dev/internal/articles/publish',{
    method:'POST',
    headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
    body:JSON.stringify({articleKey:request.articleKey})
  });
  const body=await response.json().catch(()=>({error:'INVALID_RESPONSE'}));
  if (!response.ok) throw new Error(`ARTICLE_PUBLISH_HTTP_${response.status}_${body.error || 'UNKNOWN'}`);
  if (body.status!=='LIVE' || typeof body.url!=='string' || new URL(body.url).hostname!=='lsifl.blogspot.com') throw new Error('ARTICLE_PUBLISH_RESPONSE_INVALID');
  if (body.publicVerified!==true) throw new Error('PUBLIC_VERIFY_FAILED_AFTER_PUBLISH');
  console.log(JSON.stringify({articleKey:request.articleKey,status:body.status,url:body.url,postId:body.postId,publicVerified:body.publicVerified,alreadyLive:Boolean(body.alreadyLive)}));
  processed++;
}
if (!processed) throw new Error('NO_APPROVED_REQUESTS');
