# 남은 작업 점검 · 2026-10-05

| 항목 | 현재 상태 | 다음 실행 |
|---|---|---|
| Blogger OAuth 연결 | DONE | 실제 토큰 교환 및 Worker Secret 저장 완료 |
| 허브 3개 최초 공개 발행 | DONE | 기존 postId 유지 |
| 제우스·리니지M 입력 방법 | DONE | 공식 등록 화면 근거로 본문 보강, 실제 PATCH 3건 성공 |
| 명조 입력 방법 | DEFERRED | 공식 메뉴 안내 근거 미확인. 확인 전 메뉴/코드 단정 안 함 |
| 현재 공개 본문 PC·모바일 | DONE | 제우스 1440/390 실제 렌더링 확인, 가로 화면 크기 확인 |
| 준비한 쿠폰 테마 적용 | STATE_DISCREPANCY | 사용자 완료 응답 후 관리자 Contempo Light, 공개 custom shell 없음. 파일명/복원 안내 확인 요청 중 |
| 새 테마 PC·모바일 | PENDING | 실제 새 테마 반영 확인 후 검증 |
| 실제 사용 가능한 쿠폰 | PENDING | 후보1개 UNVERIFIED. 계정·서버 조건 및 실제 사용 성공 증거 필요 |
| 원천 관찰 Cron 자연 실행 | PENDING | D1 최신 관찰 2026-10-05T08:06:20~23Z, 수동 관찰과 구분. 한국시간 03/09/15/21 예약 |
| GitHub CI 자동 배포 | DEFERRED | CLI 직접 배포 정상. CI Token/활성화 변수 미설정 |
| 장기 OAuth 운영 | PENDING | Google Testing 토큰 만료 정책에 맞춰 운영 설정 정리 |

쿠폰 사용 검증은 게임 계정에 실제 코드 적용이 필요하므로 출처 HTTP 200만으로 완료 처리하지 않는다. 게임 로그인 정보나 CS Code를 채팅에 요구하지 않는다.

## 이번 실행 증거

Worker 버전 d48cafbb-fc94-4531-8113-61f2bbe40b22. 로컬 테스트 23개 PASS. 게임별 PATCH HTTP 200, 원격 D1 UPDATE/SUCCEEDED 3건. 공개 제우스 본문에 공식 등록 링크/입력 단계/검증 기준 렌더링 확인. 현재 테마에서 PC1440 및 모바일390 실제 화면 확인. 새 테마 검증과 구분한다.

공식 입력 근거: https://coupon.withhive.com/2352 및 https://nshop.plaync.com/shop/lms/kr/coupon . 명조 비공식 입력 안내는 사용하지 않았다.

## 후속 실행

- 예약/수동 수집 구분을 collection_runs에 저장하도록 구현했다. RUNNING/SUCCEEDED/PARTIAL/FAILED 및 처리 건수를 기록한다. 원천 접근 실패와 DB 실패를 구분한다.
- migration 0004 실제 원격 적용, Worker 3dea018b-c8aa-4328-bf8f-19f87e0ca4c6 배포. 테스트 24개 PASS, Wrangler dry-run PASS.
- 실제 수동 수집: 2026-10-05T08:38:02~04Z, MANUAL/SUCCEEDED, observed_count=4, fetched_count=4. 자연 Cron 성공 증거로 대체하지 않는다.
- 현재 사용자 Blogger 화면은 '테마 복원 중…'이다. 긴 대기만으로 실패를 판정하지 않고 중복 복원을 실행하지 않았다.
- Google Cloud OAuth 대상 화면은 '테스트 중', '앱 게시' disabled, '브랜딩 페이지에서 구성을 완료해야 합니다'를 직접 확인했다. 장기 운영 완료가 아니다. Google 공식 정책상 이 scope의 Testing refresh token은 7일 만료 대상이다.
- 명조 공식 홈페이지/공식 계정 대상 검색에서 입력 경로 근거를 확보하지 못했다. 비공식 자료로 성공을 대체하지 않는다.

