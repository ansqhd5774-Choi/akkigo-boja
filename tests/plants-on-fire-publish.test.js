import test from 'node:test';
import assert from 'node:assert/strict';
import {plantsOnFireArticle} from '../src/plants-on-fire-article.js';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

test('플랜츠 온 파이어는 현재 입력 확인·공식 배포·상충·지역 제한·종료 기록을 분리한다',()=>{
  const a=currentArticleCatalog.find(x=>x.articleKey==='plants-on-fire-codes-202610');
  assert.equal(a.post.title,'플랜츠 온 파이어');
  assert.equal(a.approvedForPublish,true);
  assert.equal(a.source.checkedAt,'2026-10-14');
  const rows=a.source.gamePeriodModel.records;
  assert.equal(rows.filter(x=>x.latest===true).length,9);
  assert.equal(rows.find(x=>x.code==='PIRATEBACK').statusLabel,'제3자 실사용 확인');
  assert.match(rows.find(x=>x.code==='CRAZYMOON').statusLabel,/공식 배포/);
  assert.equal(rows.find(x=>x.code==='CRAZYMOON').status,'ACTIVE');
  assert.match(rows.find(x=>x.code==='CRAZYGIFT').statusLabel,/출처 상충/);
  assert.equal(rows.find(x=>x.code==='PLANTSONFIREGIFT').statusLabel,'지역 제한 후보');
  assert.ok(rows.filter(x=>x.statusLabel==='종료').length>=10);
  assert.deepEqual(a.source.officialCurrentCodes.map(x=>x.code),['CRAZYMOON']);
  assert.equal(validateArticleDraft(a),true);
});

test('플랜츠 온 파이어 한국 Google Play 앱 아이콘·입력 경로·코드 외 혜택을 보존한다',()=>{
  const a=plantsOnFireArticle;
  assert.equal(validateGameFeaturedImage(a.articleKey,a.post),true);
  assert.match(a.post.content,/data-ncp-app-icon="true"/);
  assert.match(a.post.content,/com\.plantsonfire\.merge/);
  assert.match(a.post.content,/pay\.nvsgames\.com\/Topup\/803374/);
  assert.match(a.post.content,/Friend Invitation System/);
  assert.match(a.post.content,/Ace Plan/);
  assert.equal(a.source.benefits.find(x=>x.type==='REFERRAL').authority,'OFFICIAL');
  assert.equal((a.post.content.match(/<!--more-->/g)||[]).length,1);
});
