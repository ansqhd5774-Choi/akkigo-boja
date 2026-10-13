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

test('declarative refresh runs one exact Verify, waits for success, then dispatches one pinned Deploy',()=>{
  const stage=read('.github/workflows/stage-game-period-refresh.yml');
  const verify=read('.github/workflows/verify.yml');
  const deploy=read('.github/workflows/deploy.yml');
  assert.match(stage,/actions:\s*write/);
  assert.equal((stage.match(/gh workflow run verify\.yml/g)||[]).length,1);
  assert.equal((stage.match(/gh workflow run deploy\.yml/g)||[]).length,1);
  assert.equal((stage.match(/gh run watch/g)||[]).length,2);
  assert.match(stage,/select\(\.head_sha == env\.GENERATED_SHA\)/);
  assert.match(stage,/source_sha="\$GENERATED_SHA"/);
  assert.ok(stage.indexOf('gh run watch "$run_id"') < stage.indexOf('gh workflow run deploy.yml'));
  assert.match(stage,/has_refresh=false/);
  assert.match(stage,/if: steps\.refresh\.outputs\.has_refresh == 'true'/);
  assert.match(verify,/data\/game-period-refreshes\/\*\*/);
  assert.match(deploy,/source_sha:[\s\S]*Exact verified source commit to deploy/);
  assert.match(deploy,/SOURCE_SHA:\s*\$\{\{ inputs\.source_sha \|\| github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.doesNotMatch(stage,/uses:\s*\.\/\.github\/workflows\/verify\.yml/);
  assert.doesNotMatch(stage,/uses:\s*\.\/\.github\/workflows\/deploy\.yml/);
});

test('explicit deploy source identity uses checkout and remote branch instead of duplicate event SHA checks',()=>{
  const source=read('tools/check-deploy-target.mjs');
  assert.match(source,/head !== sha \|\| remote !== sha/);
  assert.doesNotMatch(source,/process\.env\.GITHUB_SHA !== sha/);
});

test('normal publication uses the target public verification and does not rescan the whole site',()=>{
  const workflow=read('.github/workflows/publish-article.yml');
  const publisher=read('tools/publish-approved-requests.mjs');
  assert.doesNotMatch(workflow,/check-public-discovery\.mjs/);
  assert.doesNotMatch(workflow,/name:\s*public-discovery/);
  assert.match(publisher,/body\.publicVerified/);
  assert.match(publisher,/BLOGGER_LIVE_USER_REVIEW_URL/);
});

test('public discovery records Blogger HTTP 429 as throttled evidence without a failing stack trace',()=>{
  const source=read('tools/check-public-discovery.mjs');
  assert.match(source,/state:'THROTTLED'/);
  assert.match(source,/reason:'BLOGGER_HTTP_429'/);
  assert.match(source,/PUBLIC_DISCOVERY_THROTTLED_429/);
  assert.match(source,/if\(error\?\.code!==rateLimitCode\)throw error/);
});