## 최종 실행 점검 2026-10-05 21시 KST
- DONE: Google OAuth 프로덕션 전환 및 사용자 재동의, Worker Secret 저장. 앱 인증 심사 완료와 구분.
- DONE: 공개 허브 3개 및 개인정보 안내. 정상 Blogger 기반 테마에 본문 스타일 반영, PC1440/mobile390 제목3개 및 가로 넘침 없음 확인.
- FAILED: 원본 쿠폰 테마는 저장 후 게시물 출력 실패. 정상 기반 테마로 복원 및 최소 스타일 적용. 원본은 Git 이전 이력에서 복구 가능.
- MANUAL SUCCESS: 사용자 제우스 DEVLIVE0911 등록 성공 및 보상 수령. 특정 계정 사례이며 서버 범위·전체 계정 조건·만료 미확인, 활성 추천 제외 유지.
- BLOCKED: Cloudflare D1 계정 전체 무료 일일 읽기 한도 초과(code7500). 21시 자연 Cron 기록 확인 및 자동 게시물 갱신 차단. 수동 원천4개 성공은 앞서 직접 확인된 유효 증거로 유지.
- DEFERRED: 명조 공식 입력 경로 미확인, GitHub 자동 배포 credential 미설정. CLI 배포 및 GitHub Verify는 완료.
- NEXT: D1 한도 UTC 자정(한국시간 다음날09시) 초기화 후 기존 checkpoint 확인부터 재개. 유료 전환하지 않음. 자연 Cron 성공은 미확인으로 유지.

제우스 사용자 확인 기록 공개 반영 DONE(HTTP200 실제 본문). UPDATE 오류와 실제 반영 간 discrepancy는 D1 저장 실패로 분리하며 중복 갱신 금지.

## 결제 후 재개 · 2026-10-05 18:15 KST
- D1 실제 읽기·쓰기 성공: 무료 한도 차단 해제 확인. 결제 플랜 명칭은 별도 대시보드 조회하지 않음.
- 제우스 기존 UPDATE attempt 7d92a975-c256-4991-9e5e-08be719ca744의 공개 본문에서 코드·사용자 수령 확인·계정 범위 안내를 재확인한 뒤 SUCCEEDED로 조정. Blogger PATCH 재실행 없음.
- 실제 MANUAL 수집 2026-10-05T09:14:48.594Z~09:14:52.038Z, SUCCEEDED, observed4/fetched4. 원천별 HTTP200 및 D1 기록 확인.
- 리니지M·명조 기존 게시물 PATCH 각1회 HTTP200, D1 UPDATE/SUCCEEDED 확인. 공개3곳 모두 HTTP200·최신 확인 기준·개인정보 안내 확인.
- unresolved publish_attempts(RUNNING/UNKNOWN) 0건. 코드·환경 변경 없음, 이전25개 테스트/GitHub Verify37287660186 성공 증거 재사용. 재배포 불필요.
- 0 */6 * * *는 UTC 기준으로 한국시간03/09/15/21 실행. 이전 문서의 21시 표기는 잘못된 시간대 변환으로, 당시09UTC는18시KST다. 다음 자연 Cron은10월5일21시KST. 수동 재수집을 자연 Cron 성공으로 보고하지 않는다.
- 잔여: 자연 Cron 성공 기록 관찰, GitHub CI 자동 배포 credential 설정, 명조 공식 입력 근거. 정상 기반 테마와 공개 운영은 유지. 원본 테마 실패 기록은 대체 테마의 성공과 구분.

수동 처리 완료: 수집4개·D1저장·CLI배포 성공, 수동 운영 스크립트 및 안내 추가. GitHub Verify 수동 실행 지원. 명조 입력 경로 공식 근거 미확인 유지. 예약실행 대신 수동 실제 수집 검증 완료; 자연Cron은 별도 관찰 항목.
