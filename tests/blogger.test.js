import {test} from 'node:test';
import assert from 'node:assert/strict';
import {accessToken,updateExistingHub} from '../src/blogger.js';
const env = {BLOGGER_CLIENT_ID:'fixture-client',BLOGGER_CLIENT_SECRET:'fixture-secret',BLOGGER_REFRESH_TOKEN:'fixture-refresh',BLOGGER_BLOG_ID:'2339978524893611480',PUBLISH_ENABLED:'true'};
test('비활성화 및 잘못된 대상은 API 호출 전에 차단한다',async()=>{
  const unexpected = ()=>{throw new Error('UNEXPECTED_NETWORK');};
  await assert.rejects(updateExistingHub({...env,PUBLISH_ENABLED:'false'},'123',{title:'제목',content:'본문'},unexpected),/PUBLISH_DISABLED/);
  await assert.rejects(updateExistingHub({...env,BLOGGER_BLOG_ID:'other'},'123',{title:'제목',content:'본문'},unexpected),/TARGET_MISMATCH/);
});
test('OAuth 실패 응답 원문을 노출하지 않는다',async()=>{
  await assert.rejects(accessToken(env,async()=>new Response('fixture-sensitive-body',{status:401})),/^Error: BLOGGER_OAUTH_HTTP_401$/);
});
test('기존 postId를 PATCH하고 대상 응답을 검증한다',async()=>{
  const requests = [];
  const transport = async(url,options)=>{
    requests.push({url,method:options.method});
    return Response.json(requests.length === 1 ? {access_token:'fixture-token'} : {id:'123',blog:{id:env.BLOGGER_BLOG_ID},url:'https://lsifl.blogspot.com/2026/10/test.html'});
  };
  assert.equal((await updateExistingHub(env,'123',{title:'제목',content:'본문'},transport)).postId,'123');
  assert.equal(requests[1].method,'PATCH');
  assert.match(requests[1].url,/\/posts\/123$/);
});
