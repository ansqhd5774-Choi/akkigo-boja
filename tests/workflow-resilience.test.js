import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(path,'utf8');

test('layout verification streams Chrome DOM to disk instead of buffering child stdout',()=>{
  const source=read('tools/run-layout-checks.mjs');
  assert.match(source,/spawnSync\(chrome/);
  assert.match(source,/openSync\(dumpPath,'w'\)/);
  assert.match(source,/readFileSync\(dumpPath,'utf8'\)/);
  assert.doesNotMatch(source,/execFileSync\(chrome/);
  assert.doesNotMatch(source,/maxBuffer\s*:/);
});

test('game period refresh auto-discovers a legacy batch article only when canonical state is missing',()=>{
  const source=read('tools/apply-game-period-refresh.mjs');
  assert.match(source,/async function autoDiscoverLegacyArticle/);
  assert.match(source,/readdirSync\('src'\)/);
  assert.match(source,/if\(!model\|\|articleHits\.length===0\)/);
  assert.match(source,/GAME_PERIOD_REFRESH_LEGACY_SOURCE_NOT_FOUND/);
  assert.match(source,/GAME_PERIOD_REFRESH_LEGACY_SOURCE_AMBIGUOUS/);
});

test('declarative refresh skips premature Verify and dispatches one final Verify after generated source commit',()=>{
  const stage=read('.github/workflows/stage-game-period-refresh.yml');
  const verify=read('.github/workflows/verify.yml');
  assert.match(stage,/actions:\s*write/);
  assert.match(stage,/gh workflow run verify\.yml/);
  assert.match(stage,/GAME_PERIOD_REFRESH_FINAL_VERIFY_DISPATCHED/);
  assert.match(verify,/data\/game-period-refreshes\/\*\*/);
});

test('public discovery records Blogger HTTP 429 as throttled evidence without a failing stack trace',()=>{
  const source=read('tools/check-public-discovery.mjs');
  assert.match(source,/state:'THROTTLED'/);
  assert.match(source,/reason:'BLOGGER_HTTP_429'/);
  assert.match(source,/PUBLIC_DISCOVERY_THROTTLED_429/);
  assert.match(source,/if\(error\?\.code!==rateLimitCode\)throw error/);
});
