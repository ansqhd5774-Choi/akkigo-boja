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
  assert.equal(swordFrontierArticle.source.historicalRecords.length,0);
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
