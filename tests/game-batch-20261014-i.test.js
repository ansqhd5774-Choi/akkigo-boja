import {test} from 'node:test';
import assert from 'node:assert/strict';
import {princeGoArticle} from '../src/game-batch-20261014-i.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';

const candidates=['WELCOME','VIP222','VIP333','VIP555','VIP666','VIP888','GO2024','DCGIFT','VIP777','DOTAPURI03','DOTAPURI01','DOTAOJI100D'];
const history=['DOTAURAN','DOTAATOMU','DOTAX1WGET','SDxH6v','DOTADYR9','DOTAOJIPUMPKIN'];

test('프린스 GO는 공식 게임명·App Store 아이콘·공통 기간 렌더러를 지킨다',()=>{
  assert.equal(princeGoArticle.articleKey,'prince-go-codes-202610');
  assert.equal(princeGoArticle.post.title,'프린스 GO');
  assert.equal(princeGoArticle.approvedForPublish,true);
  assert.equal(princeGoArticle.source.templateVersion,'game-period-tabs-r1');
  assert.equal(princeGoArticle.source.presentationVersion,'compact-r2');
  assert.equal(validateGamePeriodArticle(princeGoArticle),true);
  assert.equal(validateGameFeaturedImage(princeGoArticle.articleKey,princeGoArticle.post),true);
  assert.equal((princeGoArticle.post.content.match(/data-ncp-copy=/g)||[]).length,18);
  assert.equal((princeGoArticle.post.content.match(/data-ncp-share=/g)||[]).length,18);
  assert.match(princeGoArticle.post.content,/<!--more-->/);
});

test('프린스 GO는 공식 현재 0개와 제3자 후보 12개를 분리한다',()=>{
  const html=princeGoArticle.post.content;
  assert.deepEqual(princeGoArticle.source.officialCurrentCodes,[]);
  assert.equal(princeGoArticle.source.unverifiedCandidates.length,12);
  assert.deepEqual(princeGoArticle.source.unverifiedCandidates.map(x=>x.code),candidates);
  assert.equal(princeGoArticle.source.historicalRecords.length,6);
  assert.deepEqual(princeGoArticle.source.historicalRecords.map(x=>x.code),history);
  assert.match(html,/입력 후보<\/span><strong>12개/);
  assert.match(html,/공식 현재 확인<\/span><strong>0개/);
  assert.match(html,/과거 기록<\/span><strong>6개/);
  for(const code of [...candidates,...history])assert.match(html,new RegExp(code));
});

test('프린스 GO는 동일 앱 일본판 공식 과거 코드와 한국판 현재 후보를 혼합하지 않는다',()=>{
  const rows=princeGoArticle.source.gamePeriodModel.records;
  const atom=rows.find(x=>x.code==='DOTAATOMU');
  const uran=rows.find(x=>x.code==='DOTAURAN');
  const conflict=rows.find(x=>x.code==='DOTAOJI100D');
  assert.equal(atom.latest,false);
  assert.equal(atom.status,'EXPIRED');
  assert.equal(atom.expiry,'2025-04-30');
  assert.equal(atom.sources[0].referenceType,'OFFICIAL_POST');
  assert.equal(uran.latest,false);
  assert.equal(uran.expiry,'2025-05-31');
  assert.equal(uran.sources[0].referenceType,'OFFICIAL_POST');
  assert.equal(conflict.status,'UNVERIFIED');
  assert.equal(conflict.expiry,'4월 4일·연도 미확인');
  assert.match(princeGoArticle.post.content,/일본판 과거 발급 이력을 한국판 현재 공식 쿠폰으로 일반화하지 않습니다/);
  assert.match(princeGoArticle.post.content,/한국판 공식 현재 코드는 0개/);
});