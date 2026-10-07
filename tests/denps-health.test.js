import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('덴프스 10월 건강 쿠폰 글은 공식 혜택과 공식 이미지를 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='denps-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','덴프스']);
  const html=readFileSync(new URL('../drafts/denps-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/denps-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/share-image-1-0fbc02f4e38dbe9320d13c1b48d9c7b9\.jpg/);
  assert.match(html,/10,000원 쿠폰/);
  assert.match(html,/30,000원 이상 구매/);
  assert.match(html,/5% 추가 쿠폰/);
  assert.match(html,/2026\.10\.06 10:00 ~ 10\.31 23:59/);
  assert.match(html,/덴마크 유산균이야기 1박스\/2개월분 19,900원/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
