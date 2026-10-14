import test from 'node:test';
import assert from 'node:assert/strict';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const KEY='immortal-rising-awakening-202610';
const OFFICIAL_TRACED=['IMNAVER','IMMORTAL24','LUCKY666','VIP777','VIP888','moon','GUIDE0924'];
const CURRENT_THIRD=['GAMEEDU','VIP555','VIP666','VIP999','GO2024','FBGIFT','LINEGAMES','WELCOME','VIP222','VIP2024'];

test('이모탈 라이징: 불멸의 각성은 기존 URL용 articleKey와 2026-10-14 최신 근거를 보존한다',()=>{
  const a=currentArticleCatalog.find(x=>x.articleKey===KEY);
  assert.ok(a);
  assert.equal(a.approvedForPublish,true);
  assert.equal(a.post.title,'이모탈 라이징: 불멸의 각성');
  assert.equal(a.source.checkedAt,'2026-10-14');
  assert.equal(a.source.searchMeasurement.status,'NOT_MEASURED');
  assert.equal(validateArticleDraft(a),true);
  assert.equal(validateGameFeaturedImage(a.articleKey,a.post),true);
  assert.match(a.post.content,/data-ncp-app-icon="true"/);
  assert.match(a.post.content,/현재 입력 후보<\/span><strong>17개/);
  assert.match(a.post.content,/공식 채널 게시 추적<\/span><strong>7개/);
  assert.match(a.post.content,/전체 보존 기록<\/span><strong>18개/);
});

test('이모탈 라이징 공식 채널 게시 추적 7개와 제3자 현재 후보 10개를 섞지 않는다',()=>{
  const a=currentArticleCatalog.find(x=>x.articleKey===KEY);
  const rows=a.source.gamePeriodModel.records;
  assert.equal(rows.length,18);
  assert.equal(rows.filter(x=>x.latest===true).length,17);
  assert.deepEqual(a.source.officialDistributionCandidates,OFFICIAL_TRACED);
  for(const code of OFFICIAL_TRACED){
    const row=rows.find(x=>x.code===code);
    assert.ok(row,code);
    assert.equal(row.status,'UNVERIFIED');
    assert.equal(row.statusLabel,'공식 채널 게시 추적 · 현재 입력 성공 미확인');
    assert.equal(row.sourcePublishedAt,'2026-09-24');
  }
  for(const code of CURRENT_THIRD){
    const row=rows.find(x=>x.code===code);
    assert.ok(row,code);
    assert.equal(row.latest,true);
    assert.equal(row.status,'UNVERIFIED');
    assert.match(row.statusLabel,/제3자 현재 후보/);
  }
  const old=rows.find(x=>x.code==='VIP111');
  assert.ok(old);
  assert.equal(old.latest,false);
  assert.equal(old.status,'UNVERIFIED');
  assert.match(old.statusLabel,/과거 제3자 후보/);
});
