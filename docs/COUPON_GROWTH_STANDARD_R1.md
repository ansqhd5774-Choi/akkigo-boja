# 아끼고 보자 — 검색·쿠폰·홍보 운영 기준 R1

사용자 적용 요청: 2026-10-10. 기존 작성 계약·공통 생성기·postId·URL·카드 디자인 유지. 여행 전용 구성·콘텐츠 개수 목표는 적용하지 않는다.

## 63개 적용 기준

| ID | 기준 | 실행 명세 |
|---:|---|---|
| 1 | 검색 의도 | 원고에 대상 게임/브랜드와 독자 질문을 적고 제목·도입·본문 일치 확인 |
| 2 | 즉답 | 첫 화면에 코드·확인 상태·주요 조건 제공. 긴 근거는 정보 버튼/후속 설명 |
| 3 | 기존 글 우선 | 원장과 공개 상태로 같은 대상 존재 확인. 기존 postId/URL PATCH 우선 |
| 4 | 유형별 구성 | 게임은 공통 기간 생성기, 할인·가입은 대상/할인/조건/기간 구조. 임의 CSS 복제 금지 |
| 5 | 실용 정보 | 입력 경로·계정·서버·중복 등록·우편함·오류 해결을 확인된 근거로 작성 |
| 6 | 관련 글 | 다음 질문을 해결하는 공개 URL에 설명형 앵커. 무관한 링크 채우기 금지 |
| 7 | 허브 | 카테고리/게임/브랜드별 링크 제공. /search 차단을 전체 해제하기보다 탐색 경로 검증 |
| 8 | 코드 근거 | 각 코드·보상·조건에 출처 URL/명칭/원문 날짜 연결 |
| 9 | 수정 이력 | 주요 수정은 대상 키·변경 이유·근거·적용일을 원장 또는 Git에 기록 |
| 10 | 출처 유형 | 공식 공지·공식 입력·제3자 목록·계정 사용 보고를 구분 |
| 11 | 사용 증거 | 실제 입력 성공은 해당 조건·계정의 보고. 복사 성공·HTTP 200과 구분 |
| 12 | 대상 조건 | 서버·국가·플랫폼·신규/기존·기간을 기록. 결측은 미확인 |
| 13 | 보상/만료 | 원문에서 확인된 값만 기재. 종료 공지와 제3자 만료 보고 분리 |
| 14 | 근거 충돌 | 대상·시점·조건 비교, 우선 근거와 미해결 차이를 기록. 임의 선택 금지 |
| 15 | 조회 실패 | timeout/403/429는 접근 미확인. 만료·정보 변경으로 승격 금지 |
| 16 | 날짜 | 원문 게시일·자료 확인일·실제 수정일·만료일 구분. null과 날짜 0 대체 금지 |
| 17 | 재검토 | 종료 임박/충돌/조건 변경 우선. 안정된 정보는 후순위. 다음 검토일·상태 관리 |
| 18 | 변경 후보 | 원문 변경 감지→후보→검토→반영. 수집 시각만으로 내용 갱신 금지 |
| 19 | lastmod | 실제 공개 내용 변경에만 갱신. 플랫폼 자동 날짜는 실제 수정 작업과 대조 |
| 20 | Google | 소유 속성·사이트맵·대표 URL 검사·제외 사유·성과 확인. 요청과 색인 분리 |
| 21 | Naver | 소유 확인·사이트맵/RSS·수집/진단 확인. 태그 존재만으로 등록 성공 금지 |
| 22 | Bing | 실제 속성·사이트맵·색인/성과 확인. 존재 증거 없으면 미검증 |
| 23 | IndexNow | Blogger/제출 경로 지원·호스트 검증 가능성 확인 후 적용. Google 알림 대체로 쓰지 않음 |
| 24 | 상태 | REGISTERED/SUBMITTED/CRAWLED/INDEXED/IMPRESSIONS/CLICKS를 각각 기록 |
| 25 | 메타정보 | 화면 제목 유지, 검색용 title/description 고유성·사실성·공개 반영 확인 |
| 26 | 대표 URL | canonical·내부 링크·사이트맵 비교. Google 선택 canonical은 Provider에서 별도 확인 |
| 27 | 차단 | robots 경로, meta robots/googlebot, X-Robots-Tag 확인. sitemap의 noindex와 글 차단 구분 |
| 28 | 사이트맵 | 공개 원장 집합과 대표 URL 비교. 중복·미발행·리디렉션·오류 URL 제외 |
| 29 | 오류 | HTTP·본문·최종 주소·체인 확인. soft 404/403/429/5xx를 구분 |
| 30 | 봇 렌더링 | GSC 실시간 HTML/화면에서 핵심 코드·출처·일반 링크 확인 |
| 31 | JSON-LD | 문법 및 화면 내용 일치 확인. WebSite는 홈, Article/Breadcrumb는 지원 목적에 맞게 적용 |
| 32 | 브랜드 | 이름·alternateName·소개·로고·파비콘 일치. 검색 결과 갱신은 별도 상태 |
| 33 | 공유 OG | title/description/image 공개 값·이미지 접근·실제 공유 화면 확인 |
| 34 | 이미지 권리 | 공식 대표 이미지 출처·alt·사용 조건 기록. 출처만으로 라이선스 확보 단정 금지 |
| 35 | URL 보호 | 기존 주소 유지. 이동 필요 시 대응 URL·redirect·canonical·링크·사이트맵 함께 검증 |
| 36 | 이미지 성능 | 적정 크기·width/height·반응형·첫 이미지 우선 로딩, 하단 지연 로딩 |
| 37 | 초기 로딩 | 대표 이미지·폰트·CSS·스크립트 요청과 본문 표시 지연 확인 |
| 38 | 성능 | 동일 URL/기기/조건에서 측정. Lighthouse와 CrUX/CWV 실제 사용자 데이터 분리 |
| 39 | 모바일 | 기존 390/1440 필수 UI 검사 유지. 필요한 430/768 추가. 표·날짜·배지·버튼·넘침 확인 |
| 40 | 접근성 | 키보드·포커스·터치·확대·대비·접기 상태·복사 알림 확인 |
| 41 | 방해 | 광고/팝업/공유/상단 버튼이 코드·복사·탐색을 가리지 않도록 검사 |
| 42 | 개선 선정 | 충분한 기간·노출이 있는 글에서 낮은 CTR·의도 불일치 선정. 표본 부족은 판단 보류 |
| 43 | 실제 검색어 | GSC 쿼리를 기존 글의 유용한 질문으로 보완. 키워드만 바꾼 글 양산 금지 |
| 44 | 비교 | 시작/끝·시간대·변경일·표본·기기/브랜드 필터를 함께 기록 |
| 45 | 수집 정확성 | 내부 방문·중복 page_view·누락·집계 지연·동의 거부 영향 확인 |
| 46 | 행동 정의 | coupon_copy=복사 완료, redeem_outbound=공식 등록 이동, share=공유 동작. redemption_success는 별도 사용 증거 |
| 47 | 개인정보 | UID/계정/이메일/검색 입력 원문/코드가 포함된 민감 URL을 분석에 보내지 않음. 동의/보관 기준 확인 |
| 48 | UTM | source=플랫폼, medium=social/referral/email/cpc, campaign=목적, content=게시 구분. 내부 링크 UTM 금지 |
| 49 | 재활용 | 핵심 코드/조건/미확인 안내를 요약하고 원문 연결. 과장·확정 사용 가능 표현 금지 |
| 50 | 외부 게시 | 사용자 승인 채널·계정·규칙 확인→게시→공개 URL→UTM 유입. 초안은 게시 완료가 아님 |
| 51 | 저성과 | 유입만으로 삭제 금지. 만료 기록·입력 방법·출처·다음 혜택의 효용과 중복으로 판단 |
| 52 | 완료 분리 | 원고/코드/테스트/커밋/원격/배포/공개/검색/유입 각각 증거. 색인은 발행 필수 게이트 아님 |
| 53 | 역할 | 조사·작성·발행·공개 검증 담당 명시. 다른 작업 변경을 덮지 않고 원장 공유 |
| 54 | 도구 | 현재 실제 기능만 사용. 구독/권한/자동화 제한은 영향 범위로 기록 |
| 55 | 증거 | SHA·워크플로 run·postId·공개 URL·검사일·필수 결과 보관. 인증정보 제외 |
| 56 | 재시도 | timeout 후 Provider/공개/원장 확인. 반영됐다면 동일 발행 반복 금지 |
| 57 | 복구 | 마지막 유효 checkpoint에서 이어감. 관찰 timeout과 실제 실패 구분 |
| 58 | 보호 | 최신 소스·공개 테마 백업·최소 수정·복구 경로 확보. 원격 강제 덮기 금지 |
| 59 | 회귀 | 기업명/코드 개수/하트 위치·탭 숫자·표 열·더 보기·대표 이미지·역사 보존 검사 |
| 60 | 오류 신고 | 대상 URL·내용·접수일·검토·수정·종료 상태 기록. 제보를 사실로 즉시 반영하지 않음 |
| 61 | 비용 | 신규 유료 사용/연결 전 한도 확인. read-only 일괄 검사는 병렬 4·timeout 20초, 자동 반복 없음 |
| 62 | 주기 | 매일 장애/긴급 변경, 매주 검색/오류/쿠폰 검토, 매월 성과/중복/UX. 자동 예약은 명시 요청 시만 생성 |
| 63 | 근거 | 공식 문서 URL·확인일·적용 버전·수정 이유 기록. 문서와 실제 지원 기능 충돌은 재검토 |

