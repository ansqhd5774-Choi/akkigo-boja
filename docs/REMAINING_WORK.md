# 남은 작업 점검 · 2026-10-05

## 완료 유지 — 재작업 금지

- Blogger R3 공개 테마: DONE. 공개 반영 완료. 재적용/덮어쓰기 금지.
- Blogger OAuth 연결: DONE.
- 허브 3개 최초 공개 발행 및 기존 postId 유지: DONE.
- 제우스·리니지M 입력 방법: DONE.
- 현재 게임 허브 PC1440/mobile390 공개 렌더 기본 검증: DONE.

## 이번에 코드로 완료한 기반 작업

- 여행 조건 validator: DONE.
  - 여행 종류, 지역, 예약기간, 투숙기간, 카드채널 제공자 검사.
- 할인 데이터 모델 확장: DONE.
  - CODE, AUTO_DISCOUNT, CARD_CHANNEL, MEMBER, CASHBACK, REFERRAL, GAME_REDEEM, FREEBIE.
  - FIXED_DATE, ONGOING, UNTIL_BUDGET_EXHAUSTED, UNTIL_STOCK_EXHAUSTED, UNKNOWN.
- 여행 비교 renderer: DONE.
  - 쿠폰/카드채널 예상 절감액과 최종 결제액 비교.
- 쇼핑·배달 비교 renderer: DONE.
  - 정률/정액/자동 할인 비교.
- 로컬 신규 단위테스트: 8/8 PASS.

## 실제 데이터가 필요해 남은 작업

| 항목 | 상태 | 다음 실행 |
|---|---|---|
| 여행 공식 데이터 연결 | PENDING | 허용된 공식 프로모션/카드채널 원천을 선정하고 fixture가 아닌 실제 JSON 추가 |
| 쇼핑·배달 공식 데이터 연결 | PENDING | 공식 프로모션 원천 확정 후 구조화 데이터 추가 |
| 여행/커머스 공개 비교 UI QA | PENDING | 실제 ACTIVE 데이터가 생긴 뒤 기존 테마를 덮지 않고 게시물 본문 renderer 출력으로 검증 |
| 실제 사용 가능한 게임 쿠폰 확대 | PENDING | 후보는 공식 근거+적용 범위+실사용 근거 충족 시에만 ACTIVE |
| 명조 입력 방법 | DEFERRED | 공식 메뉴 안내 근거 확인 전 단정 금지 |
| 자연 Cron 관찰 | PENDING | 수동 수집과 구분해 collection_runs의 SCHEDULED/SUCCEEDED 증거 확인 |
| GitHub CI 자동 배포 | DEFERRED | CLI 배포 정상. 필요 시 credential/변수 설정 |
| 검색 노출 운영 | PENDING | Blogger 검색 공개, Search Console, 네이버 소유확인, sitemap/RSS |
| Tistory 이전 | DEFERRED | 기존 사이트 보존. 별도 이전 정책 승인 전 미실행 |

## 운영 원칙

- TinyFish는 표준 운영 경로에서 제외하고 꼭 필요한 공개 진단 외 사용하지 않는다.
- 완료된 Blogger R3 테마를 재적용하거나 덮어쓰지 않는다.
- 실제 데이터가 없는 기능을 공개 완료로 보고하지 않는다.
- 공식 출처 HTTP 200은 쿠폰 작동 성공 증거가 아니다.
- 불명확한 publish/update 결과는 중복 재시도하지 않는다.
