import {test} from 'node:test';
import assert from 'node:assert/strict';
import {observeSource,extractCandidates} from '../src/collector.js';
import {validateCoupon,rankCoupons,renderHub} from '../src/coupons.js';
const source={id:'fixture',url:'https://example.com'};

test('페이지 읽기 성공은 쿠폰 검증 성공으로 승격하지 않는다',async()=>{
  const result=await observeSource(source,async()=>new Response('<title>공지</title>',{headers:{'content-type':'text/html'}}));
  assert.equal(result.status,'SOURCE_FETCHED_UNPARSED');
  assert.equal(result.title,'공지');
  assert.equal(result.bodyHash.length,64);
  assert.deepEqual(result.candidates,[]);
});

test('Agoda 공식 텍스트는 UNVERIFIED 여행 후보만 추출한다',async()=>{
  const agoda={id:'agoda-deals',brand:'Agoda',category:'여행·숙박',url:'https://www.agoda.com/deals',parserProfile:'TRAVEL_DEALS'};
  const html='<title>Deals</title><div>Up to ₩60,000 Off Hotels Minimum spend of ₩138,200 Expires in 3 days. Limited time Up to 15% Off Hotels</div>';
  const now=new Date('2026-10-05T00:00:00Z');
  const candidates=extractCandidates(agoda,html,now);
  assert.equal(candidates.length,2);
  assert.equal(candidates[0].evidenceLevel,'SOURCE_TEXT_ONLY');
  assert.equal(candidates.find(x=>x.fixedAmount)?.fixedAmount,60000);
  assert.equal(candidates.find(x=>x.fixedAmount)?.minimum,138200);
  const result=await observeSource(agoda,async()=>new Response(html,{headers:{'content-type':'text/html'}}),now);
  assert.equal(result.status,'SOURCE_FETCHED_CANDIDATES_UNVERIFIED');
  assert.equal(result.candidates.length,2);
});

test('Trip.com 공식 텍스트는 기간과 액티비티 5% 후보를 추출한다',()=>{
  const trip={id:'tripcom-domestic-2026',brand:'Trip.com',category:'여행·숙박',url:'https://kr.trip.com/sale/example',parserProfile:'TRAVEL_DEALS'};
  const html='<div>2026 국내여행 프로모션 기간 2026년 7월 1일 ~ 12월 31일 국내 투어·티켓 5% 할인쿠폰 회원 전용 웹 모바일 앱</div>';
  const candidates=extractCandidates(trip,html,new Date('2026-10-05T00:00:00Z'));
  assert.equal(candidates.length,1);
  assert.equal(candidates[0].rate,5);
  assert.equal(candidates[0].travel.kind,'ACTIVITY');
  assert.deepEqual(candidates[0].travel.regions,['KR']);
  assert.equal(candidates[0].travel.bookingStartAt,'2026-07-01T00:00:00.000Z');
  assert.equal(candidates[0].travel.bookingEndAt,'2026-12-31T23:59:59.000Z');
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
