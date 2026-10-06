import {test} from 'node:test';
import assert from 'node:assert/strict';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon,renderHub} from '../src/coupons.js';
import {buildHubDraft} from '../src/hubs.js';
test('저장된 공식 이미지 후보는 스키마를 만족하지만 활성 허브에 노출하지 않는다',()=>{
  for (const coupon of coupons) {
    validateCoupon(coupon);
    if (coupon.status==='UNVERIFIED') assert.ok(!renderHub(coupon.brand,coupons).includes(coupon.code));
  }
});

test('특정 계정의 성공 기록은 활성 추천과 구분해 본문에 보존한다',()=>{
  const verified=coupons.find(c=>c.verificationResult==='SUCCESS');
  assert.ok(verified);
  assert.equal(verified.eligibilityConfirmed,false);
  assert.equal(verified.status,'UNVERIFIED');
  assert.ok(!renderHub(verified.brand,coupons).includes(verified.code));
  const post=buildHubDraft('zeus',coupons);
  assert.ok(post.content.includes(verified.code));
  assert.ok(post.content.includes('사용 확인 쿠폰'));
  assert.ok(post.content.includes('서버 범위·전체 계정 조건·만료일은 확인되지 않았습니다.'));
  assert.doesNotMatch(post.content,/workingVerifiedAt|verificationResult|evidenceMethod|쿠폰 확인 기준|활성 추천/);
});


test('제우스 허브는 공식 대표 이미지를 첫 이미지로 1장만 출력한다',()=>{
  const post=buildHubDraft('zeus',coupons);
  const imageUrl='https://zeuscommunity-fn.com2us.com/zeuscommunity/public/common/og/og_default.jpg';
  assert.equal((post.content.match(/data-ncp-featured-image="zeus"/g)||[]).length,1);
  assert.ok(post.content.includes(imageUrl));
  assert.ok(post.content.includes('alt="제우스: 오만의 신 공식 대표 이미지"'));
  assert.ok(post.content.indexOf('<img') < post.content.indexOf('class="ncp-page"'));
});


test('리니지M 허브는 NC 공식 대표 이미지를 첫 이미지로 1장만 출력한다',()=>{
  const post=buildHubDraft('lineagem',coupons);
  const imageUrl='https://assets.playnccdn.com/resource/lineagem/meta/sns171017.jpg';
  assert.equal((post.content.match(/data-ncp-featured-image="lineagem"/g)||[]).length,1);
  assert.ok(post.content.includes(imageUrl));
  assert.ok(post.content.includes('alt="리니지M 공식 대표 이미지"'));
  assert.ok(post.content.indexOf('<img') < post.content.indexOf('class="ncp-page"'));
});
