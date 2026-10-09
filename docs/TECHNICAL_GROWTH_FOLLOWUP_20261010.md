# 기술 품질 후속 점검 — 2026-10-10

실제 공개 77글을 HTTP로 조회해 구조화 데이터의 제목·대표 URL, OG 대표 URL·이미지 접근, 이미지 속성을 대조했다. 검사 도구 작성만으로 완료 처리하지 않는다. 새 발견은 공유 이미지 HTTP400 3건과 기본 구조화 데이터의 publisher 브랜드 불일치다.

## 항목별 결과

| ID | 결과 | 실제 근거와 남은 범위 |
|---:|---|---|
|19|PARTIAL|공개77글 feed/sitemap 수정일 일치 기존 증거 유효. 모든 과거 수정 사건의 내용 diff 대조는 미완료. 단순 날짜 변경을 새 검증으로 표시하지 않음.|
|23|검토 완료 / 적용 DEFERRED|IndexNow는 동일 호스트의 UTF-8 텍스트 키 파일이 필요. Blogger API는 글/HTML 페이지 운영 기능이며 현재 blogspot 호스트에 임의 텍스트 파일을 제공하는 공식 경로가 확인되지 않음. Worker의 다른 호스트에 키를 두는 방식은 요건을 충족하지 못함. 키 생성·가짜 제출·호스트 이전을 하지 않음.|
|26|PARTIAL|77글 canonical와 공개 대표 URL·JSON-LD mainEntityOfPage·og:url 전수 일치. Google 선택 canonical은 별도 Provider 증거 필요.|
|28|DONE|공개 feed77/sitemap77/실제HTTP77 집합 일치, 중복·누락0, 수정일 일치. 원 기준은 공개 가능한 대표 URL/변경 상태 반영이므로 내부 DB 전체 원장 대조를 추가 완료조건으로 요구하지 않음.|
|29|PARTIAL|내부177URL 오류0 기존 검증 유효. 공유 이미지3URL HTTP400 실제 발견·source 수정. 모든 외부 출처의 HTTP 오류와 Google soft404는 아직 미검증.|
|31|PARTIAL|77글 BlogPosting 존재, 실제 post-title와 headline 일치77/77, mainEntityOfPage 일치77/77. 기본 publisher.name=Blogger가77글에 나타나 사이트 브랜드와 불일치. 날짜·작성자·발행인 의미의 전수 검증은 미완료. Blogger 내장 postMetadataJSON의 전체 대체는 이번 소스 수정에서 하지 않음.|
|33|PARTIAL → 발행 후 재확인 필요|77글 OG 이미지 존재, og:url 일치. 이미지 실조회 중3건400 발견. 캣히어로/소다전설/나만SSS급퇴마사의 source URL에서 잘못 인코딩된 사이즈 suffix 제거. 수정 URL의 Blogger1200x630 변형 응답200/image/png 확인. existingOnly 발행 요청3개 준비. 실제 게시 후 OG 재조회 및 공유앱 preview 필요.|
|34|미완료|공식 앱 아이콘 출처 연결은 이용 허락·라이선스 증명이 아님. 전 이미지 권리 원장 부재. 임의로 권리 허용 표시하지 않음.|
|36|PARTIAL|77글 img alt 누락0. width/height 미지정 이미지를 포함한 페이지21개. 적정 intrinsic크기·srcset·실제 CLS 전수 미완료.|
|37|PARTIAL|격리 Chrome 탐색/첫페인트 측정값 확보. 실제 사용자 측정·waterfall 병목 원인 비교와 개선은 미완료.|
|38|미완료|Lighthouse/CrUX 동일 조건 전후 비교 미실행. 서버 HTTP시간이나 첫페인트를 CWV 개선으로 해석하지 않음.|
|39|PARTIAL|격리 새 Chrome에서77글 실제390px, 홈390/430/768/1440 총81렌더: 넘침0·완료된 깨진 이미지0·alt누락0. lazy 이미지 미로딩을 로딩성공으로 계산하지 않음. 추가4폭 전수는 도구선택 제약 확인 후 중단. 사용자브라우저Cua검사/확대·키보드 검증과 구분.|
|40|미완료|alt 정적검사 통과. 기본 Blogger 숨은 버튼을 포함한 단순 레이블 검사는 접근성 실패 증거로 사용하지 않음. 키보드 순서·명도 대비·스크린리더 전수는 미검증.|
|41|PARTIAL|기본 무로그인 렌더에서 표시된 role=dialog 수 수집. 광고 실제 노출조건·팝업·확대·sticky 간섭은 미검증.|

## 실제 변경과 검증

- data/game-period-articles.json: soda-legend-codes-202610, solo-sss-exorcist-codes-202610 featuredHTML의 Google 앱 아이콘 사이즈 suffix 제거. 해당2키만 renderer 실행, PERIOD_RENDERED2.
- data/cat-hero-codes-202610.json: 독립 모델임을 src/cat-hero-article.js import로 확인하고 동일 URL 오류 수정. 기존 글 identity/쿠폰 원문·검색 메타 보존.
- publish-requests/*image-repair-20261010.json 3개: approved=true/existingOnly=true. 신규 글 생성 금지.
- 표현 정적 검사: PRESENTATION_POLICY_PASS42.
- data/game-app-icons.json: 같은3개 articleKey iconUrl을 원본 앱 아이콘과 일치하도록 동기화. host/path/hash/appID 보존, 인코딩된 사이즈 suffix만 제거. 소다전설 회귀1/1 PASS, 기존 exact URL 검증 assertion 유지.
- data/operations/technical-public-evidence-20261010.json: 공개 전수 결과와 수정 URL 원본/1200x630 응답200을 기록. 실제 공개 갱신은 PENDING으로 구분.
- tools/audit-public-semantic.mjs 실제 공개77글 완료, fetchErrors0, schemaHeadlineMismatch0, schemaCanonicalMismatch0, ogUrlMismatch0, OG실조회4003건. 초기 h1이 사이트명인 것을 확인해 post-title로 비교 대상을 수정한 뒤 전수 재실행. 문제가 없도록 assertion을 낮춘 것이 아니라 실제 글 제목으로 비교한 것.
- output/public-semantic-audit.json: 세부 URL/구조화 데이터/이미지 응답 증거. 수정 발행 전 baseline.
- output/public-render-audit.json 및 public-render-*.png: 격리 Chrome 측정 증거. 사용자 브라우저/수동검증이 아니며 Cua가 아닌 shell Chrome CDP를 추가 정식 운영 도구로 남기지 않음. 후속 실행 중단 및 해당 임시 검사 스크립트 제거. 이미 확보된 실제 렌더링 관찰은 소급 무효화하지 않되 전수완료 조건과 구분.

## 공식 근거

- [IndexNow 공식 문서](https://www.indexnow.org/documentation): 동일 호스트 텍스트 키 파일, 서브경로 범위,200은 접수 의미.
- [Blogger API 공식 사용 안내](https://developers.google.com/blogger/docs/3.0/using), [Pages 공식 리소스](https://developers.google.com/blogger/docs/3.0/reference/pages): 현재 지원하는 콘텐츠 관리 기능. API 문서에 임의 key.txt 파일 호스팅 기능 없음은 현재 적용 판단의 근거이며 모든 미래 지원 가능성을 부정하는 의미는 아님.

지금 source 수정/검증과 실제 게시를 구분한다. 이미지3개 공개 반영 성공은 부모 발행 로그·독립 HTTP OG조회가 나오기 전까지 미완료다.
