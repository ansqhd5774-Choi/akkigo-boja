import {test} from 'node:test';
import assert from 'node:assert/strict';
import {classifyCoupon,couponLifecycle,couponCatalog} from '../src/coupon-lifecycle.js';
import worker from '../src/worker.js';
const now=Date.parse('2026-10-07T00:00:00Z');
const base={id:'fixture',brand:'게임',category:'게임',status:'UNVERIFIED',sourceUrl:'https://example.com/notice',sourceAuthority:'OFFICIAL'};
test('공식 무기한은 명시적인 기간 근거가 있어야 포함한다',()=>{
  assert.equal(classifyCoupon(base,now),'EXCLUDED');
  assert.equal(classifyCoupon({...base,endMode:'ONGOING'},now),'EXCLUDED');
  assert.equal(classifyCoupon({...base,validity:'UNLIMITED'},now),'EXCLUDED');
  const unlimited={...base,validity:'UNLIMITED',validityEvidenceUrl:base.sourceUrl};
  assert.equal(classifyCoupon(unlimited,now),'CURRENT');
  assert.equal(classifyCoupon({...unlimited,sourceAuthority:'UNOFFICIAL'},now),'EXCLUDED');
});
test('미검증 유효기한은 포함하고 정확한 만료 시각에 공식 이력으로 전환한다',()=>{
  const c={...base,expiresAt:'2026-10-07T00:00:00Z'};
  assert.equal(classifyCoupon(c,now-1),'CURRENT');
  assert.equal(classifyCoupon(c,now),'HISTORY');
  assert.equal(classifyCoupon({...c,sourceAuthority:'UNOFFICIAL'},now-1),'CURRENT');
  assert.equal(classifyCoupon({...c,sourceAuthority:'UNOFFICIAL'},now),'EXCLUDED');
  assert.equal(c.status,'UNVERIFIED');
});
test('잘못된 날짜, 미래 시작, 제거 상태를 현재로 승격하지 않는다',()=>{
  for(const patch of [{expiresAt:'invalid'},{startsAt:'invalid'},{startsAt:'2026-10-08T00:00:00Z'},{status:'REMOVED'},{status:'OTHER'}]) {
    assert.equal(classifyCoupon({...base,expiresAt:'2026-10-09T00:00:00Z',...patch},now),'EXCLUDED');
  }
  assert.throws(()=>classifyCoupon(base,NaN),/INVALID_POLICY_TIME/);
});
test('공식 만료 이력과 공개 목록은 분리하며 코드와 계정 정보를 목록 API에 노출하지 않는다',()=>{
  const rows=[{...base,code:'PRIVATE-CODE',expiresAt:'2026-10-08T00:00:00Z'},{...base,id:'old',status:'EXPIRED',code:'OLD'}];
  assert.equal(couponLifecycle(rows,now).history.length,1);
  const catalog=couponCatalog(rows,now);
  assert.equal(catalog.current[0].count,1);
  assert.equal(catalog.history[0].count,1);
  assert.doesNotMatch(JSON.stringify(catalog),/PRIVATE-CODE|OLD|sourceUrl/);
});
test('공개 정책 API는 인증 없이 읽을 수 있고 Blogger에만 CORS를 허용한다',async()=>{
  const response=await worker.fetch(new Request('https://example.com/coupons/catalog'),{});
  assert.equal(response.status,200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'),'https://lsifl.blogspot.com');
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.equal((await response.json()).policyVersion,1);
});
