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

후속 갱신: 입력 안내 및 검증 기준을 3개 기존 게시물에 PATCH, 원격 UPDATE/SUCCEEDED 3건 확인. 현재 Worker 버전 d48cafbb-fc94-4531-8113-61f2bbe40b22. 상세 잔여 상태는 REMAINING_WORK.md 참고. 사용자의 테마 적용 완료 보고와 현재 Contempo Light 표시는 불일치로 기록하며 사용자 보고를 취소하지 않는다.

## OAuth 운영 전환 후속 증거

사용자 운영 전환 승인 후 홈페이지 https://lsifl.blogspot.com/ 및 도메인 lsifl.blogspot.com, 개인정보 안내 https://lsifl.blogspot.com/p/blog-page.html 을 저장했다. Google Cloud 화면의 '프로덕션 단계'를 직접 확인했다. Google 인증 심사 완료와는 구분한다. 앱은 운영자 개인용이며 민감 범위 미인증 사용자 한도는 현재 화면 기준 100명이다.

Blogger 안내 페이지 ID 4404238150170891065 공개, 실제 본문 확인. 소스 docs/oauth-privacy.html 보관. 운영 상태의 새 토큰 발급용 로컬 연결을 1회 시작하고 사용자 동의를 요청했다. 완료 전까지 기존 Testing 토큰의 장기 유효성을 보장하지 않는다.

허브 3곳에 개인정보 처리 안내 링크를 추가하고 실제 PATCH 3회 HTTP 200 확인. Worker 배포 버전 43ce8fac-cc7f-48a0-90a1-d2d47a82027b. 로컬 테스트 24개 PASS. 02c4eee의 GitHub Verify 37284960435 성공.
