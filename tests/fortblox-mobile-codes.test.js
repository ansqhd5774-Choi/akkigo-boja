import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

const key='fortblox-mobile-go-codes-202610';
const primary=['spe7cial','MOB6ILEFORT','WEL5COME','Path4finder','FORTBlOX2','GRANDOPEN','3SURVIVOR'];
const secondary=['PORTBLOCKSGO','WELCOMEGO','FORTRESS2024'];
const unknown=['VIP111','VIP222','VIP333','VIP555','VIP666','VIP777','VIP888','VIP999','VIP2024','GO2024','FBGIFT','DCGIFT','WELCOME','GAMEEDU','LINEGAMES'];

test('포트블록스 모바일 쿠폰 글의 코드 정확도·초안·게시물 내용 일치',()=>{
  const article=articles.find(x=>x.articleKey===key);
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['게임','포트블록스']);
  const html=readFileSync(new URL('../drafts/'+key+'.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/'+key+'.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.deepEqual(draft.post,article.post);
  assert.equal(draft.articleKey,key);
  assert.equal(article.source.status,'UNVERIFIED');
  assert.deepEqual(article.source.codes,[...primary,...secondary,...unknown]);
  assert.deepEqual(article.source.unknownSourceCodes,unknown);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,25);
  assert.match(article.post.title,/25개/);
  assert.match(html,/id="fb-unknown"/);
  assert.match(html,/추가 쿠폰 코드 15개 — 출처 불명/);
  assert.equal((html.match(/#(?:1[1-9]|2[0-5]) · 출처 불명/g)||[]).length,15);
  assert.match(html,/공식 발급·작동·만료 확인 안 됨/);
  for(const code of article.source.codes){
    assert.equal(html.split('data-ncp-copy="'+code+'"').length-1,1);
  }
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal((html.match(/data-ncp-featured-image=/g)||[]).length,1);
  assert.match(html,/news-p\.v1\.20260828\./);
  assert.match(html,/HYPERRISE|하이퍼라이즈/);
  assert.match(html,/Roblox[^<]*게임/);
  assert.match(html,/Settings|설정/);
  assert.match(html,/Account|계정/);
  assert.match(html,/coupon\.hyperrise\.kr/);
  assert.match(html,/minutetactics\.com\/codes\/fortblox-promo-codes/);
  assert.match(html,/2026년 10월 8일/);
  assert.match(html,/해외 공개 7개 \/ 국내 제보 3개 \/ 출처 불명 15개/);
  assert.doesNotMatch(html,/실사용 미검증|BEST|92% 신뢰도|video-game\.svg|게임사 공식 발급 확인됨/);
});

test('포트블록스의 기존 URL과 기사 키는 유지하고, 출처 불명 코드를 활성으로 승격하지 않는다',()=>{
  const article=articles.find(a=>a.articleKey===key);
  assert.equal(article.articleKey,key);
  assert.equal(article.source.status,'UNVERIFIED');
  assert.equal(article.source.unknownSourceCodes.length,15);
  assert.equal(article.publicationStatus,'READY');
  assert.equal(articles.filter(a=>a.articleKey===key).length,1);
});
