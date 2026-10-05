# Blogger 목록 미리보기 최소 패치 — 전체 XML 전송 불필요

대상
- blogId: 2339978524893611480
- 관리자: https://draft.blogger.com/blog/themes/edit/2339978524893611480
- 기준 HEAD: 7cc3272d701c5fb69aff0dd71ff6fa74fb5dfeb8
- 목표: 현재 안전 문구형 postBodySnippet을 정보형 목록 미리보기로 최소 변경
- 전체 XML 교체 금지. 아래 CSS + postBodySnippet 2개만 변경.

## 1. CSS 추가
현재 b:skin 내부 R3 CSS 끝부분에 아래를 추가한다.

```css
.ncp-feed-preview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0 6px}
.ncp-feed-stat{min-width:0;padding:12px 14px;border:1px solid var(--ncp-line);border-radius:10px;background:#f8fafc}
.ncp-feed-stat span{display:block;margin-bottom:3px;color:#64748b;font-size:12px;font-weight:700}
.ncp-feed-stat strong{display:block;color:#172033;font-size:15px;line-height:1.45;overflow-wrap:anywhere}
.ncp-feed-preview-generic .ncp-feed-stat strong{font-size:14px}
@media(max-width:700px){.ncp-feed-preview{grid-template-columns:1fr;gap:8px}}
```

## 2. postBodySnippet 2개 교체
현재 아래 구버전 블록을 검색한다.

```xml
<b:includable id='postBodySnippet' var='post'>
  <div class='container post-body entry-content'>
    <p class='post-snippet-safe'>쿠폰 상세 내용은 자세히 보기에서 확인하세요.</p>
  </div>
</b:includable>
```

정확히 2개여야 한다. 두 블록만 아래로 교체한다.

```xml
<b:includable id='postBodySnippet' var='post'>
  <div class='container post-body entry-content'>
    <b:if cond='data:post.hasJumpLink'>
      <data:post.body/>
    <b:else/>
      <div class='ncp-feed-preview ncp-feed-preview-generic'>
        <div class='ncp-feed-stat'><span>쿠폰 안내</span><strong>최신 정보</strong></div>
        <div class='ncp-feed-stat'><span>확인 항목</span><strong>코드 · 보상</strong></div>
        <div class='ncp-feed-stat'><span>이용 방법</span><strong>입력 안내</strong></div>
      </div>
    </b:if>
  </div>
</b:includable>
```

## 3. 저장 전 검증
- 교체된 postBodySnippet = 2
- data:post.hasJumpLink = 2
- ncp-feed-preview-generic = 2
- 구문 '쿠폰 상세 내용은 자세히 보기에서 확인하세요.' = 0
- 단일 postBody 블록은 변경 금지
- ncp-coupon-home / 검색 form / data-ncp-copy 변경 금지
- XML 전체를 다시 읽거나 재붙여넣지 않아도 됨

## 4. 저장
- 현재 관리자 HTML 전체를 먼저 로컬 비공개 backup으로 보관
- 위 최소 패치만 적용
- 저장 1회
- timeout이면 재저장 금지, 현재 editor 상태부터 다시 확인

## 5. 공개 기대값
시바 목록:
- 확인된 쿠폰 1개
- 시바 코인 10개
- 10월 6일 오전 9시

목록 금지:
- pick7p2y
- navigator.clipboard
- onclick
- JavaScript 코드 조각


## TinyFish 없이 실행하는 권장 경로
TinyFish/RDC를 사용하지 않는다. 로그인된 로컬 Chrome이 remote debugging으로 열려 있으면 아래 전용 runner를 사용한다.

- runner: `tools/apply-blogger-theme-patch-via-cdp.mjs`
- 기본 CDP: `http://127.0.0.1:9222`
- 다른 포트면 `BLOGGER_CDP_URL` 환경변수로 지정
- dry-run: `node tools/apply-blogger-theme-patch-via-cdp.mjs`
- 실제 1회 저장: `node tools/apply-blogger-theme-patch-via-cdp.mjs --apply`

runner 동작:
1. 로그인된 Blogger 테마 편집 탭만 선택.
2. 현재 editor 전체를 `backups/`에 비공개 백업.
3. 구 안전 문구형 snippet 2개만 조건부 snippet으로 교체.
4. 정보형 미리보기 CSS가 없을 때만 추가.
5. postBody/home/search/copy 수가 바뀌면 저장 전 차단.
6. editor round-trip SHA-256이 일치하지 않으면 저장 전 차단.
7. visible/enabled 저장 버튼이 정확히 1개일 때만 1회 클릭.
8. 저장 후 페이지 reload, 실제 editor 구조를 다시 읽어 최신 구조가 유지됐는지 확인.
9. 저장 결과가 불명확하면 재저장하지 않고 실패 종료.

성공 출력은 `result:DONE`, 이미 반영됐으면 `result:ALREADY_APPLIED`다.
