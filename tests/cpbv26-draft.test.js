import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

const expectedCodes=['STARTWITHGENIE','TRAININGSTART','V26STARTPACK','CPBVFULLMOON','V26A7K9P3XQ2','CPBVKDYPARTY'];

test('컴투스프로야구V26 10월 공식 쿠폰 6개는 내부 데이터에 중복 없이 저장된다',()=>{
  const items=coupons.filter(x=>x.brand==='컴투스프로야구V26');
  assert.equal(items.length,6);
  assert.deepEqual(items.map(x=>x.code).sort(),[...expectedCodes].sort());
  assert.equal(new Set(items.map(x=>x.id)).size,6);
  for (const item of items) {
    assert.equal(item.status,'UNVERIFIED');
    assert.equal(item.sourceUrl,'https://cpbv-community.com2us.com/board/all/44252');
    assert.equal(validateCoupon(item,Date.parse('2026-10-06T10:45:00Z')),item);
  }
});

test('컴투스프로야구V26 공개 글은 코드·보상·만료·복사·입력 방법을 제공하고 목록 미리보기에는 코드를 숨긴다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/cpbv26-codes-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/cpbv26-codes-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'cpbv26-codes-202610');
  assert.equal(draft.publicationStatus,'PENDING');
  assert.equal(draft.post.content,html.trim());
  assert.deepEqual(draft.post.labels,['게임','컴투스프로야구V26']);
  for (const code of expectedCodes) {
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/포인트 1,000,000개/);
  assert.match(html,/2026년 10월 8일 23:59/);
  assert.match(html,/2026년 10월 31일 23:59/);
  assert.match(html,/2026년 11월 30일 23:59/);
  assert.match(html,/더보기 → 새소식/);
  assert.match(html,/이벤트 쿠폰 교환소/);
  assert.match(html,/설정 → 계정/);
  assert.match(html,/쿠폰 보상은 계정당 1회 수령/);
  assert.ok(html.includes('https://cpbv-community.com2us.com/board/all/44252'));
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for (const code of expectedCodes) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('navigator.clipboard'),false);
  assert.equal(preview.includes('<script'),false);
  assert.match(preview,/확인된 쿠폰<\/span><strong>6개/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|쿠폰 확인 기준|내부 운영 상태|활성 추천/);
});
