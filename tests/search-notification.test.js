import {test} from 'node:test';
import assert from 'node:assert/strict';
import {notifyPublication} from '../tools/notify-search-publication.mjs';
const live={status:'LIVE',publicVerified:true,url:'https://lsifl.blogspot.com/2026/10/example.html'};
test('unverified, unchanged and invalid URLs never submit',async()=>{
  const options={token:'fixture',fetcher:()=>{throw Error('must not call');}};
  assert.equal((await notifyPublication({...live,publicVerified:false},options)).state,'SKIPPED_PUBLIC_UNVERIFIED');
  assert.equal((await notifyPublication({...live,alreadyLive:true,updated:false},options)).state,'SKIPPED_UNCHANGED');
  assert.equal((await notifyPublication({...live,url:'https://other.example/'},options)).state,'INVALID_URL');
});
test('missing token is blocked, not a successful notification',async()=>{
  assert.equal((await notifyPublication(live,{token:''})).state,'BLOCKED_CREDENTIAL_MISSING');
});
test('provider acceptance requires successful body and accepted URL count',async()=>{
  const options={token:'fixture',fetcher:async(endpoint,request)=>{
    assert.equal(endpoint,'https://apis.naver.com/searchadvisor/crawl-request/submit.json');
    assert.deepEqual(JSON.parse(request.body),{urls:[{url:live.url,type:'update'}]});
    return {ok:true,status:200,json:async()=>({errorCode:0,result:{totalUpdateCount:1}})};
  }};
  assert.equal((await notifyPublication(live,options)).state,'REQUEST_ACCEPTED');
  options.fetcher=async()=>({ok:true,status:200,json:async()=>({errorCode:1005})});
  assert.equal((await notifyPublication(live,options)).state,'REQUEST_REJECTED');
});
test('timeout is unknown and does not leak credentials or retry',async()=>{
  let calls=0;
  const result=await notifyPublication(live,{token:'fixture',fetcher:async()=>{calls++;throw Error('fixture');}});
  assert.equal(calls,1);assert.equal(result.state,'REQUEST_STATE_UNKNOWN');
  assert.ok(!JSON.stringify(result).includes('fixture'));
});
