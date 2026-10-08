# 아끼고 보자 — 게임 쿠폰 운영 워크플로 개선 실행 사양 R8~R10

- 수립일: 2026-10-08 (KST)
- 운영 범위: `https://lsifl.blogspot.com/` / Blogger blogId `2339978524893611480`
- 소스: `ansqhd5774-Choi/akkigo-boja`, `codex/blogger-worker-r1`
- 계획 수립 직전 HEAD: `a24b789a8f4882f5e0777524ecc29cfd86eff9ab`
- 문서 상태: **실행 사양 확정(DESIGN DONE), 실제 R8/R9/R10 코드 적용 전**
- 다른 Tistory 블로그, 기존 공개 URL·postId, R3 Blogger 테마 무단 변경 금지.
- 목표: **출처 있는 쿠폰을 누락 없이 보존하고, 검색자가 유효성·월별 신규 여부·복사 동작을 첫 화면에서 즉시 파악하게 한다.**

## A. 실제 확인된 현재 구현 및 기준선

| 영역 | 현재 상태/근거 | 결함/영향 |
|---|---|---|
| 콘텐츠 구조 | `data/articles.json` + `data/articles-supplemental.json`에 게시물 본문이 들어 있으며 `drafts/<key>.html`, `drafts/<key>.json`에도 복사본 있음 | 별도 작성 시 내용 drift, 큰 git diff, 연속 커밋마다 Verify/Deploy 중복 |
| 기사 등록 수 | 최신 원격 조회에서 기사 69건, 게임 26건, 월별 `gameCouponTimeline` 가진 게임 글 5건 | 레거시 21개가 새로운 월별 이력 검증에 포함되지 않음 |
| 제목 | 게임명 단독 제목 약 6/26, 다른 게임 20건은 쿠폰·연월을 제목에 포함 | 사용자의 확정 편집 기준과 불일치. 기존 URL을 보존하며 추후 안전 정비 |
| 본문 검증 | `tools/validate-article-draft.mjs`, `src/game-code-layout-contract.js`, `src/game-coupon-monthly.js` | 신규 글의 5열·68px·복사값·월별 분리 검증은 있으나 모든 옛 글에 강제하지 않음 |
| 공개 검증 | `src/articles.js::publicCheck`: 일반 글은 주로 `data-ncp-article` 마커만 확인 | 코드 누락·버튼 숨김·모바일 overflow가 있어도 `publicVerified=true` 가능 |
| UI 실측 | `verify-layout.yml`은 시바 모험단 중심의 390/1440 fixture만 점검 | 모든 새 게임 글 공개 화면까지 자동 보장하지 않음 |
| 배포 | `deploy.yml`이 `src/**, data/**` 수정에 반응; `publish-article.yml`은 OIDC·SHA·Worker source preflight 후 발행 | 현재 기사 본문은 Worker의 정적 import 대상이라 콘텐츠 변경 시 Worker 반영이 필요. 배포 자체를 무조건 생략할 수 없음 |
| 중복 보호 | `src/articles.js` D1 `article_state`, `findArticlePosts`, Blogger 기존 postId 사용, `publish_attempts` 기록 | 반드시 유지. 시간초과/UNKNOWN에 무조건 재발행 금지 |
| SEO | `src/blogger.js::createDraft`는 `title, content, labels` 전송; Blogger Posts v3 공개 리소스에 개별 `searchDescription` 전송 필드 확인되지 않음 | HTML 본문에 키워드를 넣었다고 실제 meta description 설정 완료로 간주하지 않음 |
| 최근 Actions | 최근 40건: 성공 29, 취소 9(Verify), 실패 2(과거 Layout), 이후 레이아웃 수정 PASS | 코드 수정 파일을 순차 commit할 때 검증 취소가 반복. 마지막 성공은 보존 |

## B. 고정된 운영 불변조건

