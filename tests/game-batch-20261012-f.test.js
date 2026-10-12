import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blackWizardInfiniteDefenseArticle,pixelDefendersArticle,battleCatsArticle,lastWarSurvivalArticle} from '../src/game-batch-20261012-f.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const cases=[
  [blackWizardInfiniteDefenseArticle,'흑마법사: 무한 디펜스',8],
  [pixelDefendersArticle,'픽셀 디펜더스',35],
  [battleCatsArticle,'냥코 대전쟁',0],
  [lastWarSurvivalArticle,'라스트 워: 서바이벌',10]
];

test('2026-10-12 f 배치 게임 글은 공통 기간 렌더러와 공식 앱 아이콘 계약을 지킨다',()=>{
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

test('흑마법사 후보는 범용 문자열을 삭제하지 않고 미확인으로 표시한다',()=>{
  for(const code of ['WELCOME','VIP111','VIP222','VIP555','VIP888','VIP999','FBGIFT','DCGIFT']){
    assert.match(blackWizardInfiniteDefenseArticle.post.content,new RegExp(`data-ncp-copy="${code}"`));
  }
  assert.match(blackWizardInfiniteDefenseArticle.post.content,/범용 문자열 후보/);
  assert.match(blackWizardInfiniteDefenseArticle.post.content,/공식 발급 근거 미확인/);
});

test('픽셀 디펜더스는 35개 기록과 서버·만료 조건을 보존한다',()=>{
  const html=pixelDefendersArticle.post.content;
  for(const code of ['OCTCODE','SERVER25','SERVER16','SERVERCODE','PDWELCOME','GACHAREWARD','GLOBAL01']){
    assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  }
  assert.match(html,/Global 25 서버/);
  assert.match(html,/2026-11-01/);
  assert.match(html,/자료 상충/);
});

test('냥코 대전쟁은 공식 시리얼 코드 지원 종료 상태를 빈 코드 목록으로 표시한다',()=>{
  const html=battleCatsArticle.post.content;
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.match(html,/시리얼 코드 지원/);
  assert.match(html,/지원 종료/);
  assert.match(html,/PONOS/);
});

test('라스트 워는 상충하는 10월 자료를 후보와 종료 기록으로 분리한다',()=>{
  const html=lastWarSurvivalArticle.post.content;
  for(const code of ['lastwar111','lastwar666','LASTWAR','playlastwar','LASTWARGIFT','SURVIVAL300','LWVDAY26','LWDC400K']){
    assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  }
  assert.match(html,/자료가 서로 충돌/);
  assert.match(html,/공식 교환 코드 페이지/);
});
