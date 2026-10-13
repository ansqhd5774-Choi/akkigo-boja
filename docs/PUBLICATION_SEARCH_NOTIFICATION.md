# 발행 직후 검색 알림

- 대상: lsifl.blogspot.com의 LIVE + publicVerified 게시물. 실제 변경 없이 alreadyLive인 재실행은 제외.
- tools/publish-approved-requests.mjs에서 발행 확인 후 네이버 공식 submit.json 호출.
- Runner Secret NAVER_CRAWL_ACCESS_TOKEN이 필요한 제휴 수집요청 API이며 현재 Secret 이름 목록에서 해당 항목이 없음.
- 인증 미설정은 BLOCKED_CREDENTIAL_MISSING. 접수 성공은 REQUEST_ACCEPTED. 통신 timeout은 REQUEST_STATE_UNKNOWN이며 중복 재시도하지 않음.
- 수집 알림 실패는 발행 성공을 취소하지 않음. 결과는 Actions summary와 search-notifications artifact에 보관. 실제 색인은 별도 UNVERIFIED.
- IndexNow는 같은 호스트 텍스트 키 파일 요구. Blogger 기본 페이지/API는 HTML 콘텐츠를 제공하므로 키 검증 지원 경로가 확보되지 않아 연동하지 않음. 다른 Worker 호스트로 대체하지 않음.
- Google 일반 쿠폰 글용 수집요청 API 없음. JobPosting/BroadcastEvent API를 사용하지 않음.

## 활성화에 필요한 단계
네이버 제휴 승인 후 발급되는 accessToken을 GitHub repository Actions Secret NAVER_CRAWL_ACCESS_TOKEN에 저장해야 한다. 토큰을 채팅/로그에 노출하지 않는다. 승인 없는 가짜 토큰 제출은 하지 않는다. 준비 후 실제 변경 글 1개로 provider 접수와 실제 수집을 각각 검증한다.

공식 문서: https://searchadvisor.naver.com/guide/crawl-request-api
IndexNow: https://www.indexnow.org/documentation
Google: https://developers.google.com/search/apis/indexing-api/v3/using-api
확인일: 2026-10-14