1. 게임별 **단일 대표 게시물**. 기존 `postId`, URL 유지. 신규 월 코드만으로 새 글을 중복 생성하지 않는다.
2. 게시물 제목은 **게임명만**. ‘쿠폰/연월/입력 방법’은 본문 H2·검증 가능한 검색 설명에 배치. 레거시 20개 제목의 일괄 자동 수정은 하지 않는다.
3. 공식 코드뿐 아니라 출처가 확인되는 후보도 버리지 않는다. 다만 **공식 발급, 제3자 게임명 특정, 범용, 무작위, 타지역/타게임**은 시각적으로 분리해 ‘작동’처럼 오인시키지 않는다.
4. 신규 표시(NEW)는 **이 게임에서 이전에 게시하지 않은 코드가 실제 새로 확인된 첫 월**일 때만. 발급 월과 검색·재게시 월을 혼동하지 않는다. 월을 모르면 `null`, ‘월 미상’으로 보존.
5. 5열 `순서 / 출처 / 만료 기간 / 쿠폰 / 복사`, 높이 68px, 코드·복사 버튼 항상 표시. 추가 목록을 숨기는 `details`, Load More 금지.
6. 공식 교환 경로 또는 게임 내 메뉴가 미확인일 때는 경로를 지어내지 않는다. 개인/비공개 코드·비밀번호·쿠키·OTP 저장 금지.
7. OIDC, 정확한 `postSha256`, 사용자 변경 보호, D1 체크포인트, 기존/신규 게시물 reconcile, Deploy의 인증 경계를 유지.
8. 테마 UI 변경은 별도 승인 및 원본 백업 후 공식 Blogger 관리자 절차만 사용. 이번 R8에 테마 배포 없음.
9. 외부 도구 호출 비용·한도는 제공자의 공식 페이지 또는 실제 사용량 자료로 확인. 확인 전 유료/대량 자동 호출 금지.

## C. R8 — 먼저 구현할 최소 변경 (P0)

### R8.1 단일 원천 스키마와 불변 이력
**신규 제안:** `data/game-articles/<articleKey>.json` (게임별 canonical source). 현 `data/articles.json`, `data/articles-supplemental.json`, `drafts/*.json/html`은 우선 그대로 호환하고 신규 게임부터 점진 전환.

- 필수: `articleKey, gameName, identity(appStoreUrl, packageId, publisher), postId?(existing), sourceCheckedAt, coupons[], sources[], articleSections`.
- `coupons[]`는 `code, displayCode, sourceUrl, sourceName, sourceAuthority, sourceGame, sourceCheckedAt, firstSeenAt, firstSeenMonth, firstIssuedAt?, expiry?, server?, region?, rewards?, conditions?, status, workingVerifiedAt?, workingEvidence?`.
- **`firstIssuedAt` (게임사 발급일)과 `firstSeenAt` (수집 최초 관찰일)은 다른 필드**. 무작위 외부 게시물의 갱신 날짜를 공식 발급 날짜라고 쓰지 않는다.
- 코드 ID: 게임/배포판(scope) + **원문 코드 문자열** 기준 중복 검사. 필요 시 NFC와 대소문자 민감 정책을 명시하되 원문 문자열은 변형 없이 복사.
- 기존 코드 재발견 시 `firstSeenMonth`을 유지하고 `lastSeenAt`만 갱신. 월 미상은 추정해서 이번 달 신규로 승격하지 않는다.
- 범용/무작위 후보는 운영 검색을 위해 저장하되 독자에게 **발급 근거/입력 가능 여부가 다른 자료와 동일한 신뢰도로 보이지 않도록** 별도 영역을 둔다.
- 교환 인터페이스가 없는 게임은 코드 목록이 있어도 `redeemSupport=UNCONFIRMED/NOT_AVAILABLE`을 본문 상단에 노출.

**수정·추가 후보:** `src/game-coupon-monthly.js`, `src/game-code-candidate-policy.js`, `data/game-articles/`, `tests/game-coupon-monthly.test.js`.

**통과 기준:** 이전 9월 3개+10월 신규 2개 fixture에서 **NEW 2/이전 3**, 이력 중복 0, `unknown`을 잘못 10월 신규로 만드는 사례 0; 다른 국가/게임 후보를 글로벌 공식 코드로 승격한 사례 0.

