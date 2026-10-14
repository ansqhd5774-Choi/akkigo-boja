import {test} from 'node:test';
import assert from 'node:assert/strict';
import {theRookieArticle} from '../src/game-batch-20261014-j.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const candidates=['ROOKIE777','WELCOME','BASEBALL','UPDATE1','GAMEEDU','VIP111','VIP333','VIP555','VIP888','VIP999','VIP2024','DCGIFT','LINEGAMES','VIP222','VIP666','VIP777','FBGIFT'];

test('더 루키는 공식 게임명·Google Play 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(theRookieArticle.articleKey,'the-rookie-high-school-baseball-codes-202610');
  assert.equal(theRookieArticle.post.title,'더 루키: 고교야구선수 키우기');
  assert.equal(theRookieArticle.approvedForPublish,true);
  assert.equal(theRookieArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(theRookieArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(theRookieArticle),true);
  assert.equal(validateGameFeaturedImage(theRookieArticle.articleKey,theRookieArticle.post),true);
  assert.equal((theRookieArticle.post.content.match(/data-ncp-copy=/g)||[]).length,18);
  assert.equal((theRookieArticle.post.content.match(/data-ncp-share=/g)||[]).length,18);
  assert.match(theRookieArticle.post.content,/<!--more-->/);
});

test('더 루키는 공식 NEWSOPEN 1개와 제3자 후보 17개를 분리한다',()=>{
  const official=theRookieArticle.source.officialCurrentCodes;
  assert.equal(official.length,1);
  assert.equal(official[0].code,'NEWSOPEN');
  assert.equal(official[0].sourcePublishedAt,'2026-10-11');
  assert.equal(official[0].expiry,'2026-10-25 23:59 KST');
  assert.equal(official[0].reward,'다이아 300개');
  assert.deepEqual(theRookieArticle.source.unverifiedCandidates.map(x=>x.code),candidates);
  assert.equal(theRookieArticle.source.unverifiedCandidates.length,17);
  assert.match(theRookieArticle.post.content,/공식 현재<\/span><strong>1개/);
  assert.match(theRookieArticle.post.content,/입력 후보<\/span><strong>17개/);
});

test('더 루키는 공식 입력 조건과 원문 날짜를 보존하고 제3자 문자열을 공식으로 승격하지 않는다',()=>{
  const rows=theRookieArticle.source.gamePeriodModel.records;
  const newsopen=rows.find(x=>x.code==='NEWSOPEN');
  const welcome=rows.find(x=>x.code==='WELCOME');
  const gameedu=rows.find(x=>x.code==='GAMEEDU');
  assert.equal(newsopen.status,'ACTIVE');
  assert.equal(newsopen.sourcePublishedAt,'2026-10-11');
  assert.equal(newsopen.sources[0].referenceType,'OFFICIAL_POST');
  assert.equal(welcome.status,'UNVERIFIED');
  assert.equal(welcome.sources.every(x=>x.referenceType==='THIRD_PARTY_CODE_MENTION'),true);
  assert.equal(gameedu.sourcePublishedAt,null);
  assert.match(theRookieArticle.post.content,/게스트 계정은 쿠폰을 사용할 수 없고 같은 쿠폰은 계정당 1회/);
  assert.match(theRookieArticle.post.content,/입력한 날부터 14일/);
});
