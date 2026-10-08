import {assertPeriodHTML} from './period-test-helpers.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('붕괴 스타레일 STARRAILGIFT는 장기 코드와 보상 정보를 보존한다',()=>{
  const item=coupons.find(x=>x.id==='hsr-starrailgift-202610');
  assert.ok(item);
  assert.equal(item.brand,'붕괴: 스타레일');
  assert.equal(item.code,'STARRAILGIFT');
  assert.equal(item.status,'UNVERIFIED');
  assert.equal(item.endMode,'UNKNOWN');
  assert.equal(item.expiresAt,undefined);
  assert.deepEqual(item.rewards,[
    {name:'성옥',quantity:50},
    {name:'신용 포인트',quantity:10000},
    {name:'여행 가이드',quantity:2},
    {name:'캔 소다',quantity:5}
  ]);
  assert.equal(validateCoupon(item,Date.parse('2026-10-06T13:06:00Z')),item);
});

test('붕괴 스타레일 공개 글은 활성 코드·대표 이미지·공식 교환·만료 방송 코드를 구분한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/honkai-star-rail-codes-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/honkai-star-rail-codes-202610.html',import.meta.url),'utf8');
  const imageUrl='https://play-lh.googleusercontent.com/aWrGocSA7hEuk1qAPe7L4T57LvLKrwwH26cK2_LOqxRQMQX7j3uHYojC-EKWgYEV2PdrmE0ahqvvhLhXrAGk6Q=s0-br30';
  assert.equal(draft.articleKey,'honkai-star-rail-codes-202610');
  assert.equal(draft.publicationStatus,'LIVE');
  assert.equal(draft.approvedForPublish,true);
  assert.equal(draft.publication.postId,'7527648107530469578');
  assert.equal(draft.publication.url,'https://lsifl.blogspot.com/2026/10/2026-10_01455019682.html');
  assert.equal(draft.publication.publicVerified,true);
  assert.equal(draft.publication.workflowRunId,37469425553);
  assert.equal(draft.post.content,html.trim());
  assert.deepEqual(draft.post.labels,['게임','붕괴: 스타레일']);
  assert.equal((html.match(/data-ncp-featured-image="honkai-star-rail"/g)||[]).length,1);
  assert.ok(html.includes(imageUrl));
  assert.ok(html.includes('alt="붕괴: 스타레일 공식 대표 이미지"'));
  assertPeriodHTML(html);
  assert.match(html,/STARRAILGIFT/);
  assert.match(html,/data-ncp-copy="STARRAILGIFT"/);
  assert.match(html,/성옥 50개/);
  assert.match(html,/신용 포인트 10,000/);
  assert.match(html,/여행 가이드 2개/);
  assert.match(html,/캔 소다 5개/);
  assert.match(html,/별도 만료일 미공개/);
  assert.match(html,/hsr\.hoyoverse\.com\/gift/);
  assert.match(html,/KA5SV3FJM7WX/);
  assert.match(html,/7S4AD2X35NE3/);
  assert.match(html,/MALSV2F247FP/);
  assert.match(html,/2026년 9월 22일 00:59/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('STARRAILGIFT'),false);
  assert.equal(preview.includes('navigator.clipboard'),false);
  assert.equal(preview.includes('<script'),false);
  assert.match(preview,/확인된 코드<\/span><strong>1개/);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|쿠폰 확인 기준|내부 운영 상태|활성 추천/);
});
