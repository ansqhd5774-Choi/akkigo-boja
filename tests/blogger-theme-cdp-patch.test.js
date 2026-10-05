import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inspectThemeHtml,patchThemeHtml,classifyCdpTabs} from '../tools/apply-blogger-theme-patch-via-cdp.mjs';

const old=`<html><head><b:skin><![CDATA[:root{--ncp-line:#eee}]]></b:skin></head><body>
<b:includable id='postBody' var='post'><data:post.body/></b:includable>
<div id='ncp-coupon-home'></div><button data-ncp-copy='X'>copy</button>
<b:includable id='postBodySnippet' var='post'>
  <div class='container post-body entry-content'>
    <p class='post-snippet-safe'>쿠폰 상세 내용은 자세히 보기에서 확인하세요.</p>
  </div>
</b:includable>
<b:includable id='postBodySnippet' var='post'>
  <div class='container post-body entry-content'>
    <p class='post-snippet-safe'>쿠폰 상세 내용은 자세히 보기에서 확인하세요.</p>
  </div>
</b:includable>
</body></html>`;

test('Blogger 최소 패치는 두 snippet과 CSS만 바꾸고 보존 대상은 유지한다',()=>{
  const before=inspectThemeHtml(old);
  const r=patchThemeHtml(old);
  assert.equal(r.changed,true);
  assert.equal(r.status,'PATCH_READY');
  assert.equal(r.after.snippets,2);
  assert.equal(r.after.hasJumpLink,2);
  assert.equal(r.after.feedGeneric,2);
  assert.equal(r.after.oldSafeText,0);
  assert.equal(r.after.feedCss,1);
  assert.equal(r.after.postBody,before.postBody);
  assert.equal(r.after.home,before.home);
  assert.equal(r.after.copy,before.copy);
});

test('이미 최신 구조면 저장 대상 변경을 만들지 않는다',()=>{
  const first=patchThemeHtml(old);
  const second=patchThemeHtml(first.html);
  assert.equal(second.changed,false);
  assert.equal(second.status,'ALREADY_APPLIED');
  assert.equal(second.html,first.html);
});

test('부분 적용이나 예상 밖 snippet 수는 저장 전 차단한다',()=>{
  assert.throws(()=>patchThemeHtml(old.replace('쿠폰 상세 내용은 자세히 보기에서 확인하세요.','다른 문구')),/THEME_OLD_SNIPPET_COUNT_/);
});


test('CDP 탭 분류는 로그인 화면과 실제 Blogger 편집기를 구분한다',()=>{
  assert.equal(classifyCdpTabs([{url:'https://accounts.google.com/v3/signin/identifier'}]).status,'BLOGGER_LOGIN_REQUIRED');
  assert.equal(classifyCdpTabs([{url:'https://example.com/'}]).status,'BLOGGER_THEME_EDITOR_TAB_NOT_FOUND');
  const ready=classifyCdpTabs([{
    url:'https://draft.blogger.com/blog/themes/edit/2339978524893611480',
    webSocketDebuggerUrl:'ws://127.0.0.1/devtools/page/1'
  }]);
  assert.equal(ready.status,'EDITOR_READY');
  assert.equal(ready.tab.webSocketDebuggerUrl,'ws://127.0.0.1/devtools/page/1');
});
