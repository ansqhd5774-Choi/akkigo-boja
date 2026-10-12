import test from 'node:test';
import assert from 'node:assert/strict';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {godSlayerArticle,romanticGanghoArticle,herollArticle,swordOfConvallariaArticle,treeOfSaviorMArticle} from '../src/game-batch-20261012-d.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const expected=[
  ['god-slayer-codes-202610','갓 슬레이어',godSlayerArticle],
  ['romantic-gangho-codes-202610','낭만강호',romanticGanghoArticle],
  ['heroll-codes-202610','용사님 돌았어요?',herollArticle],
  ['sword-of-convallaria-codes-202610','소드 오브 콘발라리아',swordOfConvallariaArticle],
  ['tree-of-savior-m-codes-202610','트리 오브 세이비어M',treeOfSaviorMArticle]
];

test('신규 5개 게임 글은 공식 게임명 제목·공식 앱 아이콘·공통 발행 계약을 지킨다',()=>{
  for(const [key,title,article] of expected){
    const registered=currentArticleCatalog.find(x=>x.articleKey===key);
    assert.ok(registered,key);
    assert.equal(registered.post.title,title);
    assert.equal(registered.approvedForPublish,true);
    assert.equal(registered.source.presentationVersion,'compact-r2');
    assert.equal(registered.source.templateVersion,'game-period-tabs-r1');
    assert.equal(registered.source.searchMeasurement.status,'NOT_MEASURED');
    assert.equal(validateGameFeaturedImage(key,registered.post),true);
    assert.equal(validateArticleDraft(registered),true);
    assert.equal((registered.post.content.match(/<!--more-->/g)||[]).length,1);
    assert.equal(article.articleKey,key);
  }
});

test('갓 슬레이어는 종료된 공식 발급 교차 이력만 보존하고 현재 쿠폰을 만들지 않는다',()=>{
  const rows=godSlayerArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.map(x=>x.code),['goddice00','godgold05']);
  assert.ok(rows.every(x=>x.latest===false));
  assert.deepEqual(rows.map(x=>x.expiry),['2025-08-01','2025-08-04']);
  assert.ok(rows.every(x=>/종료/.test(x.statusLabel)));
  assert.equal(godSlayerArticle.source.benefits[0].authority,'OFFICIAL');
});

test('낭만강호는 최근 9개 문자열을 공식으로 승격하지 않고 만료 의심 2개를 구분한다',()=>{
  const rows=romanticGanghoArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,9);
  assert.ok(rows.every(x=>x.latest===true));
  assert.ok(rows.every(x=>/제3자 후보/.test(x.statusLabel)));
  assert.match(rows.find(x=>x.code==='낭만보상').statusLabel,/만료 의심/);
  assert.match(rows.find(x=>x.code==='2b4egt55').statusLabel,/만료 의심/);
});

test('용사님 돌았어요는 UPDATE200 종료와 HELLOHEROLL·WELCOME 이력을 분리한다',()=>{
  const rows=herollArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.map(x=>x.code),['UPDATE200','HELLOHEROLL','WELCOME']);
  assert.ok(rows.every(x=>x.latest===false));
  assert.equal(rows[0].expiry,'2026-08-31 KST');
  assert.match(rows[0].statusLabel,/종료/);
  assert.match(rows[1].statusLabel,/현재 미확인/);
  assert.match(rows[2].statusLabel,/현재 미확인/);
});

test('소드 오브 콘발라리아는 한국 후보와 글로벌 공식 코드를 지역별로 분리한다',()=>{
  const rows=swordOfConvallariaArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,6);
  assert.equal(rows.filter(x=>/한국 제3자 후보/.test(x.statusLabel)).length,5);
  const global=rows.find(x=>x.code==='ckwy32t1eeevs');
  assert.equal(global.expiry,'2026-10-14 11:59 UTC-4');
  assert.match(global.statusLabel,/글로벌 공식/);
  assert.equal(swordOfConvallariaArticle.post.title,'소드 오브 콘발라리아');
});

test('트리 오브 세이비어M은 GOLDENSEASON과 이전 SUMMER2026을 분리하고 가을 혜택을 보존한다',()=>{
  const rows=treeOfSaviorMArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.map(x=>x.code),['GOLDENSEASON','SUMMER2026']);
  assert.equal(rows[0].latest,true);
  assert.equal(rows[0].sourcePublishedAt,'2026-09-16');
  assert.equal(rows[1].latest,false);
  assert.equal(rows[1].sourcePublishedAt,'2026-07-01');
  assert.match(treeOfSaviorMArticle.source.benefits[0].benefit,/330회/);
  assert.match(treeOfSaviorMArticle.source.benefits[0].benefit,/50%/);
});
