import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

const key='fortblox-mobile-go-codes-202610';
const primary=['spe7cial','MOB6ILEFORT','WEL5COME','Path4finder','FORTBlOX2','GRANDOPEN','3SURVIVOR'];
const secondary=['PORTBLOCKSGO','WELCOMEGO','FORTRESS2024'];

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
  assert.deepEqual(article.source.codes,[...primary,...secondary]);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,10);
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
  assert.match(html,/15개를 실제 사용 가능한 게임 쿠폰처럼/);
  assert.doesNotMatch(html,/실사용 미검증|BEST|92% 신뢰도|video-game\.svg|게임사 공식 발급 확인됨/);
});
