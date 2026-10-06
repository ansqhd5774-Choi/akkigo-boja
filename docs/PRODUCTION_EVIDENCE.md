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

프로덕션 상태 재연결 완료: 사용자 동의 후 BLOGGER_CONNECTION_STORED 종료 코드0, Worker oauthConfigured=true. 새 토큰은 운영 상태에서 발급됐으며 영구 유효성 보장은 하지 않는다. health publishing=ENABLED 유지 확인. 연결 도구의 이전 PUBLISHING_REMAINS_DISABLED 출력은 실제 설정 변경을 의미하지 않는 잘못된 안내여서 PUBLISH_SETTING_UNCHANGED로 정정했다. GitHub 28af3dd Verify 37285815511 성공.

## 최종 실행 점검 2026-10-05 21시 KST
- DONE: Google OAuth 프로덕션 전환 및 사용자 재동의, Worker Secret 저장. 앱 인증 심사 완료와 구분.
- DONE: 공개 허브 3개 및 개인정보 안내. 정상 Blogger 기반 테마에 본문 스타일 반영, PC1440/mobile390 제목3개 및 가로 넘침 없음 확인.
- FAILED: 원본 쿠폰 테마는 저장 후 게시물 출력 실패. 정상 기반 테마로 복원 및 최소 스타일 적용. 원본은 Git 이전 이력에서 복구 가능.
- MANUAL SUCCESS: 사용자 제우스 DEVLIVE0911 등록 성공 및 보상 수령. 특정 계정 사례이며 서버 범위·전체 계정 조건·만료 미확인, 활성 추천 제외 유지.
- BLOCKED: Cloudflare D1 계정 전체 무료 일일 읽기 한도 초과(code7500). 21시 자연 Cron 기록 확인 및 자동 게시물 갱신 차단. 수동 원천4개 성공은 앞서 직접 확인된 유효 증거로 유지.
- DEFERRED: 명조 공식 입력 경로 미확인, GitHub 자동 배포 credential 미설정. CLI 배포 및 GitHub Verify는 완료.
- NEXT: D1 한도 UTC 자정(한국시간 다음날09시) 초기화 후 기존 checkpoint 확인부터 재개. 유료 전환하지 않음. 자연 Cron 성공은 미확인으로 유지.

제우스 갱신 요청은 오류 응답이었으나 실제 Blogger 편집 화면 및 공개 HTTP200 본문에서 DEVLIVE0911 사용자 성공 기록 반영을 확인했다. API 반영 후 D1 저장 실패 가능성이 확인되므로 반복 PATCH하지 않는다. checkpoint는 한도 초기화 후 조정 필요. 수동 GUI 추가 저장은 실행하지 않았다.

최종 Worker 소스 배포 46c8ebaf-bda4-469c-939c-24e7c1011889, 예약설정 유지. 사용자 성공 사례와 활성 추천을 분리하는 회귀 검사 추가, 로컬25개PASS.

## 결제 후 재개 · 2026-10-05 18:15 KST
- D1 실제 읽기·쓰기 성공: 무료 한도 차단 해제 확인. 결제 플랜 명칭은 별도 대시보드 조회하지 않음.
- 제우스 기존 UPDATE attempt 7d92a975-c256-4991-9e5e-08be719ca744의 공개 본문에서 코드·사용자 수령 확인·계정 범위 안내를 재확인한 뒤 SUCCEEDED로 조정. Blogger PATCH 재실행 없음.
- 실제 MANUAL 수집 2026-10-05T09:14:48.594Z~09:14:52.038Z, SUCCEEDED, observed4/fetched4. 원천별 HTTP200 및 D1 기록 확인.
- 리니지M·명조 기존 게시물 PATCH 각1회 HTTP200, D1 UPDATE/SUCCEEDED 확인. 공개3곳 모두 HTTP200·최신 확인 기준·개인정보 안내 확인.
- unresolved publish_attempts(RUNNING/UNKNOWN) 0건. 코드·환경 변경 없음, 이전25개 테스트/GitHub Verify37287660186 성공 증거 재사용. 재배포 불필요.
- 0 */6 * * *는 UTC 기준으로 한국시간03/09/15/21 실행. 이전 문서의 21시 표기는 잘못된 시간대 변환으로, 당시09UTC는18시KST다. 다음 자연 Cron은10월5일21시KST. 수동 재수집을 자연 Cron 성공으로 보고하지 않는다.
- 잔여: 자연 Cron 성공 기록 관찰, GitHub CI 자동 배포 credential 설정, 명조 공식 입력 근거. 정상 기반 테마와 공개 운영은 유지. 원본 테마 실패 기록은 대체 테마의 성공과 구분.