### R8.2 통합 렌더러·메타 작성기
**신규 제안:** `tools/build-game-article.mjs` + `src/game-article-renderer.js`.

- canonical JSON에서 **결정적(deterministic)**으로 `drafts/<key>.html`, `drafts/<key>.json`, `data/articles-supplemental.json`을 자동 생성. 세 파일을 따로 사람이 관리하지 않는다.
- `--check`는 git 파일을 수정하지 않고 생성 예정 결과가 현재 산출물과 같은지만 검증.
- `--write`는 정확한 `articleKey` 한 항목만 갱신. 다른 사용자가 수정한 다른 article 및 순서는 보존; `data/articles.json` 원본은 임의 재정렬·대체하지 않는다.
- 모든 신규 게임의 `post.title`은 게임명만; 상단 1화면에서 신규 쿠폰(있다면)·입력 공식 URL·실제 발급 상태가 드러나야 한다.
- `description`은 canonical 원천에 검색 문안으로 **작성/보관만**. Blogger Posts API에 존재하지 않는 입력 필드를 상상해 전송하지 않는다. R9에서 공식 관리자 경로/실제 공개 meta를 검증한 다음 적용.
- 기사별 앱 아이콘은 공식 Google Play/App Store ID·원본 이미지 URL·서비스명을 1:1 검증한 경우만.
- 새 코드가 없으면 빈 표/가짜 버튼/가짜 신규 숫자 대신 ‘현재 확인된 신규 코드 없음’으로 출력.
- 현재 채택 5열, 높이 68px, 기존 복사 기능과 Jump Break를 보존. 공통 CSS만 최소 수정, R3 테마 변경 금지.

**수정·추가 후보:** `tools/build-game-article.mjs`, `src/game-article-renderer.js`, `src/game-coupon-table.js`, `tools/validate-article-draft.mjs`, `tests/game-article-renderer.test.js`.

**통과 기준:** 빌드 2회 SHA 일치; 소스 등록 쿠폰 N개와 HTML 복사 버튼 N개 100% 일치; 출처 링크 N개 유효 형식; 중복 H1 0; `<!--more-->` 정확히 1개; 모바일 표 넘침 0.

### R8.3 하나의 변경 묶음 및 불필요 배포 축소
- 기사 작성 중 4~6회 GitHub 파일 저장을 **준비된 소스/산출물 1회 원자적 커밋**으로 묶는다. 변경 전 원격 HEAD drift 대조 및 충돌 시 중단/안전 통합.
- 이후 **동일 기사 발행 요청 커밋 1회**. 실패 시 같은 요청 파일을 무작정 재생성하지 않고 기존 요청 상태를 읽기.
- 새 콘텐츠가 `data/articles-supplemental.json`에 들어가는 현재 구조에서는 **Worker 업데이트가 필요**하다. 실제 소스 hash / deployed snapshot이 같을 때만 `WORKER_SNAPSHOT_MATCH_SKIP_DEPLOY`. 무조건 Worker 배포를 없앤다고 약속하지 않는다.
- `Verify`의 기존 자동 취소는 불필요한 중간 실행에만 적용. `publish-article.yml`, `deploy.yml`의 `production-worker`, `queue: max`, `cancel-in-progress: false`를 변경 전 GitHub 공식 동시성 계약과 대조 후 보존.
- `publish_attempts`에 `RUNNING/UNKNOWN`이 있으면 새 발행보다 Blogger 공개/API/D1 대조가 우선이다.

**수정 후보:** `.github/workflows/verify.yml`, `.github/workflows/deploy.yml`, `.github/workflows/publish-article.yml`, `tools/select-publish-requests.mjs`, 신규 일괄 스테이징 스크립트.

**통과 기준:** 표준 신규 글 1건당 **소스 커밋 1회 + 발행 요청 커밋 1회**; 정상 케이스에서 최종 Verify 1회 성공, 실제 필요한 Worker 배포만 수행, publish 요청 한 번으로 게시물 LIVE. 오류 케이스에서 중복 postId/URL 0건.

