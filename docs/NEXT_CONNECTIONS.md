현재 연결·공개 발행 상태는 [PRODUCTION_EVIDENCE.md](PRODUCTION_EVIDENCE.md)를 우선한다. 아래 미연결 상태는 이전 단계 기록이다.

# 연결 상태 · 2026-10-05

## 실제 완료

- 로컬 테스트 11개 PASS. 최신 GitHub af6d378의 Verify 37278793073 install/test/build 성공.
- GitHub Verify 실행 37276989970: install/test/build 성공.
- Blogger OAuth 갱신 및 기존 postId PATCH 어댑터 구현. fixture 검증이며 실제 Google OAuth/API는 미실행.
- 초기 게임 대상: 한국 Google Play 전화 최고 매출 1~3위. 공식 브라우저에서 제우스: 오만의 신, 리니지M, 명조:워더링 웨이브 순서 확인.
- 자동 배포 workflow 준비. API Token 및 활성화 변수 미설정으로 Deploy Worker는 skipped. 성공으로 간주하지 않는다.
- D1 전용 DB와 두 migration 적용, 원천 관찰 Cron과 게임 보상 스키마 구현. 공식 페이지 3곳 HTTP 200, 원격 D1 3행과 64자리 해시 저장 확인.
- Worker 배포 버전 3132a35b-c722-41bb-b5ae-6446dbc5a751. 공개 health의 D1_BOUND/OAuth false, 비인증 수집 401, 비활성 발행 409 직접 확인.
- 기존 postId 갱신 체크포인트 및 미확정 결과 재시도 방지 구현. 실제 Blogger PATCH는 인증 미연결로 미실행.
- 신규 초안 insert·postId 저장·생성 복구 모듈 및 로컬 초안 3개 구현. 실제 Blogger 생성은 미실행. 로컬 테스트는 현재 23개 PASS이며 GitHub 71b287e CI는 당시 20개 테스트와 build 성공이다.
- 공식 원천은 4곳으로 확대했고 실제 Worker 응답과 D1 4행 저장 확인. 제우스는 이미지 공지 검토 필요 상태다. 수집된 공식 후보 1개는 UNVERIFIED이며 공개 활성 목록에서 제외한다.
- 코드 자동 추출/사용 검증, 테마 적용과 공개 렌더링 검증은 미완료. 원천 관찰 행 수는 사용 가능한 쿠폰 수가 아니다.
- Google Cloud 전용 프로젝트 akkigo-boja 생성, Blogger API 사용 설정됨, OAuth 앱 및 Desktop 클라이언트 생성, 본인 테스트 사용자 1명 등록을 GUI에서 확인. Google 실제 관리 동의·토큰 교환·Worker OAuth Secret 연결은 미완료. JSON 자동 다운로드는 완료 이벤트 timeout 및 기본 다운로드 폴더의 신규 파일 부재로 AUTOMATION_BLOCKED다. 해당 JSON의 실제 저장 경로가 필요하다.

## 테마 수동 적용

1. 목적: 준비된 쿠폰 테마를 새 블로그에 적용한다.
2. 준비: 기존 테마 백업 backups/blogger-original.xml 확보 및 XML 문법 확인 완료. 새 XML은 원본 패키지의 starter theme이다. 실제 Blogger 업로드 허용 여부는 미검증.
3. Chrome에서 https://draft.blogger.com/blog/themes/2339978524893611480 를 연다.
4. 블로그가 '아끼고 보자'인지 확인 → 맞춤설정 옆 ▼ → 복원 → 업로드.
5. 파일 C:/Users/c06/Documents/ChatGPT/구글 블로거 - 쿠폰 사이트/akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml 을 선택한다.
6. 업로드는 정확히 1회 실행한다.
7. 정상: 복원 완료 안내. https://lsifl.blogspot.com/ 에서 제목, 검색, 카테고리 메뉴를 확인할 수 있다.
8. 오류/복원 실패/빈 화면이면 STOP. 재업로드하지 말고 표시된 오류 문구만 회신한다.
9. 기존 DDoRi 블로그 수정, 블로그 삭제, 예시 쿠폰 공개 발행, 인증정보 공유는 금지한다.
10. 회신: 복원 성공 여부와 오류가 있으면 오류 문구. 이후 Codex가 PC 1440/mobile 390 공개 렌더링을 확인한다.

