# 연결 상태 · 2026-10-05

## 실제 완료

- 로컬 테스트 6개 및 Worker dry-run PASS.
- GitHub Verify 실행 37276989970: install/test/build 성공.
- Blogger OAuth 갱신 및 기존 postId PATCH 어댑터 구현. fixture 검증이며 실제 Google OAuth/API는 미실행.
- 초기 게임 대상: 한국 Google Play 전화 최고 매출 1~3위. 공식 브라우저에서 제우스: 오만의 신, 리니지M, 명조:워더링 웨이브 순서 확인.
- 자동 배포 workflow 준비. API Token 및 활성화 변수 미설정으로 Deploy Worker는 skipped. 성공으로 간주하지 않는다.
- 신규 post insert, checkpoint/영구 저장, 공식 원천 자동 수집 및 게임 보상형 쿠폰 스키마는 아직 미구현.

## 테마 수동 적용

1. 목적: 준비된 쿠폰 테마를 새 블로그에 적용한다.
2. 준비: 기존 테마 백업 backups/blogger-original.xml 확보 및 XML 문법 확인 완료. 새 XML은 원본 패키지의 starter theme이다. 실제 Blogger 업로드 허용 여부는 미검증.
3. Chrome에서 https://draft.blogger.com/blog/themes/2339978524893611480 를 연다.
4. 블로그가 '아끼고 보자'인지 확인 → 맞춤설정 옆 ▼ → 복원 → 업로드.
5. 파일 C:/Users/c06/Documents/ChatGPT/구글 블로거 - 쿠폰 사이트/nutriments_blogger_r1_bundle/theme/blogger-theme-r1.xml 을 선택한다.
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

공식 참고: https://developers.google.com/blogger/docs/3.0/using 및 https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/.
