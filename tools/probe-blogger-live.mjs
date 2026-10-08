const token=process.env.GITHUB_OIDC_TOKEN;
if(!token)throw Error('GITHUB_OIDC_TOKEN_MISSING');
const articleKey='shibarpg-pickup-202610';
const response=await fetch('https://akkigo-boja.ansqhd5774.workers.dev/internal/articles/preflight',{
  method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
  body:JSON.stringify({articleKey,readOnlyLive:true}),signal:AbortSignal.timeout(120000)
});
if(!response.ok)throw Error('READONLY_LIVE_PROBE_HTTP_'+response.status);
const result=await response.json();
const live=result.live;
if(!result.approved || live?.readOnly!==true || live.status!=='LIVE' || live.postId!=='4686430079776725627' || live.url!=='https://lsifl.blogspot.com/2026/10/pick7p2y.html')throw Error('BLOGGER_LIVE_PROBE_MISMATCH');
console.log('OIDC_WORKER_D1_BLOGGER_LIVE_PASS',JSON.stringify(live));
