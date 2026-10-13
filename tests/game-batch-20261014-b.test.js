import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bladeWarThreeKingdomsArticle} from '../src/game-batch-20261014-b.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const currentCodes=[
  'C6Q2B4','L9X0S5','NEWWEBSTORE','Q3Y0T7','K7M4Q9','S1H0X6','B6W8Q1','BLADEWAR2026',
  'BLADEWAR','SAMGUK777','WELCOME','VIP666','VIP888','RY3K888','RY3K666','SG2024',
  '43sio4ibsHdA','LVcOBSNVvQZZ','inwxnAUEpIcD','Wgezcg8E6EPN','JpNX0V2Anzax','mycrUCVG0lJP','1ShmDWQstx23','ny5xaFiosIdB'
];
const historicalCodes=['B2X8LP','STORENEWEVENT','K7M9Q2'];

test('블레이드 워: 삼국은 공식 게임명·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(bladeWarThreeKingdomsArticle.articleKey,'blade-war-three-kingdoms-codes-202610');
  assert.equal(bladeWarThreeKingdomsArticle.post.title,'블레이드 워: 삼국');
  assert.equal(bladeWarThreeKingdomsArticle.approvedForPublish,true);
  assert.equal(bladeWarThreeKingdomsArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(bladeWarThreeKingdomsArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(bladeWarThreeKingdomsArticle),true);
  assert.equal(validateGameFeaturedImage(bladeWarThreeKingdomsArticle.articleKey,bladeWarThreeKingdomsArticle.post),true);
  assert.equal((bladeWarThreeKingdomsArticle.post.content.match(/data-ncp-copy=/g)||[]).length,27);
  assert.equal((bladeWarThreeKingdomsArticle.post.content.match(/data-ncp-share=/g)||[]).length,27);
  assert.match(bladeWarThreeKingdomsArticle.post.content,/<!--more-->/);
});

test('블레이드 워: 삼국은 현재 후보 24개와 과거 종료 3개를 구분한다',()=>{
  const html=bladeWarThreeKingdomsArticle.post.content;
  assert.deepEqual(bladeWarThreeKingdomsArticle.source.officialCurrentCodes,[]);
  assert.equal(bladeWarThreeKingdomsArticle.source.unverifiedCandidates.length,24);
  assert.deepEqual(bladeWarThreeKingdomsArticle.source.unverifiedCandidates.map(x=>x.code),currentCodes);
  assert.equal(bladeWarThreeKingdomsArticle.source.historicalRecords.length,3);
  assert.deepEqual(bladeWarThreeKingdomsArticle.source.historicalRecords.map(x=>x.code),historicalCodes);
  assert.match(html,/현재 입력 후보<\/span><strong>24개/);
  assert.match(html,/공식 발급 확인<\/span><strong>0개/);
  assert.match(html,/과거 종료 기록<\/span><strong>3개/);
  assert.match(html,/최신 <small>24<\/small>/);
  assert.match(html,/2026 <small>3<\/small>/);
  for(const code of [...currentCodes,...historicalCodes])assert.match(html,new RegExp(code));
});

test('블레이드 워: 삼국은 공식 교환소와 만료·지역·제3자 근거를 혼동하지 않는다',()=>{
  const html=bladeWarThreeKingdomsArticle.post.content;
  const byCode=new Map(bladeWarThreeKingdomsArticle.source.gamePeriodModel.records.map(x=>[x.code,x]));
  assert.equal(byCode.get('BLADEWAR2026').expiry,'2026-12-31');
  assert.equal(byCode.get('NEWWEBSTORE').expiry,'2026-12-31');
  assert.equal(byCode.get('B2X8LP').expiry,'2026-09-15');
  assert.equal(byCode.get('STORENEWEVENT').expiry,'2026-09-30');
  assert.equal(byCode.get('B2X8LP').latest,false);
  assert.equal(byCode.get('STORENEWEVENT').latest,false);
  assert.equal(byCode.get('43sio4ibsHdA').expiry,'2026-10-20');
  assert.match(html,/https:\/\/bladewar\.evistagame\.com\/giftcode/);
  assert.match(html,/캐릭터 ID/);
  assert.match(html,/최대 10분/);
  assert.match(html,/게임사와 무관/);
  assert.match(html,/공식 발급 원문과 이 대화에서의 실제 계정 입력 성공은 확인되지 않았으므로 ACTIVE로 단정하지 않습니다/);
});
