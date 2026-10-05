import {test} from 'node:test';
import assert from 'node:assert/strict';
import {observeSource} from '../src/collector.js';
import {validateCoupon,rankCoupons,renderHub} from '../src/coupons.js';
const source={id:'fixture',url:'https://example.com'};
test('페이지 읽기 성공은 쿠폰 검증 성공으로 승격하지 않는다',async()=>{
  const result=await observeSource(source,async()=>new Response('<title>공지</title>',{headers:{'content-type':'text/html'}}));
  assert.equal(result.status,'SOURCE_FETCHED_UNPARSED');
  assert.equal(result.title,'공지');
  assert.equal(result.bodyHash.length,64);
});
test('차단, redirect 및 큰 응답은 상태만 기록한다',async()=>{
  assert.equal((await observeSource(source,async()=>new Response('denied',{status:403}))).status,'HTTP_FAILED');
  assert.equal((await observeSource(source,async()=>new Response('',{status:302}))).status,'REDIRECT_REVIEW_REQUIRED');
  assert.equal((await observeSource(source,async()=>new Response('x'.repeat(1000001),{headers:{'content-type':'text/html'}}))).status,'BODY_LIMIT');
});
test('게임 보상은 현금 절감액 순위에 포함하지 않는다',()=>{
  const now=Date.parse('2026-10-05T00:00:00Z');
  const game={type:'GAME_REWARD',id:'game',brand:'테스트',category:'게임',code:'FIXTURE',status:'UNVERIFIED',rewards:[{name:'골드',quantity:100}],server:'전체',redemptionMethod:'게임 내 입력',platform:'APP',member:'ALL',sourceUrl:'https://example.com',sourceCheckedAt:'2026-10-04T23:00:00Z'};
  assert.equal(validateCoupon(game,now),game);
  assert.deepEqual(rankCoupons([game],{amount:1000,member:'ALL',platform:'APP'},now),[]);
  const html=renderHub('테스트',[{...game,status:'ACTIVE',eligibilityConfirmed:true,workingVerifiedAt:'2026-10-04T23:00:00Z',verificationResult:'SUCCESS'}],now);
  assert.match(html,/골드 100개/);
  assert.doesNotMatch(html,/undefined|% 할인/);
});
test('이미지 공지는 검토 필요로 유지하고 계정 조건 미확인 게임 쿠폰은 활성화하지 않는다',async()=>{
  const observation=await observeSource({...source,requiresImageReview:true},async()=>new Response('<title>공지</title>',{headers:{'content-type':'text/html'}}));
  assert.equal(observation.status,'SOURCE_FETCHED_IMAGE_REVIEW_REQUIRED');
  const game={type:'GAME_REWARD',id:'fixture',brand:'게임',category:'게임',code:'FIXTURE',status:'ACTIVE',rewards:[{name:'골드',quantity:1}],server:'미확인',redemptionMethod:'입력',platform:'APP',member:'ALL',eligibilityConfirmed:false,sourceUrl:'https://example.com',sourceCheckedAt:new Date().toISOString()};
  assert.throws(()=>validateCoupon(game),/MISSING_ELIGIBILITY_EVIDENCE/);
});
