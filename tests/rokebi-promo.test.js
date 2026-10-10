import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rokebiArticle} from '../src/rokebi-article.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

test('로밍도깨비는 현재 공식·제휴·자격형 혜택을 분리한다',()=>{
  const article=rokebiArticle;
  assert.equal(article.articleKey,'rokebi-promo-202610');
  assert.deepEqual(article.post.labels,['유심·로밍','로밍도깨비']);
  assert.equal(article.approvedForPublish,true);
  const html=article.post.content;
  assert.match(html,/WELCOME COUPON/);
  assert.match(html,/친구도 나도 500캐시/);
  assert.match(html,/더블팩 5%/);
  assert.match(html,/신세계면세점 5%/);
  assert.match(html,/오키투어 10%/);
  assert.match(html,/승무원 전용 요금/);
  assert.match(html,/멤버십 앱 전용 쿠폰/);
  assert.match(html,/상품별 자동 할인/);
  assert.match(html,/로깨비톡 무료 통화/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|내부 운영 상태/);
  assert.equal(validateArticleDraft(article),true);
});

test('로밍도깨비 출처 게시일과 행사기간을 섞지 않는다',()=>{
  const b=rokebiArticle.source.benefits;
  const welcome=b.find(x=>x.name==='WELCOME COUPON');
  const double=b.find(x=>x.name==='더블팩');
  const ssg=b.find(x=>x.name==='신세계면세점');
  const crew=b.find(x=>x.name==='승무원 전용 eSIM');
  const membership=b.find(x=>x.name==='멤버십 앱 전용 쿠폰·제휴');
  const oki=b.find(x=>x.name==='오키투어');
  assert.equal(welcome.sourcePublishedAt,null);
  assert.equal(welcome.expiry,null);
  assert.equal(double.sourcePublishedAt,'2025-11-28');
  assert.equal(ssg.sourcePublishedAt,null);
  assert.equal(ssg.eventStart,'2026-03-19');
  assert.equal(ssg.expiry,'2026-12-31');
  assert.equal(crew.sourcePublishedAt,'2026-04-21');
  assert.equal(membership.sourcePublishedAt,'2026-06-24');
  assert.equal(oki.value,'10%');
  assert.equal(rokebiArticle.source.searchMeasurement.status,'NOT_MEASURED');
});
