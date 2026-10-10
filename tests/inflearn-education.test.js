import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inflearnArticle} from '../src/inflearn-article.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

test('인프런 교육 혜택 글은 현재 쿠폰·자격·환급·무료 혜택을 구분한다',()=>{
  const a=inflearnArticle;
  assert.equal(a.articleKey,'inflearn-coupons-202610');
  assert.equal(a.approvedForPublish,true);
  assert.deepEqual(a.post.labels,['교육','인프런']);
  const html=a.post.content;
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/신규가입 25%/);
  assert.match(html,/자격증 강의 30%/);
  assert.match(html,/개인 마케팅 파트너 30%/);
  assert.match(html,/평생교육이용권/);
  assert.match(html,/90% 환급/);
  assert.match(html,/무료 AI 챌린지/);
  assert.match(html,/무료 Live/);
  assert.match(html,/최대 30%/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.equal(validateArticleDraft(a),true);
});

test('인프런 출처 게시일과 발급·사용·모집 기한을 분리한다',()=>{
  const b=inflearnArticle.source.benefits;
  const welcome=b.find(x=>x.name==='신규가입 할인');
  const cert=b.find(x=>x.name==='자격증 강의 할인');
  const partner=b.find(x=>x.name==='개인 마케팅 파트너 할인');
  const voucher=b.find(x=>x.name==='2026 평생교육이용권');
  const refund=b.find(x=>x.name==='10월 AI 환급 과정');
  const kakao=b.find(x=>x.name==='카카오톡 플러스친구');
  const summer=b.find(x=>x.name==='2026 썸머 블랙프라이데이');
  assert.equal(welcome.sourcePublishedAt,null);
  assert.equal(welcome.expiryRule,'가입 후 24시간');
  assert.equal(cert.sourcePublishedAt,null);
  assert.equal(cert.issueDeadline,'2026-10-31');
  assert.equal(cert.expiryRule,'수령 후 7일');
  assert.equal(partner.sourcePublishedAt,null);
  assert.equal(voucher.expiry,'2026-12-31');
  assert.equal(refund.applicationDeadline,'2026-10-12');
  assert.equal(kakao.sourcePublishedAt,'2021-12-12');
  assert.equal(kakao.status,'RECHECK_REQUIRED');
  assert.equal(summer.status,'EXPIRED');
  assert.equal(inflearnArticle.source.publicStringCode.status,'NONE_VERIFIED_CURRENT');
  assert.equal(inflearnArticle.source.searchMeasurement.status,'NOT_MEASURED');
});
