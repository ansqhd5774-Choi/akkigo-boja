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

test('운빨존많겜 2026-10-14 재조사는 글로벌 현재 후보와 한국 공식 상태를 분리한다',()=>{
  const article=supplementalArticles.find(x=>x.articleKey==='lucky-defense-codes-202610');
  assert.ok(article);
  assert.equal(article.source.checkedAt,'2026-10-14');
  const model=article.source.gamePeriodModel;
  assert.equal(model.records.length,31);
  assert.equal(new Set(model.records.map(x=>x.code)).size,31);
  const latest=model.records.filter(x=>x.latest===true).map(x=>x.code).sort();
  assert.deepEqual(latest,['LUCKY10KFANS','LUCKYCOMMU50K','LUCKYDISCORD','LUCKYJOIN30K'].sort());
  for(const code of latest){
    const row=model.records.find(x=>x.code===code);
    assert.ok(row.latestEvidence);
    assert.ok(row.sources.some(s=>s.url==='https://www.pocketgamer.com/lucky-defense-omfg/codes/' && s.sourcePublishedAt==='2026-10-11'));
  }
  for(const code of ['THANKS2YEARS','LUCKY2NDANNIV','LUCKYDISCORD30K']) assert.equal(model.records.find(x=>x.code===code).latest===true,false);
  const html=article.post.content;
  assert.match(html,/10월 글로벌 후보<\/span><strong>4개/);
  assert.match(html,/한국 공식 현재 확인<\/span><strong>0개/);
  assert.match(html,/Pocket Gamer 2026-10-11 글로벌 현재 코드 목록/);
  assert.match(html,/111% 공식 쿠폰 입력 방법/);
  assert.match(html,/한국 Google Play 운빨존많겜 공식 앱/);
});

test('운빨존많겜 전세계 재조사 원장은 날짜·지역·검증 상태를 보존한다',()=>{
  const r=JSON.parse(readFileSync(new URL('../data/lucky-defense-refresh-20261014.json',import.meta.url),'utf8'));
  assert.equal(r.checkedAt,'2026-10-14');
  assert.equal(r.preservedRecordCount,31);
  assert.equal(r.newCouponRowsAdded,0);
  assert.equal(r.officialCurrentPublicCodeCount,0);
  assert.equal(r.currentGlobalThirdPartyCandidates.length,4);
  assert.deepEqual(r.currentGlobalThirdPartyCandidates.map(x=>x.code).sort(),['LUCKYDISCORD','LUCKYCOMMU50K','LUCKYJOIN30K','LUCKY10KFANS'].sort());
  for(const x of r.currentGlobalThirdPartyCandidates){
    assert.equal(x.status,'UNVERIFIED');
    assert.equal(x.region,'GLOBAL_OMFG_LUCKY_ME');
    assert.equal(x.koreanAccountVerified,false);
    assert.equal(x.officialIssueVerified,false);
    assert.equal(x.sourcePublishedAt,'2026-10-11');
  }
  assert.equal(r.searchMetrics,null);
});
