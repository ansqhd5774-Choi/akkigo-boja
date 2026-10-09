import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('에스더몰 10월 건강 쿠폰 글은 현재 공식 혜택만 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='esthermall-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','에스더몰']);
  const html=readFileSync(new URL('../drafts/esthermall-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/esthermall-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/logos\/esthermall-representative\.png/);
  assert.match(html,/첫구매 100원딜/);
  assert.match(html,/최종 결제금액 합계가 20,000원 이상/);
  assert.match(html,/ID당 최대 1개/);
  assert.match(html,/친구초대 할인쿠폰/);
  assert.match(html,/20,000원 이상 구매 시 무료배송/);
  assert.match(html,/쿠폰 적용 불가/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
