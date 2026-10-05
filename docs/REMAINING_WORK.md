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
