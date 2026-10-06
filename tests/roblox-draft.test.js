import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('Roblox SPIDERCOLA 데이터가 저장된다',()=>{
  const item=coupons.find(x=>x.id==='roblox-spidercola-202610');
  assert.ok(item);
  assert.equal(item.brand,'로블록스');
  assert.equal(item.code,'SPIDERCOLA');
  assert.equal(item.status,'UNVERIFIED');
  assert.equal(item.endMode,'UNKNOWN');
  assert.deepEqual(item.rewards,[{name:'Spider Cola 어깨 액세서리',quantity:1}]);
  assert.equal(validateCoupon(item,Date.parse('2026-10-06T14:40:00Z')),item);
});

test('Roblox 공개 글은 코드·보상·대표 이미지·공식 입력 페이지를 제공한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/roblox-promo-codes-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/roblox-promo-codes-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'roblox-promo-codes-202610');
  assert.equal(draft.publicationStatus,'READY');
  assert.equal(draft.post.content,html.trim());
  assert.deepEqual(draft.post.labels,['게임','로블록스']);
  assert.equal((html.match(/data-ncp-featured-image="roblox"/g)||[]).length,1);
  assert.match(html,/SPIDERCOLA/);
  assert.match(html,/data-ncp-copy="SPIDERCOLA"/);
  assert.match(html,/Spider Cola 어깨 액세서리/);
  assert.match(html,/www\.roblox\.com\/ko\/redeem/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('SPIDERCOLA'),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
