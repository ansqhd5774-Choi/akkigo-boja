import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('안국건강 10월 건강 쿠폰 글은 공식 혜택과 공식 이미지를 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='angukhealth-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','안국건강']);
  const html=readFileSync(new URL('../drafts/angukhealth-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/angukhealth-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/mata_logo\.webp/);
  assert.match(html,/첫 구매 20% 할인쿠폰/);
  assert.match(html,/재구매 20% 할인쿠폰/);
  assert.match(html,/3% 앱 전용 할인쿠폰/);
  assert.match(html,/3,000원 적립금/);
  assert.match(html,/매월 장바구니 \+ 상품 쿠폰/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
