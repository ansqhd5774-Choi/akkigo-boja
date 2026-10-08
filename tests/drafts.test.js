import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createStoredDraft,reconcileDraft} from '../src/publisher.js';
import {createDraft,findHubPosts,BLOG_ID} from '../src/blogger.js';
import {buildHubDraft} from '../src/hubs.js';

function fixture() {
  const state={postId:null,attempt:null,status:null};
  const DB={prepare(sql){return {bind(...args){return {
    async first(){return sql.includes('FROM hub_state')?(state.postId?{post_id:state.postId}:null):state.attempt;},
    async run(){
      if (sql.startsWith('INSERT INTO publish_attempts')) {
        if (state.attempt) throw new Error('constraint');
        state.attempt={attempt_id:args[0],status:'RUNNING',started_at:args[2]};
      } else {state.attempt.status='UNKNOWN';}
    },sql,args
  };}};},async batch(statements){state.postId=statements[0].args[1];state.status=statements[0].args[2];state.attempt=null;}};
  return {state,env:{DB,PUBLISH_ENABLED:'true',BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture',BLOGGER_BLOG_ID:BLOG_ID}};
}
test('3게임 초안은 실제 쿠폰이 없으면 빈 상태이며 고정 복구 표식을 갖는다',()=>{
  for (const key of ['zeus','lineagem','wuthering']) {
    const post=buildHubDraft(key);
    assert.match(post.content,/value="latest" checked="checked"/);
    assert.ok(post.content.includes(`data-ncp-hub="${key}"`));
    assert.doesNotMatch(post.content,/쿠폰 확인 기준|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|개인정보 처리 안내/);
  }
  assert.throws(()=>buildHubDraft('other'),/UNKNOWN_HUB/);
});
test('신규 생성은 isDraft=true이며 postId 저장 후 재호출해도 insert하지 않는다',async()=>{
  const {state,env}=fixture();let inserts=0;
  const transport=async(url,options)=>{
    if (url.includes('/token')) return Response.json({access_token:'fixture'});
    inserts++;assert.match(url,/isDraft=true/);assert.equal(options.method,'POST');
    return Response.json({id:'123',blog:{id:BLOG_ID},status:'DRAFT'});
  };
  await createStoredDraft(env,'zeus',[],transport);
  assert.equal(state.postId,'123');assert.equal(state.status,'DRAFT');
  await createStoredDraft(env,'zeus',[],transport);assert.equal(inserts,1);
});
test('최초 조회 뒤 다른 생성이 완료된 경우 잠금 후 재확인으로 중복 insert를 막는다',async()=>{
  const {env}=fixture();let reads=0,network=0;
  const original=env.DB.prepare.bind(env.DB);
  env.DB.prepare=sql=>sql.includes('FROM hub_state')?{bind(){return {async first(){return ++reads===1?null:{post_id:'123'};}};}}:original(sql);
  const result=await createStoredDraft(env,'zeus',[],async()=>{network++;throw new Error('unexpected');});
  assert.equal(result.postId,'123');assert.equal(network,0);assert.equal(reads,2);
});
test('타임아웃 후 재생성은 차단하고 정확한 기존 표식의 게시물만 복구한다',async()=>{
  const {state,env}=fixture();let inserts=0;
  const failing=async(url)=>{
    if (url.includes('/token')) return Response.json({access_token:'fixture'});
    inserts++;throw new Error('private timeout');
  };
  await assert.rejects(createStoredDraft(env,'zeus',[],failing),/RECONCILIATION_REQUIRED/);
  await assert.rejects(createStoredDraft(env,'zeus',[],failing),/CHECKPOINT_UNAVAILABLE/);
  assert.equal(inserts,1);
  state.attempt.started_at=new Date(Date.now()-600000).toISOString();
  await reconcileDraft(env,'zeus',async(url)=>Response.json(url.includes('/token')?{access_token:'fixture'}:{items:url.includes('status=draft')?[{id:'123',blog:{id:BLOG_ID},status:'DRAFT',labels:['ncp-hub-zeus'],content:buildHubDraft('zeus').content}]:[]}));
  assert.equal(state.postId,'123');assert.equal(state.attempt,null);
});
test('일치 없음과 중복은 기존 미확정 상태를 유지한다',async()=>{
  for (const count of [0,2]) {
    const {state,env}=fixture();state.attempt={attempt_id:'fixture',status:'UNKNOWN',started_at:new Date(Date.now()-600000).toISOString()};
    const transport=async(url)=>Response.json(url.includes('/token')?{access_token:'fixture'}:{items:url.includes('status=draft')?Array.from({length:count},(_,i)=>({id:String(100+i),blog:{id:BLOG_ID},status:'DRAFT',labels:['ncp-hub-zeus'],content:buildHubDraft('zeus').content})):[]});
    await assert.rejects(reconcileDraft(env,'zeus',transport),count?/DUPLICATE_HUB/:/NO_MATCH_KEEP_BLOCKED/);
    assert.equal(state.postId,null);assert.equal(state.attempt.status,'UNKNOWN');
  }
});
test('목록 스캔 예산 소진과 잘못된 초안 응답은 성공으로 간주하지 않는다',async()=>{
  const {env}=fixture();
  await assert.rejects(findHubPosts(env,'zeus',async(url)=>Response.json(url.includes('/token')?{access_token:'fixture'}:{items:[],nextPageToken:'more'})),/SCAN_LIMIT/);
  await assert.rejects(createDraft(env,buildHubDraft('zeus'),async(url)=>Response.json(url.includes('/token')?{access_token:'fixture'}:{id:'123',blog:{id:BLOG_ID},status:'LIVE'})),/DRAFT_RESPONSE_MISMATCH/);
});

test('기간 미확인 성공 사례도 현재 쿠폰으로 표시하지 않는다',()=>{
  const post=buildHubDraft('zeus',[{id:'fixture-manual',type:'GAME_REWARD',offerType:'GAME_REDEEM',brand:'제우스: 오만의 신',category:'게임',status:'UNVERIFIED',verificationResult:'SUCCESS',code:'TESTCODE',rewards:[{name:'테스트 보상',quantity:1}],server:'테스트',redemptionMethod:'공식 웹',platform:'WEB',member:'ALL',eligibilityConfirmed:false,endMode:'UNKNOWN',sourceUrl:'https://example.com',sourceCheckedAt:'2026-10-05T00:00:00Z'}]);
  assert.doesNotMatch(post.content,/TESTCODE/);
  assert.match(post.content,/현재 입력 대상으로 분류할 근거가 확인된 코드가 없습니다/);
  assert.doesNotMatch(post.content,/workingVerifiedAt|verificationResult|evidenceMethod|활성 추천|쿠폰 확인 기준|개인정보 처리 안내/);
});
