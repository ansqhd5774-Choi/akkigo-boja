import test from 'node:test';
import assert from 'node:assert/strict';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {chunoIdleArticle,cookieRunCrumbleArticle,switchingHeroesArticle,realfarmArticle,mongilStarDiveArticle} from '../src/game-batch-20261012-e.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const expected=[
  ['chuno-idle-codes-202610','추노 키우기',chunoIdleArticle],
  ['cookierun-crumble-codes-202610','쿠키런 키우기 - 쿠키런: 크럼블',cookieRunCrumbleArticle],
  ['switching-heroes-codes-202610','스위칭 히어로즈: 키우기 RPG',switchingHeroesArticle],
  ['realfarm-benefits-202610','레알팜',realfarmArticle],
  ['mongil-star-dive-codes-202610','몬길: STAR DIVE',mongilStarDiveArticle]
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

test('추노 키우기는 8개 문자열을 현재 공식으로 승격하지 않는다',()=>{
  const rows=chunoIdleArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,8);
  assert.deepEqual(rows.map(x=>x.code),['OPENCHUNO','FIRSTWIN','CHUNO1ST','IOSOPEN','APPLE1ST','CAFE1000','CAFE2000','CAFE3000']);
  assert.ok(rows.every(x=>x.latest===true));
  assert.ok(rows.every(x=>/제3자 후보/.test(x.statusLabel)));
  assert.ok(rows.every(x=>x.expiry==='미확인'));
});

test('쿠키런 크럼블은 공식 입력 페이지와 종료 출시 쿠폰을 분리한다',()=>{
  const rows=cookieRunCrumbleArticle.source.gamePeriodModel.records;
  assert.deepEqual(rows.map(x=>x.code),['COOKIERUNCRUMBLE1ST','COOKIERUNCRUMBLENO1']);
  assert.ok(rows.every(x=>x.latest===false));
  assert.ok(rows.every(x=>/종료/.test(x.statusLabel)));
  assert.equal(cookieRunCrumbleArticle.source.benefits[0].type,'REDEEM_PORTAL');
});

test('스위칭 히어로즈는 게임사 제공 제휴 3개와 제3자 1주년 후보 3개를 분리한다',()=>{
  const rows=switchingHeroesArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,6);
  assert.deepEqual(rows.slice(0,3).map(x=>x.code),['kupondotcom1','kupondotcom2','kupondotcom3']);
  assert.ok(rows.slice(0,3).every(x=>/게임사 제공 제휴/.test(x.statusLabel)));
  assert.ok(rows.slice(3).every(x=>/제3자 교차 후보/.test(x.statusLabel)));
  assert.equal(rows[0].expiry,'2027-09-30 00:00');
});

test('레알팜은 복사형 문자열을 만들지 않고 레알쿠폰 교환 혜택을 표시한다',()=>{
  assert.equal(realfarmArticle.source.gamePeriodModel.records.length,0);
  assert.equal(realfarmArticle.source.benefits[0].type,'IN_GAME_REDEMPTION');
  assert.match(realfarmArticle.source.benefits[0].benefit,/레알쿠폰 11장/);
  assert.doesNotMatch(realfarmArticle.post.content,/data-ncp-copy=/);
});

test('몬길 STAR DIVE는 현재 공식 코드 0 상태와 과거 공식 이력·현재 ★5 혜택을 분리한다',()=>{
  const rows=mongilStarDiveArticle.source.gamePeriodModel.records;
  assert.equal(rows.length,6);
  assert.ok(rows.every(x=>x.latest===false));
  assert.equal(rows[0].code,'BUNNYSHOW');
  assert.equal(rows[0].expiry,'2026-09-09 08:30 JST');
  assert.match(mongilStarDiveArticle.source.benefits[0].benefit,/★5/);
  assert.equal(mongilStarDiveArticle.source.benefits[0].expiry,'2026-11-11 08:59 KST');
});
