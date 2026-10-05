# 아끼고 보자

공개 사이트: https://lsifl.blogspot.com/ · Blogger blogId: `2339978524893611480`

GitHub는 소스를 관리하고 Cloudflare Worker는 운영 실행을 담당하며 Blogger는 공개 게시물을 제공한다.

## 현재 구현

- `nutriments_blogger_r1_bundle/`: 사용자가 제공한 테마·게시물 템플릿·운영 기준. 게시물 예시를 실데이터로 발행하지 않는다.
- `src/coupons.js`: 쿠폰 근거 검증, 조건별 절감액 비교, 안전한 HTML 렌더링.
- `src/worker.js`: 공개 상태 확인 `/health`. 발행 및 수집은 아직 비활성화.
- `data/coupons.json`: 실제 확인한 쿠폰만 등록. 초기 데이터는 빈 배열.

## 실행

Node.js 22 이상, pnpm 사용. `pnpm install`, `pnpm test`, `pnpm build`, `pnpm deploy`.
Cloudflare 로그인은 `pnpm exec wrangler login`으로 진행한다. 인증정보를 소스에 넣지 않는다.

## 다음 연결

1. 허용된 공식 쿠폰 원천과 검증 방식을 확정한다. 자동 수집·추천·발행이 구현 완료된 상태가 아니다.
2. Blogger OAuth client/refresh token은 Worker Secret으로 저장한다. 비밀번호·OTP 자동입력을 사용하지 않는다.
3. 발행 상태 영구 저장소와 중복 방지·복구 구현 후 insert/update를 연결한다. 같은 브랜드는 postId를 유지한다.
4. 실제 발행 후 익명 공개 페이지를 검증하고 Cron을 활성화한다. 현재 Cron은 없음.

기존 Blogger 테마 백업은 로컬 `backups/`에 보관하며 Git에 올리지 않는다. 기존 Tistory 및 DDoRi 블로그는 변경 대상이 아니다.

공식 문서: [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/), [Blogger API](https://developers.google.com/blogger/docs/3.0/using).
