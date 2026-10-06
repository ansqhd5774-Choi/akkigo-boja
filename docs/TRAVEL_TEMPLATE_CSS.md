# 여행·숙박 게시물 CSS 작성 규칙

CSS `content`의 체크 표시는 `content:"\2713"`처럼 Unicode escape를 사용한다.
HTML 엔티티(`&#10003;`)나 체크 문자 리터럴을 CSS 생성 콘텐츠에 넣지 않는다.
JSON에서는 백슬래시를 이스케이프해 `"content:\"\\2713\""`로 저장한다.
HTML 원본, drafts JSON, data/articles.json을 동기화하고 기존 postId로 갱신한다.
저장 후 공개 페이지의 ::before computed content와 PC·모바일 겹침을 확인한다.
