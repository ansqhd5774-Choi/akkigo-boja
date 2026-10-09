import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('종근당건강몰 10월 건강 쿠폰 글은 현재 공식 혜택만 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='ckdhcmall-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','종근당건강몰']);
  const html=readFileSync(new URL('../drafts/ckdhcmall-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/ckdhcmall-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/logos\/ckdhcmall-representative\.png/);
  assert.match(html,/15% 장바구니 쿠폰/);
  assert.match(html,/50,000원 이상 구매/);
  assert.match(html,/20% 장바구니 쿠폰/);
  assert.match(html,/100,000원 이상 구매/);
  assert.match(html,/종근당건강몰 카카오 3천원 쿠폰/);
  assert.match(html,/2027년 4월 23일/);
  assert.match(html,/인기 상품 100원 혜택/);
  assert.doesNotMatch(html,/첫 로그인 3,000원|과거 PAYCO 행사.*현재|실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
