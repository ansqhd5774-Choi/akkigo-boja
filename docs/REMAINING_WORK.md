# 남은 작업 점검 · 2026-10-05

## 완료 유지 — 재작업 금지

- 기존 Blogger R3 공개 테마: DONE. 최신 목록 미리보기 후속 XML은 SOURCE/TEST DONE, 관리자 실제 저장 PENDING. 승인된 최신 XML 외 임의 재적용 금지.
- Blogger OAuth 연결: DONE.
- 허브 3개 최초 공개 발행 및 기존 postId 유지: DONE.
- 제우스·리니지M 입력 방법: DONE.
- 현재 게임 허브 PC1440/mobile390 공개 렌더 기본 검증: DONE.
- TinyFish 관리자 자동화: STOPPED. 표준 운영 경로에서 제외.

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
- 공식 여행 원천 관찰 source 추가: DONE.
  - Agoda Deals
  - Trip.com 2026 국내여행 프로모션
- 공식 여행 텍스트 후보 추출: SOURCE DONE.
  - 추출 결과는 `SOURCE_TEXT_ONLY`, `UNVERIFIED` 고정.
  - 플랫폼/대상/지역을 확인할 수 없으면 추정하지 않고 hint/UNCONFIRMED로 저장.
- D1 candidate 저장/중복방지: SOURCE DONE.
  - migration `0005_coupon_candidates.sql`
  - 동일 후보 재관찰 시 row 증가 없이 `last_seen_at`/payload 갱신.
- 수집 테스트 원천 건수 하드코딩 제거: DONE.
- GitHub Verify: PASS.
  - source-count run: 37298222331
  - candidate persistence run: 37299403638
  - candidate review API run: 37299721615
  - Agoda card-local parser fix run: 37300074756
- 11st source Verify PASS — Run 37302858196. production 반영은 아직 아님.
- Deploy workflow 단순화 PASS: `CLOUDFLARE_DEPLOY_ENABLED` 제거, account ID는 단일 계정-scoped token에서 Wrangler 자동 선택. Token 미설정 상태에서 Deploy Worker 37306340225는 실제 배포 단계를 안전하게 모두 skip. Verify 37306340167/37306344141 PASS.
- Blogger 테마 후속 변경: SOURCE DONE. 안전한 목록 요약, Jump Break 보호, 복사 UX 보존, `akkigo_blogger_r1_bundle` 경로 격리 완료.

## 실제 운영 데이터가 필요해 남은 작업

| 항목 | 상태 | 다음 실행 |
|---|---|---|
| Agoda/Trip.com 구조화 추출 | PROD CODE DEPLOYED / DATA REVIEW PENDING | parser·UNVERIFIED 저장 코드와 migration 0005 production 반영 완료. 실제 최신 후보 행을 관리자 read-only 조회로 검토 필요 |
| 여행 ACTIVE 검증 | PENDING | production candidate를 관리자 read-only `/internal/candidates`로 검토해 최소금액·한도·대상·지역·플랫폼·작동 근거를 확보한 항목만 ACTIVE 승격 |
| 쇼핑·배달 공식 데이터 연결 | SHOPPING SOURCE DONE / DELIVERY PENDING | 11번가 10월 월간 십일절과 패션뷰티 페스타 공식 원천을 별도 URL로 분리해 SOURCE_TEXT_ONLY/UNVERIFIED 후보 parser 연결 및 production 배포 완료. 올리브영·G마켓·배달 원천은 기존 보류 유지. 실제 발급/작동 확인 전 ACTIVE 승격 금지 |
| 여행/커머스 공개 비교 UI QA | PENDING | 실제 ACTIVE 데이터가 생긴 뒤 기존 테마를 덮지 않고 게시물 본문 renderer 출력으로 검증 |
| 실제 사용 가능한 게임 쿠폰 확대 | PARTIAL | 시바 모험단 pick7p2y 공식 발급 글은 신규 공개 완료. 실제 계정 사용 성공은 미확인이라 UNVERIFIED 유지. 공식 근거+적용범위+실사용 근거 충족 시에만 ACTIVE |
| 명조 입력 방법 | DEFERRED | 공식 메뉴 안내 근거 확인 전 단정 금지 |
| 자연 Cron 관찰 | PARTIAL DONE | 2026-10-05 21시 KST 기존4원천 SCHEDULED/SUCCEEDED observed4/fetched4 확인. 최신 추가원천이 포함된 다음 자연 Cron은 별도 확인 필요 |
| Worker 자동 배포 | DONE | CLOUDFLARE_API_TOKEN Secret 연결 완료. Deploy Worker 37308158968 SUCCESS, tests39/39, migration0005, Worker deploy 완료. 별도 account ID/deploy-enable 변수 불필요 |
| 검색 노출 운영 | AUTOMATION_BLOCKED/PENDING | GitHub Hosted Runner가 Blogger 접근 시 Google GOOGLE_ANTI_BOT_429로 차단됨(Public SEO Check 37303719852). 사이트 장애로 판정하지 않음. site:lsifl.blogspot.com 공개 검색 결과는 아직 없음. Search Console 무료 공식 화면에서 소유/사이트맵 확인 필요 |
| 네이버 등록 | PENDING | 소유확인 및 sitemap/RSS 제출 |
| Tistory 이전 | DEFERRED | 기존 사이트 보존. 별도 이전 정책 승인 전 미실행 |

## 운영 원칙

- 완료된 Blogger R3 테마를 재적용하거나 덮어쓰지 않는다.
- TinyFish는 꼭 필요한 공개 진단 외 사용하지 않는다.
- 실제 데이터가 없는 기능을 공개 완료로 보고하지 않는다.
- 쿠폰적용가/세일가의 가격 차이를 개별 쿠폰 할인액으로 역산하지 않는다.
- 공식 출처 HTTP 200은 쿠폰 작동 성공 증거가 아니다.
- 외부 사이트에서 발견한 코드는 공식/허용 근거 없이 ACTIVE로 올리지 않는다.
- 불명확한 publish/update 결과는 중복 재시도하지 않는다.
- 유료 구독/플랜 전환은 사용자 승인 없이 하지 않는다.

## 2026-10-06 현재 남은 핵심 작업
| 항목 | 상태 | 다음 실행 |
|---|---|---|
| 게임 목록 카드 최신 테마 적용 | SOURCE/TEST DONE · ADMIN APPLY PENDING | 현재 Blogger 테마 백업 후 `akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml`을 공식 HTML 편집기에서 1회 저장 |
| 목록 공개 확인 | PENDING | 게임 라벨/검색에서 시바 카드가 확인된 쿠폰 1개 · 시바 코인 10개 · 10월6일 오전9시로 표시되고 코드/JS가 노출되지 않는지 확인 |
| 게임 쿠폰 공통 표준 | SOURCE DONE | `article/game-coupon-article-r1.html`을 신규 게임 renderer 기준으로 재사용. 기존 게시물 URL/postId는 변경하지 않음 |
| 프로젝트 명칭 격리 | DONE | `nutriments` 경로/코드 잔재 0건 유지 |

시바 상세 글 자체의 안전 요약 마크업 PATCH와 Worker 배포는 완료됐다(Publish 37342377560, publicVerified=true). 테마 관리자 저장 전에는 목록 공개 완료로 보고하지 않는다.
