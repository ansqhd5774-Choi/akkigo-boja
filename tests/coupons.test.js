import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateCoupon,rankCoupons,renderHub,calculateSaving,renderTravelComparison,renderCommerceComparison} from '../src/coupons.js';
const now = Date.parse('2026-10-05T00:00:00Z');
const coupon = {id:'fixture',brand:'테스트',category:'게임',code:'TEST',status:'ACTIVE',rate:10,minimum:1000,cap:500,platform:'APP',member:'NEW',sourceUrl:'https://example.com',sourceCheckedAt:'2026-10-04T23:00:00Z',workingVerifiedAt:'2026-10-04T23:00:00Z',verificationResult:'SUCCESS'};

test('활성 쿠폰은 직접 작동 근거와 최신성을 요구한다',()=>{
  assert.throws(()=>validateCoupon({...coupon,verificationResult:'FAILED'},now));
  assert.throws(()=>validateCoupon({...coupon,workingVerifiedAt:'2026-10-01T00:00:00Z'},now));
});

test('기존 퍼센트 쿠폰은 조건, 최소금액, 할인한도, 만료를 반영한다',()=>{
  assert.equal(rankCoupons([coupon],{amount:10000,member:'NEW',platform:'APP'},now)[0].saving,500);
  assert.equal(rankCoupons([coupon],{amount:10000,member:'EXISTING',platform:'APP'},now).length,0);
  assert.equal(rankCoupons([{...coupon,expiresAt:'2026-10-04T00:00:00Z'}],{amount:10000,member:'NEW',platform:'APP'},now).length,0);
  assert.equal(rankCoupons([{...coupon,cap:0}],{amount:10000,member:'NEW',platform:'APP'},now)[0].saving,0);
});

test('정액 할인과 카드채널을 실제 절감액으로 계산한다',()=>{
  const fixed={...coupon,id:'fixed',category:'쇼핑·오픈마켓',offerType:'CODE',discountKind:'FIXED',fixedAmount:5000,minimum:30000,cap:5000,member:'ALL',platform:'ALL'};
  assert.equal(calculateSaving(validateCoupon(fixed,now),40000),5000);
  assert.equal(calculateSaving(fixed,20000),0);
  const card={...fixed,id:'card',offerType:'CARD_CHANNEL',category:'여행·숙박',paymentProvider:'테스트카드',travel:{kind:'HOTEL',regions:['KR']}};
  assert.equal(calculateSaving(validateCoupon(card,now),40000),5000);
});

test('여행 할인은 여행 종류·지역과 기간, 카드채널 제공자를 검증한다',()=>{
  const base={...coupon,id:'travel',brand:'테스트여행',category:'여행·숙박',offerType:'CODE',member:'ALL',platform:'WEB',travel:{kind:'HOTEL',regions:['KR'],bookingStartAt:'2026-10-01T00:00:00Z',bookingEndAt:'2026-10-31T23:59:59Z',stayStartAt:'2026-10-01T00:00:00Z',stayEndAt:'2026-12-31T23:59:59Z'}};
  assert.equal(validateCoupon(base,now).id,'travel');
  assert.throws(()=>validateCoupon({...base,travel:null},now),/MISSING_TRAVEL_CONDITIONS/);
  assert.throws(()=>validateCoupon({...base,travel:{kind:'HOTEL',regions:['KR'],bookingStartAt:'2026-11-01T00:00:00Z',bookingEndAt:'2026-10-01T00:00:00Z'}},now),/INVALID_BOOKING_PERIOD/);
  assert.throws(()=>validateCoupon({...base,offerType:'CARD_CHANNEL'},now),/MISSING_PAYMENT_PROVIDER/);
});

test('여행 쿠폰과 카드채널을 최종 결제액으로 비교한다',()=>{
  const common={...coupon,brand:'테스트여행',category:'여행·숙박',member:'ALL',platform:'ALL',travel:{kind:'HOTEL',regions:['KR']}};
  const offers=[
    {...common,id:'code',offerType:'CODE',rate:8,minimum:100000,cap:60000},
    {...common,id:'card',offerType:'CARD_CHANNEL',paymentProvider:'카드A',rate:10,minimum:100000,cap:50000}
  ];
  const html=renderTravelComparison('테스트여행',offers,{amount:300000,member:'ALL',platform:'WEB'},now);
  assert.match(html,/270,000원/);
  assert.match(html,/현재 더 유리/);
  assert.ok(html.indexOf('카드채널') < html.length);
});

test('쇼핑·배달 비교는 예상 절감액과 최종가를 출력한다',()=>{
  const offers=[
    {...coupon,id:'shop1',brand:'테스트샵',category:'쇼핑·오픈마켓',member:'ALL',platform:'ALL',rate:10,minimum:10000,cap:10000},
    {...coupon,id:'shop2',brand:'테스트샵',category:'쇼핑·오픈마켓',member:'ALL',platform:'ALL',offerType:'AUTO_DISCOUNT',rate:5,minimum:0,cap:5000,code:undefined}
  ];
  const html=renderCommerceComparison('테스트샵',offers,{amount:80000,member:'ALL',platform:'WEB'},now);
  assert.match(html,/8,000원/);
  assert.match(html,/72,000원/);
});

test('종료 방식은 고정 종료·상시·예산 소진을 구분한다',()=>{
  assert.throws(()=>validateCoupon({...coupon,endMode:'FIXED_DATE',expiresAt:null},now),/EXPIRY_REQUIRED/);
  assert.equal(validateCoupon({...coupon,endMode:'ONGOING'},now).endMode,'ONGOING');
  assert.equal(validateCoupon({...coupon,endMode:'UNTIL_BUDGET_EXHAUSTED'},now).endMode,'UNTIL_BUDGET_EXHAUSTED');
  assert.throws(()=>validateCoupon({...coupon,endMode:'SOMEDAY'},now),/INVALID_END_MODE/);
});

test('빈 데이터와 HTML 문자를 안전하게 출력한다',()=>{
  assert.match(renderHub('<브랜드>',[],now),/&lt;브랜드&gt;/);
  assert.match(renderHub('테스트',[],now),/현재 확인된 사용 가능 쿠폰이 없습니다/);
  assert.throws(()=>validateCoupon({...coupon,rate:NaN},now));
});

test('공개 쿠폰 HTML은 내부 작동확인 필드를 노출하지 않는다',()=>{
  const html=renderHub('테스트',[coupon],now);
  assert.doesNotMatch(html,/작동 확인|workingVerifiedAt|verificationResult|evidenceMethod|UNVERIFIED/);
});
