# 시바 모험단 게임 쿠폰 벤치마크 재비교 · 2026-10-06

## 범위
- 대상: https://lsifl.blogspot.com/2026/10/pick7p2y.html
- postId: 4686430079776725627
- 비교 축: 코드/보상/복사, Active/Expired 구조, 입력 방법, 문제 해결, 새 코드 찾기, 관련 콘텐츠, FAQ, 모바일/PC 반응형.

## 확인한 벤치마크 패턴
- Pro Game Guides: Active/Inactive 또는 Active/Expired 분리, Code + Copy + Description/Reward를 한 행으로 배치, 만료 코드는 별도 노출/접기.
- Destructoid: Active/Expired 분리, 코드 옆 Copy, 별도 redeem steps, 코드 실패 원인 안내.
- Pocket Gamer: 업데이트 날짜를 상단에 표시하고 active/expired 목록과 입력 방법을 분리.
- Beebom: 업데이트 날짜, 최신 코드와 보상, 최근 문서의 Copy 버튼, Expired Codes 및 redeem 방법.
- 국내 냥코프: 목록 카드에서 활성 개수/전체 개수/업데이트 날짜/쿠폰 보기 CTA를 제공.
- 국내 쿠폰 페이지 사례: 코드 복사 CTA, 할인/보상 정보, FAQ를 한 페이지에서 연결.

## 시바 모험단 반영
- 코드 / 보상 / 만료일 / 복사 UI / 공식 입력 CTA를 단일 카드로 묶음.
- 내부 데이터가 UNVERIFIED인 점을 공개 운영 문구로 반복하지 않되, 실제 사용 성공이 확인되지 않은 상태에서 “사용 가능”으로 단정하지 않도록 공개 문구를 “현재 확인된 쿠폰”으로 조정.
- 만료 섹션을 별도 섹션 + 수량 배지로 통일.
- 게임 입력 / 웹 입력을 2열 카드로 분리하고 모바일에서는 1열로 전환.
- 쿠폰 실패 점검, 새 쿠폰 확인, 공식 출처, 관련 게임 쿠폰, FAQ 유지.
- 복사 버튼 최소 높이 44px, 공식 입력 버튼 최소 높이 46px.
- Jump Break 이전에는 쿠폰 코드가 나오지 않도록 유지.
- postBodySnippet은 Jump Break가 있는 글에서 Break 앞 안전 요약만 사용하고, Break가 없는 기존 글은 코드/스크립트가 없는 일반 쿠폰 안내 카드로 대체하도록 소스 정리.

## 검증 증거
- Verify Run 37336728711: 49/49 PASS.
- Blogger theme regeneration clean diff PASS.
- Blogger XML 3개 parse PASS.
- headless Chrome 390px: LAYOUT_OK_390.
- headless Chrome 1440px: LAYOUT_OK_1440.
- clipboard fixture: pick7p2y 실제 writeText 값, 성공 문구, 1.4초 후 복구 검증.
- Publish Approved Article Run 37337358759: SUCCESS.
- Worker version d1e4957c-889d-49a2-be46-fe2d9515b9dc.
- 기존 postId/URL 유지, publicVerified=true.
- 강화된 publicCheck가 ncp-copy-wrap / 현재 확인된 쿠폰 / 확인된 코드 / ncp-count-muted 및 금지 문자열 부재를 확인.

## 2026-10-06 후속 완료
- 안전한 목록 카드 소스 구현: 확인된 쿠폰 수 / 보상 / 만료를 노출하고 코드/JavaScript는 노출하지 않음.
- Feed preview headless 검증: FEED_LAYOUT_OK_390 / FEED_LAYOUT_OK_1440.
- 상세 페이지 headless 검증: LAYOUT_OK_390 / LAYOUT_OK_1440.
- 게임 쿠폰 공통 템플릿 `akkigo_blogger_r1_bundle/article/game-coupon-article-r1.html` 승격.
- 시바 본문 PATCH 및 공개 상세 검증: Publish 37342377560 SUCCESS, postId/URL 유지, publicVerified=true.

## 남은 항목
- 최신 테마 XML의 Blogger 관리자 실제 저장.
- 저장 후 게임 라벨/검색 목록에서 새 요약 카드가 실제 렌더되는지 사용자 최종 확인.
- 관리자 저장 전에는 전체 완료로 보고하지 않는다.
