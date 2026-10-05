# 문제 목록 현재 대조 · 2026-10-05

> 현재 Blogger R3 테마는 공개 반영 완료 상태다. 이후 작업은 테마 재적용 없이 Worker/데이터/검증/콘텐츠 연결만 진행한다.

| 번호 | 현재 판정 |
|---|---|
| 1 | DONE: 쿠폰 홈·검색·게임 카드 공개 반영. 전체 기능은 아래 항목별로 구분 |
| 2,4 | DONE: 공식 관리자 HTML 편집·저장·공개 검증 경로 확인. THEME_DEPLOYMENT.md |
| 3 | STOPPED: TinyFish는 표준 운영 경로에서 제외. 꼭 필요한 공개 진단 외 추가 사용 금지 |
| 5 | DONE: OAuth 운영 전환 및 실제 API 생성·공개·갱신 증거 확보 |
| 6 | DONE: `akkigo-boja`가 Blogger Worker source of truth. 기존 Tistory 저장소는 별도 보존 |
| 7 | DONE: 현재 최종 XML Blogger 저장 및 공개 홈/게시물 확인. 완료 테마를 덮어쓰지 않음 |
| 8 | DONE: 공개 홈에 근거 없는 신뢰도 비율 없음. 계정별 직접 적용 기록과 미확인 조건 명시 |
| 9 | PARTIAL: 검색·17메뉴·확인 기록·게임 안내·최신/만료 빈 상태 반영. 실시간 자동 홈 재생성 및 인기 순위 미구현 |
| 10 | PARTIAL: 홈 코드·보상 펼치기·플랫폼·서버/만료 미확인 표시·복사·입력 안내 링크 구현 |
| 11 | PARTIAL: 여행 비교 엔진·validator + Agoda/Trip.com 공식 텍스트 후보 추출 + UNVERIFIED D1 저장 구조 구현. 실제 Worker 배포·원격 migration·ACTIVE 검증은 미완료 |
| 12 | PARTIAL: 쇼핑/배달 정률·정액·자동할인 절감액 비교 엔진 구현. 실제 공식 쇼핑/배달 데이터 연결은 미구현 |
| 13 | DONE: 쿠폰 데이터→일반/여행/커머스 HTML renderer 구현. 기존 게임 허브 renderer와 공존 |
| 14 | DONE: 상태·출처·날짜·게임 보상 + offerType/endMode + 여행 validator + 후보 저장/중복방지 회귀 구현. 기존 게임 회귀 유지, GitHub Verify PASS |
| 15 | PARTIAL: 17메뉴 출력 확인, 현재 실제 콘텐츠는 게임 Label 중심. 빈 Label 등록 성공으로 처리하지 않음 |
| 16 | DEFERRED: Tistory 이전 미실행·기존 사이트 보존. 별도 이전 정책 필요 |
| 17 | PARTIAL: 현재 홈 PC1440/mobile390 overflow 없음, 복사·검색·보상 펼치기 성공. 여행/커머스 실제 ACTIVE 데이터가 없으므로 신규 비교 UI 공개 QA는 미실행 |
| 18 | 유지: 저장·배포·공개 화면 검증을 분리. 전체 완료 아님 |

## 이번 후속 작업

- `src/coupons.js` 확장: `CODE / AUTO_DISCOUNT / CARD_CHANNEL / MEMBER / CASHBACK / REFERRAL / GAME_REDEEM / FREEBIE` offer type 지원.
- 종료 조건: `FIXED_DATE / ONGOING / UNTIL_BUDGET_EXHAUSTED / UNTIL_STOCK_EXHAUSTED / UNKNOWN` 지원.
- 여행: 종류·지역·예약기간·투숙기간·카드채널 제공자 검증 및 최종 결제액 비교 renderer 추가.
- 쇼핑/배달: 정률·정액·자동할인 예상 절감액/최종가 비교 renderer 추가.
- 공식 여행 원천: Agoda Deals, Trip.com 2026 국내여행 프로모션을 `data/sources.json` 관찰 대상으로 추가.
- `extractCandidates()` 추가: 공식 페이지 텍스트에서 혜택 후보만 추출하고 `SOURCE_TEXT_ONLY` / `UNVERIFIED`로 유지.
- migration `0005_coupon_candidates.sql`: 후보를 별도 D1 테이블에 저장하고 재관찰 시 동일 후보 중복 생성을 방지.
- 수집 테스트의 원천 건수 하드코딩 제거. 설정된 sources 길이에 자동 대응.
- 기존 게임 데이터/허브와 하위 호환 유지.
- Blogger Theme XML 및 `tools/build-theme.mjs` 변경 0건.

## 검증

- GitHub Verify:
  - comparison model/source 변경 PASS
  - collector source count 변경 PASS — Run 37298222331
  - travel candidate persistence 전체 Verify PASS — Run 37299403638
- Deploy Worker는 `CLOUDFLARE_DEPLOY_ENABLED` 가드로 skipped. migration 0005와 candidate collector는 아직 production Worker/D1에 반영되지 않았다.
- GSC Wizard는 현재 `payment_required`로 조회 불가. 유료 구독/결제는 실행하지 않았다.
- 공개 검색 확인에서 `site:lsifl.blogspot.com` 결과는 아직 확인되지 않았다.

## 별도 남은 작업

- Agoda/Trip.com 실제 원문에서 후보 추출을 production에서 실행하고, 후보별 조건/작동 검증 후에만 ACTIVE 승격.
- 쇼핑·배달의 허용된 공식 원천 확정 및 실제 데이터 연결.
- 자연 Cron 성공 기록 관찰.
- Worker 배포 credential/활성화 여부 확정 후 source 변경 운영 반영.
- 명조 공식 입력 경로 근거 확인.
- Blogger 검색 공개 설정, Search Console·네이버 소유 확인/사이트맵/RSS.
