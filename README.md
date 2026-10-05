# 아끼고 보자

공개 사이트: https://lsifl.blogspot.com/ · Blogger blogId: `2339978524893611480`

GitHub는 소스를 관리하고 Cloudflare Worker는 운영 실행을 담당하며 Blogger는 공개 게시물을 제공한다.

## 현재 구현

- 공개 Blogger R3 테마: 적용 완료. 현재 공개 테마는 재적용/덮어쓰기 대상이 아니다.
- `akkigo_blogger_r1_bundle/`: 초기 테마·게시물 템플릿·운영 기준 보존본. 현재 공개 테마를 덮기 위한 배포본으로 사용하지 않는다.
- `src/coupons.js`: 쿠폰 근거 검증, 정률/정액 절감액 계산, 일반/여행/커머스 HTML renderer. 게임은 기존 GAME_REWARD 하위 호환을 유지한다.
- 지원 offer type: CODE, AUTO_DISCOUNT, CARD_CHANNEL, MEMBER, CASHBACK, REFERRAL, GAME_REDEEM, FREEBIE.
- 지원 종료 조건: FIXED_DATE, ONGOING, UNTIL_BUDGET_EXHAUSTED, UNTIL_STOCK_EXHAUSTED, UNKNOWN.
- 여행 validator: 여행 종류·지역·예약기간·투숙기간·카드채널 제공자 검사.
- `src/worker.js`: 공개 상태 확인 `/health`, 인증된 수집/기존 허브 갱신 진입점. 인증된 내부 API 발행은 활성화됐고 Cron 자동 발행은 하지 않는다.
- `src/collector.js`: 공식 페이지 응답·변경 해시를 D1에 기록. 코드 추출과 사용 성공 검증은 별도 단계다.
- `data/sources.json`: 게임 공식 원천 4개 + Agoda Deals + Trip.com 2026 국내여행 프로모션 관찰 원천. 여행 원천은 아직 구조화 ACTIVE 쿠폰으로 자동 승격하지 않는다.
- `src/publisher.js`: 최초 초안 생성·postId 저장·기존 갱신. 불명확한 결과는 UNKNOWN으로 보존하고 자동 재시도를 차단. 고유 본문 표식이 정확히 하나인 기존 글만 복구 연결.
- `migrations/`: 원천 확인, 허브 postId, 갱신 시도와 동시 실행 방지 인덱스.
- `tools/connect-blogger.mjs`: Desktop OAuth JSON으로 로컬 PKCE 동의를 받고 Worker Secret에 직접 저장. 실계정 OAuth 연결 및 최초 공개 발행·갱신 완료.
- `data/coupons.json`: 공식 이미지에서 확인한 제우스 후보 1개. 사용자 계정 1건 등록·보상 수령 확인. 전체 계정/서버 조건과 기한은 미확인으로 UNVERIFIED 유지.
- `drafts/`: 게임별 HTML/JSON 초안 3개. `node tools/build-drafts.mjs`로 생성한다. 실제 Blogger 생성과 구분한다.

## 검증

- GitHub Verify workflow: push마다 `pnpm test` + `pnpm build`.
- 여행/커머스 비교 모델 및 validator 변경 PASS.
- 공식 여행 source 추가 후 source-count 회귀 수정 PASS — Verify Run `37298222331`.
- Deploy Worker workflow는 현재 운영 가드에 따라 skipped될 수 있다. GitHub source 반영과 Worker production 반영을 구분한다.
- Blogger Theme XML 및 `tools/build-theme.mjs`는 이번 후속 작업에서 수정하지 않았다.

## 실행

Node.js 24 이상, pnpm 사용. `pnpm install`, `pnpm test`, `pnpm build`, `pnpm deploy`.
Cloudflare 로그인은 `pnpm exec wrangler login`으로 진행한다. 인증정보를 소스에 넣지 않는다.

## 남은 연결

1. Agoda/Trip.com 공식 페이지에서 구조화 후보를 추출하되 공식 HTTP 200만으로 ACTIVE 처리하지 않는다.
2. 여행 후보는 적용 대상·기간·최소금액·플랫폼·지역과 실제 작동 근거를 검증한 후 승격한다.
3. 쇼핑·배달의 허용된 공식 프로모션 원천을 확정한다.
4. 실제 ACTIVE 데이터가 생긴 뒤 여행/커머스 비교 renderer를 게시물 본문에 연결하고 공개 QA한다. 기존 R3 테마는 덮어쓰지 않는다.
5. 자연 Cron의 SCHEDULED/SUCCEEDED 기록을 수동 수집과 분리해 확인한다.
6. Worker 자동 배포는 현재 GitHub deploy 가드/credential 상태를 확인한 뒤 활성화한다.
7. Search Console/네이버 등록은 무료 공식 경로를 우선한다. GSC Wizard는 현재 payment_required 상태이므로 유료 결제 없이 진행한다.

기존 Blogger 테마 백업은 로컬 `backups/`에 보관하며 Git에 올리지 않는다. 기존 Tistory 및 DDoRi 블로그는 변경 대상이 아니다.

공식 문서: [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/), [Blogger API](https://developers.google.com/blogger/docs/3.0/using).

테마 직접 배포: docs/THEME_DEPLOYMENT.md. 현재 문제 대조: docs/CURRENT_ISSUE_AUDIT.md. 남은 작업: docs/REMAINING_WORK.md.
