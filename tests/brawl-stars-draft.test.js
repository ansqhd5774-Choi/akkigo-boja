import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('브롤스타즈 10월 무료 보상 후보 데이터가 저장된다',()=>{
  const item=coupons.find(x=>x.id==='brawl-stars-october-freebies-202610');
  assert.ok(item);
  assert.equal(item.brand,'브롤스타즈');
  assert.equal(item.offerType,'FREEBIE');
  assert.equal(item.status,'UNVERIFIED');
  assert.equal(item.endMode,'UNKNOWN');
  assert.equal(validateCoupon(item,Date.parse('2026-10-06T15:33:00Z')),item);
});

test('브롤스타즈 공개 글은 공식 보상 링크 5개와 대표 이미지를 제공한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/brawl-stars-rewards-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/brawl-stars-rewards-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'brawl-stars-rewards-202610');
  assert.equal(draft.publicationStatus,'LIVE');
  assert.equal(draft.approvedForPublish,true);
  assert.equal(draft.publication.postId,'218467175103767457');
  assert.equal(draft.publication.url,'https://lsifl.blogspot.com/2026/10/qr-2026-10.html');
  assert.equal(draft.publication.publicVerified,true);
  assert.equal(draft.publication.workflowRunId,37489646514);
  assert.equal(draft.post.content,html.trim());
  assert.deepEqual(draft.post.labels,['게임','브롤스타즈']);
  assert.equal((html.match(/data-ncp-featured-image="brawl-stars"/g)||[]).length,1);
  assert.match(html,/Candle Spray/);
  assert.match(html,/Nori Box/);
  assert.match(html,/Thief Pin/);
  assert.match(html,/Bolt Box/);
  assert.match(html,/Bulb Pin/);
  assert.equal((html.match(/https:\/\/link\.brawlstars\.com/g)||[]).length>=5,true);
  assert.match(html,/QR 코드/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('link.brawlstars.com'),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