수동 운영 도구 tools/manual-operations.ps1 추가. Status/Collect 실제 실행, 원천4개HTTP200 및 MANUAL/SUCCEEDED 저장 확인. Deploy 실제 실행: 테스트25개PASS, 배포081edc99-81e2-4d59-89c9-a66982f74ea3 및 기존Cron설정 확인. Verify workflow_dispatch 지원 추가. GitHub 자동 배포 credential 미연결은 수동 CLI 배포로 대체하며 자연Cron 성공과 구분한다.

R3 홈 실제 배포: 공식 HTML 편집기 직접 저장, 공개 ncp-coupon-home·검색·17카테고리·사용자 확인 코드·보상·게임 링크·최신/만료 빈 상태 확인. 정상 native Blog 위젯 보존, 기존 제우스 본문 유지. PC1440/390 overflow없음, 복사 후 실제 붙여넣기코드일치, 검색 제우스 결과, 보상 펼치기 성공. 로컬 backups/r3-pc-1440.jpg 및 r3-mobile-390.jpg 증거. 전체 문제 해결과 구분.


## GitHub Actions 자동 배포 연결 · 2026-10-05
- Deploy Worker run 37308158968 SUCCESS.
- 대상 SHA 7ef466f486ccd77029dc8823a670f1675743575c.
- tests 39/39 PASS, fail 0.
- remote migration 0005_coupon_candidates.sql 적용 성공.
- Worker version 8745b13f-a21c-41b8-9ba7-62e682578a95, D1 binding·Blogger vars·cron 0 */6 * * * 확인.
- CLOUDFLARE_API_TOKEN은 GitHub Secret으로 사용됐고 값은 기록하지 않음.
- 2026-10-05T12:00:25Z(한국21시) 자연 Cron은 SUCCEEDED/observed4/fetched4. 최신 소스 배포 이전 실행이므로 신규 원천 전체 성공 증거로 확대하지 않음.
- Blogger R3 테마 변경 0건.


## 시바 모험단 신규 게임 글 공개 · 2026-10-05
- 사용자 명시 승인 후 일반 게시물 전용 idempotent 발행 경로를 추가.
- 최초 발행 요청은 Worker route 405로 Blogger 단계 진입 전 실패. D1 article_state/article_publish_attempts 모두 빈 상태를 확인한 뒤 route 정규화 후 1회 재시도.
- Publish Approved Article run 37311517129 SUCCESS, tests43/43 PASS.
- Blogger postId 4686430079776725627, URL https://lsifl.blogspot.com/2026/10/pick7p2y.html
- Worker 공개 fetch 검증 publicVerified=true.
- D1 article_state LIVE 및 article_publish_attempts CREATE_PUBLISH/SUCCEEDED 확인.
- 쿠폰 pick7p2y는 공식 발급 정보 확인 상태이나 실제 계정 사용 성공은 미확인이라 data/coupons.json에서 UNVERIFIED 유지.
- Blogger R3 테마 변경 0건.


## 시바 안전 목록 요약 및 Worker 배포 · 2026-10-06
- Publish Approved Article run 37342377560 SUCCESS.
- tests 50/50 PASS, D1 migration 단계 PASS, Worker deploy PASS.
- Worker version: 7e2413d1-b94e-408e-bfb8-668bb9e0a53f.
- 기존 Blogger postId 4686430079776725627 / URL https://lsifl.blogspot.com/2026/10/pick7p2y.html 유지.
- 공개 상세 본문에 data-ncp-feed-preview 표식과 최신 상세 UI가 존재하며 publicVerified=true.
- 목록 요약에는 코드 pick7p2y와 JavaScript를 넣지 않고, 확인된 쿠폰 수·보상·만료만 배치했다.
- 최신 목록 테마 source는 검증됐지만 Blogger 관리자 저장은 아직 확인되지 않았다. 따라서 공개 라벨/검색 목록의 새 카드 반영은 별도 PENDING이다.


