import {test} from 'node:test';
import assert from 'node:assert/strict';
import {archerCastleArticle} from '../src/game-batch-20261015.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const candidates=['TESTRAID01','SIRYUN1004','REVIEW100','REVIEW300','SIRYUN100','THANKS5000C','THANKS5000B','THANKS5000A','CAFELOVE4T','3SECONDS','SUPER10','NEWGAME','2000CAFEJOIN','CAFE1000JOIN','LAUNCHING0820','OPEN0820','GAMEEDU','WELCOME','VIP222','VIP333','VIP555','VIP666','VIP777','VIP999','GO2024','FBGIFT','DCGIFT'];
const history=['CLEANUSER3','AFFLE2','CAFEJOIN3T','0830UPDATEDAY','0830LATEUPDATE','0830NIGHTUPDATE','DUNGEON100PLUS','SEPTCOUPON','0826SORRY','0826APOLOGIZE','0826BUGFIX'];

test('아처캐슬 키우기는 공식 게임명·Google Play 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(archerCastleArticle.articleKey,'archer-castle-idle-codes-202610');
  assert.equal(archerCastleArticle.post.title,'아처캐슬 키우기');
  assert.equal(archerCastleArticle.approvedForPublish,true);
  assert.equal(archerCastleArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(archerCastleArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(archerCastleArticle),true);
  assert.equal(validateGameFeaturedImage(archerCastleArticle.articleKey,archerCastleArticle.post),true);
  assert.equal((archerCastleArticle.post.content.match(/data-ncp-copy=/g)||[]).length,38);
  assert.equal((archerCastleArticle.post.content.match(/data-ncp-share=/g)||[]).length,38);
  assert.match(archerCastleArticle.post.content,/<!--more-->/);
});

test('아처캐슬 키우기는 공식 직접확인 0개·현재 후보 27개·종료 기록 11개를 분리한다',()=>{
  const html=archerCastleArticle.post.content;
  assert.deepEqual(archerCastleArticle.source.officialCurrentCodes,[]);
  assert.deepEqual(archerCastleArticle.source.unverifiedCandidates.map(x=>x.code),candidates);
  assert.equal(archerCastleArticle.source.unverifiedCandidates.length,27);
  assert.deepEqual(archerCastleArticle.source.historicalRecords.map(x=>x.code),history);
  assert.equal(archerCastleArticle.source.historicalRecords.length,11);
  assert.match(html,/현재 입력 후보<\/span><strong>27개/);
  assert.match(html,/공식 직접확인<\/span><strong>0개/);
  assert.match(html,/종료 기록<\/span><strong>11개/);
  for(const code of [...candidates,...history])assert.match(html,new RegExp(code));
});

test('아처캐슬 키우기는 당일 후보·명시 만료·범용 문자열의 근거를 섞지 않는다',()=>{
  const rows=archerCastleArticle.source.gamePeriodModel.records;
  const raid=rows.find(x=>x.code==='TESTRAID01');
  const siryun=rows.find(x=>x.code==='SIRYUN1004');
  const conflict=rows.find(x=>x.code==='CAFEJOIN3T');
  const generic=rows.find(x=>x.code==='GAMEEDU');
  assert.equal(raid.status,'UNVERIFIED');
  assert.equal(raid.latest,true);
  assert.equal(raid.expiry,'2026-10-15 23:59 KST');
  assert.equal(siryun.expiry,'2026-10-15 23:59 KST');
  assert.equal(conflict.status,'EXPIRED');
  assert.equal(conflict.latest,false);
  assert.equal(conflict.expiry,'2026-09-22');
  assert.equal(generic.status,'UNVERIFIED');
  assert.equal(generic.sourcePublishedAt,null);
  assert.equal(generic.sources[0].sourcePublishedAt,null);
  assert.match(archerCastleArticle.post.content,/명시적 과거 만료일을 우선/);
  assert.match(archerCastleArticle.post.content,/공식 직접확인 현재 코드는 0개/);
});
