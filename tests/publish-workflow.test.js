import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('허브 갱신 workflow는 HEAD^ diff와 최근 배포 이력 확인을 위해 충분한 이력을 checkout한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  assert.match(yaml,/actions\/checkout@v7\.0\.1[\s\S]*?fetch-depth:\s*50/);
  assert.match(yaml,/git diff --name-only HEAD\^ HEAD -- 'publish-requests\/hub-refresh-\*\.json'/);
});

test('발행 workflow는 소스 Verify 성공과 Worker 배포 상태를 확인한 뒤 필요한 경우에만 복구 배포한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  assert.match(yaml,/Require latest source Verify success/);
  assert.match(yaml,/Check Worker deployment readiness/);
  assert.match(yaml,/WORKER_ALREADY_DEPLOYED_BY_DEPLOY_WORKFLOW/);
  assert.match(yaml,/WORKER_ALREADY_DEPLOYED_BY_SUCCESSFUL_PUBLISH/);
  assert.match(yaml,/if: steps\.worker\.outputs\.deploy_needed == 'true'/);
  assert.doesNotMatch(yaml,/^-\s+run:\s+pnpm test\s*$/m);
  assert.match(yaml,/group:\s*production-worker/);
});

test('publish 요청만 바뀌면 전체 Verify를 재실행하지 않고 화면 렌더 검사는 별도 경로로 제한한다',()=>{
  const verify=readFileSync(new URL('../.github/workflows/verify.yml',import.meta.url),'utf8');
  const layout=readFileSync(new URL('../.github/workflows/verify-layout.yml',import.meta.url),'utf8');
  assert.match(verify,/paths-ignore:[\s\S]*publish-requests\/\*\*/);
  assert.doesNotMatch(verify,/Render Shiba coupon layout/);
  assert.match(layout,/drafts\/shibarpg-pickup-202610\.html/);
  assert.match(layout,/akkigo_blogger_r1_bundle\/theme\/blogger-theme-r1\.xml/);
  assert.match(layout,/Render Shiba coupon layout at 390 and 1440/);
});

test('Verify는 오래된 실행을 취소하고 문서 변경을 제외한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/verify.yml',import.meta.url),'utf8');
  assert.match(yaml,/cancel-in-progress:\s*true/);
  assert.match(yaml,/docs\/\*\*/);
  assert.match(yaml,/'\*\*\/\*\.md'/);
});

test('Verify는 Worker 관련 변경이 아닐 때 pnpm 설치와 Worker dry-run을 모두 생략한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/verify.yml',import.meta.url),'utf8');
  assert.match(yaml,/Detect Worker build changes/);
  assert.match(yaml,/WORKER_BUILD_REQUIRED_UNCERTAIN_DIFF/);
  assert.match(yaml,/WORKER_BUILD_SKIPPED/);
  assert.match(yaml,/npm install --global pnpm@11\.19\.0\s*\n\s*if: steps\.changes\.outputs\.worker == 'true'/);
  assert.match(yaml,/pnpm install --frozen-lockfile\s*\n\s*if: steps\.changes\.outputs\.worker == 'true'/);
  assert.match(yaml,/run: node --test/);
  assert.match(yaml,/pnpm build\s*\n\s*if: steps\.changes\.outputs\.worker == 'true'/);
  assert.doesNotMatch(yaml,/actions\/cache@/);
});

test('Deploy는 별도 account probe와 cache 복원을 반복하지 않고 테스트 후 필요한 도구만 설치한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/deploy.yml',import.meta.url),'utf8');
  assert.doesNotMatch(yaml,/wrangler whoami/);
  assert.doesNotMatch(yaml,/actions\/cache@/);
  assert.match(yaml,/run: node --test/);
  assert.match(yaml,/npm install --global pnpm@11\.19\.0/);
  assert.match(yaml,/pnpm install --frozen-lockfile/);
  assert.match(yaml,/wrangler d1 migrations apply akkigo-boja-state --remote/);
  assert.match(yaml,/pnpm deploy/);
});
