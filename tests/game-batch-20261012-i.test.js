import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evilLandsArticle,muMonarch2Article,rfOnlineNextArticle,pixelMageIdleArticle,overgearedHeroArticle} from '../src/game-batch-20261012-i.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const cases=[
  [evilLandsArticle,'이블랜드',4],
  [muMonarch2Article,'뮤 모나크2',6],
  [rfOnlineNextArticle,'RF 온라인 넥스트',1],
  [pixelMageIdleArticle,'픽셀 법사 키우기',50],
  [overgearedHeroArticle,'템빨용사',12]
];

test('2026-10-12 i 배치 게임 글은 단독 게임명 제목·공식 앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
  for(const [article,title,count] of cases){
    assert.equal(article.post.title,title);
    assert.equal(article.approvedForPublish,true);
    assert.equal(article.source.templateVersion,'game-period-tabs-r1');
    assert.equal(article.source.presentationVersion,'compact-r2');
    assert.equal(validateGamePeriodArticle(article),true);
    assert.equal(validateGameFeaturedImage(article.articleKey,article.post),true);
    assert.equal((article.post.content.match(/data-ncp-copy=/g)||[]).length,count);
    assert.equal((article.post.content.match(/data-ncp-share=/g)||[]).length,count);
    assert.match(article.post.content,new RegExp(`data-ncp-featured-image="${article.articleKey}"`));
    assert.match(article.post.content,/<!--more-->/);
  }
});

test('이블랜드는 최신 제3자 문자열을 보존하되 공식 교환 체계를 만들지 않는다',()=>{
  const html=evilLandsArticle.post.content;
  for(const code of ['EVILLANDS2024','WELCOME2024','EPIC2024','RPG2024']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/공식 입력 체계 미확인/);
  assert.match(html,/공식 코드<\/span><strong>0개 확인/);
});

test('뮤 모나크2는 제3자 현재 후보와 종료된 공식 2주년 쿠폰을 분리한다',()=>{
  const html=muMonarch2Article.post.content;
  for(const code of ['MU2OPEN','MU2LAUNCH','MU2GIFT','MU2WELCOME','MU2VIP','뮤모나크2감사제']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/공식 2주년 쿠폰·종료/);
  assert.match(html,/Android·PC/);
});

test('RF 온라인 넥스트는 AUTUMN2026 연장 기한과 코드 외 출석 혜택을 구분한다',()=>{
  const html=rfOnlineNextArticle.post.content;
  assert.match(html,/data-ncp-copy="AUTUMN2026"/);
  assert.match(html,/2026-10-31/);
  assert.equal(rfOnlineNextArticle.source.benefits.length,1);
  assert.equal(rfOnlineNextArticle.source.benefits[0].type,'EVENT_ATTENDANCE');
  assert.equal(rfOnlineNextArticle.source.benefits[0].expiry,'2026-10-19 23:59 KST');
});

test('픽셀 법사 키우기는 최신 47개 후보와 과거 종료 3개를 보존하고 상충 코드를 분리한다',()=>{
  const html=pixelMageIdleArticle.post.content;
  assert.equal(pixelMageIdleArticle.source.gamePeriodModel.records.length,50);
  for(const code of ['카페20000','픽법키10만명','생일축하해요','픽법키','삼일절','GRANDOPEN','NECROMANCER']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/최신 목록 상충·만료 의심/);
  assert.match(html,/47개/);
});

test('템빨용사는 현재 커뮤니티 후보 8개와 당일·개발사 발표 종료 기록을 분리한다',()=>{
  const html=overgearedHeroArticle.post.content;
  for(const code of ['OHMOON925','TOPHERO666','TOPHERO888','GEAR666','HERO888','chuseok26','1mthanks']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/개발사 발표 보도·종료/);
  assert.match(html,/당일 종료 기록/);
});
