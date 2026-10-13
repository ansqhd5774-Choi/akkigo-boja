import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zombieTowerArticle} from '../src/game-batch-20261012-g.js';
import {currentArticleCatalog} from '../src/article-catalog.js';

test('Zombie Tower 2026-10-13 재조사는 Pi Game 모바일판 현재 코드 0개를 유지한다',()=>{
  assert.equal(zombieTowerArticle.articleKey,'zombie-tower-codes-202610');
  assert.equal(currentArticleCatalog.find(x=>x.articleKey===zombieTowerArticle.articleKey),zombieTowerArticle);
  assert.equal(zombieTowerArticle.source.checkedAt,'2026-10-13');
  assert.equal(zombieTowerArticle.source.gamePeriodModel.records.length,0);
  assert.match(zombieTowerArticle.post.content,/data-refresh-evidence="zombie-tower-20261013"/);
  assert.match(zombieTowerArticle.post.content,/com\.pi\.zombie\.tower/);
  assert.match(zombieTowerArticle.post.content,/2026년 5월 11일/);
  assert.doesNotMatch(zombieTowerArticle.post.content,/data-ncp-copy=/);
});

test('Zombie Tower는 Roblox 동명 게임 코드를 Pi Game 쿠폰으로 혼합하지 않는다',()=>{
  const html=zombieTowerArticle.post.content;
  for(const code of ['UPDATE4','500LIKES','Overhaul_Real','Holidays2024'])assert.doesNotMatch(html,new RegExp(code,'i'));
  assert.match(html,/Roblox/);
  assert.match(html,/다른 게임/);
});
