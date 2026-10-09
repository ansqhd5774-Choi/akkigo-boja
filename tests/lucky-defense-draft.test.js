import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import supplementalArticles from '../data/articles-supplemental.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('운빨존많겜 쿠폰 후보와 종료 이력이 저장된다',()=>{
  const ids=[
    'lucky-defense-lucky2ndanniv-202610',
    'lucky-defense-thanks2years-202610',
    'lucky-defense-luckydiscord30k-202610',
    'lucky-defense-luckydiscord-202610'
  ];
  for(const id of ids){
    const item=coupons.find(x=>x.id===id);
    assert.ok(item,id);
    assert.equal(item.brand,'운빨존많겜');
    assert.equal(validateCoupon(item,Date.parse('2026-10-06T17:09:30Z')),item);
  }
  assert.equal(coupons.find(x=>x.id==='lucky-defense-lucky2ndanniv-202610').status,'EXPIRED');
  assert.equal(coupons.find(x=>x.id==='lucky-defense-thanks2years-202610').status,'EXPIRED');
  assert.equal(coupons.find(x=>x.id==='lucky-defense-luckydiscord30k-202610').status,'EXPIRED');
  assert.equal(coupons.find(x=>x.id==='lucky-defense-luckydiscord-202610').status,'UNVERIFIED');
});

test('운빨존많겜 supplemental article과 공개 HTML이 일치한다',()=>{
  const article=supplementalArticles.find(x=>x.articleKey==='lucky-defense-codes-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['게임','운빨존많겜']);
  const html=readFileSync(new URL('../drafts/lucky-defense-codes-202610.html',import.meta.url),'utf8').trim();
  assert.equal(article.post.content,html);
  for(const code of ['LUCKYDISCORD','LUCKY2NDANNIV','THANKS2YEARS','LUCKYDISCORD30K']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/다이아 1,000개/);
  assert.match(html,/다이아 2,222개/);
  assert.match(html,/다이아 2,000개/);
  assert.match(html,/다이아 3,000개/);
  assert.match(html,/메뉴/);
  assert.match(html,/쿠폰 입력/);
  assert.equal(article.source.gamePeriodModel.records.length,31);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,31);
  assert.equal((html.match(/data-ncp-share=/g)||[]).length,31);
  assert.equal((html.match(/data-ncp-featured-image="lucky-defense"/g)||[]).length,1);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['LUCKYDISCORD','LUCKY2NDANNIV','THANKS2YEARS','LUCKYDISCORD30K']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
