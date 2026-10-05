# 게임 쿠폰 벤치마크 대상 확정 R1

작성일: 2026-10-05
대상: https://lsifl.blogspot.com/
기준 브랜치: codex/blogger-worker-r1
기준 SHA: 9c22c3fafb571170d5fb50b75b8ae4231a51678e

## 1. 해외 기준 사이트

### Pro Game Guides
샘플:
- Peroxide Codes (October 2026)
- Loot Up Codes (October 2026)
- Last Stop Codes (October 2026)

반복 구조:
- 제목 + 작성자 + Updated
- 상단 업데이트 박스
- Active / Inactive 분리
- 코드 / Copy / Description 표
- NEW 표시
- 쿠폰 수가 많을 때 Load More
- How to Redeem
- Where to Find New Codes

주요 벤치마크 포인트:
- 코드와 Copy 버튼의 즉시 접근성
- Active/Inactive 탭과 수량 표시
- 코드/보상 표의 높은 정보 밀도
- 입력 방법의 번호형 단계
- 관련 코드 글 연결

### Beebom
샘플:
- Anime Dice Codes (October 2026)
- Anime Capture Codes (October 2026)
- Anime Simulator Codes (October 2026)

반복 구조:
- 월 포함 제목
- Updated + 별도 "checked for new codes" 문구
- 짧은 도입
- All New ... Codes
- 코드 : 보상 + NEW + Copy
- Expired Codes 분리
- 후반 입력 방법/추가 코드 안내

주요 벤치마크 포인트:
- 코드 한 줄에서 코드·보상·NEW·Copy를 모두 해결
- 모바일에서도 읽기 쉬운 단순 리스트 밀도
- 최신성 문구를 짧게 처리

### Pocket Gamer
샘플:
- Chapters redemption codes
- Puzzles & Survival codes
- Solo Leveling Arise codes
- Cookie Run Kingdom codes

반복 구조:
- 제목 + 작성자 + 날짜 + 플랫폼
- Updated on ... - checked for codes
- 짧은 도입
- Active/Working codes
- Expired codes
- How to redeem
- 게임/스토어 관련 링크

주요 벤치마크 포인트:
- 모바일 게임에 맞는 플랫폼/업데이트 정보
- 활성/만료 구분이 단순함
- 입력 방법이 본문 흐름 안에 자연스럽게 포함

### Destructoid
샘플:
- Archived codes
- Loot the Deep codes
- A Cultivation Game codes

반복 구조:
- 제목 + Published
- Updated 인용 박스
- 짧은 소개
- All ... codes list
- Active codes
- 코드 / Copy / 보상
- 입력법/관련 글

주요 벤치마크 포인트:
- 상단 업데이트 정보의 시각적 분리
- Active/Expired 계층이 명확함
- 코드 표와 본문 설명의 간격이 큼

## 2. 국내 기준 사이트

### 냥코프
샘플:
- 게임 쿠폰 허브
- 에르피스 쿠폰 모음
- 명조/워더링 웨이브 등 개별 쿠폰 페이지

반복 구조:
- 게임명 + "쿠폰 모음 (2026년 최신)"
- 업데이트 날짜
- 공식 채널
- 목차
- 쿠폰 목록
- 활성/만료 구분
- 보상과 만료일
- 쿠폰 등록 방법
- FAQ

주요 벤치마크 포인트:
- 한국어 쿠폰 사용자가 기대하는 정보 순서
- 공식 채널을 위쪽에 두는 방식
- 쿠폰/보상/만료의 카드형 묶음
- 목차, 입력법, FAQ까지 한 페이지에서 해결

### 쿠폰던전
확인 구조:
- 게임명/쿠폰 검색
- 장르 필터
- 인기 게임 바로가기
- 최신 쿠폰
- 코드 + 복사
- 만료일
- 게임별 전체 쿠폰
- 작동 여부 피드백
- 쿠폰 입력 방법

주요 벤치마크 포인트:
- 코드 복사를 최우선 액션으로 배치
- 만료일을 코드 근처에 배치
- 게임별 이동 동선이 짧음
- 한국어 모바일 사용자용 컴포넌트 밀도가 높음

주의:
- 사이트의 이용약관에도 쿠폰 유효성을 보증하지 않는다고 명시되어 있으므로, 작동 여부 숫자나 투표값을 우리 사이트의 검증 근거로 사용하지 않는다.

### DIGWOW
확인 구조:
- 게임별 쿠폰/공략 허브
- 작성자·날짜 표시
- 쿠폰 업데이트/편집 기준 설명
- 게임 채널 및 관련 공략 연결

주요 벤치마크 포인트:
- 쿠폰만 고립하지 않고 게임 허브/공략과 연결하는 내부 링크 구조
- 작성자·업데이트 시점 노출 방식

주의:
- 개별 쿠폰 페이지의 과거 검색 결과와 현재 URL 구조가 달라진 사례가 있어 UI 보조 참고 대상으로만 사용한다.

## 3. 최종 우선순위

A급 — 시바 모험단 글 직접 디자인 기준
1. Pro Game Guides
2. Beebom
3. 냥코프
4. 쿠폰던전

B급 — 구조/본문 순서 보조 기준
5. Pocket Gamer
6. Destructoid

C급 — 내부링크/게임 허브 참고
7. DIGWOW

## 4. 시바 모험단에 그대로 가져올 요소

- 제목 아래 짧은 업데이트 정보
- 현재 사용 가능한 쿠폰 수
- 코드 바로 옆 복사 버튼
- 코드 / 보상 / 만료를 한 카드에서 처리
- Active / Expired 명확 분리
- NEW는 실제 신규 코드일 때만 표시
- 공식 입력 페이지를 강한 CTA 버튼으로 제공
- 게임 입력 / 웹 입력을 별도 카드로 분리
- "쿠폰이 안 될 때" 체크리스트
- 새 쿠폰 확인 방법
- 관련 게임 쿠폰 카드
- FAQ
- 모바일 390px에서 표 대신 카드 우선

## 5. 가져오지 않을 요소

- 근거 없는 "검증됨", "100% 작동", 인기 순위
- 작동 투표를 공식 검증처럼 표현
- 내부 validator/UNVERIFIED/evidenceMethod 노출
- 과도한 광고 간격이나 긴 서론
- 코드보다 먼저 보이는 불필요한 운영 설명

## 판정

1단계 벤치마크 대상 확정: DONE
다음 단계: 현재 시바 모험단 글을 동일 항목으로 상세 해부하고 차이를 없음/약함/다름/불필요로 분류한다.