### R8.4 강화된 공개 검증
- 현재 `src/articles.js::publicCheck` 일반 글에 적용된 마커 단독 검사를 구조화 판정으로 대체.
- **PROVIDER_WRITE**: Blogger API가 postId·status·title·기대 SHA를 응답.
- **PUBLIC_CONTENT**: 실제 공개 URL의 동일 articleKey, 기대 title, 최초 이미지, 코드 원문 N개, 월 그룹 순서, 복사 버튼 N개, 공식 링크 존재. 민감값은 로그 출력하지 않음.
- **BROWSER_QA**: 독립된 headless Chromium에서 PC1440/mobile390 실제 클릭, 복사 후 문자열 비교, 스크롤 너비/가로넘침/버튼 가시성 확인.
- 하나라도 불확실하면 `publicVerified=true` 단정 금지. `PROVIDER_OK_PUBLIC_UNKNOWN`, `PUBLIC_OK_BROWSER_NOT_RUN`, `PUBLIC_QA_PASS`처럼 **단계별 증거를 분리**.
- 공개 페이지 봇 차단/HTTP429는 사이트 기능 실패로 단정하지 않고 `AUTOMATION_BLOCKED` 혹은 별도 `PUBLIC_STATE_UNKNOWN` 증거로 기록.
- Blogger 저장 후 공개 검증만 실패한 경우도 재발행·무조건 PATCH하지 않음. 원래 postId·공개 본문을 읽고 상태만 복구.

**수정 후보:** `src/articles.js`, `tools/check-public-article.mjs`, `tests/article-publisher.test.js`, `tests/game-publish-pipeline.test.js`.

**통과 기준:** 테스트에서 고의로 코드 1개 제거, 버튼 1개 숨김, 월 그룹 뒤바꿈, 포스터 이미지 변경 시 모두 실패; 정상 fixture에서 390/1440 전부 통과. 실제 공개 브라우저 검증은 별도 실행 증거가 있어야만 완료.

## D. R9 — 확장 품질 (P1)

| ID | 변경 | 대상 | 필수 검증 |
|---|---|---|---|
| R9.1 | 모든 신규 게임 HTML을 1440·390 헤드리스 브라우저 fixture로 검사; 기존 시바 전용 검증 일반화 | `verify-layout.yml`, `tools/check-game-layout.mjs` | 코드·복사 클릭·모바일 수평 스크롤·최소 탭 크기·접힌 쿠폰=0 |
| R9.2 | 공식 Blogger 개별 게시물 **Search description** 지원 경로 확인. API v3 공식 Posts 모델에 없는 필드를 임의 사용하지 않으며 필요한 관리자 조치/테마 변경은 별도 승인 | `src/blogger.js`, `docs/SEO_METADATA_VERIFY_R9.md` | 특정 1개 승인된 시험 글에서 공개 HTML의 meta description 실제 검증, 실패하면 전면 적용 보류 |
| R9.3 | 공개 QA 로그를 `articleKey/postId/url/sourceSha/status/verifierTimestamp/errorCode`로 표준화, 실패 원인 증거 보호 | `src/articles.js`, `tools/publish-approved-requests.mjs`, D1 migration(필요 시) | API/DB/공개 브라우저 성공을 별도 집계, 미실행 검사 결코 PASS 보고 금지 |
| R9.4 | 기존 게임 제목 20개와 월별 이력 미보유 21개를 **리스크 기반 개별 갱신 후보**로 식별. URL/postId 유지·실제 기존 코드 이력 확보 후 순차 적용 | `docs/LEGACY_GAME_BACKLOG_R9.md` | 기존 URL 100% 보존, 과거 코드의 NEW 오분류 0, 승인 없는 일괄 PATCH 0 |
| R9.5 | 공식 발급 수/제3자 후보 수/추가 문자열 수를 제목·본문에서 혼합하지 않고 설명 | template / game-code candidate policy | 전체 문자열 수 = 출처별 목록 수 합계; 공식 발급 숫자 과장 0 |

