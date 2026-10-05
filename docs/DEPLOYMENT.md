# 배포 상태 · 2026-10-05

- GitHub: https://github.com/ansqhd5774-Choi/akkigo-boja (비공개)
- 브랜치: `codex/blogger-worker-r1`
- Cloudflare Worker: `akkigo-boja`
- 상태 URL: https://akkigo-boja.ansqhd5774.workers.dev/health
- 배포 버전: `8289b6e6-ad0f-4d0b-8a2e-a46a1ed61c41`, 배포 비중 100% 확인
- Blogger: https://lsifl.blogspot.com/ (아끼고 보자)

## 실제 확인

쿠폰 모듈 테스트 3개 PASS. Wrangler dry-run PASS. GitHub commit/push 및 Cloudflare deploy 완료.
첫 HTTP 요청은 1104였고, 배포 상태 조회 후 재확인에서 HTTP 200 및 실제 JSON 응답을 확인했다.
JSON: service=akkigo-boja, status=READY, couponCount=0, publishing=DISABLED, collection=NOT_CONFIGURED, oauthConfigured=false.

이는 Worker 상태 API의 운영 검증이다. 실제 쿠폰 수집·작동 확인·Blogger 발행 성공 증거가 아니다.
현재 GitHub push에 따른 자동 배포 연결은 없으며 Wrangler로 수동 배포했다.

## 다음 작업

공식 수집 원천 확정, Blogger OAuth 연결, postId/checkpoint 저장 및 재시도 중복 방지, 발행 후 공개 검증을 구현한다.
그 전까지 Cron과 자동 발행을 비활성화한다. 테마 적용 및 PC/mobile 렌더링 검증은 미완료다.
기본 Blogger 테마 백업은 로컬 backups/blogger-original.xml에 보관했으며 XML 문법 검사 PASS, Git 업로드 제외.

공식 기준: [Blogger API OAuth 및 게시물 갱신](https://developers.google.com/blogger/docs/3.0/using), [Worker 설정](https://developers.cloudflare.com/workers/wrangler/configuration/).
