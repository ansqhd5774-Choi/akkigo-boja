# 모든 게임 쿠폰 글 공통 작성 계약

사용자 승인: 2026-10-09. 적용 대상은 기존/신규 게임 글 전체와 제우스·리니지M·명조 허브다. 기존 월별 펼침·내용별 탭 규칙보다 이 계약을 우선한다.

## 작성 명령

1. 조사 결과를 `data/game-period-articles.json`의 해당 모델에 병합한다. 새 글은 articleKey/title/records/공식 대표 이미지/입력 안내를 넣고 article registry에 같은 키를 등록한다. 허브는 `data/game-period-hubs.json`에 작성한다.
2. 각 기록에 code, sourcePublishedAt(원문 최초 게시일 또는 null), expiry, sources(원문 URL/이름/게시일), statusLabel, evidenceHTML(보상·조건)을 넣는다. 수집일·검색 결과 날짜·수정일·만료일·코드의 연도·firstSeenMonth를 원문 게시일로 대체하지 않는다. 같은 코드의 추가 출처는 기존 sources에 병합한다.
3. `최신`은 현재 입력 대상으로 소개할 근거를 확보한 경우만 latest:true와 latestEvidence를 함께 기록한다. 실제 사용 성공 여부와 공식 사용 기한을 구분한다. 나머지는 확인된 원문 연도에 배정하며 날짜 미확인은 별도 목록이다.
4. `node tools/render-game-period-articles.mjs`로 초안과 카탈로그를 생성한다. HTML과 CSS를 글별로 작성하거나 직접 고치지 않는다.
5. `node tools/check-article-presentation.mjs`와 `node --test`를 통과시킨 후 기존 발행 워크플로우를 사용한다. HTML 수동 편집, 날짜별/출처별 박스, 5행 단위 목록 분할, 누락된 과거 코드, 생성 데이터 불일치는 차단된다.

## 표시와 보존

- 기간 선택은 최신 / 2026 / 2025 / 2024이며 더 오래된 원문이 있으면 해당 연도가 자동 추가된다. CSS는 연도 값과 무관하게 라디오와 패널 연결로 작동한다. 클릭·키보드 방향키 지원, 기본 최신 선택.
- 한 코드는 한 행만 생성한다. 최신에 포함된 코드의 연도는 그 행의 원문 날짜에 남기고 연도 목록에 중복 출력하지 않는다.
- 각 기간과 게시일 미확인 목록은 처음 5행 + 더 보기. 목록을 5개씩 여러 섹션으로 나누지 않는다.
- 다섯 열은 순서 / 출처 게시일 / 만료 기간 / 쿠폰 / 공유·복사다. 출처·보상·조건은 행의 ⓘ, 긴 설명은 제목 옆 ⓘ에 둔다.
- 글씨 굵기, 제목과 ⓘ 정렬, 버튼 폭, 반응형, 접기와 기간 선택은 `theme/article-compact.css`와 `theme/article-typography.css`에서 관리한다.
- 전환 기준 `data/game-period-migration-baseline.json`의 기존 코드가 빠지면 생성이 실패한다. 출처와 원고의 상세 조건을 모델에 보존한다.
- 발행 전 기본 검사와 Worker 발행 직전에 공통 생성 결과를 대조한다. 허브도 같은 검사에 포함되며 예전의 고정 HTML 경로를 사용하지 않는다.
- 기존 글 전환 요청은 existingOnly:true를 사용한다. 공개된 기존 postId/URL만 갱신하며 미발행 원고를 새 게시물로 만들지 않는다.

일반 데이터 갱신은 동일 SHA 검증 결과와 LIVE 응답을 확인한다. 공통 UI 변경·실제 오류·사용자 점검 요청에는 PC·모바일 렌더링과 관련 클릭 검사를 추가한다.

## 발행 보고 집계

- `node tools/game-period-report.mjs` 또는 `node tools/game-period-report.mjs "게임명"`의 결과로 총 코드·복사·공유·게시일 미확인·만료 기록 수를 작성한다. 수동 계산이나 조사 중간 집계를 최종 보고에 사용하지 않는다.
- Verify가 발행 카탈로그의 source.gamePeriodModel과 허브 모델에서 생성한 `game-period-report` artifact를 보존한다. 본문과 보고는 공통 중복 제거 결과를 사용한다.
- 만료 기록 수는 statusLabel의 만료·종료 분류 집계다. 실제 사용 성공·공식 발급 여부를 뜻하지 않으며, 그 검증 결과는 별도 증거로 보고한다.
