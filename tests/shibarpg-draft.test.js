import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

const now=Date.parse('2026-10-05T12:30:00Z');

test('시바 모험단 공식 쿠폰 후보는 UNVERIFIED로 유효하고 ACTIVE가 아니다',()=>{
  const coupon=coupons.find(x=>x.id==='shibarpg-pick7p2y');
  assert.ok(coupon);
  assert.equal(coupon.status,'UNVERIFIED');
  assert.equal(coupon.code,'pick7p2y');
  assert.equal(coupon.expiresAt,'2026-10-06T00:00:00.000Z');
  assert.equal(coupon.rewards[0].name,'시바 코인');
  assert.equal(coupon.rewards[0].quantity,10);
  assert.equal(validateCoupon(coupon,now),coupon);
});

test('시바 모험단 신규 글 초안은 공식 정보와 미검증 상태를 함께 표시한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/shibarpg-pickup-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/shibarpg-pickup-202610.html',import.meta.url),'utf8');
  assert.equal(draft.publicationStatus,'LIVE');
  assert.equal(draft.publication.url,'https://lsifl.blogspot.com/2026/10/pick7p2y.html');
  assert.equal(draft.publication.publicVerified,true);
  assert.deepEqual(draft.post.labels,['게임','시바 모험단']);
  assert.match(draft.post.title,/시바 모험단 쿠폰 pick7p2y/);
  assert.match(html,/pick7p2y/);
  assert.match(html,/시바 코인 × 10/);
  assert.match(html,/2026년 10월 6일 오전 9시/);
  assert.match(html,/공식 발급 정보 · 실사용 미검증/);
  assert.match(html,/coupon\.withhive\.com\/shibarpg/);
  assert.doesNotMatch(html,/현재 사용 가능|검증 완료|전체 계정에서 사용 가능/);
});
