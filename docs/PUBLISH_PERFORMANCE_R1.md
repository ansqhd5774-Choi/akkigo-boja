# Blogger 발행 지연 개선 — ACTIVE R1 (2026-10-08)

대상: `ansqhd5774-Choi/akkigo-boja`, 브랜치 `codex/blogger-worker-r1`, 블로그 ID `2339978524893611480`.

## 왜 느렸는가
직전 아우터플레인 발행: 텍스트 테스트 불일치로 Verify/Deploy 실패, 발행 첫 시도는 Worker deploy 직후 409 `ARTICLE_NOT_APPROVED` 응답, 두 번째 실행 성공. 재배포 직후 실제 Worker에 글이 등록됐는지 검증하지 않은 것이 핵심 구조 문제. 정확한 409 내부 원인은 추측하지 않는다.

## 실행 기준
1. **공통 HTML 모듈:** `tools/game-coupon-components.mjs`의 `renderGameCouponTable`, `renderGameCouponGridCss`, `renderGameAppIcon`을 신규 게임 글 작성에 사용. 확정된 5열/68px 및 공식 앱 아이콘 유지.
2. **배포 전 테스트:** source와 draft, table/HTML/SEO 문구, 앱 아이콘, 기존 URL 조건을 `node --test`에서 확인. 자동 Verify 실패 시 발행 요청을 생성하지 않음.
3. **신뢰 가능한 배포 재사용:** `/internal/articles/preflight`에 GitHub OIDC 인증 후 해당 글의 승인 상태와 SHA-256(제목·본문·라벨 포함)를 요청. Worker 지문이 GitHub 원본과 같으면 repair deploy를 생략.
4. **정합성 확인:** Worker가 준비되지 않았을 때만 기존 deploy 복구 수행. 이후 read-only preflight 최대 9회, 간격 2.5초로 동일 지문 확인 후 발행. 불일치가 계속되면 Blogger mutation 전에 실패시켜 중복 글 위험 회피.
5. **가드 강화:** publish 요청에 동일한 `postSha256`를 전송하며 Worker가 검사 후 기존 `publishApprovedArticle` 호출. `ARTICLE_SNAPSHOT_MISMATCH`이면 409로 중단.
6. **재시도 경계:** 읽기 전용 preflight만 재시도. Blogger 생성/수정/발행 요청은 네트워크 오류·타임아웃·UNKNOWN 때 자동으로 반복하지 않음. 공식 공개/API/D1과 대조 후 상태 별로 수동 재처리해야 함.
7. **자동 테스트:** 해시 일치/불일치, stale Worker 재확인, 인증 실패 차단, 공통 HTML 생성기, 발행 순서를 테스트한다. GitHub Verify/Deploy 실제 결과와 공개 동작 검증 별도 기록.

## 범위 제한
- 기존 게시물 제목/본문/postId/URL, Blogger 테마, 기타 블로그 변경 없음.
- 최초 배포 검증 뒤 승인된 새 글이 추가되기 전에는 공개 mutation 없음.
- 시간 개선 목표는 2~3분이지만 보장하지 않으며 다음 실제 발행 때 측정한다.
