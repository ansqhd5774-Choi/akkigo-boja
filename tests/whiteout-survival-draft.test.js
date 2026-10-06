import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import supplementalArticles from '../data/articles-supplemental.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('화이트아웃 서바이벌 10월 코드 4개가 저장된다',()=>{
  const ids=[
    'whiteout-thxteacher-202610',
    'whiteout-gaecheonjeol-202610',
    'whiteout-gudokytkor-202610',
    'whiteout-2ndyoutubekr-202610'
  ];
  for (const id of ids) {
    const item=coupons.find(x=>x.id===id);
    assert.ok(item,id);
    assert.equal(item.brand,'화이트아웃 서바이벌');
    assert.equal(item.status,'UNVERIFIED');
    assert.equal(validateCoupon(item,Date.parse('2026-10-06T16:00:00Z')),item);
  }
  const thx=coupons.find(x=>x.id==='whiteout-thxteacher-202610');
  assert.equal(thx.code,'THXTeacher');
  assert.equal(thx.expiresAt,'2026-10-08T23:59:00.000Z');
  const gae=coupons.find(x=>x.id==='whiteout-gaecheonjeol-202610');
  assert.equal(gae.conditions,'용광로 Lv.7 이상');
});

test('화이트아웃 서바이벌 supplemental article과 공개 HTML이 일치한다',()=>{
  const article=supplementalArticles.find(x=>x.articleKey==='whiteout-survival-codes-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['게임','화이트아웃 서바이벌']);
  const html=readFileSync(new URL('../drafts/whiteout-survival-codes-202610.html',import.meta.url),'utf8').trim();
  assert.equal(article.post.content,html);
  for (const code of ['THXTeacher','GAECHEONJEOL','GuDokYTKOR','2ndYoutubeKR']) {
    assert.match(html,new RegExp(code));
  }
  assert.match(html,/2026년 10월 9일 08:59/);
  assert.match(html,/용광로 Lv\.7 이상/);
  assert.match(html,/wos-giftcode\.centurygame\.com/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,4);
  assert.equal((html.match(/data-ncp-featured-image="whiteout-survival"/g)||[]).length,1);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('THXTeacher'),true);
  assert.equal(preview.includes('GAECHEONJEOL'),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});

test('Worker가 supplemental article registry를 publish 후보에 포함한다',()=>{
  const worker=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');
  assert.match(worker,/articles-supplemental\.json/);
  assert.match(worker,/\.\.\.articles,\.\.\.supplementalArticles/);
});
