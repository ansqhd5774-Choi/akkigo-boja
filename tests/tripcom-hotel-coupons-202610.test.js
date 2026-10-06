import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('트립닷컴 10월 숙박 할인 글은 공식 조건을 서로 분리해 표시한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/tripcom-hotel-coupons-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/tripcom-hotel-coupons-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'tripcom-hotel-coupons-202610');
  assert.equal(draft.approvedForPublish,true);
  assert.equal(draft.publicationStatus,'READY');
  assert.deepEqual(draft.post.labels,['여행·숙박','트립닷컴']);
  assert.equal(draft.post.content,html.trim());
  assert.match(html,/data-ncp-article="tripcom-hotel-coupons-202610"/);
  assert.match(html,/12% · 최대 5만원/);
  assert.match(html,/최근 15일 이내 항공 예약 고객/);
  assert.match(html,/2026년 10월 25일까지/);
  assert.match(html,/2027년 3월 31일까지/);
  assert.match(html,/신한카드 회원 전용 호텔 할인/);
  assert.match(html,/2026년 10월 31일까지/);
  assert.match(html,/2026년 12월 31일까지/);
  assert.match(html,/최대 10%/);
  assert.match(html,/최대 8,200원/);
  assert.match(html,/<!--more-->/);
  assert.match(html,/tripchance-oct\.html/);
  assert.match(html,/shmembershipdiscount\.html/);
  assert.match(html,/kr\.trip\.com\/hotels/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});

test('트립닷컴 목록 미리보기는 조건 요약만 포함한다',()=>{
  const html=readFileSync(new URL('../drafts/tripcom-hotel-coupons-202610.html',import.meta.url),'utf8');
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.match(preview,/주요 숙박 혜택/);
  assert.match(preview,/최대 20%/);
  assert.match(preview,/10월 25일/);
  assert.equal(preview.includes('<script'),false);
});

test('체크리스트는 Blogger 저장에 안전한 CSS escape를 사용한다',()=>{
 const html=readFileSync(new URL('../drafts/tripcom-hotel-coupons-202610.html',import.meta.url),'utf8');
 assert.ok(html.includes('content:"\\2713"'));
 assert.doesNotMatch(html,/content:["'](?:✓|&#10003;)/);
});
