import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

const expectedCodes=['GOOGLETOP3','3RDBOLTHDAY'];

test('트릭컬 리바이브 10월 쿠폰 2개는 중복 없이 내부 데이터에 저장된다',()=>{
  const items=coupons.filter(x=>x.brand==='트릭컬 리바이브');
  assert.equal(items.length,2);
  assert.deepEqual(items.map(x=>x.code).sort(),[...expectedCodes].sort());
  assert.equal(new Set(items.map(x=>x.id)).size,2);
  for (const item of items) {
    assert.equal(item.status,'UNVERIFIED');
    assert.equal(item.expiresAt,'2026-10-22T01:59:00.000Z');
    assert.equal(validateCoupon(item,Date.parse('2026-10-06T10:45:00Z')),item);
  }
});

test('트릭컬 리바이브 공개 글은 코드·보상·만료·복사·플랫폼별 입력 방법을 제공한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/trickcal-revive-codes-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/trickcal-revive-codes-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'trickcal-revive-codes-202610');
  assert.equal(draft.publicationStatus,'LIVE');
  assert.equal(draft.publication.postId,'4891814108367830529');
  assert.equal(draft.publication.url,'https://lsifl.blogspot.com/2026/10/2026-10.html');
  assert.equal(draft.publication.publicVerified,true);
  assert.equal(draft.publication.workflowRunId,37454686035);
  assert.equal(draft.post.content,html.trim());
  assert.deepEqual(draft.post.labels,['게임','트릭컬 리바이브']);
  for (const code of expectedCodes) {
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/교주의 빛무리 선택권 1개/);
  assert.match(html,/참! 잘했어요 333개/);
  assert.match(html,/엘리프 927개/);
  assert.match(html,/영원살이 일곱자매 선택권 1개/);
  assert.match(html,/2026년 10월 22일 10:59/);
  assert.match(html,/메뉴\(三\) → 설정 → 기타/);
  assert.match(html,/coupon\.a\.prod\.service\.trickcal\.io/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for (const code of expectedCodes) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('navigator.clipboard'),false);
  assert.equal(preview.includes('<script'),false);
  assert.match(preview,/확인된 쿠폰<\/span><strong>2개/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|쿠폰 확인 기준|내부 운영 상태|활성 추천/);
});
