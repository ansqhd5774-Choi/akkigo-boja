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
  assert.equal((html.match(/class="ncp-col-source" role="cell">출처 불명/g)||[]).length,15);
  assert.match(html,/실제 입력되는지, 보상이 있는지는 확인되지 않았습니다/);
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

test('포트블록스 쿠폰 목록은 PC·모바일에서 순서/출처/만료 기간/쿠폰/복사 순으로 고정 정렬된다',()=>{
  const html=readFileSync(new URL('../drafts/'+key+'.html',import.meta.url),'utf8');
  const scope='[data-ncp-article="'+key+'"] ';
  assert.ok(html.includes(scope+'.ncp-list-header,'+scope+'.ncp-code-card{display:grid;'));
  assert.ok(html.includes('grid-template-columns:46px 116px 108px minmax(0,1fr) 74px'));
  assert.ok(html.includes('grid-template-columns:26px 61px 63px minmax(0,1fr) 54px'));
  assert.match(html,/height:68px;min-height:68px/);
  const headings='<span role="columnheader">순서</span><span role="columnheader">출처</span><span role="columnheader">만료 기간</span><span role="columnheader">쿠폰</span><span role="columnheader">복사</span>';
  assert.equal(html.split(headings).length-1,3);
  assert.equal((html.match(/class="ncp-code-card ncp-coupon-card"/g)||[]).length,25);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,25);
  assert.equal((html.match(/class="ncp-col-expiry" role="cell">미확인/g)||[]).length,25);
  for(let i=1;i<=25;i++){
    const label=i<=7?'해외 공개':i<=10?'국내 제보':'출처 불명';
    assert.ok(html.includes('<span class="ncp-col-order" role="cell">'+String(i).padStart(2,'0')+'</span><span class="ncp-col-source" role="cell">'+label+'</span>'));
  }
  for(const code of articles.find(a=>a.articleKey===key).source.codes){
    assert.ok(html.includes('<code class="ncp-col-code" role="cell">'+code+'</code>'));
    assert.equal(html.split('data-ncp-copy="'+code+'"').length-1,1);
  }
  assert.doesNotMatch(html,/class="ncp-code-head"|class="ncp-source-small"|grid-template-columns:1fr 1fr/);
});
