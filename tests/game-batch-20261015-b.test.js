import {test} from 'node:test';
import assert from 'node:assert/strict';
import {eclipseAwakeningArticle} from '../src/game-batch-20261015-b.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const candidates=['ECLIPSE777','ECLIPSE2024','WELCOME','VIP777','GIFT888','leedo1009','G4MOCBVONE3OPLUA'];
const history=['0914ECLIPSE1ST','0914ECLIPSE2ND','HAPPYCHUSEOK','BOREUMDALDAL','1014UPDATEREADY','1013LIVETICKET5','1013LIVEWELCOME'];

test('이클립스 더 어웨이크닝은 공식 게임명·Google Play 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(eclipseAwakeningArticle.articleKey,'eclipse-the-awakening-codes-202610');
  assert.equal(eclipseAwakeningArticle.post.title,'이클립스: 더 어웨이크닝');
  assert.equal(eclipseAwakeningArticle.approvedForPublish,true);
  assert.equal(eclipseAwakeningArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(eclipseAwakeningArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(eclipseAwakeningArticle),true);
  assert.equal(validateGameFeaturedImage(eclipseAwakeningArticle.articleKey,eclipseAwakeningArticle.post),true);
  assert.match(eclipseAwakeningArticle.post.content,/<!--more-->/);
});

test('이클립스 더 어웨이크닝은 공식 현재 1개·미검증 후보 7개·종료 기록 7개를 분리한다',()=>{
  assert.deepEqual(eclipseAwakeningArticle.source.officialCurrentCodes.map(x=>x.code),['0910ECLIPSE']);
  assert.deepEqual(eclipseAwakeningArticle.source.unverifiedCandidates.map(x=>x.code),candidates);
  assert.deepEqual(eclipseAwakeningArticle.source.historicalRecords.map(x=>x.code),history);
  assert.equal(eclipseAwakeningArticle.source.officialCurrentCodes[0].expiry,'2026-11-10 23:59 KST');
  assert.equal(eclipseAwakeningArticle.source.officialCurrentCodes[0].sourcePublishedAt,'2026-09-05');
});

test('카카오톡 발급형 쿠폰은 공용 코드와 분리하고 발급 마감·사용 마감을 구분한다',()=>{
  assert.equal(eclipseAwakeningArticle.source.benefits.length,2);
  assert.equal(eclipseAwakeningArticle.source.benefits.every(x=>x.issueDeadline==='2026-10-10 23:00 KST'),true);
  assert.equal(eclipseAwakeningArticle.source.benefits.every(x=>x.useDeadline==='2026-11-10 23:59 KST'),true);
  const hidden=eclipseAwakeningArticle.source.gamePeriodModel.records.find(x=>x.code==='leedo1009');
  assert.equal(hidden.status,'UNVERIFIED');
  assert.match(hidden.statusLabel,/공식 문자열 미공개/);
});

test('10/21 사용자 제공 코드와 10/20 만료 기록을 출처 수준별로 분리한다',()=>{
  assert.equal(eclipseAwakeningArticle.source.checkedAt,'2026-10-21');
  const rows=eclipseAwakeningArticle.source.gamePeriodModel.records;
  const screenshot=rows.find(r=>r.code==='G4MOCBVONE3OPLUA');
  assert.equal(screenshot.status,'UNVERIFIED');
  assert.equal(screenshot.sourcePublishedAt,null);
  assert.equal(screenshot.sources[0].url,null);
  assert.match(screenshot.statusLabel,/공용 여부 미확인/);
  for(const code of ['1014UPDATEREADY','1013LIVETICKET5','1013LIVEWELCOME']){
    const row=rows.find(r=>r.code===code);
    assert.equal(row.status,'EXPIRED');
    assert.equal(row.latest,false);
    assert.equal(row.expiry,'2026-10-20 23:59 KST');
    assert.equal(row.sources.every(s=>s.referenceType==='THIRD_PARTY_CODE_MENTION'),true);
  }
  assert.equal(eclipseAwakeningArticle.source.searchMeasurement.status,'NOT_MEASURED');
});
