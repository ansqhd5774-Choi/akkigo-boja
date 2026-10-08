import {test} from 'node:test';
import assert from 'node:assert/strict';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon,renderHub} from '../src/coupons.js';
import {classifyCoupon} from '../src/coupon-lifecycle.js';
import {buildHubDraft} from '../src/hubs.js';
test('저장 후보는 스키마와 기간 정책에 따라 현재 또는 이력에 표시한다',()=>{
  for (const coupon of coupons) {
    validateCoupon(coupon);
    assert.equal(renderHub(coupon.brand,[coupon]).includes(coupon.code),classifyCoupon(coupon)!=='EXCLUDED');
  }
});

test('기간 미확인 성공 기록은 원본에 보존하고 현재 표시에서는 제외한다',()=>{
  const verified=coupons.find(c=>c.verificationResult==='SUCCESS');
  assert.ok(verified);
  assert.equal(verified.eligibilityConfirmed,false);
  assert.equal(verified.status,'UNVERIFIED');
  assert.ok(!renderHub(verified.brand,coupons).includes(verified.code));
  const post=buildHubDraft('zeus',coupons);
  assert.ok(!post.content.includes(verified.code));
  assert.ok(post.content.includes('만료 이력'));
  assert.equal(verified.verificationResult,'SUCCESS');
  assert.doesNotMatch(post.content,/workingVerifiedAt|verificationResult|evidenceMethod|쿠폰 확인 기준|활성 추천/);
});


test('제우스 허브는 공식 대표 이미지를 첫 이미지로 1장만 출력한다',()=>{
  const post=buildHubDraft('zeus',coupons);
  const imageUrl='https://zeuscommunity-fn.com2us.com/zeuscommunity/public/common/og/og_default.jpg';
  assert.equal((post.content.match(/data-ncp-featured-image="zeus"/g)||[]).length,1);
  assert.ok(post.content.includes(imageUrl));
  assert.ok(post.content.includes('alt="제우스: 오만의 신 공식 대표 이미지"'));
  assert.ok(post.content.indexOf('<img') < post.content.indexOf('class="ncp-brief"'));
});


test('리니지M 허브는 NC 공식 대표 이미지를 첫 이미지로 1장만 출력한다',()=>{
  const post=buildHubDraft('lineagem',coupons);
  const imageUrl='https://assets.playnccdn.com/resource/lineagem/meta/sns171017.jpg';
  assert.equal((post.content.match(/data-ncp-featured-image="lineagem"/g)||[]).length,1);
  assert.ok(post.content.includes(imageUrl));
  assert.ok(post.content.includes('alt="리니지M 공식 대표 이미지"'));
  assert.ok(post.content.indexOf('<img') < post.content.indexOf('class="ncp-brief"'));
});


test('명조 허브는 Kuro Games 공식 대표 이미지를 첫 이미지로 1장만 출력한다',()=>{
  const post=buildHubDraft('wuthering',coupons);
  const imageUrl='https://wutheringwaves.kurogames.com/website-preface/video/bg/bg-poster.webp';
  assert.equal((post.content.match(/data-ncp-featured-image="wuthering"/g)||[]).length,1);
  assert.ok(post.content.includes(imageUrl));
  assert.ok(post.content.includes('alt="명조: 워더링 웨이브 공식 대표 이미지"'));
  assert.ok(post.content.indexOf('<img') < post.content.indexOf('class="ncp-brief"'));
});
