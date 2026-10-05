# 문제 목록 현재 대조 · 2026-10-05

> 기존 Blogger R3 공개 테마는 안정 상태다. 다만 2026-10-06 목록 미리보기 개선 소스는 별도 승인된 후속 변경이며, Blogger 관리자에 실제 저장되기 전까지 공개 반영으로 간주하지 않는다.

| 번호 | 현재 판정 |
|---|---|
| 1 | DONE: 쿠폰 홈·검색·게임 카드 공개 반영. 전체 기능은 아래 항목별로 구분 |
| 2,4 | DONE: 공식 관리자 HTML 편집·저장·공개 검증 경로 확인. THEME_DEPLOYMENT.md |
| 3 | STOPPED: TinyFish는 표준 운영 경로에서 제외. 꼭 필요한 공개 진단 외 추가 사용 금지 |
| 5 | DONE: OAuth 운영 전환 및 실제 API 생성·공개·갱신 증거 확보 |
| 6 | DONE: `akkigo-boja`가 Blogger Worker source of truth. 기존 Tistory 저장소는 별도 보존 |
| 7 | PARTIAL: 기존 R3 테마 공개 저장은 DONE. 최신 안전 목록 미리보기 XML은 SOURCE/TEST DONE, Blogger 관리자 실제 저장은 PENDING |
| 8 | DONE: 공개 홈에 근거 없는 신뢰도 비율 없음. 계정별 직접 적용 기록과 미확인 조건 명시 |
| 9 | PARTIAL: 검색·17메뉴·확인 기록·게임 안내·최신/만료 빈 상태 반영. 실시간 자동 홈 재생성 및 인기 순위 미구현 |
| 10 | PARTIAL: 홈 코드·보상 펼치기·플랫폼·서버/만료 미확인 표시·복사·입력 안내 링크 구현 |
| 11 | PARTIAL: 여행 비교 엔진·validator + Agoda/Trip.com 공식 텍스트 후보 추출 + UNVERIFIED D1 저장 + 관리자 read-only 후보 조회 API 구현. Worker production 배포와 migration 0005 적용 완료. ACTIVE 검증은 미완료 |
| 12 | PARTIAL: 쇼핑/배달 비교 엔진 구현. 11번가 월간 십일절·패션뷰티 페스타를 서로 다른 공식 URL로 분리해 SOURCE_TEXT_ONLY/UNVERIFIED 후보 원천으로 추가. production Worker 반영 완료. 올리브영·G마켓·배달은 보류 |
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
- 2026-10-06 목록 미리보기 개선으로 Blogger Theme XML 및 `tools/build-theme.mjs` 변경이 발생했다. 기존 R3 기능을 보존하며 안전한 Jump Break 미리보기와 게임 쿠폰 요약 카드만 추가했다.

## 검증

- GitHub Verify:
  - comparison model/source 변경 PASS
  - collector source count 변경 PASS — Run 37298222331
  - travel candidate persistence 전체 Verify PASS — Run 37299403638
  - candidate review API Verify PASS — Run 37299721615
  - Agoda card-local parser fix Verify PASS — Run 37300074756
- 11st source Verify PASS — Run 37302858196; Deploy Worker skipped by guard — Run 37302858354
- GitHub Actions Deploy Worker 37308158968 SUCCESS. 테스트39/39 PASS, migration 0005 적용, Worker version 8745b13f-a21c-41b8-9ba7-62e682578a95 배포 완료.
- GSC Wizard는 현재 `payment_required`로 조회 불가. 유료 구독/결제는 실행하지 않았다.
- 공개 검색 확인에서 `site:lsifl.blogspot.com` 결과는 아직 확인되지 않았다.

## 별도 남은 작업

- Agoda/Trip.com 실제 원문에서 후보 추출을 production에서 실행하고, 후보별 조건/작동 검증 후에만 ACTIVE 승격.
- 쇼핑·배달 공식 원천 추가 조사. 현재 검토한 원천은 조건 분리가 불충분해 자동 파서 연결을 보류.
- 자연 Cron 기존4원천 성공 증거 확보: scheduled_at 2026-10-05T12:00:25Z(한국21시), SUCCEEDED/observed4/fetched4. 최신 11번가 포함 원천 전체의 자연 Cron 검증은 다음 실행부터 별도 확인.
- Worker 자동 배포 연결 완료. CLOUDFLARE_API_TOKEN Secret 단일 조건으로 운영.
- 명조 공식 입력 경로 근거 확인.
- Blogger 검색 공개 설정, Search Console·네이버 소유 확인/사이트맵/RSS.

## 2026-10-05 후속 확인
- Deploy Readiness 37303826813: deploy_enabled=false, CLOUDFLARE_ACCOUNT_ID 존재=false, CLOUDFLARE_API_TOKEN 존재=false. 값은 출력하지 않음.
- Public SEO Check 37303719852: GitHub Hosted Runner가 Blogger 요청에서 Google anti-bot 429로 차단. 공개 사이트 장애 증거로 사용하지 않음.
- 공개 검색 site:lsifl.blogspot.com: 현재 검색 결과 없음. 색인 미확정 상태 유지.
- 명조 입력 경로: 공식 Kuro Games 검색에서 교환 코드 메뉴 경로 근거를 찾지 못해 기존 DEFERRED 유지. 제3자 가이드는 공식 근거로 승격하지 않음.

## Cloudflare 자동 배포 단순화
- `CLOUDFLARE_DEPLOY_ENABLED` 별도 가드 제거.
- `CLOUDFLARE_ACCOUNT_ID` GitHub Variable 의존성 제거. 단일 계정으로 scope된 API Token이면 최신 Wrangler가 계정을 자동 선택하며, 여러 계정이면 배포 중단.
- 최신 Deploy Readiness 37306344065: `api_token_present=false`.
- Token 미설정 상태 Deploy Worker 37306340225: credential 확인만 실행, checkout/test/migration/deploy는 모두 skip, 잘못된 production 배포 0건.
- Verify: 37306340167 및 37306344141 PASS.

## 2026-10-06 게임 쿠폰 목록/표준화 후속
- 프로젝트 격리: `nutriments_blogger_r1_bundle` 잔재를 `akkigo_blogger_r1_bundle`로 이관 완료. 현재 브랜치 경로/코드 검색에서 nutriments 잔재 0건.
- 시바 글 본문: 목록 전용 안전 요약(확인된 쿠폰 수·보상·만료) 추가. 쿠폰 코드/JS는 Jump Break 뒤에만 유지.
- Publish Approved Article 37342377560 SUCCESS. postId `4686430079776725627`, URL 유지, publicVerified=true.
- Worker version `7e2413d1-b94e-408e-bfb8-668bb9e0a53f`.
- Verify 37342278067 SUCCESS: tests 50/50, build, theme regeneration clean diff, XML 3개, detail 390/1440, feed preview 390/1440 PASS.
- 게임 쿠폰 공통 템플릿 `akkigo_blogger_r1_bundle/article/game-coupon-article-r1.html` 추가.
- 남은 핵심: 최신 `akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml`의 Blogger 관리자 실제 저장과 저장 후 목록 공개 확인.
