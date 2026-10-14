import {test} from 'node:test';
import assert from 'node:assert/strict';
import {darkAngelAngelDescentArticle} from '../src/game-batch-20261014-h.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const currentCodes=['WELCOME','VIP222','VIP333','VIP555','VIP666','VIP888','GO2024','DCGIFT'];

test('다크엔젤 천사 강림은 공식 게임명·Google Play 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(darkAngelAngelDescentArticle.articleKey,'dark-angel-angel-descent-codes-202610');
  assert.equal(darkAngelAngelDescentArticle.post.title,'다크엔젤: 천사 강림');
  assert.equal(darkAngelAngelDescentArticle.approvedForPublish,true);
  assert.equal(darkAngelAngelDescentArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(darkAngelAngelDescentArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(darkAngelAngelDescentArticle),true);
  assert.equal(validateGameFeaturedImage(darkAngelAngelDescentArticle.articleKey,darkAngelAngelDescentArticle.post),true);
  assert.equal((darkAngelAngelDescentArticle.post.content.match(/data-ncp-copy=/g)||[]).length,8);
  assert.equal((darkAngelAngelDescentArticle.post.content.match(/data-ncp-share=/g)||[]).length,8);
  assert.match(darkAngelAngelDescentArticle.post.content,/<!--more-->/);
});

test('다크엔젤 천사 강림은 공식 코드 0개와 GameEDU 후보 8개를 분리한다',()=>{
  const html=darkAngelAngelDescentArticle.post.content;
  assert.deepEqual(darkAngelAngelDescentArticle.source.officialCurrentCodes,[]);
  assert.equal(darkAngelAngelDescentArticle.source.unverifiedCandidates.length,8);
  assert.deepEqual(darkAngelAngelDescentArticle.source.unverifiedCandidates.map(x=>x.code),currentCodes);
  assert.deepEqual(darkAngelAngelDescentArticle.source.historicalRecords,[]);
  assert.match(html,/입력 후보<\/span><strong>8개/);
  assert.match(html,/공식 발급 확인<\/span><strong>0개/);
  assert.match(html,/제3자 혜택 후보<\/span><strong>1종/);
  for(const code of currentCodes)assert.match(html,new RegExp(code));
});

test('다크엔젤 천사 강림은 출처 게시일·갱신일·제3자 프로모션을 공식 근거와 구분한다',()=>{
  const records=darkAngelAngelDescentArticle.source.gamePeriodModel.records;
  assert.ok(records.every(x=>x.sourcePublishedAt==='2026-06-01'&&x.status==='UNVERIFIED'));
  assert.ok(records.every(x=>x.sources[0].updatedAt==='2026-10-14'));
  assert.match(darkAngelAngelDescentArticle.post.content,/본 이벤트가 다크엔젤: 천사 강림 운영사와 무관/);
  assert.match(darkAngelAngelDescentArticle.post.content,/공식 현재 쿠폰은 0개/);
  assert.equal(darkAngelAngelDescentArticle.source.benefits.length,1);
  assert.equal(darkAngelAngelDescentArticle.source.benefits[0].authority,'THIRD_PARTY');
  assert.equal(darkAngelAngelDescentArticle.source.benefits[0].status,'UNVERIFIED');
  assert.equal(darkAngelAngelDescentArticle.source.benefits[0].sourcePublishedAt,'2026-09-12');
  assert.equal(darkAngelAngelDescentArticle.source.benefits[0].expiry,'2026-10-18');
});