R9의 '검색 설명'은 Google 결과 스니펫을 보장하지 않는다. Google은 쿼리에 따라 본문 텍스트를 사용할 수 있다.

## E. R10 — 이후 운영 자동화 (P2)

1. **공식 소스 우선 변화 관찰:** `data/sources.json` 등 공식 공지 채널 기준 관찰·중복 제거·상태 저장. SNS/동영상/블로그 보조 출처는 허용된 인터페이스로만 확인, 접근 불가한 비공개 콘텐츠를 수집했다고 주장하지 않는다.
2. **변경 감지:** 저장된 `code+game+edition`의 첫 관찰 월, 최근 확인 시점, 공식 발급 증거를 비교해 **정말 새로운 후보**만 업데이트 대기열에 등록. 동일 콘텐츠 재발행 방지.
3. **자동 공개 승격 금지:** 원천 관찰 Cron이 새로운 코드를 발견해도 곧바로 `ACTIVE`나 자동 발행하지 않는다. 기존 검증 조건을 통과한 데이터/승인된 발행 경로만 사용.
4. **SEO 성과 분석:** Search Console 소유/색인 상태 확인 후 28일 실측 query·impression·click·CTR 기반으로 보강할 검색어를 선정. GSC Wizard 결제 상태를 근거 없이 변경하지 않는다.
5. **모니터링 비용 가드:** 변경 없는 관찰은 재배포하지 않고, 동일 URL 반복 수집에 캐시·출처 최신성 확인. 도구 한도 부족 시 별도 `AUTOMATION_BLOCKED`.

## F. 단계별 작업 순서·게이트

| 게이트 | 입력 | 산출물 | 통과 조건 | 실패 시 |
|---|---|---|---|---|
| G0 | 원격 HEAD, 실제 운영 증거 | 변경 기준선 | 다른 변경 drift 확인 완료 | 관련 범위만 안전 통합/보류 |
| G1 | 1개 게임의 쿠폰 원천 | canonical JSON | 출처·게임 ID·원문 코드·처음 확인 월 유지 | 후보로 저장, 발행 보류 |
| G2 | canonical JSON | HTML/JSON/카탈로그 | 2회 생성 동일 + 모든 코드/버튼 일치 | 변경 저장 중단 |
| G3 | GitHub 1묶음 | Verify 테스트·빌드 | PASS, title/월별/이미지/복사·유효 링크 | 공개 mutation 차단 |
| G4 | 검증된 SHA | Worker source 대응 | 실제 배포 digest 일치 또는 필요 배포 성공 | 발행 요청 중단 |
| G5 | 승인된 발행 요청 1회 | Blogger `postId/url/status` | 동일 articleKey의 게시물 1개, 기존 URL 보존 | RUNNING/UNKNOWN 확인 후 reconcile |
| G6 | 공개 URL | content/browser QA | PC1440·mobile390 + 코드 N개 + 복사 N개 검증 | 진짜 실패와 접근차단 구분해 PARTIAL |
| G7 | 최종 운영 기록 | evidence/status report | DONE/PARTIAL/BLOCKED/AUTOMATION_BLOCKED/RUNTIME_FAILED 중 정확히 기록 | 근거 없는 완료 선언 금지 |

## G. 출시 방안과 롤백

- R8.1~R8.4는 **한 게임 신규 게시물 fixture**에서 먼저 검증. 기존 리니지M·제우스·명조 hub 글 및 게시물에는 소급 적용 금지.
- shadow 모드에서 기존 렌더러와 신규 렌더러의 쿠폰 순서·표·월별 코드·출처 일치 확인 후 신규 글 한 건에만 적용.
- 검증 성공 뒤 새로운 글부터 기본 생성기로 전환. 기존 26게임 전부 한꺼번에 전환 금지.
- Blogger 변경이 필요할 경우 postId·기존 URL·직전 content를 비공개 증거로 보존. 오류 시 재생성을 반복하지 않고 Provider 상태를 확인한 뒤 승인된 복구만 수행.
- Cloudflare Worker rollback은 필요성과 영향 확인 후 제한된 범위에서만 진행. Blogger 테마 XML은 이번 개선에서 변경하지 않는다.

