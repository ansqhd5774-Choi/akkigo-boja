import {test} from 'node:test';
import assert from 'node:assert/strict';
import {swordFrontierArticle} from '../src/game-batch-20261015-c.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const candidates=['SwordFrontier','OPENDAY','SwordFronti5r','COUNTDOWN01','COUNTDOWN02','COUNTDOWN03','Sword4rontier','3wordFrontier','Swo2dFrontier','SwordFront1er','GWANGBOK26','VIP777','VIP888','VIP999'];

test('소드 앤 프론티아는 공식 게임명·Google Play 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(swordFrontierArticle.articleKey,'sword-frontier-codes-202610');
  assert.equal(swordFrontierArticle.post.title,'소드 앤 프론티아');
  assert.equal(swordFrontierArticle.approvedForPublish,true);
  assert.equal(swordFrontierArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(swordFrontierArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(swordFrontierArticle),true);
  assert.equal(validateGameFeaturedImage(swordFrontierArticle.articleKey,swordFrontierArticle.post),true);
  assert.match(swordFrontierArticle.post.content,/<!--more-->/);
});

test('소드 앤 프론티아는 공식 현재 코드가 확인되지 않은 상태에서 14개 입력 후보를 UNVERIFIED로 분리한다',()=>{
  assert.deepEqual(swordFrontierArticle.source.officialCurrentCodes,[]);
  assert.deepEqual(swordFrontierArticle.source.unverifiedCandidates.map(x=>x.code),candidates);
  assert.equal(swordFrontierArticle.source.historicalRecords.length,9);
  assert.equal(swordFrontierArticle.source.gamePeriodModel.records.length,23);
  assert.equal(swordFrontierArticle.source.checkedAt,'2026-10-20');
  assert.match(swordFrontierArticle.source.searchDescription,/2026년 10월 20일/);
  assert.equal(swordFrontierArticle.source.gamePeriodModel.records.every(x=>x.status==='UNVERIFIED'),true);
  assert.equal(swordFrontierArticle.source.gamePeriodModel.records.every(x=>x.expiry==='미확인'),true);
});

test('과거 행사형 문자열도 종료일 근거 없이는 임의 EXPIRED 처리하지 않는다',()=>{
  for(const code of ['COUNTDOWN01','COUNTDOWN02','COUNTDOWN03','GWANGBOK26']){
    const record=swordFrontierArticle.source.gamePeriodModel.records.find(x=>x.code===code);
    assert.equal(record.status,'UNVERIFIED');
    assert.match(record.statusLabel,/공식 현재 확인 필요/);
  }
});

test('GAMEDAY의 만료 주장 9건은 원문 최초 게시일·공식 종료일 미확인 상태로 격리한다',()=>{
  const old=['ichidonudo','MIDAUT26','SMSF2026','ONESF2026','PREGIFT26','PRE2026','SVIP666','SVIP777','SVIP888'];
  assert.deepEqual(swordFrontierArticle.source.historicalRecords.map(r=>r.code),old);
  for(const code of old){
    const rec=swordFrontierArticle.source.gamePeriodModel.records.find(r=>r.code===code);
    assert.equal(rec.latest,false);
    assert.equal(rec.status,'UNVERIFIED');
    assert.equal(rec.sourcePublishedAt,null);
    assert.equal(rec.expiry,'미확인');
    assert.match(rec.statusLabel,/실제 종료일 미확인/);
  }
  for(const code of ['COUNTDOWN01','COUNTDOWN02','COUNTDOWN03','GWANGBOK26']){
    const rec=swordFrontierArticle.source.gamePeriodModel.records.find(r=>r.code===code);
    assert.equal(rec.latest,true);
    assert.equal(rec.status,'UNVERIFIED');
    assert.match(rec.statusLabel,/만료 주장 상충/);
  }
});

test('10월 19일 라운지 미니 이벤트를 쿠폰 발급으로 오인하지 않는다',()=>{
  assert.match(swordFrontierArticle.post.content,/아이템 이름 맞히기/);
  assert.match(swordFrontierArticle.post.content,/이 이벤트를 공용 쿠폰 발급으로 오인하지 않고/);
  assert.equal(swordFrontierArticle.source.officialCurrentCodes.length,0);
});
