import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mahjongSoulKrArticle} from '../src/game-batch-20261012-h.js';
import {currentArticleCatalog} from '../src/article-catalog.js';

const article=mahjongSoulKrArticle;

test('작혼 2026-10-13 재조사는 원문 최초 게시일과 현재 후보를 분리한다',()=>{
  assert.equal(article.articleKey,'mahjong-soul-kr-codes-202610');
  assert.equal(article.post.title,'작혼: 리치 마작');
  assert.equal(currentArticleCatalog.find(x=>x.articleKey===article.articleKey),article);
  assert.equal(article.source.checkedAt,'2026-10-13');
  const rows=article.source.gamePeriodModel.records;
  assert.equal(rows.length,6);
  const latest=rows.filter(x=>x.latest).map(x=>x.code).sort();
  assert.deepEqual(latest,['HAPPYANNIV2026','WKJZSH7MA5AM'].sort());
  const happy=rows.find(x=>x.code==='HAPPYANNIV2026');
  const sao=rows.find(x=>x.code==='WKJZSH7MA5AM');
  assert.equal(happy.sourcePublishedAt,'2026-04-19');
  assert.equal(sao.sourcePublishedAt,'2026-04-20');
  assert.match(sao.statusLabel,/한국판 적용 미확인/);
  assert.match(article.post.content,/data-refresh-evidence="mahjong-soul-20261013"/);
});

test('RXDPSAKMA4A3은 10월 목록의 working 표기보다 명시 만료 근거를 우선한다',()=>{
  const row=article.source.gamePeriodModel.records.find(x=>x.code==='RXDPSAKMA4A3');
  assert.ok(row);
  assert.equal(row.latest,false);
  assert.equal(row.sourcePublishedAt,'2026-06-14');
  assert.equal(row.expiry,'2026-06-15 19:00 UTC-7');
  assert.match(row.statusLabel,/명시 만료/);
  assert.match(row.evidenceHTML,/10월.*상충/);
});

test('일본 공식 로그인 보너스는 한국판 쿠폰과 분리된 지역 혜택이다',()=>{
  const benefits=article.source.benefits;
  assert.equal(benefits.length,1);
  assert.equal(benefits[0].kind,'LOGIN_BONUS');
  assert.equal(benefits[0].region,'JP');
  assert.equal(benefits[0].publicCode,false);
  assert.equal(benefits[0].sourcePublishedAt,null);
  assert.equal(benefits[0].startAt,'2026-10-12 12:00 JST');
  assert.equal(benefits[0].expiry,'2026-10-21 05:59 JST');
  assert.match(article.post.content,/일본판 공식 로그인 보너스/);
  assert.match(article.post.content,/한국판 동일 적용은 확인되지 않았습니다/);
});