## 발행과 후속 점검 분리

발행 필수: 기존 공통 생성/데이터/중복/레이아웃/원장/공개 본문 검증 유지. 검색엔진 등록·노출·새 분석 기능·홍보는 후속 게이트로 관리하며 발행을 무기한 차단하지 않는다.

공개 정적 점검: `npm run audit:search`. 결과는 `output/search-foundation-audit.json`. 이 도구는 HTTP/HTML 범위이며 계정별 쿠폰 사용, Google 색인, 내부 링크 전체 그래프, 실제 공유·분석 이벤트·라이선스를 보장하지 않는다.

재검토 후보 생성: `npm run audit:coupon-review`. 결과는 `output/coupon-review-queue.json`. 최신 입력 후보 우선, 만료 기록 후순위로 정렬하고 출처·게시일·만료·최신 근거 누락을 표시한다. 생성 시각은 출처 검증 시각이 아니므로 checkedAt은 null이다. nextReviewAt은 최초 검토 기한(HIGH 1일/NORMAL 7일/LOW 30일)이며 재생성해도 기존 기한을 미루지 않는다. sourceFingerprint는 저장된 근거의 비교용이다.

외부 출처 관찰: `npm run audit:coupon-sources`. 명시된 최신 후보의 출처만 병렬4/20초로 읽고 정적 본문 코드 언급과 본문 해시를 기록한다. 24시간 이내 checkpoint는 접근 실패까지 재사용해 같은 차단을 반복하지 않는다. 새 관찰이 필요한 경우 `node tools/review-coupon-sources.mjs`를 실행한다. 본문 변화는 검토 후보이며 자동 만료/발행으로 이어지지 않는다. 코드 언급은 계정 입력 성공을 뜻하지 않는다. 접근 실패 항목은 attemptedAt과 checkedAt을 분리한다. 글 단위 참고 링크는 코드별 출처로 자동 배정하지 않는다.

