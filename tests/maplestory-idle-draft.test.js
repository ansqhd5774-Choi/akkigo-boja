import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import supplementalArticles from '../data/articles-supplemental.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('메이플 키우기 10월 코드 2개가 저장된다',()=>{
  const ids=['maplestory-idle-pinkbeanattack-202610','maplestory-idle-50cubecoupon-202610'];
  for (const id of ids) {
    const item=coupons.find(x=>x.id===id);
    assert.ok(item,id);
    assert.equal(item.brand,'메이플 키우기');
    assert.equal(item.status,'UNVERIFIED');
    assert.equal(validateCoupon(item,Date.parse('2026-10-06T16:31:00Z')),item);
  }
  const official=coupons.find(x=>x.id==='maplestory-idle-pinkbeanattack-202610');
  assert.equal(official.code,'PINKBEANATTACK');
  assert.equal(official.rewards[0].name,'동료 소환권');
  assert.equal(official.rewards[0].quantity,300);
  assert.equal(official.expiresAt,'2026-10-14T14:59:00.000Z');
  const cube=coupons.find(x=>x.id==='maplestory-idle-50cubecoupon-202610');
  assert.equal(cube.code,'50CUBECOUPON');
  assert.equal(cube.rewards[0].name,'미라클 큐브');
  assert.equal(cube.rewards[0].quantity,50);
  assert.equal(cube.expiresAt,'2026-10-07T14:59:00.000Z');
});

test('메이플 키우기 supplemental article과 공개 HTML이 일치한다',()=>{
  const article=supplementalArticles.find(x=>x.articleKey==='maplestory-idle-codes-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['게임','메이플 키우기']);
  const html=readFileSync(new URL('../drafts/maplestory-idle-codes-202610.html',import.meta.url),'utf8').trim();
  assert.equal(article.post.content,html);
  assert.match(html,/PINKBEANATTACK/);
  assert.match(html,/50CUBECOUPON/);
  assert.match(html,/동료 소환권 300장/);
  assert.match(html,/미라클 큐브 50개/);
  assert.match(html,/2026년 10월 14일 23:59/);
  assert.match(html,/2026년 10월 7일 23:59/);
  assert.match(html,/coupon\.nexon\.com\/ko-kr\/maplestoryidle/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,2);
  assert.equal((html.match(/data-ncp-featured-image="maplestory-idle"/g)||[]).length,1);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('PINKBEANATTACK'),false);
  assert.equal(preview.includes('50CUBECOUPON'),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
