import {test} from 'node:test';
import assert from 'node:assert/strict';
import {luckyOffenseArticle,potatoZombieArticle,imoWorldOfMagicArticle,mahjongSoulKrArticle} from '../src/game-batch-20261012-h.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const cases=[
  [luckyOffenseArticle,'운빨돌격대',3],
  [potatoZombieArticle,'감자슉슈슉-3333뽑기 증정',9],
  [imoWorldOfMagicArticle,'아이모: The World of Magic',13],
  [mahjongSoulKrArticle,'작혼: 리치 마작',6]
];

test('2026-10-12 h 배치 게임 글은 공식 제목·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
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

test('운빨돌격대는 2025년 3개 기록을 현재 쿠폰으로 승격하지 않는다',()=>{
  const html=luckyOffenseArticle.post.content;
  for(const code of ['LUCKY777','UNBBAL111','luckyoffens2e']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.doesNotMatch(html,/현재 확인<\/span><strong>[1-9]/);
});

test('감자슉슈슉은 최신 제3자 후보 5개와 과거 4개를 분리한다',()=>{
  const html=potatoZombieArticle.post.content;
  for(const code of ['POTATO1','POTATO2','POTATO3','WELCOME','GAMJA']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/공식 발급 미확인/);
  assert.match(html,/BP8ZNBAH28RMBY/);
});

test('아이모는 공식 과거 13개를 보존하고 현재 쿠폰으로 표시하지 않는다',()=>{
  const html=imoWorldOfMagicArticle.post.content;
  for(const code of ['ZYZREDFE','YXYYPLIL','BWLKFQPP','SUMMERIMO']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/공식 발급·기간 종료/);
  assert.match(html,/공식 쿠폰 교환소/);
});

test('작혼은 글로벌 최신 후보와 과거 기록을 한국판 공식으로 승격하지 않는다',()=>{
  const html=mahjongSoulKrArticle.post.content;
  for(const code of ['HAPPYANNIV2026','WKJZSH7MA5AM','RXDPSAKMA4A3','EESQSXTMADAH']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/한국판 적용 미확인/);
  assert.match(html,/상충/);
});
