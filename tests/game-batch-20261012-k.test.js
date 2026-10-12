import {test} from 'node:test';
import assert from 'node:assert/strict';
import {silverPalaceArticle} from '../src/game-batch-20261012-k.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

test('실버 팰리스는 공식 게임명·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(silverPalaceArticle.post.title,'실버 팰리스');
  assert.equal(silverPalaceArticle.approvedForPublish,true);
  assert.equal(silverPalaceArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(silverPalaceArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(silverPalaceArticle),true);
  assert.equal(validateGameFeaturedImage(silverPalaceArticle.articleKey,silverPalaceArticle.post),true);
  assert.equal((silverPalaceArticle.post.content.match(/data-ncp-copy=/g)||[]).length,0);
  assert.equal((silverPalaceArticle.post.content.match(/data-ncp-share=/g)||[]).length,0);
  assert.match(silverPalaceArticle.post.content,/<!--more-->/);
});

test('실버 팰리스는 공개 코드를 만들지 않고 공식 사전예약 마일스톤 혜택을 분리한다',()=>{
  const html=silverPalaceArticle.post.content;
  assert.match(html,/공개 코드<\/span><strong>0개/);
  assert.match(html,/사전예약 마일스톤 보상/);
  assert.match(html,/온스 80,000/);
  assert.match(html,/신규 4성 캐릭터/);
  assert.match(html,/재연의 탄환 5개/);
  assert.equal(silverPalaceArticle.source.benefits.length,2);
  assert.equal(silverPalaceArticle.source.benefits[0].sourcePublishedAt,'2026-09-23');
});
