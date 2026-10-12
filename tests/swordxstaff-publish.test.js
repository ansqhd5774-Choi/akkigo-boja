import test from 'node:test';
import assert from 'node:assert/strict';
import {swordxstaffArticle} from '../src/swordxstaff-article.js';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

test('소드X스태프 글은 최신 후보·출처 상충·종료 이력을 분리한다',()=>{
  const a=currentArticleCatalog.find(x=>x.articleKey==='swordxstaff-codes-202610');
  assert.equal(a.articleKey,'swordxstaff-codes-202610');
  assert.equal(a.approvedForPublish,true);
  assert.equal(a.post.title,'소드X스태프');
  assert.deepEqual(a.post.labels,['게임','소드X스태프']);
  assert.equal(a.source.presentationVersion,'compact-r2');
  assert.equal(a.source.templateVersion,'game-period-tabs-r1');
  const rows=a.source.gamePeriodModel.records;
  assert.equal(rows.filter(x=>x.latest===true).length,17);
  assert.equal(rows.filter(x=>x.statusLabel==='출처 상충·시도 후보').length,6);
  assert.equal(rows.find(x=>x.code==='ISLA').expiry,'2026-10-13 00:00 UTC-5');
  assert.equal(rows.find(x=>x.code==='Chomusuke').sourcePublishedAt,'2026-06-12');
  assert.match(rows.find(x=>x.code==='SXSREDDIT').statusLabel,/사용 성공 보고/);
  assert.equal(a.source.searchMeasurement.status,'NOT_MEASURED');
  assert.equal(validateArticleDraft(a),true);
});

test('소드X스태프 공식 앱 아이콘·입력 경로·코드 외 혜택을 보존한다',()=>{
  const a=swordxstaffArticle;
  assert.equal(validateGameFeaturedImage(a.articleKey,a.post),true);
  assert.match(a.post.content,/data-ncp-app-icon="true"/);
  assert.match(a.post.content,/User Center/);
  assert.match(a.post.content,/Boltray 코드 교환 페이지/);
  assert.match(a.post.content,/Daily Top-up Sign-in/);
  assert.equal(a.source.benefits.find(x=>x.type==='PURCHASE_BONUS').authority,'OFFICIAL');
  assert.equal(a.source.benefits.find(x=>x.type==='LAUNCH_REWARD').status,'HISTORICAL');
  assert.equal((a.post.content.match(/<!--more-->/g)||[]).length,1);
});
