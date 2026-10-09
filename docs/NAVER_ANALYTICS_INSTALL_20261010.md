# 네이버 애널리틱스 적용

- 사이트: https://lsifl.blogspot.com/
- 등록 화면에서 확인한 분석 ID: `1269dd838904e20`
- 운영 Blogger 테마를 백업하고 닫는 body 앞에 분석 설정과 비동기 라이브러리를 추가한 뒤 저장했다.
- `theme/naver-analytics.xml`을 테마 생성기에 연결하여 재생성 때 누락되지 않도록 했다. 생성 XML 두 파일에도 같은 최소 변경을 반영했다.
- 공개 홈페이지와 캣 히어로 글에서 정확한 ID, 라이브러리 로드 및 `https://wcs.naver.com/b` beacon 요청을 확인했다. 글의 라이브러리는 1개다.
- XML 검사 통과, 관련 기존 검사 15/15 통과, diff 검사 통과.
- 네이버 대시보드의 통계 집계 반영은 미확인이다. 요청 전송과 집계 완료는 구분한다.
- 이번 공개 검증 방문은 운영자 점검 트래픽이다.

증거: `data/operations/naver-analytics-install-20261010.json`

백업: `backups/blogger-theme-before-naver-analytics-20261010.xml` (로컬 보관)

저장 화면: `output/naver-analytics-theme-saved-20261010.png` (로컬 보관)
