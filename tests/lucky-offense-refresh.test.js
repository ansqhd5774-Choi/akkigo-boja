import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};

const article=[...articles,...supplemental].find(x=>x.articleKey==='lucky-offense-codes-202610');

test('운빨돌격대 2026-10-13 재조사는 현재 쿠폰 0개와 과거 코드 3개를 보존한다',()=>{
  assert.ok(article);
  assert.equal(article.source.checkedAt,'2026-10-13');
  const html=article.post.content;
  for(const code of ['LUCKY777','UNBBAL111','luckyoffens2e'])assert.match(html,new RegExp(`data-ncp-copy="${code}"`));
  const copies=[...html.matchAll(/data-ncp-copy="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(copies.length,3);
  assert.equal(new Set(copies).size,3);
  assert.match(html,/data-refresh-evidence="lucky-offense-20261013"/);
  assert.match(html,/2026년 제휴 발급 이력/);
  assert.match(html,/현재 신규 발급 가능 여부는 확인되지 않았습니다/);
  assert.doesNotMatch(html,/현재 확인<\/span><strong>[1-9]/);
});

test('운빨돌격대 TikTok Lite 이력은 공개 공용 코드가 아닌 발급형 혜택으로 분리한다',()=>{
  const benefits=article.source.benefits;
  assert.equal(benefits.length,2);
  assert.ok(benefits.every(x=>x.kind==='PARTNER_ISSUED_CODE'));
  assert.ok(benefits.every(x=>x.publicCode===false));
  assert.equal(benefits[0].sourcePublishedAt,'2026-02-25');
  assert.equal(benefits[0].expiry,null);
  assert.equal(benefits[0].status,'UNVERIFIED');
  assert.equal(benefits[1].sourcePublishedAt,'2026-05-30');
  assert.equal(benefits[1].expiry,'2026-06-30');
  assert.equal(benefits[1].status,'EXPIRED');
});
