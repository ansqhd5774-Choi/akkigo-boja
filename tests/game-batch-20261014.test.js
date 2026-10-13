import {test} from 'node:test';
import assert from 'node:assert/strict';
import {waruruBeaverArticle} from '../src/game-batch-20261014.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const expectedCodes=['WELCOME','VIP222','VIP333','VIP555','VIP666','VIP777','VIP888','VIP2024','GO2024','FBGIFT','DCGIFT'];

test('와르르비버는 공식 게임명·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(waruruBeaverArticle.articleKey,'waruru-beaver-codes-202610');
  assert.equal(waruruBeaverArticle.post.title,'와르르비버');
  assert.equal(waruruBeaverArticle.approvedForPublish,true);
  assert.equal(waruruBeaverArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(waruruBeaverArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(waruruBeaverArticle),true);
  assert.equal(validateGameFeaturedImage(waruruBeaverArticle.articleKey,waruruBeaverArticle.post),true);
  assert.equal((waruruBeaverArticle.post.content.match(/data-ncp-copy=/g)||[]).length,11);
  assert.equal((waruruBeaverArticle.post.content.match(/data-ncp-share=/g)||[]).length,11);
  assert.match(waruruBeaverArticle.post.content,/<!--more-->/);
});

test('와르르비버는 공식 코드 0개와 제3자 현재 후보 11개를 구분하고 범용 문자열도 삭제하지 않는다',()=>{
  const html=waruruBeaverArticle.post.content;
  assert.deepEqual(waruruBeaverArticle.source.officialCurrentCodes,[]);
  assert.equal(waruruBeaverArticle.source.unverifiedCandidates.length,11);
  assert.deepEqual(waruruBeaverArticle.source.unverifiedCandidates.map(x=>x.code),expectedCodes);
  assert.match(html,/공식 확인 코드<\/span><strong>0개/);
  assert.match(html,/제3자 현재 후보<\/span><strong>11개/);
  for(const candidate of waruruBeaverArticle.source.unverifiedCandidates){
    assert.equal(candidate.status,'UNVERIFIED');
    assert.equal(candidate.latest,true);
    assert.equal(candidate.sourcePublishedAt,null);
    assert.ok(candidate.latestEvidence.includes('2026-10-14'));
    assert.ok(candidate.sources.length>=1);
    assert.ok(candidate.sources.every(x=>x.referenceType==='THIRD_PARTY_CODE_MENTION'));
    assert.ok(candidate.sources.every(x=>x.sourcePublishedAt===null));
  }
  for(const code of expectedCodes)assert.match(html,new RegExp(code));
  assert.match(html,/범용 문자열처럼 보여도 삭제하지 않고 미확인 후보로 보존/);
  assert.match(html,/원문 최초 게시일은 정확히 확인되지 않아 수집일로 대체하지 않았습니다/);
  assert.match(html,/공식 쿠폰 입력 메뉴를 확인하지 못했습니다/);
});
