# 아끼고 보자 공개 코드 적용 R1

- Fuse.js 7.5.0 (Apache-2.0): 입력할 때만 로드하는 최근 게시물 검색 추천. 전체 검색은 기존 Blogger GET form을 유지한다. 최근 150개 게시물 범위라는 안내를 표시한다.
- lucide-static 1.52.0 (ISC 및 Feather 유래 MIT): 필요한 12개 SVG만 추출. 카테고리·하트·이동 버튼 아이콘을 사용하며 각 저작권 및 허가 문구를 테마와 assets/licenses/lucide.txt에 보존한다.
- sharp 0.34.5 (Apache-2.0): 원본 홈 이미지를 유지하면서 960px WebP를 생성한다. 네이티브 libvips 등 전이 의존성 라이선스는 설치 패키지에 보존한다.
- SVGO 4.0.0 (MIT): 선택한 SVG만 빌드 시 최적화한다.

정확한 패키지 버전 및 무결성은 pnpm-lock.yaml에 기록한다. `node tools/build-site-assets.mjs`로 생성하며 결과물을 저장소에 포함하므로 방문자나 Blogger가 npm 설치를 수행하지 않는다. Fuse 변환은 고정된 ESM의 default export만 classic script로 바꾸고 라이선스 고지를 보존한다.

기존 복사 상태 저장, 12개 페이지, 모바일 4열, 상세 본문, 라벨, postId 및 URL을 유지한다. 카드 목록은 하트 API를 기다리지 않으며 미확인 집계를 0으로 대체하지 않는다. 스와이프·방향키와 동작 축소 설정을 지원한다. 외부 HTML은 표시하지 않고 검색 결과는 textContent로 만든다.

Embla/Splide는 기존 페이지 기능과 겹쳐 추가하지 않았다. Clipboard/Toastify는 기존 지속 복사 피드백을 유지하며 추가하지 않았다. 모달·영상·스크롤 장식·테마 전체 교체는 현재 사용처가 없어 제외했다. 별도 웹폰트 다운로드 대신 시스템 글꼴을 사용한다. 신규 구독·과금·권한·DB 변경을 추가하지 않는다.

검증: Node 회귀 검사, XML 검사, Worker dry-run 및 390/1440 브라우저 fixture. 실제 적용은 현재 Blogger 테마 백업에 두 목록 스크립트 교체, 공통 스크립트·CSS 추가, 카테고리 SVG와 hero picture만 패치한다. 전체 XML 교체 금지. 저장 전 round-trip 확인, 저장 1회 후 관리자 재조회와 공개 화면을 확인한다.

이 문서는 구현 범위를 기록하며 실행 전인 Production 검증을 완료로 선언하지 않는다.
