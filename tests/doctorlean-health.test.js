import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('닥터린 10월 건강 쿠폰 글은 공식 혜택과 공식 이미지를 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='doctorlean-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','닥터린']);
  const html=readFileSync(new URL('../drafts/doctorlean-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/doctorlean-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/DT130552336940wYYNB7\.png/);
  assert.match(html,/7종 쿠폰팩/);
  assert.match(html,/10% 추가할인 쿠폰/);
  assert.match(html,/앱 설치 회원 대상/);
  assert.match(html,/30,000원 이상 무료배송/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
