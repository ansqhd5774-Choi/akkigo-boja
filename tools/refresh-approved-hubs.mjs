import {readFile} from 'node:fs/promises';

const requestPath=process.argv[2];
if (!requestPath || !/^(?:hub-refresh-requests|publish-requests)\/[a-zA-Z0-9._-]+\.json$/.test(requestPath)) throw new Error('REFRESH_REQUEST_PATH_REQUIRED');
const input=JSON.parse(await readFile(requestPath,'utf8'));
const allowed=new Set(['zeus','lineagem','wuthering']);
if (!Array.isArray(input.hubKeys) || !input.hubKeys.length || input.hubKeys.some(key=>!allowed.has(key))) throw new Error('INVALID_HUB_KEYS');
const token=process.env.GITHUB_OIDC_TOKEN;
if (!token) throw new Error('GITHUB_OIDC_TOKEN_MISSING');
const endpoint='https://akkigo-boja.ansqhd5774.workers.dev/internal/hubs/refresh';
for (const hubKey of input.hubKeys) {
  const response=await fetch(endpoint,{
    method:'POST',
    headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
    body:JSON.stringify({hubKey})
  });
  const body=await response.json().catch(()=>({error:'INVALID_RESPONSE'}));
  if (!response.ok) throw new Error(`HUB_REFRESH_FAILED_${hubKey}_${body.error||response.status}`);
  console.log(JSON.stringify({hubKey,status:body.status||'UPDATED',url:body.url||null,postId:body.postId||null}));
}
