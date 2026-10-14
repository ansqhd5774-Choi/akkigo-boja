import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bossrunIdleKnightArticle} from '../src/game-batch-20261015-d.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

test('보스런 기사키우기는 공식 게임명·Google Play 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(bossrunIdleKnightArticle.articleKey,'bossrun-idle-knight-codes-202610');
  assert.equal(bossrunIdleKnightArticle.post.title,'보스런 : 기사키우기');
  assert.equal(bossrunIdleKnightArticle.approvedForPublish,true);
  assert.equal(bossrunIdleKnightArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(bossrunIdleKnightArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(bossrunIdleKnightArticle),true);
  assert.equal(validateGameFeaturedImage(bossrunIdleKnightArticle.articleKey,bossrunIdleKnightArticle.post),true);
  assert.match(bossrunIdleKnightArticle.post.content,/<!--more-->/);
});

test('보스런 기사키우기는 공식 현재 코드·입력 후보를 근거 없이 만들지 않는다',()=>{
  assert.equal(bossrunIdleKnightArticle.source.officialCurrentCodes.length,0);
  assert.equal(bossrunIdleKnightArticle.source.unverifiedCandidates.length,0);
  assert.equal(bossrunIdleKnightArticle.source.historicalRecords.length,0);
  assert.equal(bossrunIdleKnightArticle.source.gamePeriodModel.records.length,0);
  assert.match(bossrunIdleKnightArticle.post.content,/현재 등록 가능한 쿠폰은 0개/);
});

test('보스런 기사키우기는 공식 입력 경로 미확인을 명시하고 동명이인 코드를 섞지 않는다',()=>{
  assert.match(bossrunIdleKnightArticle.post.content,/쿠폰 입력 메뉴 또는 외부 교환 페이지를 확인하지 못했습니다/);
  assert.match(bossrunIdleKnightArticle.source.searchDescription,/보스런 기사키우기 쿠폰/);
  assert.equal(bossrunIdleKnightArticle.source.searchMeasurement.status,'NOT_MEASURED');
});
