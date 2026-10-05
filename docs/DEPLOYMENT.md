# 배포 상태 · 2026-10-05

- GitHub: https://github.com/ansqhd5774-Choi/akkigo-boja (비공개)
- 브랜치: `codex/blogger-worker-r1`
- Cloudflare Worker: `akkigo-boja`
- 상태 URL: https://akkigo-boja.ansqhd5774.workers.dev/health
- 현재 배포 버전: `68598e69-c466-46fd-a4c2-c386375ae186` (Wrangler 직접 배포)
- D1: `akkigo-boja-state`, migration 3개 적용, 원천 관찰 4행 실제 저장 확인
- Blogger: https://lsifl.blogspot.com/ (아끼고 보자)

## 실제 확인

로컬 테스트 11개 PASS. GitHub af6d378의 Verify 실행 37278793073 install/test/build 성공. commit/push 및 Cloudflare deploy 완료.
실제 Worker에서 공식 페이지 3곳 수집 후 HTTP 200 및 D1 원격 저장 3행을 확인했다. 저장 시각은 2026-10-05T07:31:57~59Z, 각 본문 해시 길이 64이다.
현재 health: service=akkigo-boja, status=READY, couponCount=1, unverifiedCouponCount=1, publishing=DISABLED, collection=SOURCE_OBSERVATION_ONLY, stateStorage=D1_BOUND, oauthConfigured=false.
현재 코드 기준 로컬 테스트 23개 PASS. GitHub 71b287e Verify 37281752787은 당시 테스트 20개 및 build 성공. 원천 관찰은 4곳 모두 HTTP 200, 제우스는 SOURCE_FETCHED_IMAGE_REVIEW_REQUIRED로 기록한다. 실제 D1 hub_state 및 publish_attempts는 각각 0행이므로 Blogger 생성/갱신 실행 완료로 간주하지 않는다.
비인증 수집 POST는 401, 인증된 발행 요청도 비활성 상태에서는 409 PUBLISH_DISABLED이다.

이는 Worker 상태 API 및 원천 관찰/저장의 운영 검증이다. 쿠폰 코드 추출·사용 성공·Blogger 발행 증거가 아니다.
GitHub 자동 배포 workflow는 migration 후 deploy 순서로 준비됐다. API Token 및 활성화 변수 미설정으로 실행 37278792990은 skipped. 실제 배포는 기존 Cloudflare CLI 로그인으로 수행했다.

## 다음 작업

Blogger OAuth 연결, 최초 허브 생성의 실계정 실행, 쿠폰 코드 자동 추출·사용 검증, 공개 발행의 실계정 실행과 공개 확인이 남았다. 최초 초안 생성·postId 저장·복구와 기존 갱신 모듈은 fixture 검증 완료이며 실계정 실행은 미완료다.
Cron은 원천 관찰만 한국시간 03/09/15/21시에 수행한다. 자연 스케줄 실행은 아직 관찰하지 않았다. 자동 발행은 비활성이다. 테마 적용 및 PC/mobile 렌더링 검증은 미완료다.
기본 Blogger 테마 백업은 로컬 backups/blogger-original.xml에 보관했으며 XML 문법 검사 PASS, Git 업로드 제외.

공식 기준: [Blogger API OAuth 및 게시물 갱신](https://developers.google.com/blogger/docs/3.0/using), [Worker 설정](https://developers.cloudflare.com/workers/wrangler/configuration/).

배포된 공개 전환 경로: 비인증 POST 401, 인증 POST 409 PUBLISH_DISABLED 직접 확인. 실제 Google 발행 요청은 실행하지 않았다.

