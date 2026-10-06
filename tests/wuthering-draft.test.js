import {test} from 'node:test';
import assert from 'node:assert/strict';
import coupons from '../data/coupons.json' with {type:'json'};
import {buildHubDraft} from '../src/hubs.js';
import {validateCoupon} from '../src/coupons.js';

test('명조 10월 현재 코드와 3.7 종료 이력이 저장된다',()=>{
  const items=coupons.filter(x=>x.brand==='명조:워더링 웨이브');
  assert.equal(items.length,4);
  const current=items.find(x=>x.code==='WUTHERINGGIFT');
  assert.ok(current);
  assert.equal(current.status,'UNVERIFIED');
  assert.equal(validateCoupon(current,Date.parse('2026-10-06T17:42:30Z')),current);
  for(const code of ['FALLINGSANCTUM','FINDSENTINEL','WAKINGMOON']){
    const item=items.find(x=>x.code===code);
    assert.ok(item,code);
    assert.equal(item.status,'EXPIRED');
    assert.equal(item.expiresAt,'2026-09-21T15:59:00.000Z');
  }
});

test('명조 기존 허브는 최신형 10월 본문으로 렌더링된다',()=>{
  const items=coupons.filter(x=>x.brand==='명조:워더링 웨이브');
  const post=buildHubDraft('wuthering',items,Date.parse('2026-10-06T17:43:00Z'));
  assert.equal(post.title,'명조: 워더링 웨이브 리딤코드 모음 (2026년 10월) | 입력 방법·보상');
  assert.match(post.content,/WUTHERINGGIFT/);
  assert.match(post.content,/별의 소리 50/);
  assert.match(post.content,/FALLINGSANCTUM/);
  assert.match(post.content,/FINDSENTINEL/);
  assert.match(post.content,/WAKINGMOON/);
  assert.match(post.content,/터미널 → 설정 → 기타 설정/);
  assert.match(post.content,/data-ncp-featured-image="wuthering"/);
  assert.match(post.content,/<!--more-->/);
  assert.equal((post.content.match(/data-ncp-copy=/g)||[]).length,1);
  const preview=post.content.slice(0,post.content.indexOf('<!--more-->'));
  assert.equal(preview.includes('WUTHERINGGIFT'),false);
  assert.doesNotMatch(post.content,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
