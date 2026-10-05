import {test} from 'node:test';
import assert from 'node:assert/strict';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon,renderHub} from '../src/coupons.js';
test('저장된 공식 이미지 후보는 스키마를 만족하지만 활성 허브에 노출하지 않는다',()=>{
  for (const coupon of coupons) {
    validateCoupon(coupon);
    if (coupon.status==='UNVERIFIED') assert.ok(!renderHub(coupon.brand,coupons).includes(coupon.code));
  }
});
