# 현재 운영 증거 · 2026-10-05

Blogger OAuth 연결 도구가 BLOGGER_CONNECTION_STORED로 종료했고 Worker health oauthConfigured=true를 확인했다. 인증정보 값은 기록하지 않았다.

Worker 직접 배포 버전: 1bee93f7-3c90-48a8-9988-fe8778ce90a6. PUBLISH_ENABLED=true이며 인증된 내부 요청만 허용한다. Cron은 계속 원천 관찰만 수행하고 자동 발행하지 않는다.

실제 Blogger 생성 3회 및 공개 전환 3회 모두 HTTP 200. 공개 전 사전 조회에서 DRAFT 상태와 서버 예상 제목·본문 일치를 확인했다. 원격 D1에서 CREATE/SUCCEEDED 3건, PUBLISH/SUCCEEDED 3건 및 hub_state LIVE 3행을 직접 확인했다.

| 게임 | 공개 게시물 |
|---|---|
| 제우스: 오만의 신 | https://lsifl.blogspot.com/2026/10/blog-post.html |
| 리니지M | https://lsifl.blogspot.com/2026/10/m.html |
| 명조:워더링 웨이브 | https://lsifl.blogspot.com/2026/10/blog-post_05.html |

세 공개 URL 모두 HTTP 200 및 '현재 검증된 쿠폰이 없습니다.' 본문을 확인했다. 미검증 후보 DEVLIVE0911은 모두 미노출이다. 제우스 게시물은 실제 브라우저에서 제목·본문 렌더링을 확인했고 backups/blogger-first-live.jpg에 로컬 증거를 저장했다.

기존 docs의 OAuth 미연결/발행 미실행/비활성 관련 내용은 이전 단계 기록이다. 이 증거가 현재 연결·최초 공개 발행 상태를 대체한다. 로컬 테스트 23개 및 a572b1f GitHub Verify 37282493260 성공 증거는 소스가 변경되지 않아 재사용한다. GitHub 자동 배포는 여전히 비활성이고 이번 배포는 Wrangler CLI로 실행했다.

남은 작업: 준비한 테마 적용과 PC/mobile 렌더링 검증, 게임 쿠폰 적용 조건 및 실제 사용 성공 검증, 입력 방법 상세 본문, 자연 Cron 실행 관찰, Google Testing OAuth 만료 정책에 맞춘 운영 연결 정리. 사용 가능한 쿠폰이 확인됐다고 보고하지 않는다.
