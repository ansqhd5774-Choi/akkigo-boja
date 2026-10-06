import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import supplementalArticles from '../data/articles-supplemental.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

const expectedCodes=[
  '2026HAPPYNEWYEAR','2026EATBETTER','2026LETSDANCE','2026WORKHARDER','2026KEEPTACTICAL',
  'NIKKECHRISTMASPARTY','3YEARSWITHNIKKE','3YEARSWITHCOMMANDER','PUNYQUEEN','thxfor990000',
  'NIKKESTELLARBLADE','30MONTHSTOGETHER','NIKKECONCERT2025','NIKKE1104'
];

test('니케 10월 입력 시도 코드 14개가 내부 데이터에 저장된다',()=>{
  const items=coupons.filter(x=>x.brand==='승리의 여신: 니케');
  assert.equal(items.length,14);
  assert.deepEqual(items.map(x=>x.code).sort(),[...expectedCodes].sort());
  assert.equal(new Set(items.map(x=>x.id)).size,14);
  for(const item of items){
    assert.equal(item.status,'UNVERIFIED');
    assert.equal(validateCoupon(item,Date.parse('2026-10-06T17:09:30Z')),item);
  }
});

test('니케 공개 글은 14개 코드·보상·입력 방법과 최근 만료를 제공한다',()=>{
  const article=supplementalArticles.find(x=>x.articleKey==='nikke-codes-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['게임','승리의 여신: 니케']);
  const html=readFileSync(new URL('../drafts/nikke-codes-202610.html',import.meta.url),'utf8').trim();
  assert.equal(article.post.content,html);
  for(const code of expectedCodes){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,14);
  assert.equal((html.match(/data-ncp-featured-image="nikke"/g)||[]).length,1);
  assert.match(html,/UNBREAKABLEMEMORIES/);
  assert.match(html,/2026년 8월 1일 종료/);
  assert.match(html,/WAVETOYOU2026/);
  assert.match(html,/2026년 7월 22일 종료/);
  assert.match(html,/CD-Key Redemption Portal/);
  assert.match(html,/discord\.gg\/nikke-en/);
  assert.match(html,/2026년 10월 24일 19:00/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of expectedCodes) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
