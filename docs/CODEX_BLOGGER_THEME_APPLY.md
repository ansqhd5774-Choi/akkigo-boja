# CODEX — Blogger 최신 테마 1회 적용 인계

대상:
- 블로그: https://lsifl.blogspot.com/
- blogId: 2339978524893611480
- 저장소: ansqhd5774-Choi/akkigo-boja
- 브랜치: codex/blogger-worker-r1
- 인계 작성 시 HEAD: 4458bd846e7f2c7d9132856ab9a034e537018bb2
- 적용 파일: akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml
- 적용 파일 blob SHA: 90857cdabfa83a6c26a70c62b111e0e9ec8c263e
- 공식 편집기: https://draft.blogger.com/blog/themes/edit/2339978524893611480

목표:
- 기존 R3 홈·검색·복사·단일 게시물 postBody를 보존한다.
- 목록 postBodySnippet만 최신 안전 요약 구조로 적용한다.
- Jump Break가 있는 시바 글은 확인된 쿠폰 수 / 보상 / 만료만 목록에 표시한다.
- 쿠폰 코드와 JavaScript는 목록에 노출하지 않는다.
- Jump Break가 없는 기존 글은 일반 쿠폰 안내 카드 fallback을 사용한다.

실행:
1. origin/codex/blogger-worker-r1 최신 HEAD를 다시 확인한다. 이 문서 작성 이후 변경이 있으면 최신 변경을 보존하고 현재 HEAD의 적용 파일을 사용한다.
2. 현재 Blogger 관리자 HTML 전체를 로컬 비공개 backups/에 백업한다. Git commit 금지.
3. 현재 관리자 HTML의 postBodySnippet을 먼저 확인한다.
   - 이미 최신 구조(data:post.hasJumpLink + data:post.body + ncp-feed-preview-generic)라면 저장하지 않고 ALREADY_APPLIED로 종료한다.
4. 미적용이면 적용 파일 전체를 공식 HTML 편집기에 교체하고 저장 버튼을 1회만 누른다.
5. timeout/결과 불명확이면 두 번째 저장 금지. 현재 편집기 내용을 다시 읽어 실제 저장 상태부터 확인한다.
6. 저장 후 관리자 HTML에서 아래를 확인한다.
   - postBodySnippet 2개
   - data:post.hasJumpLink
   - data:post.body
   - ncp-feed-preview-generic
   - 단일 게시물 postBody 유지
   - ncp-coupon-home 유지
   - data-ncp-copy 유지
7. 공개 화면은 사용자가 최종 확인한다. Codex는 관리자 저장 성공과 공개 확인을 분리해 보고한다.

사전 검증 증거:
- Verify run 37342278067 SUCCESS
- tests 50/50 PASS
- theme regeneration clean diff PASS
- XML 3개 parse PASS
- LAYOUT_OK_390 / LAYOUT_OK_1440
- FEED_LAYOUT_OK_390 / FEED_LAYOUT_OK_1440
- 시바 본문 Publish run 37342377560 SUCCESS
- 기존 postId 4686430079776725627 / URL 유지 / publicVerified=true
- Worker version 7e2413d1-b94e-408e-bfb8-668bb9e0a53f

최종 보고:
- 최신 HEAD:
- 백업 경로:
- Blogger 실제 저장: DONE / ALREADY_APPLIED / BLOCKED / FAILED
- 저장 횟수: 0 또는 1
- 관리자 저장 구조 확인:
- 사용자 공개 화면 확인: PENDING_USER_CHECK

사용자 공개 확인 전 전체 DONE 금지.

## 차단 해제: 클립보드/파일 업로드 없이 CDP로 정확히 전달

대용량 clipboard paste나 로컬 파일 upload가 불완전하면 그 경로를 사용하지 않는다.
로그인된 Chrome의 공식 Blogger HTML 편집기 페이지에 CDP/Playwright로 연결하고,
로컬 Git checkout에서 읽은 XML 문자열을 DevTools Protocol 인자로 편집기 런타임에 직접 전달한다.
이 방식은 clipboard나 file chooser를 거치지 않는다.

### 필수 무결성 절차
1. Node에서 최신 XML을 `fs.readFileSync(...,'utf8')`로 읽고 SHA-256과 문자열 길이를 계산한다.
2. 공식 편집기에서 현재 editor 값을 읽어 백업 파일에 저장한다.
3. editor 구현을 탐지한다. 지원 우선순위:
   - CodeMirror 5: `document.querySelector('.CodeMirror')?.CodeMirror`
   - Ace: `window.ace` + 실제 editor element
   - textarea/contenteditable fallback
