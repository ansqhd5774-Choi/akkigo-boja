import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import supplementalArticles from '../data/articles-supplemental.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('FC 모바일 최근 공식 종료 쿠폰 이력이 저장된다',()=>{
  const item=coupons.find(x=>x.id==='fc-mobile-260922-ng-token');
  assert.ok(item);
  assert.equal(item.brand,'FC 모바일');
  assert.equal(item.status,'EXPIRED');
  assert.equal(item.code,'260922알쏭뚝딱방망이NG토큰');
  assert.equal(item.expiresAt,'2026-09-29T14:59:00.000Z');
  assert.equal(validateCoupon(item,Date.parse('2026-10-06T17:04:00Z')),item);
});

test('FC 모바일 supplemental article과 공개 HTML이 일치한다',()=>{
  const article=supplementalArticles.find(x=>x.articleKey==='fc-mobile-codes-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['게임','FC 모바일']);
  const html=readFileSync(new URL('../drafts/fc-mobile-codes-202610.html',import.meta.url),'utf8').trim();
  assert.equal(article.post.content,html);
  assert.match(html,/현재 사용 가능하다고 확인된 FC 모바일 쿠폰 코드는 없습니다/);
  assert.match(html,/260922알쏭뚝딱방망이NG토큰/);
  assert.match(html,/750만 MP/);
  assert.match(html,/fcmobile\.nexon\.com\/Coupon\/Index/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,1);
  assert.equal((html.match(/data-ncp-featured-image="fc-mobile"/g)||[]).length,1);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('260922알쏭뚝딱방망이NG토큰'),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
