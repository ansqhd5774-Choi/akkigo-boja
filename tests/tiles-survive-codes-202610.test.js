import {test} from 'node:test';
import assert from 'node:assert/strict';
import candidates from '../data/game-code-candidates.json' with {type:'json'};
import icons from '../data/game-app-icons.json' with {type:'json'};
import {tilesSurviveArticle} from '../src/tiles-survive-article.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameCouponLayout} from '../src/game-code-layout-contract.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';
import {validateGameCandidateCoverage} from '../src/game-code-candidate-policy.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateArticlePresentation} from '../src/article-presentation.js';
import {assertPeriodHTML} from './period-test-helpers.js';

const key='tiles-survive-codes-202610';

test('Tiles Survive uses the shared game-period article contract',()=>{
  const a=tilesSurviveArticle;
  assert.equal(a.articleKey,key);
  assert.equal(a.approvedForPublish,true);
  assert.equal(a.post.title,'타일 서바이벌');
  assert.deepEqual(a.post.labels,['게임','타일서바이벌']);
  assert.equal(a.source.gamePeriodModel.records.length,42);
  const html=a.post.content;
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal(html.includes('<h1'),false);
  const copies=[...html.matchAll(/data-ncp-copy="([^"]+)"/g)].map(x=>x[1]);
  const shares=[...html.matchAll(/data-ncp-share="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(copies.length,42);
  assert.deepEqual(copies,shares);
  for(const code of ['TS777','TS888','TS999','MOONGIFT','DISCORD50K','FACEBOOK100K'])assert.ok(copies.includes(code),code);
  assert.ok(html.includes('LDSHOP5FF'));
  assert.ok(html.includes('첫 구매 5% 할인'));
  assert.ok(html.includes('최대 22% 할인'));
  assert.ok(html.includes('10-11'));
  assert.equal(a.source.benefits.find(x=>x.type==='ELIGIBILITY_APPLICATION')?.expiry,'2026-10-11');
  assertPeriodHTML(html);
  assert.equal(validateGamePeriodArticle(a),true);
  assert.equal(validateGameCouponLayout(key,a.post),true);
  assert.equal(validateGameCandidateCoverage(a),true);
  assert.equal(validateGameFeaturedImage(key,a.post),true);
  assert.equal(validateArticlePresentation(a),true);
  assert.equal(validateArticleDraft(a),true);
});

test('Tiles Survive separates expired, conflicting and unverified evidence',()=>{
  const own=candidates.filter(x=>x.gameName==='타일서바이벌');
  assert.equal(own.length,42);
  assert.equal(new Set(own.map(x=>x.code)).size,42);
  for(const code of ['MOONGIFT','DISCORD50K','FACEBOOK100K'])assert.equal(own.find(x=>x.code===code)?.status,'EXPIRED');
  for(const code of ['TS777','TS888','TS999','HUGDAY2026'])assert.equal(own.find(x=>x.code===code)?.status,'UNVERIFIED');
  const icon=icons.find(x=>x.articleKey===key);
  assert.equal(icon?.gameName,'타일 서바이벌');
  assert.equal(icon?.platform,'apple-app-store');
  assert.equal(tilesSurviveArticle.source.measuredSearch.monthlySearchRange,'500~1천');
});
