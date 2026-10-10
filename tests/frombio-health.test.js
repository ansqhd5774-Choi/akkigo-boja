import {test} from 'node:test';
import assert from 'node:assert/strict';
import {frombioArticle} from '../src/frombio-article.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

test('프롬바이오 건강 쿠폰 글은 10월 쿠폰팩과 회원 혜택을 구분한다',()=>{
  const a=frombioArticle;
  assert.equal(a.articleKey,'frombio-coupons-202610');
  assert.equal(a.approvedForPublish,true);
  assert.deepEqual(a.post.labels,['건강','프롬바이오']);
  const html=a.post.content;
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/10월 쿠폰팩 3,000원/);
  assert.match(html,/10월 쿠폰팩 5,000원/);
  assert.match(html,/10월 쿠폰팩 7,000원/);
  assert.match(html,/발급 후 10일/);
  assert.match(html,/신규 회원 혜택/);
  assert.match(html,/정기배송 혜택/);
  assert.match(html,/단체주문 할인/);
  assert.match(html,/디어퀸 콜라겐스틱 9포 증정/);
  assert.match(html,/30,000원 이상 구매 시 무료배송/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|내부 운영 상태/);
  assert.equal(validateArticleDraft(a),true);
});

test('프롬바이오 출처 게시일·확인일·사용기간을 분리한다',()=>{
  const b=frombioArticle.source.benefits;
  for(const amount of ['3000원','5000원','7000원']){
    const row=b.find(x=>x.value===amount);
    assert.ok(row);
    assert.equal(row.sourcePublishedAt,null);
    assert.equal(row.expiryRule,'발급일로부터 10일');
  }
  assert.equal(b.find(x=>x.name==='신규 회원 혜택').sourcePublishedAt,'2022-09-07');
  assert.equal(b.find(x=>x.name==='정기배송 혜택').sourcePublishedAt,'2022-09-07');
  assert.equal(b.find(x=>x.name==='단체주문 할인').sourcePublishedAt,'2024-01-12');
  assert.equal(b.find(x=>x.name==='추석 선물 대첩 10%').status,'RECHECK_REQUIRED');
  assert.equal(frombioArticle.source.checkedAt,'2026-10-10');
  assert.equal(frombioArticle.source.measuredSearch.couponKeywordMeasurement,null);
});
