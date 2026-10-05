import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publishDraft,BLOG_ID} from '../src/blogger.js';
import {buildHubDraft} from '../src/hubs.js';
const env={PUBLISH_ENABLED:'true',BLOGGER_BLOG_ID:BLOG_ID,BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture'};
test('초안 본문을 대조하고 body 없이 publish한 뒤 대상 공개 URL을 검증한다',async()=>{
  const expected=buildHubDraft('zeus');let publishes=0;
  const result=await publishDraft(env,'123',expected,async(url,options)=>{
    if (url.includes('/token')) return Response.json({access_token:'fixture'});
    if (!url.endsWith('/publish')) return Response.json({id:'123',blog:{id:BLOG_ID},status:'DRAFT',...expected});
    publishes++;assert.equal(options.method,'POST');assert.equal(options.body,undefined);
    return Response.json({id:'123',blog:{id:BLOG_ID},status:'LIVE',url:'https://lsifl.blogspot.com/test.html'});
  });
  assert.equal(publishes,1);assert.equal(result.status,'LIVE');
});
test('다른 본문 또는 이미 공개된 글에는 publish를 호출하지 않는다',async()=>{
  for (const current of [{status:'DRAFT',content:'changed'},{status:'LIVE',content:buildHubDraft('zeus').content}]) {
    let publishes=0;
    await assert.rejects(publishDraft(env,'123',buildHubDraft('zeus'),async(url)=>{
      if (url.endsWith('/publish')) publishes++;
      return Response.json(url.includes('/token')?{access_token:'fixture'}:{id:'123',blog:{id:BLOG_ID},title:buildHubDraft('zeus').title,...current});
    }),/DRAFT_CONTENT_MISMATCH/);
    assert.equal(publishes,0);
  }
});
test('발행 응답이 다른 블로그 호스트이면 공개 성공으로 취급하지 않는다',async()=>{
  const expected=buildHubDraft('zeus');
  await assert.rejects(publishDraft(env,'123',expected,async(url)=>Response.json(url.includes('/token')?{access_token:'fixture'}:url.endsWith('/publish')?{id:'123',blog:{id:BLOG_ID},status:'LIVE',url:'https://other.blogspot.com/test.html'}:{id:'123',blog:{id:BLOG_ID},status:'DRAFT',...expected})),/PUBLIC_URL_MISMATCH/);
});
