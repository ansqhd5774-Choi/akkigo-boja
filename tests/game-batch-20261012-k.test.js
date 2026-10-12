import {test} from 'node:test';
import assert from 'node:assert/strict';
import {silverPalaceArticle} from '../src/game-batch-20261012-k.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const expectedCodes=['SILVERPALACE777','OPENINGGIFT','WELCOME2024','SILVER777','PALACE888','VIP999'];

test('실버 팰리스는 공식 게임명·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(silverPalaceArticle.post.title,'실버 팰리스');
  assert.equal(silverPalaceArticle.approvedForPublish,true);
  assert.equal(silverPalaceArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(silverPalaceArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(silverPalaceArticle),true);
  assert.equal(validateGameFeaturedImage(silverPalaceArticle.articleKey,silverPalaceArticle.post),true);
  assert.equal((silverPalaceArticle.post.content.match(/data-ncp-copy=/g)||[]).length,6);
  assert.equal((silverPalaceArticle.post.content.match(/data-ncp-share=/g)||[]).length,6);
  assert.match(silverPalaceArticle.post.content,/<!--more-->/);
});

test('실버 팰리스는 공식 확인 코드와 제3자 미확인 후보를 분리한다',()=>{
  const html=silverPalaceArticle.post.content;
  assert.match(html,/공식 확인 코드<\/span><strong>0개/);
  assert.match(html,/미확인 후보<\/span><strong>6개/);
  assert.equal(silverPalaceArticle.source.unverifiedCandidates.length,6);
  assert.deepEqual(silverPalaceArticle.source.unverifiedCandidates.map(x=>x.code),expectedCodes);
  for(const code of expectedCodes)assert.match(html,new RegExp(code));
  for(const candidate of silverPalaceArticle.source.unverifiedCandidates){
    assert.equal(candidate.status,'UNVERIFIED');
    assert.ok(candidate.sources.length>=1);
    assert.ok(candidate.sources.every(x=>x.referenceType==='THIRD_PARTY_CODE_MENTION'));
  }
  assert.match(html,/사전예약 마일스톤 보상/);
  assert.match(html,/온스 80,000/);
  assert.match(html,/신규 4성 캐릭터/);
  assert.match(html,/재연의 탄환 5개/);
  assert.equal(silverPalaceArticle.source.benefits.length,2);
  assert.equal(silverPalaceArticle.source.benefits[0].sourcePublishedAt,'2026-09-23');
});
