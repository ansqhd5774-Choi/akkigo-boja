import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('정관장 10월 건강 할인 글은 현재 공식 혜택만 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='jungkwanjang-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','정관장']);
  const html=readFileSync(new URL('../drafts/jungkwanjang-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/jungkwanjang-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/og_logo_20251107\.jpg/);
  assert.match(html,/~10% 할인/);
  assert.match(html,/홍삼정/);
  assert.match(html,/홍이장군/);
  assert.match(html,/공용 문자열 쿠폰코드는 확인하지 못했습니다/);
  assert.doesNotMatch(html,/첫구매 50%|전 상품 50%|실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
