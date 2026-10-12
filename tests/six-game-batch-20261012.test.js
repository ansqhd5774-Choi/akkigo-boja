import test from 'node:test';
import assert from 'node:assert/strict';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {executionerSwordClassicArticle,majoArticle,blackDesertMobileArticle,zombieWavesArticle,rogueLegendArticle,aion2Article} from '../src/game-batch-20261012-b.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const expected=[
  ['executioner-sword-classic-codes-202610','집행검 클래식',executionerSwordClassicArticle],
  ['majo-codes-202610','MAJO',majoArticle],
  ['black-desert-mobile-codes-202610','검은사막 모바일',blackDesertMobileArticle],
  ['zombie-waves-codes-202610','좀비 웨이브스',zombieWavesArticle],
  ['rogue-legend-codes-202610','로그 레전드',rogueLegendArticle],
  ['aion2-codes-202610','아이온2',aion2Article]
];

test('6개 게임 글은 단독 게임명 제목·공식 앱 아이콘·공통 발행 계약을 지킨다',()=>{
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

test('집행검 클래식은 공식 고정코드를 만들지 않고 제3자 10개를 미확인 후보로 유지한다',()=>{
  const rows=executionerSwordClassicArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,10);
  assert.ok(rows.every(x=>x.latest===true));
  assert.ok(rows.every(x=>/미확인/.test(x.statusLabel)));
  assert.equal(executionerSwordClassicArticle.source.benefits[0].status,'EXPIRED');
});

test('MAJO는 커뮤니티 코드와 범용 문자열을 공식으로 승격하지 않고 공식 접속 보상을 분리한다',()=>{
  const rows=majoArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,9);
  assert.equal(rows.find(x=>x.code==='MAJO6SRJH').sourcePublishedAt,'2026-09-11');
  assert.ok(rows.every(x=>/미확인/.test(x.statusLabel)));
  assert.equal(majoArticle.source.benefits.find(x=>x.benefit.includes('연속 뽑기')).authority,'OFFICIAL');
  assert.equal(majoArticle.source.benefits.find(x=>x.benefit.includes('TikTok Lite')).status,'EXPIRED');
});

test('검은사막 모바일은 PC판과 분리된 공식 현재 쿠폰 7개와 기한을 보존한다',()=>{
  const rows=blackDesertMobileArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,7);
  assert.ok(rows.every(x=>x.latest===true));
  assert.ok(rows.every(x=>x.statusLabel==='공식·현재'));
  assert.deepEqual(rows.map(x=>x.code),['PRESENTFROMGM','THANKS4FEEDBACK','FORYOURGROWTH','PLAYEASIER','HEIDEL2026','DEVCOMMENTARY26','CRIMSONXBDM']);
  assert.equal(rows.find(x=>x.code==='CRIMSONXBDM').expiry,'2026-10-15 23:59');
  assert.equal(rows.find(x=>x.code==='HEIDEL2026').expiry,'2026-10-27 업데이트 점검 전');
  assert.equal(rows.find(x=>x.code==='DEVCOMMENTARY26').sourcePublishedAt,'2026-07-11');
});

test('좀비 웨이브스는 제3자 현재 후보와 종료 프로모션을 분리한다',()=>{
  const rows=zombieWavesArticle.source.gamePeriodModel.records;
  assert.equal(rows.filter(x=>x.latest===true).length,15);
  assert.ok(rows.filter(x=>x.latest===true).every(x=>/미확인/.test(x.statusLabel)));
  assert.equal(rows.find(x=>x.code==='zwdarktide').expiry,'2026-11-30');
  assert.equal(rows.find(x=>x.code==='SUPER2026BUNDLE').sourcePublishedAt,'2026-10-06');
  assert.equal(rows.filter(x=>/종료/.test(x.statusLabel)).length,6);
});

test('로그 레전드는 제3자 고정 후보 5개와 공식 Daily Reward를 구분한다',()=>{
  const rows=rogueLegendArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.map(x=>x.code),['GET888','Rogue2026','EMBERIN','Gem100','HAMMER']);
  assert.ok(rows.every(x=>x.sourcePublishedAt==='2026-09-16'));
  assert.ok(rows.every(x=>/미확인/.test(x.statusLabel)));
  const daily=rogueLegendArticle.source.benefits.find(x=>x.type==='DAILY_REWARD');
  assert.equal(daily.authority,'OFFICIAL');
  assert.equal(daily.status,'ACTIVE');
});

test('아이온2는 공식 추석 쿠폰 1개를 현재로 두고 과거 공식 코드를 종료 이력으로 분리한다',()=>{
  const rows=aion2Article.source.gamePeriodModel.records;
  const current=rows.filter(x=>x.latest===true);
  assert.equal(current.length,1);
  assert.equal(current[0].code,'HAPPYCHUSEOKAION2');
  assert.equal(current[0].sourcePublishedAt,'2026-09-22');
  assert.equal(current[0].expiry,'2026-10-14 정기점검 전');
  assert.deepEqual(rows.filter(x=>!x.latest).map(x=>x.code),['AION2DAYS100','WELCOMEBACK','AION2CHAPTERONE']);
  assert.ok(rows.filter(x=>!x.latest).every(x=>/종료/.test(x.statusLabel)));
});
