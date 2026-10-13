import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sabukIceKingdomArticle} from '../src/game-batch-20261014-c.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const currentCodes=[
  'GRANDOPEN','500BOX','VIP666','VIP777','VIP888','VIP999','ICE666','ICE777','ICE888','ICE999','ICE000',
  'SVIP555','SVIP666','SVIP888','SVIP999','MOON111','WEEKXB1','WEEKMA2','WEEKMW3','WEEK4LD',
  'SABUK100','ICEKINGDOM','WELCOME','SABUK777','GAMEEDU','VIP111','VIP222','FBGIFT','DCGIFT'
];

test('사북: 아이스 킹덤은 공식 게임명·앱 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(sabukIceKingdomArticle.articleKey,'sabuk-ice-kingdom-codes-202610');
  assert.equal(sabukIceKingdomArticle.post.title,'사북: 아이스 킹덤');
  assert.equal(sabukIceKingdomArticle.approvedForPublish,true);
  assert.equal(sabukIceKingdomArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(sabukIceKingdomArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(sabukIceKingdomArticle),true);
  assert.equal(validateGameFeaturedImage(sabukIceKingdomArticle.articleKey,sabukIceKingdomArticle.post),true);
  assert.equal((sabukIceKingdomArticle.post.content.match(/data-ncp-copy=/g)||[]).length,29);
  assert.equal((sabukIceKingdomArticle.post.content.match(/data-ncp-share=/g)||[]).length,29);
  assert.match(sabukIceKingdomArticle.post.content,/<!--more-->/);
});

test('사북: 아이스 킹덤은 공식 확정 0개와 입력 후보 29개를 구분한다',()=>{
  const html=sabukIceKingdomArticle.post.content;
  assert.deepEqual(sabukIceKingdomArticle.source.officialCurrentCodes,[]);
  assert.equal(sabukIceKingdomArticle.source.unverifiedCandidates.length,29);
  assert.deepEqual(sabukIceKingdomArticle.source.unverifiedCandidates.map(x=>x.code),currentCodes);
  assert.deepEqual(sabukIceKingdomArticle.source.historicalRecords,[]);
  assert.match(html,/최근 입력 후보<\/span><strong>29개/);
  assert.match(html,/공식 발급 확인<\/span><strong>0개/);
  assert.match(html,/전체 보존 기록<\/span><strong>29개/);
  assert.match(html,/최신 <small>29<\/small>/);
  for(const code of currentCodes)assert.match(html,new RegExp(code));
});

test('사북: 아이스 킹덤은 주말 코드 상충과 입력 경로를 과장 없이 보존한다',()=>{
  const html=sabukIceKingdomArticle.post.content;
  const byCode=new Map(sabukIceKingdomArticle.source.gamePeriodModel.records.map(x=>[x.code,x]));
  for(const code of ['WEEKXB1','WEEKMA2','WEEKMW3','WEEK4LD']){
    assert.equal(byCode.get(code).status,'UNVERIFIED');
    assert.equal(byCode.get(code).expiry,'미확인');
    assert.match(byCode.get(code).statusLabel,/타 게임 동일 문자열/);
  }
  assert.equal(byCode.get('GRANDOPEN').status,'UNVERIFIED');
  assert.match(html,/설정 → 설정 → 패키지 코드 교환/);
  assert.match(html,/10월 주말 코드 2/);
  assert.match(html,/실제 계정 입력 성공이 확인되지 않아 UNVERIFIED/);
});
