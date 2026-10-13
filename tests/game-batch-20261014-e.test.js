import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nightDiffArticle} from '../src/game-batch-20261014-e.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const gameeduCodes=['WELCOME','VIP333','VIP555','VIP666','VIP888','VIP999','VIP2024','FBGIFT','D8PsQ1s59S3O'];
const linegamesCodes=['Dq08BQXBOdaH','RXgHO8owATFB','QEN8ss0GZMkZ','bHXXYnUBYuZn','M55eegsFBCWQ','6cHe5LVREVuB','PVymOswxiJm9','lZQqTObztWgT','XKhQHXRVnjgj','nQ9KOSolUf9h','j0bIKYOGuBZX','wyxw4ki7smIt','c7MUdomwtwhI'];
const currentCodes=[...gameeduCodes,...linegamesCodes];

test('나이트디프는 공식 게임명·Google Play 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(nightDiffArticle.articleKey,'nightdiff-codes-202610');
  assert.equal(nightDiffArticle.post.title,'나이트디프');
  assert.equal(nightDiffArticle.approvedForPublish,true);
  assert.equal(nightDiffArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(nightDiffArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(nightDiffArticle),true);
  assert.equal(validateGameFeaturedImage(nightDiffArticle.articleKey,nightDiffArticle.post),true);
  assert.equal((nightDiffArticle.post.content.match(/data-ncp-copy=/g)||[]).length,22);
  assert.equal((nightDiffArticle.post.content.match(/data-ncp-share=/g)||[]).length,22);
  assert.match(nightDiffArticle.post.content,/<!--more-->/);
});

test('나이트디프는 공식 코드 0개와 제3자 현재 후보 22개를 구분한다',()=>{
  const html=nightDiffArticle.post.content;
  assert.deepEqual(nightDiffArticle.source.officialCurrentCodes,[]);
  assert.equal(nightDiffArticle.source.unverifiedCandidates.length,22);
  assert.deepEqual(nightDiffArticle.source.unverifiedCandidates.map(x=>x.code),currentCodes);
  assert.deepEqual(nightDiffArticle.source.historicalRecords,[]);
  assert.match(html,/최근 입력 후보<\/span><strong>22개/);
  assert.match(html,/공식 발급 확인<\/span><strong>0개/);
  assert.match(html,/전체 보존 기록<\/span><strong>22개/);
  for(const code of currentCodes)assert.match(html,new RegExp(code));
});

test('나이트디프는 제3자 목록의 원문 게시일·최근 갱신과 공식 입력 경로 미확인을 분리한다',()=>{
  const records=nightDiffArticle.source.gamePeriodModel.records;
  const gameedu=records.filter(x=>x.sources[0].name.startsWith('GameEDU'));
  const linegames=records.filter(x=>x.sources[0].name.startsWith('LINEGames'));
  assert.equal(gameedu.length,9);
  assert.equal(linegames.length,13);
  assert.ok(gameedu.every(x=>x.sourcePublishedAt==='2026-03-29'&&x.status==='UNVERIFIED'));
  assert.ok(linegames.every(x=>x.sourcePublishedAt==='2026-04-08'&&x.status==='UNVERIFIED'));
  assert.ok(records.every(x=>x.sources[0].updatedAt==='2026-10-13'));
  assert.match(nightDiffArticle.post.content,/공식 Google Play 페이지와 개발사 사이트에서는 코드 입력 메뉴를 안내하지 않습니다/);
  assert.match(nightDiffArticle.post.content,/NightDiff 운영사와 무관/);
});