4. 편집기에 XML을 **CDP 인자**로 전달해 setValue/value를 교체한다. OS clipboard 금지.
5. 저장 클릭 전에 editor 전체 값을 다시 읽어 Node로 반환한다.
6. 읽어온 값의 SHA-256과 길이가 원본 XML과 **완전히 동일**할 때만 저장 버튼을 1회 누른다.
7. 한 글자라도 다르면 저장 금지하고 `EDITOR_ROUNDTRIP_MISMATCH`로 종료한다.
8. 저장 후 editor 값을 다시 읽어 동일 SHA-256을 확인한다.

### Playwright/CDP 구현 예시
아래는 구조 예시다. 현재 Codex 환경의 기존 로그인 Chrome CDP endpoint를 사용하고 새 프로필을 만들지 않는다.

```js
import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const THEME='akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml';
const EDITOR='https://draft.blogger.com/blog/themes/edit/2339978524893611480';
const xml=fs.readFileSync(THEME,'utf8');
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const expectedSha=sha(xml);

// 기존 로그인 Chrome에만 연결. endpoint는 현재 Codex에서 이미 쓰는 실제 값을 사용한다.
const browser=await chromium.connectOverCDP(process.env.EXISTING_CHROME_CDP);
const context=browser.contexts()[0];
let page=context.pages().find(p=>p.url().includes('draft.blogger.com/blog/themes/edit/'));
if(!page){ page=await context.newPage(); await page.goto(EDITOR); }
await page.waitForLoadState('domcontentloaded');

const adapter=await page.evaluate(()=>{
  const cm=document.querySelector('.CodeMirror')?.CodeMirror;
  if(cm) return 'codemirror5';
  const ta=document.querySelector('textarea');
  if(ta) return 'textarea';
  const ce=document.querySelector('[contenteditable="true"]');
  if(ce) return 'contenteditable';
  const aceEl=document.querySelector('.ace_editor');
  if(aceEl && window.ace) return 'ace';
  return null;
});
if(!adapter) throw new Error('BLOGGER_EDITOR_ADAPTER_NOT_FOUND');

const readEditor=()=>page.evaluate((adapter)=>{
  if(adapter==='codemirror5') return document.querySelector('.CodeMirror').CodeMirror.getValue();
  if(adapter==='textarea') return document.querySelector('textarea').value;
  if(adapter==='contenteditable') return document.querySelector('[contenteditable="true"]').innerText;
  if(adapter==='ace') return window.ace.edit(document.querySelector('.ace_editor')).getValue();
},adapter);

const before=await readEditor();
fs.mkdirSync('backups',{recursive:true});
fs.writeFileSync(`backups/blogger-theme-before-info-preview-${Date.now()}.xml`,before,'utf8');

await page.evaluate(({adapter,xml})=>{
  if(adapter==='codemirror5'){
    const cm=document.querySelector('.CodeMirror').CodeMirror;
    cm.setValue(xml); cm.save?.(); cm.refresh?.();
    return;
  }
  if(adapter==='textarea'){
    const el=document.querySelector('textarea');
    el.value=xml;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
    return;
  }
  if(adapter==='contenteditable'){
    const el=document.querySelector('[contenteditable="true"]');
    el.textContent=xml;
    el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:null}));
    return;
  }
  if(adapter==='ace'){
    window.ace.edit(document.querySelector('.ace_editor')).setValue(xml,-1);
  }
},{adapter,xml});

const roundTrip=await readEditor();
if(roundTrip.length!==xml.length || sha(roundTrip)!==expectedSha){
  throw new Error('EDITOR_ROUNDTRIP_MISMATCH');
}

// 여기서 실제 Blogger 저장 버튼 selector를 현재 DOM에서 확인한 뒤 1회만 click.
// selector를 추정하지 말고 visible/enabled 저장 버튼을 먼저 식별한다.
```

### 금지
- XML을 채팅에 분할 붙여넣기
- 14만자 전체를 OS clipboard 한 번에 전달
- clipboard 실패 후 반복 저장
- local file:// 우회
- editor round-trip hash가 다른 상태에서 저장
- 저장 버튼 selector 추정 클릭

이 절차로도 editor adapter를 찾지 못한 경우에만 `BLOCKED: BLOGGER_EDITOR_ADAPTER_NOT_FOUND`로 보고한다.
