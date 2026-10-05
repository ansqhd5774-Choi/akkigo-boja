# 허브 생성·복구 운영

대상은 Blogger blogId 2339978524893611480 / lsifl.blogspot.com 하나다. 등록된 게임 키는 zeus, lineagem, wuthering이다.

## 현재 검증 범위

- 최초 생성은 `posts.insert?isDraft=true`로만 실행한다. 공개 발행 API는 아직 미구현이다.
- DB의 기존 postId가 있으면 신규 생성 없이 반환한다. 미해결 시도는 SQLite 고유 인덱스로 동시 실행을 막는다. 잠금 획득 뒤 기존 postId를 다시 확인해 조회 시점 경합도 방지한다.
- API 전 체크포인트를 저장한다. API/응답 검증/결과 저장 중 불명확한 실패가 나면 UNKNOWN으로 유지한다. 자동 재시도하지 않는다.
- `/internal/hubs/reconcile`는 생성 시작 후 5분 이상 지난 CREATE 시도만 대상으로 한다. draft/live/scheduled 각 최대 5페이지를 조회하며 본문 고유 표식이 정확히 하나일 때 postId를 연결한다. 일치 없음, 중복, 목록 예산 초과면 잠금을 유지한다. 게시물 삭제·추가 생성은 하지 않는다.
- 갱신 UPDATE의 UNKNOWN은 이 생성 복구 API 대상이 아니다. 실제 본문과 요청 결과를 운영자가 대조해야 한다.
- 로컬 fixture 및 실제 migration SQL 검증이며 실제 Blogger insert/PATCH/복구는 OAuth 미연결로 미실행이다.

## 실행 전제

ADMIN_TOKEN 인증, Blogger OAuth Secret 3개, 고정 BLOGGER_BLOG_ID, PUBLISH_ENABLED=true가 모두 필요하다. 현재 PUBLISH_ENABLED=false이므로 생성/복구/갱신은 409로 차단된다. 인증 연결만으로 설정을 자동 활성화하지 않는다.

생성 POST `/internal/hubs/create`, JSON `{"hubKey":"zeus"}`. 생성 본문은 서버의 고정 게임 목록과 coupon 데이터로 렌더링한다. 임의 본문이나 다른 블로그 ID는 생성 API에서 받지 않는다.

복구 POST `/internal/hubs/reconcile`, JSON `{"hubKey":"zeus"}`. 예상 성공값은 postId와 status이다. 409 또는 timeout이면 먼저 D1 publish_attempts 및 실제 Blogger 상태를 확인한다. 데이터 삭제, UNKNOWN 자동 해제, 무조건 재생성은 금지한다.

갱신 POST `/internal/hubs/update`, JSON의 hubKey/post 사용. 저장된 postId만 PATCH한다. 이 API는 초안을 공개 게시물로 전환하지 않는다.

## 실제 쿠폰 근거

제우스 DEVLIVE0911은 공식 이미지의 코드 및 보상 7종을 브라우저에서 읽었다. 사용 성공, 만료일, 서버/계정 조건은 미확인이다. UNVERIFIED 후보로만 저장하며 활성 허브와 추천에서 제외한다. 리니지M 채널 구독 보상은 개인별 발급 안내이므로 공용 코드로 수집하지 않는다. 명조의 공식 리딤 공지와 공개 코드는 아직 미확인이다.

원천 HTML의 HTTP 200·변경 해시는 쿠폰 사용 성공 증거가 아니다. 이미지 공지는 SOURCE_FETCHED_IMAGE_REVIEW_REQUIRED로 기록한다. 이미지 OCR/자동 코드 추출과 실제 게임 적용 검증은 미완료다.

공식 API: https://developers.google.com/blogger/docs/3.0/reference/posts/insert 및 https://developers.google.com/blogger/docs/3.0/reference/posts/list
