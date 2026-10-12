import test from 'node:test';
import assert from 'node:assert/strict';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {darkTowerArticle,honkaiImpact3rdArticle,neoMonstersArticle,tokyoDebunkerArticle,kartRiderRushPlusArticle} from '../src/game-batch-20261012.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const expected=[
  ['dark-tower-codes-202610','다크타워',darkTowerArticle],
  ['honkai-impact-3rd-codes-202610','붕괴3rd',honkaiImpact3rdArticle],
  ['neo-monsters-benefits-202610','네오몬스터',neoMonstersArticle],
  ['tokyo-debunker-codes-202610','도쿄 디벙커',tokyoDebunkerArticle],
  ['kartrider-rush-plus-codes-202610','카트라이더 러쉬플러스',kartRiderRushPlusArticle]
];

test('5개 게임 글은 단독 게임명 제목·공식 앱 아이콘·공통 발행 계약을 지킨다',()=>{
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

test('다크타워는 공식 globalsupport와 제3자 후보를 분리한다',()=>{
  const rows=darkTowerArticle.source.gamePeriodModel.records;
  const official=rows.find(x=>x.code==='globalsupport');
  assert.equal(official.latest,true);
  assert.equal(official.expiry,'2026-10-16');
  assert.equal(official.statusLabel,'공식 쿠폰');
  assert.equal(rows.filter(x=>x.statusLabel==='제3자 후보·실사용 미확인').length,24);
  assert.equal(darkTowerArticle.source.benefits.find(x=>x.type==='IN_GAME_EVENT').authority,'OFFICIAL');
});

test('붕괴3rd는 스타레일과 분리하고 공식 현재 3개·공식 종료 상충 2개를 보존한다',()=>{
  const rows=honkaiImpact3rdArticle.source.gamePeriodModel.records;
  assert.equal(rows.filter(x=>x.latest===true).length,3);
  assert.equal(rows.find(x=>x.code==='BV8FVTZX6K').expiry,'2026-10-24 00:59 JST');
  assert.equal(rows.find(x=>x.code==='ToSenadina').expiry,'2026-10-22 00:59 JST');
  assert.equal(rows.find(x=>x.code==='TimeAlbum').expiry,'2026-10-31 23:59');
  assert.match(rows.find(x=>x.code==='QUBP3NCYI3').statusLabel,/종료 확정/);
  assert.match(rows.find(x=>x.code==='5T8NUPYUC2').statusLabel,/종료 확정/);
  assert.notEqual(honkaiImpact3rdArticle.articleKey,'honkai-star-rail-codes-202610');
});

test('네오몬스터는 존재하지 않는 공용 리딤코드를 만들지 않고 공식 할인 혜택만 표시한다',()=>{
  assert.equal(neoMonstersArticle.source.gamePeriodModel.records.length,0);
  assert.equal(neoMonstersArticle.source.benefits.find(x=>x.type==='AUTO_DISCOUNT').benefit,'Google Play 앱 가격 100% 할인');
  assert.match(neoMonstersArticle.post.content,/리딤코드를 발급하지 않는다고 명시/);
  assert.doesNotMatch(neoMonstersArticle.post.content,/data-ncp-copy=/);
});

test('도쿄 디벙커는 제3자 17개를 전부 미확인 후보로 유지한다',()=>{
  const rows=tokyoDebunkerArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,17);
  assert.equal(rows.filter(x=>x.latest===true).length,17);
  assert.ok(rows.every(x=>/미확인/.test(x.statusLabel)));
  assert.equal(tokyoDebunkerArticle.source.benefits[0].status,'UNVERIFIED');
  assert.match(tokyoDebunkerArticle.post.content,/공식 확인<\/span><strong>0개/);
});

test('카러플은 WEST 공용 후보와 한국 서버 참여자 발급형 쿠폰을 혼합하지 않는다',()=>{
  const rows=kartRiderRushPlusArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.filter(x=>x.latest===true).map(x=>x.code),['KRRPING','RUSHPING']);
  assert.ok(rows.filter(x=>x.latest===true).every(x=>/WEST/.test(x.statusLabel)));
  const ald1=kartRiderRushPlusArticle.source.benefits.find(x=>x.benefit.includes('ALD1'));
  const hy=kartRiderRushPlusArticle.source.benefits.find(x=>x.benefit.includes('hy'));
  assert.equal(ald1.authority,'OFFICIAL');
  assert.equal(ald1.expiry,'2026-11-11 23:59');
  assert.equal(hy.status,'EXPIRED_ACQUISITION_USE_ACTIVE');
  assert.equal(hy.expiry,'2026-12-31 23:59');
});
