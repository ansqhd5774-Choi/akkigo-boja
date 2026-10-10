import {test} from 'node:test';
import assert from 'node:assert/strict';
import {maaltalkArticle} from '../src/maaltalk-article.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

test('말톡 글은 현재 상품할인·쿠폰·리뷰·무료전화 혜택을 구분한다',()=>{
  const a=maaltalkArticle;
  assert.equal(a.articleKey,'maaltalk-benefits-202610');
  assert.equal(a.approvedForPublish,true);
  assert.deepEqual(a.post.labels,['유심·로밍','말톡']);
  const html=a.post.content;
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/약 40%/);
  assert.match(html,/쿠폰 다운받기/);
  assert.match(html,/200 마일리지/);
  assert.match(html,/eSIM 무료배송/);
  assert.match(html,/해외 현지 무료전화/);
  assert.match(html,/10분 무료통화/);
  assert.match(html,/추천인코드/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.equal(validateArticleDraft(a),true);
});

test('말톡 현재와 종료·미확인 혜택 및 날짜 정책을 보존한다',()=>{
  const b=maaltalkArticle.source.benefits;
  assert.equal(b.find(x=>x.name==='상품 페이지 쿠폰 다운로드').status,'ACTIVE_UNDISCLOSED');
  assert.equal(b.find(x=>x.name==='리뷰 작성 마일리지').value,'200P');
  assert.equal(b.find(x=>x.name==='추천인코드').status,'UNVERIFIED_BENEFIT_VALUE');
  assert.equal(b.find(x=>x.name==='스마트스토어 여행지원금').sourcePublishedAt,'2023-07-12');
  assert.equal(b.find(x=>x.name==='스마트스토어 여행지원금').status,'EXPIRED');
  assert.equal(b.find(x=>x.name==='하나카드 말톡 유심').eventPeriod,'2023-01-01~2023-12-31');
  assert.equal(b.find(x=>x.name==='부킹닷컴 캐시백').sourcePublishedAt,'2019-10-04');
  assert.equal(maaltalkArticle.source.publicStringCode.status,'NONE_VERIFIED_CURRENT');
  assert.equal(maaltalkArticle.source.searchMeasurement.status,'NOT_MEASURED');
});
