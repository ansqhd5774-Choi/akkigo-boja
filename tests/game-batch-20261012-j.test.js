import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mobileLegendsArticle,clashRoyaleArticle,muMonarchArticle,anipang4Article,reverse1999Article} from '../src/game-batch-20261012-j.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const cases=[
  [mobileLegendsArticle,'모바일 레전드: Bang Bang',3],
  [clashRoyaleArticle,'클래시 로얄',8],
  [muMonarchArticle,'뮤 모나크',8],
  [anipang4Article,'애니팡4: 매치3 퍼즐 게임',0],
  [reverse1999Article,'리버스: 1999',9]
];

test('2026-10-12 j 배치 게임 글은 단독 게임명 제목·공식 앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
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

test('모바일 레전드는 10월 후보 3개와 공식 교환소를 구분한다',()=>{
  const html=mobileLegendsArticle.post.content;
  for(const code of ['se237hey1','es721azy3','k0m3fvyza']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/공식 발급 미확인/);
  assert.match(html,/사용 횟수 한도/);
  assert.match(html,/Code Exchange/);
});

test('클래시 로얄은 Store 후보 8개와 Creator Code·공식 Store 혜택을 혼동하지 않는다',()=>{
  const html=clashRoyaleArticle.post.content;
  for(const code of ['HEROVALKYRIE','PRINCESSEVO!','MINIONHORDE!','ROYALEAFFAIR','FIREANDICE!!','TRUSTYTURRET','WHENHOGSFLY!','REINABARRIGA']) assert.match(html,new RegExp(`data-ncp-copy="${code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`));
  assert.match(html,/제3자 최신 Store 코드 후보/);
  assert.match(html,/Creator Code/);
  assert.match(html,/Supercell Store/);
});

test('뮤 모나크는 ChuSeokMu 공식 현재와 후보·종료 공식을 분리한다',()=>{
  const html=muMonarchArticle.post.content;
  for(const code of ['ChuSeokMu','MUMONARCH1','MUMONARCH2','MURELIC','COOLINGMU']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/2026-10-21 23:59 KST/);
  assert.match(html,/공식 현재 쿠폰/);
  assert.match(html,/공식 발급·기간 종료/);
});

test('애니팡4는 존재하지 않는 공개 코드를 만들지 않고 SKT 유료 혜택만 분리한다',()=>{
  const html=anipang4Article.post.content;
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.match(html,/공개 코드<\/span><strong>0개/);
  assert.match(html,/5,500원/);
  assert.match(html,/매일 코인 15개/);
  assert.match(html,/유료/);
});

test('리버스 1999는 기간형 3개와 장기 후보 6개를 모두 보존한다',()=>{
  const html=reverse1999Article.post.content;
  for(const code of ['폐허속고향의노래','회귀불가구역','성숙한이념을지닌건축가','gift4u','grandopen1999','1999gift','yyy1999ccc','reverseculture','리버스1999YouTube']) assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  assert.match(html,/2026-10-15 04:59 KST/);
  assert.match(html,/2026-11-05/);
  assert.match(html,/상시 주장·공식 현재 확인 미완료/);
});
