import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('원신 10월 프로모션 리딤코드는 코드·보상·만료 조건을 보존한다',()=>{
  const item=coupons.find(x=>x.id==='genshin-6ls3f3ls5k87-202610');
  assert.ok(item);
  assert.equal(item.brand,'원신');
  assert.equal(item.code,'6LS3F3LS5K87');
  assert.equal(item.status,'UNVERIFIED');
  assert.equal(item.expiresAt,'2026-11-03T16:00:00.000Z');
  assert.deepEqual(item.rewards,[{name:'원석',quantity:20},{name:'구현의 수정',quantity:160}]);
  assert.equal(validateCoupon(item,Date.parse('2026-10-06T11:20:00Z')),item);
});

test('원신 공개 글은 리딤코드·원석 보상·만료·복사·공식 교환 경로를 제공한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/genshin-codes-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/genshin-codes-202610.html',import.meta.url),'utf8');
  const imageUrl='https://play-lh.googleusercontent.com/PQEqjOxr-3uZaNHmWoQinLVQQ9fbSegMKXmqgFm5nGgagqC2REH-1er3BguYStWbH3YStijj5WH1DDlwPh2ehw=s0-br30';
  assert.equal(draft.articleKey,'genshin-codes-202610');
  assert.equal((html.match(/data-ncp-featured-image="genshin"/g)||[]).length,1);
  assert.ok(html.includes(imageUrl));
  assert.ok(html.includes('alt="원신 공식 대표 이미지"'));
  assert.ok(html.indexOf('<img') < html.indexOf('class="ncp-hero"'));
  assert.equal(draft.publicationStatus,'LIVE');
  assert.equal(draft.publication.postId,'7068598989400675288');
  assert.equal(draft.publication.url,'https://lsifl.blogspot.com/2026/10/2026-10_02129223752.html');
  assert.equal(draft.publication.publicVerified,true);
  assert.equal(draft.publication.workflowRunId,37458048452);
  assert.equal(draft.post.content,html.trim());
  assert.deepEqual(draft.post.labels,['게임','원신']);
  assert.match(html,/6LS3F3LS5K87/);
  assert.match(html,/data-ncp-copy="6LS3F3LS5K87"/);
  assert.match(html,/원석 20개/);
  assert.match(html,/구현의 수정 160개/);
  assert.match(html,/2026년 11월 4일 01:00/);
  assert.match(html,/genshin\.hoyoverse\.com\/ko\/gift/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('6LS3F3LS5K87'),false);
  assert.equal(preview.includes('navigator.clipboard'),false);
  assert.equal(preview.includes('<script'),false);
  assert.match(preview,/확인된 코드<\/span><strong>1개/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|쿠폰 확인 기준|내부 운영 상태|활성 추천/);
});
