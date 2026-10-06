import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('브라운더스트2 10월 월간 쿠폰은 공식 코드와 만료 조건으로 저장된다',()=>{
  const item=coupons.find(x=>x.id==='browndust2-2026bd2oct-202610');
  assert.ok(item);
  assert.equal(item.brand,'브라운더스트2');
  assert.equal(item.code,'2026BD2OCT');
  assert.equal(item.status,'UNVERIFIED');
  assert.equal(item.expiresAt,'2026-10-31T14:59:00.000Z');
  assert.equal(item.rewards[0].name,'1회 뽑기권');
  assert.equal(item.rewards[0].quantity,3);
  assert.equal(validateCoupon(item,Date.parse('2026-10-06T11:15:00Z')),item);
});

test('브라운더스트2 공개 글은 코드·보상·만료·복사·플랫폼별 입력 방법을 제공한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/browndust2-codes-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/browndust2-codes-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'browndust2-codes-202610');
  assert.equal(draft.publicationStatus,'LIVE');
  assert.equal(draft.publication.postId,'1806229069030793005');
  assert.equal(draft.publication.url,'https://lsifl.blogspot.com/2026/10/2-2026-10.html');
  assert.equal(draft.publication.publicVerified,true);
  assert.equal(draft.publication.workflowRunId,37456353584);
  assert.equal(draft.post.content,html.trim());
  assert.deepEqual(draft.post.labels,['게임','브라운더스트2']);
  assert.match(html,/2026BD2OCT/);
  assert.match(html,/data-ncp-copy="2026BD2OCT"/);
  assert.match(html,/1회 뽑기권 3개/);
  assert.match(html,/2026년 10월 31일 23:59/);
  assert.match(html,/기타/);
  assert.match(html,/쿠폰 등록/);
  assert.match(html,/redeem\.bd2\.pmang\.cloud/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('2026BD2OCT'),false);
  assert.equal(preview.includes('navigator.clipboard'),false);
  assert.equal(preview.includes('<script'),false);
  assert.match(preview,/확인된 쿠폰<\/span><strong>1개/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|쿠폰 확인 기준|내부 운영 상태|활성 추천/);
});