## H. 성공 지표 (측정값 아닌 개선 목표)

| 지표 | R8 목표 |
|---|---|
| 발행 데이터 원본 | 신규 게임은 canonical source 1개 |
| 신규 코드 누락·중복·잘못된 NEW | 테스트 및 발행 기준 0 |
| 코드 복사값 불일치 / 코드 숨김 | 테스트 기준 0 |
| 정상 신규 글 GitHub 변경 | 소스 1묶음 + 승인 발행 요청 1건 |
| 실사용 브라우저 QA | QA 실행된 신규 게임 PC1440/mobile390 모두 PASS, 미실행 건은 별도 표시 |
| 공식 코드 오분류 | 근거 없는 공식 발급/활성 승격 0 |
| 기존 URL·postId 변경 | 0 |
| Worker 불필요 중복 배포 | 동일 소스 digest에 대한 배포 0 (기존 Worker 빌드 구조의 필요한 배포는 허용) |
| 출시 뒤 검증 기록 | 모든 게시물에 Provider/공개/브라우저 상태 별도 기록 |

## I. 실제 사용 도구와 운영 한도 기록 (수립 단계)

| 도구 | 사용 가능 | 실제 담당 | 호출 조건 | 공식 한도/사용량 | 대체·금지 |
|---|---|---|---|---|---|
| GitHub | YES | 브랜치·커밋·코드·Actions 읽기, 본 문서 저장 | 설계/향후 구현 | 한도: GitHub API [공식 REST rate limit](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api), 실잔여량 미확인 | 읽기/저장은 GitHub 원본 기준; 승인 없는 reset·force push 금지 |
| Context7 | YES, 이번 단계 미호출 | 향후 Blogger·Cloudflare 도구 문서 교차 검증 시 | 코드 구현 단계 | 개별 플러그인 한도/잔여 미확인 | 공식 개발자 문서 직접 확인 가능 |
| Firecrawl | YES, 이번 단계 미호출 | 공식 원천 페이지 내용 수집/변경 조사 | R10 범위로 실제 수집 승인 시 | 현재 잔여 미조회 (비용/쿼터 확인 전 반복 수집 금지) | 공개 웹/공식 사이트; 유료·대량 수집 금지 |
| GSC Wizard | YES, 이번 단계 미호출 | 검색 실적·색인 | 연결·구독·사이트 확인 후 | 미확인 | 공식 무료 GSC 화면 이용 가능, 결제 무단 변경 금지 |
| Google Drive | YES, 이번 단계 미호출 | 원본·백업 조회 | 별도 백업 검토 필요시 | 미확인 | GitHub 원본 대체/무단 overwrite 금지 |
| PostHog | YES, 이번 단계 미호출 | 실제 연결된 분석 이벤트 증거 | 명시적으로 사이트 데이터 연결 확인 후 | 미확인 | 연결 안 된 트래픽·CTR 수치 가정 금지 |

- 공식 근거(2026-10-08 기준):
  - GitHub concurrency / queue: https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency
  - Blogger Posts v3 resource: https://developers.google.com/blogger/docs/3.0/reference/posts
  - Blogger Posts insert: https://developers.google.com/blogger/docs/3.0/reference/posts/insert
  - Google 검색 스니펫과 meta description: https://developers.google.com/search/docs/appearance/snippet

## J. 현재 완료 상태

- **DONE:** 설계 수립, 실제 GitHub 소스·워크플로 대조, 우선순위·파일·테스트·롤백 조건 정의, 문서 저장.
- **NOT_RUN:** R8~R10 구현 코드 수정, 새 테스트 실행, Worker 실제 재배포, Blogger 글 변경, 공개 PC/mobile QA.
- 다음 실제 구현 첫 작업은 **R8.1 데이터 계약·fixture 및 검증부터** 시작; 통과 전 운영용 게시물에 대한 자동 대량 변경 금지.
