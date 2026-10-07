import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('발행 workflow는 전체 Push 이력을 가져오고 별도 요청 범위 선택기를 실행한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  assert.match(yaml,/actions\/checkout@v7\.0\.1[\s\S]*?fetch-depth:\s*0/);
  assert.match(yaml,/node tools\/select-publish-requests\.mjs/);
  assert.match(yaml,/PUSH_BEFORE/);
  assert.doesNotMatch(yaml,/git diff --name-only HEAD\^ HEAD/);
});

test('발행 workflow는 소스 Verify 성공과 Worker 배포 상태를 확인한 뒤 필요한 경우에만 복구 배포한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  assert.match(yaml,/Require verified source snapshot/);
  assert.match(yaml,/SOURCE_SNAPSHOT_VERIFIED/);
  assert.match(yaml,/git diff --name-only "\$candidate" "\$GITHUB_SHA"/);
  assert.match(yaml,/grep -Ev '.*docs\//);
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

test('이미 성공한 Worker 배포가 최신 데이터 커밋의 후손이면 중복 재배포하지 않는다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  assert.match(yaml,/mapfile -t deployed_shas/);
  assert.match(yaml,/git merge-base --is-ancestor "\$deploy_sha" "\$deployed_sha"/);
  assert.match(yaml,/git merge-base --is-ancestor "\$deployed_sha" HEAD\^/);
  assert.match(yaml,/WORKER_ALREADY_DEPLOYED_BY_DEPLOY_WORKFLOW/);
  assert.doesNotMatch(yaml,/head_sha="\$deploy_sha"/);
  assert.match(yaml,/if \[ "\$deploy_needed" = true \]; then/);
});

test('발행과 Deploy는 같은 생산 환경 FIFO 대기열을 보존한다',()=>{
  for(const path of ['../.github/workflows/publish-article.yml','../.github/workflows/deploy.yml']){
    const yaml=readFileSync(new URL(path,import.meta.url),'utf8');
    assert.match(yaml,/group: production-worker\s*\n\s*queue: max\s*\n\s*cancel-in-progress: false/);
  }
});

test('발행 실행의 빈 diff와 중복 코드 방지가 안전하게 연결된다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  const runner=readFileSync(new URL('../tools/publish-approved-requests.mjs',import.meta.url),'utf8');
  assert.match(yaml,/if: steps\.requests\.outputs\.has_requests == 'true'/);
  assert.match(yaml,/publish-hub-paths\.txt/);
  assert.match(yaml,/publish-article-paths\.txt/);
  assert.match(yaml,/node tools\/refresh-approved-hubs\.mjs/);
  assert.match(yaml,/node tools\/publish-approved-requests\.mjs/);
  assert.doesNotMatch(yaml,/COMMIT_MESSAGE/);
  assert.match(runner,/NO_EXPLICIT_PUBLISH_REQUESTS/);
  assert.match(runner,/DUPLICATE_ARTICLE_REQUEST_SKIPPED/);
  assert.doesNotMatch(runner,/readdir/);
});

test('배포 상태 탐지는 50개 커밋 조회 제한 대신 전체 Git 이력을 사용한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  assert.match(yaml,/git log -1 --format=%H HEAD -- src\//);
  assert.doesNotMatch(yaml,/git rev-list --max-count=50/);
});
