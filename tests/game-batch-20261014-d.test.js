import {test} from 'node:test';
import assert from 'node:assert/strict';
import {superEvolutionStory2Article} from '../src/game-batch-20261014-d.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const koreanCodes=[
  'SES2OPEN','SES2GIFT','SES2WELCOME','SES2777','SES2888',
  'VIP111','VIP222','VIP333','VIP555','VIP666','VIP777','VIP888','VIP999',
  'LINEGAMES','VIP2024','GO2024','DCGIFT'
];
const allCodes=[
  ...koreanCodes,
  'GAMEEDU','WELCOME','FBGIFT',
  '超进化222','超进化666','超进化物语2','超2来了','超进化2',
  '进化222','进化666','进化777','进化888','进化999','两种扣减',
  'CJH666','CJH888','CJH999','SVIP666','SVIP888',
  'jinhua666','jinhua777','jinhua999','BZBZ7PDSGK','wtjiw47n8u3nb',
  '3.5丰野间','月缘形态','子弹时间','造唤许可'
];

test('슈퍼진화스토리2는 공식 게임명·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(superEvolutionStory2Article.articleKey,'super-evolution-story-2-codes-202610');
  assert.equal(superEvolutionStory2Article.post.title,'슈퍼진화스토리2');
  assert.equal(superEvolutionStory2Article.approvedForPublish,true);
  assert.equal(superEvolutionStory2Article.source.templateVersion,'game-period-tabs-r1');
  assert.equal(superEvolutionStory2Article.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(superEvolutionStory2Article),true);
  assert.equal(validateGameFeaturedImage(superEvolutionStory2Article.articleKey,superEvolutionStory2Article.post),true);
  assert.equal((superEvolutionStory2Article.post.content.match(/data-ncp-copy=/g)||[]).length,45);
  assert.equal((superEvolutionStory2Article.post.content.match(/data-ncp-share=/g)||[]).length,45);
  assert.match(superEvolutionStory2Article.post.content,/<!--more-->/);
});

test('슈퍼진화스토리2는 한국 후보·중국 공식 지역 근거·과거 이력을 분리한다',()=>{
  const html=superEvolutionStory2Article.post.content;
  const records=superEvolutionStory2Article.source.gamePeriodModel.records;
  assert.equal(records.length,45);
  assert.equal(new Set(records.map(x=>x.code)).size,45);
  assert.deepEqual(superEvolutionStory2Article.source.officialCurrentCodes,[]);
  assert.equal(superEvolutionStory2Article.source.unverifiedCandidates.length,43);
  assert.equal(superEvolutionStory2Article.source.historicalRecords.length,2);
  assert.equal(superEvolutionStory2Article.source.officialRegionalCodes.length,4);
  assert.match(html,/한국 공개 후보<\/span><strong>17개/);
  assert.match(html,/중국 공식 근거<\/span><strong>4개/);
  assert.match(html,/전체 보존 기록<\/span><strong>45개/);
  assert.match(html,/최신 <small>43<\/small>/);
  for(const code of allCodes)assert.ok(records.some(x=>x.code===code),code);
});

test('슈퍼진화스토리2는 중국판 공식 코드를 한국판 공식 현재로 승격하지 않는다',()=>{
  const byCode=new Map(superEvolutionStory2Article.source.gamePeriodModel.records.map(x=>[x.code,x]));
  for(const code of ['3.5丰野间','月缘形态']){
    assert.equal(byCode.get(code).latest,true);
    assert.equal(byCode.get(code).status,'UNVERIFIED');
    assert.match(byCode.get(code).statusLabel,/중국판 공식 발급·한국판 적용 미확인/);
    assert.equal(byCode.get(code).sources[0].referenceType,'OFFICIAL_CODE_CONTEXT');
  }
  for(const code of ['子弹时间','造唤许可']){
    assert.equal(byCode.get(code).latest,false);
    assert.equal(byCode.get(code).status,'UNVERIFIED');
    assert.match(byCode.get(code).statusLabel,/중국판 공식 과거 발급/);
  }
  assert.equal(byCode.get('两种扣减').expiry,'2026-12-31');
  assert.equal(byCode.get('SES2OPEN').status,'UNVERIFIED');
  assert.match(superEvolutionStory2Article.post.content,/프로필 → 설정 → 교환 코드\(兑换码\)/);
  assert.match(superEvolutionStory2Article.post.content,/한국판 사용 가능으로 승격하지 않습니다/);
});
