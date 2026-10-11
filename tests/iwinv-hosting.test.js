import {test} from 'node:test';
import assert from 'node:assert/strict';
import {iwinvArticle} from '../src/iwinv-article.js';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

test('iwinv 글은 현재 공식 호스팅·GPU·자격형·파트너 혜택을 구분한다',()=>{
  const a=currentArticleCatalog.find(x=>x.articleKey==='iwinv-benefits-202610');
  assert.ok(a);
  assert.equal(a.approvedForPublish,true);
  assert.deepEqual(a.post.labels,['호스팅·도메인','iwinv']);
  const html=a.post.content;
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/웹호스팅 6개월 50%/);
  assert.match(html,/GPU 신규 첫달 50%/);
  assert.match(html,/클라우드 최대 80% 지원/);
  assert.match(html,/파트너 콘텐츠 캐시 할인/);
  assert.match(html,/공용 입력형 할인코드는 확인되지 않았습니다/);
  assert.match(html,/V-Pay/);
  assert.match(html,/2025-09-17/);
  assert.match(html,/2026-05-15/);
  assert.match(html,/출처 게시일: 미확인/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.match(html,/data-ncp-brand-logo="true"/);
  assert.match(html,/gdn\.event\.iwinv\.kr\/webhosting\/img\/iwinv_1\.png/);
  assert.equal(validateArticleDraft(a),true);
});

test('iwinv 원천 날짜·혜택 유형·미확인 상태를 보존한다',()=>{
  const b=iwinvArticle.source.benefits;
  const web=b.find(x=>x.name==='웹호스팅 신규 6개월 반값');
  const gpu=b.find(x=>x.name==='GPU 신규 고객 첫달 반값');
  const long=b.find(x=>x.name==='GPU 1년 이상 장기이용 반값');
  const gov=b.find(x=>x.name==='2026년 클라우드 서비스 보급·확산 사업');
  const partner=b.find(x=>x.name==='콘텐츠 캐시 파트너 제휴 할인');
  assert.equal(web.value,'6개월 50%');
  assert.equal(web.sourcePublishedAt,null);
  assert.equal(gpu.type,'CASHBACK');
  assert.equal(gpu.sourcePublishedAt,null);
  assert.equal(long.sourcePublishedAt,'2025-09-17');
  assert.equal(gov.sourcePublishedAt,'2026-05-15');
  assert.equal(partner.type,'PARTNER_LINK');
  assert.equal(partner.manualVersion,'2026-08-12');
  assert.equal(iwinvArticle.source.searchMeasurement.status,'NOT_MEASURED');
  assert.ok(iwinvArticle.source.unverified.includes('현재 공용 문자열 할인코드'));
  assert.equal(iwinvArticle.source.thirdParty[0].status,'SERVICE_USE_REPORT_ONLY');
});
