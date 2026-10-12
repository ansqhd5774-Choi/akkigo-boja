import test from 'node:test';
import assert from 'node:assert/strict';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {dragonVillage3Article,evernightReverseArticle,xpHeroArticle,yulgangNextArticle,nyangjjikHeroesArticle} from '../src/game-batch-20261012-c.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const expected=[
  ['dragon-village3-codes-202610','드래곤빌리지3',dragonVillage3Article],
  ['evernight-reverse-codes-202610','에버나이트: 리버스',evernightReverseArticle],
  ['xp-hero-codes-202610','XP Hero',xpHeroArticle],
  ['yulgang-next-codes-202610','열혈강호: 넥스트',yulgangNextArticle],
  ['nyangjjik-heroes-codes-202610','냥찍 히어로즈',nyangjjikHeroesArticle]
];

test('5개 게임 글은 공식 게임명 제목·공식 앱 아이콘·공통 발행 계약을 지킨다',()=>{
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

test('드래곤빌리지3는 최근 후보와 공식 종료·발급 이력을 섞지 않는다',()=>{
  const rows=dragonVillage3Article.source.gamePeriodModel.records;
  assert.equal(rows.filter(x=>x.latest===true).length,9);
  assert.ok(rows.filter(x=>x.latest===true).every(x=>/미확인/.test(x.statusLabel)));
  const roadmap=rows.find(x=>x.code==='7ROADMAP');
  assert.equal(roadmap.latest,false);
  assert.equal(roadmap.sourcePublishedAt,'2026-06-25');
  assert.equal(roadmap.expiry,'2026-07-09 08:59 KST');
  assert.equal(rows.find(x=>x.code==='DV3START').sourcePublishedAt,'2026-06-03');
  assert.equal(dragonVillage3Article.source.benefits[0].status,'ACTIVE');
});

test('에버나이트 리버스는 공식 발급 3개를 보존하되 사용 가능으로 단정하지 않는다',()=>{
  const rows=evernightReverseArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.map(x=>x.code),['evernightopen','evernightday2','evernight333']);
  assert.deepEqual(rows.map(x=>x.sourcePublishedAt),['2026-09-16','2026-09-17','2026-09-18']);
  assert.ok(rows.every(x=>x.latest===true));
  assert.ok(rows.every(x=>/현재 사용 미확인/.test(x.statusLabel)));
  assert.ok(rows.every(x=>x.expiry==='공식 기한 미표기'));
  assert.equal(evernightReverseArticle.source.benefits[0].authority,'OFFICIAL');
});

test('XP Hero는 Creator Code를 무료 보상 쿠폰으로 오인시키지 않는다',()=>{
  const rows=xpHeroArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,1);
  assert.equal(rows[0].code,'lxy9950');
  assert.match(rows[0].statusLabel,/플레이어 보상 없음/);
  assert.match(xpHeroArticle.post.content,/보상 쿠폰/);
  assert.match(xpHeroArticle.post.content,/0개/);
  assert.equal(xpHeroArticle.source.benefits[0].type,'CREATOR_CODE');
});

test('열혈강호 넥스트는 HAPPY1003 교차 후보와 나머지 후보를 공식으로 승격하지 않는다',()=>{
  const rows=yulgangNextArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,12);
  const happy=rows.find(x=>x.code==='HAPPY1003');
  assert.equal(happy.sourcePublishedAt,'2026-10-03');
  assert.match(happy.statusLabel,/후보/);
  assert.ok(rows.every(x=>/미확인/.test(x.statusLabel)));
  assert.equal(yulgangNextArticle.source.benefits[0].status,'ACTIVE');
});

test('냥찍 히어로즈는 현재 후보 4개와 종료 기록 9개를 날짜 기준으로 분리한다',()=>{
  const rows=nyangjjikHeroesArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.filter(x=>x.latest).map(x=>x.code),['HANGEUL1009','HAPPYAUTUMN','BETTERPLAY','SOULDUO']);
  assert.equal(rows.filter(x=>!x.latest).length,9);
  assert.equal(rows.find(x=>x.code==='HANGEUL1009').expiry,'2026-12-09');
  assert.equal(rows.find(x=>x.code==='SOULDUO').expiry,'2026-10-30');
  assert.ok(rows.filter(x=>!x.latest).every(x=>/종료/.test(x.statusLabel)));
  assert.equal(nyangjjikHeroesArticle.source.benefits[0].benefit,'777회 무료 뽑기');
});
