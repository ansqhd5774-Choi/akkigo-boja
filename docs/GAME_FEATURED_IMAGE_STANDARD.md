# 게임 쿠폰 대표 이미지 운영 기준 — ACTIVE R1

대상: https://lsifl.blogspot.com/ 의 '게임' 카테고리. 타 블로그 및 Blogger 테마 변경 금지.

## 확정 기준
- **대표 사진 = 해당 게임의 공식 모바일 앱 아이콘** (Google Play 또는 Apple App Store의 공식 앱 상세 페이지에서 확인).
- 이미지 원본은 실제 해당 게임의 것만 사용. 프로모션 배너, 게임 스크린샷, 캐릭터 일러스트, 무관한 로고, 임의 제작 합성 이미지 사용 금지.
- 출처 우선순위: 공식 Google Play 앱 페이지 → 공식 Apple App Store 앱 페이지. 실제 앱 이름/게시자/ID를 확인한다. 공식 원본 없으면 발행을 멈추고 출처 확인 필요 상태로 보고한다.
- 원본 아이콘은 정사각형(1:1), 512px 이상의 이미지 우선. 본문 최대 폭 256px, 높이 자동, `object-fit:contain`; 아이콘 찌그러짐/크롭 금지.
- 대표 아이콘을 본문 첫 `<img>`로 배치. `data-ncp-featured-image` 1개, `data-ncp-app-icon="true"`, 공식 원천 URL, 설명적인 alt, 스토어 연결 링크를 필수로 한다.
- 새 글마다 `data/game-app-icons.json`에 `articleKey/gameName/platform/appStoreUrl/iconUrl/iconShape/verifiedDate`를 등록한다. 등록되지 않은 새 게임 글은 `GAME_APP_ICON_REGISTRY_REQUIRED`로 발행 중단한다.
- 발행 경로 `src/articles.js`는 `validateGameFeaturedImage` 통과 후에만 Blogger 작성/수정한다. 출처나 URL, 첫 이미지, 정사각형 CSS, 원본 비교가 다르면 자동 중단.
- Blogger 제목은 상단 1번만 출력하고 본문에 중복 `<h1>`을 추가하지 않는다.
- 기존 글은 게시물 URL·postId·본문·쿠폰·복사기능을 보존한다. 공식 아이콘이 개별 확인된 글부터 변경한다. 예외 목록은 `src/game-featured-image-policy.js`의 16개 이전 글이며, 변경 시 아이콘 등록 후 예외에서 제거한다.
- 검증 단계는 GitHub 소스/테스트 → 필요한 Worker 배포 → 기존 게시물 PATCH → 공개 대표 이미지/og:image 확인 → PC1440·모바일390의 1:1 렌더링이다. HTTP200만으로 아이콘 교체 완료 처리하지 않는다.

## 최초 적용 사례
- Pokémon GO App Store 공식 페이지: https://apps.apple.com/us/app/pok%C3%A9mon-go/id1094591345
- 실제 공식 앱 아이콘: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/da/c0/a6/dac0a6e7-189d-d8bc-c7da-28b46715d327/Placeholder.mill/1024x1024wd.png
- 2026-10-08 원본 시각 확인. adidas 행사 포스터는 앱 아이콘을 대신할 수 없다.
