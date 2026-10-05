# 아끼고 보자

공개 사이트: https://lsifl.blogspot.com/ · Blogger blogId: `2339978524893611480`

GitHub는 소스를 관리하고 Cloudflare Worker는 운영 실행을 담당하며 Blogger는 공개 게시물을 제공한다.

## 현재 구현

- `nutriments_blogger_r1_bundle/`: 사용자가 제공한 테마·게시물 템플릿·운영 기준. 게시물 예시를 실데이터로 발행하지 않는다.
- `src/coupons.js`: 쿠폰 근거 검증, 조건별 절감액 비교, 안전한 HTML 렌더링.
- `src/worker.js`: 공개 상태 확인 `/health`, 인증된 수집/기존 허브 갱신 진입점. 인증된 내부 API 발행은 활성화됐고 Cron 자동 발행은 하지 않는다.
- `src/collector.js`: 공식 페이지 4곳의 응답·변경 해시를 D1에 기록. 코드 추출과 사용 성공 검증은 미구현.
- `src/publisher.js`: 최초 초안 생성·postId 저장·기존 갱신. 불명확한 결과는 UNKNOWN으로 보존하고 자동 재시도를 차단. 고유 본문 표식이 정확히 하나인 기존 글만 복구 연결.
- `migrations/`: 원천 확인, 허브 postId, 갱신 시도와 동시 실행 방지 인덱스.
- `tools/connect-blogger.mjs`: Desktop OAuth JSON으로 로컬 PKCE 동의를 받고 Worker Secret에 직접 저장. 실계정 OAuth 연결 및 최초 공개 발행·갱신 완료.
- `data/coupons.json`: 공식 이미지에서 확인한 제우스 후보 1개. 사용·조건·기한 미검증으로 UNVERIFIED이며 활성 허브에서 제외.
- `drafts/`: 게임별 HTML/JSON 초안 3개. `node tools/build-drafts.mjs`로 생성한다. 실제 Blogger 생성과 구분한다.

## 실행

Node.js 24 이상, pnpm 사용. `pnpm install`, `pnpm test`, `pnpm build`, `pnpm deploy`.
Cloudflare 로그인은 `pnpm exec wrangler login`으로 진행한다. 인증정보를 소스에 넣지 않는다.

## 다음 연결

1. 허용된 공식 쿠폰 원천과 검증 방식을 확정한다. 자동 수집·추천·발행이 구현 완료된 상태가 아니다.
2. Blogger OAuth client/refresh token은 Worker Secret으로 저장한다. 비밀번호·OTP 자동입력을 사용하지 않는다.
3. 인증 및 명시적 활성화 후 `/internal/hubs/create`에 고정 hubKey를 전달하면 초안 생성과 postId 등록을 수행한다. UNKNOWN 시 5분 뒤 `/internal/hubs/reconcile`로 실제 Blogger 상태를 대조한다. 일치 없음/중복/목록 예산 초과는 잠금을 유지하며 자동 재생성하지 않는다. 실계정 허브 3개 생성·공개 전환·갱신 성공 기록은 docs/PRODUCTION_EVIDENCE.md에 있다.
4. 실제 발행 후 익명 공개 페이지를 검증한다. 현재 Cron은 한국시간 03/09/15/21시 원천 관찰만 수행한다. 스케줄의 자연 실행은 아직 관찰하지 않았다.

기존 Blogger 테마 백업은 로컬 `backups/`에 보관하며 Git에 올리지 않는다. 기존 Tistory 및 DDoRi 블로그는 변경 대상이 아니다.

공식 문서: [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/), [Blogger API](https://developers.google.com/blogger/docs/3.0/using).

