import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateCoupon,rankCoupons,renderHub} from '../src/coupons.js';
const now = Date.parse('2026-10-05T00:00:00Z');
const coupon = {id:'fixture',brand:'테스트',category:'게임',code:'TEST',status:'ACTIVE',rate:10,minimum:1000,cap:500,platform:'APP',member:'NEW',sourceUrl:'https://example.com',sourceCheckedAt:'2026-10-04T23:00:00Z',workingVerifiedAt:'2026-10-04T23:00:00Z',verificationResult:'SUCCESS'};
test('활성 쿠폰은 직접 작동 근거와 최신성을 요구한다',()=>{
  assert.throws(()=>validateCoupon({...coupon,verificationResult:'FAILED'},now));
  assert.throws(()=>validateCoupon({...coupon,workingVerifiedAt:'2026-10-01T00:00:00Z'},now));
});
test('조건, 최소금액, 할인한도, 만료를 반영한다',()=>{
  assert.equal(rankCoupons([coupon],{amount:10000,member:'NEW',platform:'APP'},now)[0].saving,500);
  assert.equal(rankCoupons([coupon],{amount:10000,member:'EXISTING',platform:'APP'},now).length,0);
  assert.equal(rankCoupons([{...coupon,expiresAt:'2026-10-04T00:00:00Z'}],{amount:10000,member:'NEW',platform:'APP'},now).length,0);
  assert.equal(rankCoupons([{...coupon,cap:0}],{amount:10000,member:'NEW',platform:'APP'},now)[0].saving,0);
});
test('빈 데이터와 HTML 문자를 안전하게 출력한다',()=>{
  assert.match(renderHub('<브랜드>',[],now),/&lt;브랜드&gt;/);
  assert.match(renderHub('테스트',[],now),/현재 검증된 쿠폰이 없습니다/);
  assert.throws(()=>validateCoupon({...coupon,rate:NaN},now));
});
