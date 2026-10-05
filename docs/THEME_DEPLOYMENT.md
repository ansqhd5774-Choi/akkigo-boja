# Blogger 테마 직접 배포 경로

TinyFish와 Blogger 콘텐츠 API를 사용하지 않는다. 관리자 공식 HTML 편집 경로:

https://draft.blogger.com/blog/themes/edit/2339978524893611480

## Source of truth

- `theme/blogger-native-base.xml`: 실제 게시물 출력이 확인된 Blogger 위젯 기반.
- `tools/build-theme.mjs`: 쿠폰 JSON, 17개 메뉴, 실제 확인 기록과 게임별 링크로 홈을 생성한다.
- `akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml`: 관리자에 저장할 최종 XML.
- `data/coupons.json`: 확인 기록의 실제 데이터. 특정 계정 사례를 전체 사용 가능으로 승격하지 않는다.

생성: `node tools/build-theme.mjs`. 테마는 Worker deploy로 배포되지 않는다.

## 확인된 관리자 절차

1. 대상 블로그 ID 확인 후 HTML 편집기를 연다.
2. 현재 편집기 전체 내용을 로컬 비공개 `backups/`에 보관한다.
3. 최종 XML을 편집기 전체 선택·붙여넣기로 교체하고 저장을 1회 누른다.
4. 공개 홈의 `ncp-coupon-home` 및 기존 게시물 본문을 확인한다. 저장 성공만으로 완료 처리하지 않는다.
5. PC1440/mobile390, 검색 결과, 코드 복사·실제 붙여넣기, 보상 펼치기를 확인한다.
6. 저장 오류·본문 소실이면 중복 저장하지 않고 확보한 원래 테마를 복원한다.

2026-10-05 실제 관리자 저장과 공개 렌더링 확인 완료. 이전 starter의 빈 게시물 출력 문제는 native 위젯을 보존한 기반으로 해결했다. 최초 원인 전체는 단정하지 않는다.

17개 카테고리 메뉴는 실제 출력된다. 게시물이 없는 16개 Label은 등록 완료로 간주하지 않는다. 여행·쇼핑·배달의 실제 데이터와 비교 도구는 아직 미완료다.

## 2026-10-06 승인된 목록 미리보기 후속 변경
- 기존 R3 공개 테마 성공 이력은 보존한다.
- 최신 source of truth는 `akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml`이다.
- 변경 범위는 목록용 `postBodySnippet`, 안전 요약 카드 CSS, 기존 위임형 복사 UX 보존이다.
- Jump Break가 있는 글은 Break 앞의 안전 요약만 목록에 렌더링한다.
- Jump Break가 없는 기존 글은 쿠폰 코드/스크립트 대신 일반 쿠폰 안내 카드만 렌더링한다.
- Verify 37342278067: tests 50/50, theme regeneration clean diff, XML parse PASS, detail/feed 390·1440 PASS.
- 이 최신 XML은 소스 검증 완료 상태이며, **Blogger 관리자 실제 저장은 아직 별도 확인이 필요하다.** 기존 2026-10-05 관리자 저장 완료 기록을 최신 소스 저장 완료로 확대하지 않는다.
