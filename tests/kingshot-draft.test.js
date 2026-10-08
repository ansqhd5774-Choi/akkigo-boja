import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import supplementalArticles from '../data/articles-supplemental.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('킹샷 10월 코드 데이터가 저장된다',()=>{
  const ids=[
    'kingshot-kingshot888-202610',
    'kingshot-ks1005-202610',
    'kingshot-welldone-202610',
    'kingshot-vip777-202610'
  ];
  for (const id of ids) {
    const item=coupons.find(x=>x.id===id);
    assert.ok(item,id);
    assert.equal(item.brand,'킹샷');
    assert.equal(item.status,'UNVERIFIED');
    assert.equal(validateCoupon(item,Date.parse('2026-10-06T16:41:00Z')),item);
  }
  assert.equal(coupons.find(x=>x.id==='kingshot-ks1005-202610').expiresAt,'2026-10-07T23:59:00.000Z');
  assert.equal(coupons.find(x=>x.id==='kingshot-welldone-202610').expiresAt,'2026-10-10T23:59:00.000Z');
});

test('킹샷 supplemental article과 공개 HTML이 일치한다',()=>{
  const article=supplementalArticles.find(x=>x.articleKey==='kingshot-codes-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['게임','킹샷']);
  const html=readFileSync(new URL('../drafts/kingshot-codes-202610.html',import.meta.url),'utf8').trim();
  assert.equal(article.post.content,html);
  for (const code of ['KS1005','WELLDONE','Kingshot888','VIP777']) {
    assert.match(html,new RegExp(code));
  }
  assert.match(html,/2026년 10월 8일 만료/);
  assert.match(html,/2026년 10월 11일 오전 8시 59분/);
  assert.match(html,/ks-giftcode\.centurygame\.com/);
  const codes=[...html.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(codes.length,163);
  assert.equal(new Set(codes).size,163);
  assert.equal((html.match(/class="ncp-card-list ncp-compact-list" role="table"/g)||[]).length,3);
  assert.equal(article.post.title,'킹샷');
  assert.equal((html.match(/data-ncp-featured-image="kingshot"/g)||[]).length,1);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for (const code of ['KS1005','WELLDONE','Kingshot888','VIP777']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