## 컴투스프로야구V26 신규 쿠폰 글 공개 · 2026-10-06
- 공식 원천: 컴투스프로야구V26 공식 커뮤니티 `쿠폰 모아보기` 2026-10-02 최신화.
- 중복 확인: 저장소 및 공개 검색에서 동일 검색 의도 글 없음.
- 쿠폰 6개 저장: STARTWITHGENIE / TRAININGSTART / V26STARTPACK / CPBVFULLMOON / V26A7K9P3XQ2 / CPBVKDYPARTY.
- 쿠폰 데이터는 공식 코드·보상·사용기한·입력 경로 확인 상태이며, 실제 계정 사용 성공은 별도 확인하지 않아 내부 상태 `UNVERIFIED` 유지.
- Verify 37452904029 SUCCESS, 후속 Publish commit Verify 37453006019 SUCCESS, 최종 Publish commit Verify 37453216474 SUCCESS.
- Publish Approved Article 37453216445: tests PASS, D1 migration PASS, Worker deploy PASS, OIDC PASS, Blogger 공개 발행 PASS.
- Worker version `1f9afd25-5a2e-46bd-a301-3bc0a4b8c1fb`.
- Blogger postId `4618248412018847849`.
- 공개 URL: https://lsifl.blogspot.com/2026/10/v26-2026-10.html
- Worker 공개 검증 `publicVerified=true`.
- 목록 미리보기에는 쿠폰 코드를 넣지 않고 확인된 쿠폰 수·다음 만료·최장 만료만 표시.


## 트릭컬 리바이브 신규 쿠폰 글 공개 · 2026-10-06
- 중복 확인: 저장소 및 공개 검색에서 동일 검색 의도 글 없음.
- 최근 쿠폰 2개 정리: GOOGLETOP3 / 3RDBOLTHDAY.
- GOOGLETOP3: 교주의 빛무리 선택권 1개 + 참! 잘했어요 333개, 2026-10-22 10:59까지.
- 3RDBOLTHDAY: 엘리프 927개 + 영원살이 일곱자매 선택권 1개, 2026-10-22 10:59까지.
- 공식 네이버 게임 라운지 쿠폰 게시판과 공식 채널을 우선 원천으로 사용. 실제 계정 사용 성공은 별도 확인하지 않아 내부 상태 `UNVERIFIED` 유지.
- Article source Verify 37454579644 SUCCESS, Deploy Worker 37454579656 SUCCESS.
- Publish Approved Article 37454686035 SUCCESS: tests PASS, D1 migration PASS, Worker deploy PASS, OIDC PASS, Blogger 공개 발행 PASS.
- Worker version `e39a1367-dddb-4a12-953a-00c59837d9e0`.
- Blogger postId `4891814108367830529`.
- 공개 URL: https://lsifl.blogspot.com/2026/10/2026-10.html
- Worker 공개 검증 `publicVerified=true`.
- 목록 미리보기에는 쿠폰 코드를 넣지 않고 쿠폰 수·대표 보상·만료 정보만 표시.


## 브라운더스트2 신규 쿠폰 글 공개 · 2026-10-06
- 중복 확인: 저장소 및 공개 검색에서 동일 검색 의도 글 없음.
- 공식 10월 월간 쿠폰 코드 `2026BD2OCT` 확인. Android 게임 내 [기타] → [쿠폰 등록], 공식 웹 쿠폰 입력 페이지 경로 및 계정당 1회 조건 확인.
- 보상 `1회 뽑기권 3개`는 공개 쿠폰 DB 2곳에서 교차 확인. 공식 라운지 접근 텍스트에는 보상 수량이 직접 노출되지 않아 실제 계정 사용 성공과 함께 내부 상태는 `UNVERIFIED` 유지.
- 사용기한: 2026-10-31 23:59 KST.
- 최초 Publish 37455890507 / Verify 37455890549는 `sourceCheckedAt`이 CI 실행시각보다 미래로 저장되어 `INVALID_CHECK_TIME`에서 실패. Blogger/D1/Worker 변경 단계 진입 전 중단되어 공개 mutation 없음.
- 확인 시각 정정 후 Verify 37456270052 SUCCESS.
- 재발행 Publish Approved Article 37456353584 SUCCESS: tests PASS, D1 migration PASS, Worker deploy PASS, OIDC PASS, Blogger 공개 발행 PASS.
- 동시 Verify 37456353797 SUCCESS.
- Worker version `1b080005-d68e-4122-afe2-d3f4706e0b4d`.
- Blogger postId `1806229069030793005`.
- 공개 URL: https://lsifl.blogspot.com/2026/10/2-2026-10.html
- Worker 공개 검증 `publicVerified=true`.
- 목록 미리보기에는 쿠폰 코드를 넣지 않고 쿠폰 수·보상·만료 정보만 표시.