오류 접수 원장: `data/operations/growth-issues.json`. OPEN → IN_REVIEW → RESOLVED 순서로 근거·대상·다음 조치를 기록하며 종료는 실제 수정/검증 증거가 있는 경우만 한다.

## 원장 계약

각 작업에 id, targetUrl/articleKey, status, checkedAt, evidence, reason, nextAction을 기록한다. 완료는 필요한 실행·공개 증거가 확보된 범위만. 코드가 있어도 운영 증거가 없으면 미완료다.

쿠폰 재검토 원장에는 sourceUrl, sourcePublishedAt, checkedAt, effectiveDate, expiry, applicability, verificationState, nextReviewAt, conflict, lastChangeReason을 사용한다. 기존 필드를 삭제/일괄 변환하지 않는다. 결측은 미확인으로 유지한다.

분석/게시 원장에는 channel, publicPostUrl, utm, publishedAt, measurementWindow, impressions, clicks, couponCopies, redeemOutbound, limitations을 기록한다. 실제 값이 없으면 null이며 0으로 채우지 않는다.

## 공식 근거

확인일 2026-10-10.
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors
- https://support.google.com/analytics/answer/6004245

네이버·Bing·IndexNow·GA4의 실제 계정/지원 기능 검증 결과는 완료 원장에 별도로 남긴다.
