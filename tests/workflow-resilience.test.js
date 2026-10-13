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

test('declarative refresh verifies and deploys the generated SHA exactly once through reusable workflows',()=>{
  const stage=read('.github/workflows/stage-game-period-refresh.yml');
  const verify=read('.github/workflows/verify.yml');
  const deploy=read('.github/workflows/deploy.yml');
  assert.doesNotMatch(stage,/actions:\s*write/);
  assert.doesNotMatch(stage,/gh workflow run verify\.yml/);
  assert.equal((stage.match(/uses:\s*\.\/\.github\/workflows\/verify\.yml/g)||[]).length,1);
  assert.equal((stage.match(/uses:\s*\.\/\.github\/workflows\/deploy\.yml/g)||[]).length,1);
  assert.match(stage,/generated_sha:\s*\$\{\{ steps\.generated\.outputs\.generated_sha \}\}/);
  assert.match(stage,/source_sha:\s*\$\{\{ needs\.stage\.outputs\.generated_sha \}\}/);
  assert.match(stage,/secrets:\s*inherit/);
  assert.match(verify,/workflow_call:[\s\S]*source_sha:/);
  assert.match(verify,/ref:\s*\$\{\{ inputs\.source_sha \|\| github\.sha \}\}/);
  assert.match(verify,/data\/game-period-refreshes\/\*\*/);
  assert.match(deploy,/workflow_call:[\s\S]*source_sha:/);
  assert.match(deploy,/SOURCE_SHA:\s*\$\{\{ inputs\.source_sha \|\| github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
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
