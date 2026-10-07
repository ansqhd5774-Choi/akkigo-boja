import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('락티브 10월 건강 쿠폰 글은 현재 공식 혜택만 사용한다',()=>{
  const a=articles.find(x=>x.articleKey==='lactiv-coupons-202610');
  assert.ok(a);
  assert.deepEqual(a.post.labels,['건강','락티브']);
  const html=readFileSync(new URL('../drafts/lactiv-coupons-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/lactiv-coupons-202610.json',import.meta.url),'utf8'));
  assert.equal(a.post.content,html);
  assert.equal(draft.post.content,html);
  assert.match(html,/laciv_main_color\.png/);
  assert.match(html,/카카오 플친 채널 추가 후 쿠폰을 다운로드하면 10% 할인/);
  assert.match(html,/최대 할인금액은 10,000원/);
  assert.match(html,/일부 기획세트/);
  assert.match(html,/중복 적용 불가/);
  assert.match(html,/가입만 해도 2만원 쿠폰팩/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|video-game\.svg/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
});
