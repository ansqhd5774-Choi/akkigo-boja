import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('뉴트리원 10월 건강 쿠폰 글은 공식 혜택과 공식 대표 이미지를 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='nutrione-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','뉴트리원']);
  const html=readFileSync(new URL('../drafts/nutrione-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/nutrione-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/20260930_19475\.jpg/);
  assert.match(html,/WELCOME 12%/);
  assert.match(html,/60,000원 이상 구매/);
  assert.match(html,/APP 전용 2,000원/);
  assert.match(html,/3,000원 상품 할인쿠폰/);
  assert.match(html,/2026년 10월 31일/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
