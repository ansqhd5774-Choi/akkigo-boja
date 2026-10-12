import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catHeroesMergeDefenseArticle,darkWarSurvivalArticle,lastZSurvivalShooterArticle,darkSlayerIdleArticle,zombieTowerArticle} from '../src/game-batch-20261012-g.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const cases=[
  [catHeroesMergeDefenseArticle,'캣 히어로즈 - 고양이 머지 디펜스',0],
  [darkWarSurvivalArticle,'Dark War Survival',33],
  [lastZSurvivalShooterArticle,'Last Z: Survival Shooter',21],
  [darkSlayerIdleArticle,'다크슬레이어 : 방치형 RPG 키우기',12],
  [zombieTowerArticle,'Zombie Tower',0]
];

test('2026-10-12 g 배치 게임 글은 공식 제목·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
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

test('캣 히어로즈는 다른 캣 히어로 쿠폰 게임과 섞지 않고 빈 현재 목록을 유지한다',()=>{
  const html=catHeroesMergeDefenseArticle.post.content;
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.match(html,/HYKICK/);
  assert.match(html,/다른 게임/);
});

test('Dark War Survival은 최신 상충 후보와 종료 기록을 모두 보존한다',()=>{
  const html=darkWarSurvivalArticle.post.content;
  for(const code of ['WEBCHOICE','HAUNT7','NEWGIFTCENTER','5MILY','DWFBXNYAN','DWDC3GT8','DWDC12LS','DWDC150K','WEBSTORE210']){
    assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  }
  assert.match(html,/자료 상충/);
  assert.match(html,/공식 Gift Center/);
});

test('Last Z는 최신 후보·철자 상충·최근 종료 기록을 분리한다',()=>{
  const html=lastZSurvivalShooterArticle.post.content;
  for(const code of ['LABWORK','TANKLZ','THANKU250KCOM','THANU250KCOM','LASTZXMAS2425','VICTORY280K4UT','TRUCK99','TROOPZ']){
    assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  }
  assert.match(html,/Special Website Code/);
  assert.match(html,/철자/);
  assert.match(html,/자료 상충/);
});

test('다크슬레이어는 원작 패키지와 2023 기록을 보존하고 후속작을 혼합하지 않는다',()=>{
  const html=darkSlayerIdleArticle.post.content;
  for(const code of ['welcomeds','gogods','loveslyer','sorrydss','1130gift','sgiftsya']){
    assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  }
  assert.match(html,/com\.gamepub\.zhteam\.g/);
  assert.match(html,/다크슬레이어2/);
  assert.match(html,/2023/);
});

test('Zombie Tower는 Pi Game 모바일 앱만 대상으로 하고 Roblox 코드를 섞지 않는다',()=>{
  const html=zombieTowerArticle.post.content;
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.match(html,/Pi Game/);
  assert.match(html,/Roblox/);
  assert.match(html,/다른 게임/);
});
