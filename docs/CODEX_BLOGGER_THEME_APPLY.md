# CODEX — Blogger 최신 테마 1회 적용 인계

대상:
- 블로그: https://lsifl.blogspot.com/
- blogId: 2339978524893611480
- 저장소: ansqhd5774-Choi/akkigo-boja
- 브랜치: codex/blogger-worker-r1
- 인계 작성 시 HEAD: 4458bd846e7f2c7d9132856ab9a034e537018bb2
- 적용 파일: akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml
- 적용 파일 blob SHA: 90857cdabfa83a6c26a70c62b111e0e9ec8c263e
- 공식 편집기: https://draft.blogger.com/blog/themes/edit/2339978524893611480

목표:
- 기존 R3 홈·검색·복사·단일 게시물 postBody를 보존한다.
- 목록 postBodySnippet만 최신 안전 요약 구조로 적용한다.
- Jump Break가 있는 시바 글은 확인된 쿠폰 수 / 보상 / 만료만 목록에 표시한다.
- 쿠폰 코드와 JavaScript는 목록에 노출하지 않는다.
- Jump Break가 없는 기존 글은 일반 쿠폰 안내 카드 fallback을 사용한다.

실행:
1. origin/codex/blogger-worker-r1 최신 HEAD를 다시 확인한다. 이 문서 작성 이후 변경이 있으면 최신 변경을 보존하고 현재 HEAD의 적용 파일을 사용한다.
2. 현재 Blogger 관리자 HTML 전체를 로컬 비공개 backups/에 백업한다. Git commit 금지.
3. 현재 관리자 HTML의 postBodySnippet을 먼저 확인한다.
   - 이미 최신 구조(data:post.hasJumpLink + data:post.body + ncp-feed-preview-generic)라면 저장하지 않고 ALREADY_APPLIED로 종료한다.
4. 미적용이면 적용 파일 전체를 공식 HTML 편집기에 교체하고 저장 버튼을 1회만 누른다.
5. timeout/결과 불명확이면 두 번째 저장 금지. 현재 편집기 내용을 다시 읽어 실제 저장 상태부터 확인한다.
6. 저장 후 관리자 HTML에서 아래를 확인한다.
   - postBodySnippet 2개
   - data:post.hasJumpLink
   - data:post.body
   - ncp-feed-preview-generic
   - 단일 게시물 postBody 유지
   - ncp-coupon-home 유지
   - data-ncp-copy 유지
7. 공개 화면은 사용자가 최종 확인한다. Codex는 관리자 저장 성공과 공개 확인을 분리해 보고한다.

사전 검증 증거:
- Verify run 37342278067 SUCCESS
- tests 50/50 PASS
- theme regeneration clean diff PASS
- XML 3개 parse PASS
- LAYOUT_OK_390 / LAYOUT_OK_1440
- FEED_LAYOUT_OK_390 / FEED_LAYOUT_OK_1440
- 시바 본문 Publish run 37342377560 SUCCESS
- 기존 postId 4686430079776725627 / URL 유지 / publicVerified=true
- Worker version 7e2413d1-b94e-408e-bfb8-668bb9e0a53f

최종 보고:
- 최신 HEAD:
- 백업 경로:
- Blogger 실제 저장: DONE / ALREADY_APPLIED / BLOCKED / FAILED
- 저장 횟수: 0 또는 1
- 관리자 저장 구조 확인:
- 사용자 공개 화면 확인: PENDING_USER_CHECK

사용자 공개 확인 전 전체 DONE 금지.
