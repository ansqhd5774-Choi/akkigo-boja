# 공통 글 디자인 R2

- 새 게임 원고는 source.presentationVersion와 HTML data-ncp-presentation에 compact-r2를 선언한다. 기존 R1 목록은 고정되며 새 원고를 예외 목록에 추가하지 않는다.
- theme/article-compact.css가 메뉴, 44px 공유·복사 영역, 제목과 안내 아이콘의 동일 높이 및 모바일 배치를 소유한다. 글마다 해당 CSS를 다시 작성하지 않는다.
- 출처·날짜·불확실성의 긴 설명은 renderArticleInfo를 사용해 해당 section의 h2 다음에 둔다. 핵심 상태는 짧은 본문으로 유지한다. 상단 안내는 ncp-brief 안에 둔다.
- 섹션 목록은 5개까지 표시하고 나머지는 details.ncp-list-more 안에 보존한다. summary는 더 보기 N과 CSS 화살표를 사용한다. 삭제하거나 복사·공유 코드값을 바꾸지 않는다.
- 기존 Verify와 실제 발행 워크플로의 필수 presentation 검사는 R2 요구, 안내 구조, 긴 목록 접기, 공통 CSS와 생성 테마 일치, 버튼 코드 일치를 검사한다. 발행 검사에는 SHA 검증 재사용 여부와 관계없이 적용한다.
- GitHub 테마 소스 수정 후 Blogger 관리자 저장과 공개 렌더링 확인을 별도로 수행한다.