자동 업로드는 Chrome ChatGPT 확장의 파일 URL 접근 비활성으로 차단됐다. 수동 업로드는 확장 권한을 변경하지 않는다.

## OAuth 및 CI 배포 권한

Blogger 발행에는 Google OAuth 동의와 client/refresh token 준비가 필요하다. CI 배포에는 해당 Cloudflare 계정의 Worker 편집 권한 API Token이 필요하다. 새로운 권한 생성/동의는 별도 확인 후 진행한다. Secret은 해당 Worker/GitHub 저장소의 Secret 입력란 또는 공식 CLI로만 전달하고 채팅에 복사하지 않는다.

GitHub Secrets: CLOUDFLARE_API_TOKEN. GitHub Variables: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DEPLOY_ENABLED=true.
Worker Secrets: BLOGGER_CLIENT_ID, BLOGGER_CLIENT_SECRET, BLOGGER_REFRESH_TOKEN.
현재 이 항목들은 미연결이며 단순 코드 준비가 인증 성공을 의미하지 않는다.

## Blogger 인증 연결 절차

1. 목적: 비밀번호나 토큰을 채팅에 공유하지 않고 Worker에 Blogger API 권한을 연결한다.
2. 준비: 로컬 연결 도구 구현 및 구문 확인 완료. Google 계정 실동의/토큰 교환은 미검증. Cloudflare CLI 기존 로그인 사용.
3. https://console.cloud.google.com/ 에서 이 블로그 전용 프로젝트를 만들거나 이미 준비한 전용 프로젝트를 선택한다. 다른 서비스 프로젝트는 수정하지 않는다.
4. API 및 서비스 → 라이브러리 → Blogger API v3 → 사용. Google Auth Platform → Branding/Audience에서 앱 이름 '아끼고 보자', 본인 연락처와 본인 테스트 사용자를 설정한다. 결제나 조직 정책 변경이 나오면 STOP.
5. Google Auth Platform → Clients → Create client → Desktop app → '아끼고 보자 로컬 연결'. JSON을 로컬에 다운로드한다. 파일 내용은 공유하지 않는다.
6. Codex에는 JSON의 로컬 파일 경로만 알려준다. Codex가 연결 도구를 정확히 1회 실행한 뒤 표시하는 127.0.0.1 주소를 브라우저로 연다.
7. Google 동의 화면 열기 → 블로그 소유 계정 선택 → Blogger 관리 권한 범위를 확인하고 본인이 동의한다. 이 scope는 계정의 Blogger 관리 권한이다. Worker 코드는 lsifl 대상 ID로 제한한다. 정상 기대값은 '연결 완료'와 BLOGGER_CONNECTION_STORED; 발행은 계속 비활성이다.
8. 오류, 다른 계정/프로젝트/앱, 권한 범위 불일치, 대기시간 초과가 나오면 STOP. 재실행하지 않는다. Google Testing 상태 refresh token은 만료 정책이 있으므로 영구 운영 연결 완료로 간주하지 않는다.
9. 토큰/인증 URL/JSON 내용/비밀번호/OTP를 채팅에 복사하지 않는다. 테마 변경이나 게시물 발행을 이 연결 절차 중 별도로 실행하지 않는다.
10. 회신: 연결 완료 여부 또는 터미널의 상태 코드만. 이후 Codex가 인증 상태 확인, 허브 초안 생성과 공개 전 검증을 이어간다.

연결 도구 실행: bundled Node로 tools/connect-blogger.mjs 뒤에 다운로드한 JSON의 절대 경로를 인자로 전달한다. 인증정보는 저장 파일을 추가 생성하지 않고 Wrangler Secret stdin으로 전달한다.

공식 OAuth 근거: https://developers.google.com/identity/protocols/oauth2/native-app (Desktop loopback/PKCE).

공식 참고: https://developers.google.com/blogger/docs/3.0/using 및 https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/.

공개 전환 API 구현 및 fixture 검증 완료. 실제 초안의 제목·본문·DRAFT 상태를 확인한 뒤 발행하며 UNKNOWN은 자동 재시도하지 않는다. 실제 Blogger 초안 생성/공개 발행은 OAuth 미연결로 미실행이다.


