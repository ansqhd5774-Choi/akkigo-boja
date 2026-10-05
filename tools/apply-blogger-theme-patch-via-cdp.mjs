import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';

const BLOG_ID='2339978524893611480';
const EDITOR_URL_PART='/blog/themes/edit/'+BLOG_ID;
const DEFAULT_CDP_ENDPOINT='http://127.0.0.1:9231';
const OLD_BLOCK=`<b:includable id='postBodySnippet' var='post'>
  <div class='container post-body entry-content'>
    <p class='post-snippet-safe'>쿠폰 상세 내용은 자세히 보기에서 확인하세요.</p>
  </div>
</b:includable>`;
const NEW_BLOCK=`<b:includable id='postBodySnippet' var='post'>
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
</b:includable>`;
const FEED_CSS=`.ncp-feed-preview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0 6px}
.ncp-feed-stat{min-width:0;padding:12px 14px;border:1px solid var(--ncp-line);border-radius:10px;background:#f8fafc}
.ncp-feed-stat span{display:block;margin-bottom:3px;color:#64748b;font-size:12px;font-weight:700}
.ncp-feed-stat strong{display:block;color:#172033;font-size:15px;line-height:1.45;overflow-wrap:anywhere}
.ncp-feed-preview-generic .ncp-feed-stat strong{font-size:14px}
@media(max-width:700px){.ncp-feed-preview{grid-template-columns:1fr;gap:8px}}
`;

const sha256=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const count=(s,needle)=>s.split(needle).length-1;

export function inspectThemeHtml(html){
  return {
    oldSafeText:count(html,'쿠폰 상세 내용은 자세히 보기에서 확인하세요.'),
    snippets:count(html,"<b:includable id='postBodySnippet' var='post'>"),
    hasJumpLink:count(html,'data:post.hasJumpLink'),
    feedGeneric:count(html,"<div class='ncp-feed-preview ncp-feed-preview-generic'>"),
    feedCss:count(html,'.ncp-feed-preview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'),
    postBody:count(html,"<b:includable id='postBody' var='post'>"),
    home:count(html,'ncp-coupon-home'),
    copy:count(html,'data-ncp-copy')
  };
}

export function patchThemeHtml(html){
  const before=inspectThemeHtml(html);
  const already=before.snippets===2 && before.hasJumpLink>=2 && before.feedGeneric>=2 && before.oldSafeText===0 && before.feedCss>=1;
  if(already) return {html,changed:false,status:'ALREADY_APPLIED',before,after:before};

  const oldBlocks=count(html,OLD_BLOCK);
  if(oldBlocks!==2) throw new Error(`THEME_OLD_SNIPPET_COUNT_${oldBlocks}`);

  let next=html.split(OLD_BLOCK).join(NEW_BLOCK);
  if(!next.includes('.ncp-feed-preview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))')){
    const skinEnd=']]></b:skin>';
    if(count(next,skinEnd)!==1) throw new Error('THEME_SKIN_END_NOT_UNIQUE');
    next=next.replace(skinEnd,FEED_CSS+skinEnd);
  }

  const after=inspectThemeHtml(next);
  if(after.snippets!==2 || after.hasJumpLink<2 || after.feedGeneric<2 || after.oldSafeText!==0 || after.feedCss<1){
    throw new Error('THEME_PATCH_POSTCONDITION_FAILED');
  }
  if(after.postBody!==before.postBody || after.home!==before.home || after.copy!==before.copy){
    throw new Error('THEME_PATCH_SCOPE_VIOLATION');
  }
  return {html:next,changed:true,status:'PATCH_READY',before,after};
}

class Cdp {
  constructor(wsUrl){this.ws=new WebSocket(wsUrl);this.id=0;this.pending=new Map();}
  async open(){
    await new Promise((resolve,reject)=>{
      this.ws.addEventListener('open',resolve,{once:true});
      this.ws.addEventListener('error',reject,{once:true});
      this.ws.addEventListener('message',e=>{
        const m=JSON.parse(e.data);
        if(!m.id) return;
        const p=this.pending.get(m.id);
        if(!p) return;
        this.pending.delete(m.id);
        if(m.error) p.reject(new Error(m.error.message||'CDP_ERROR')); else p.resolve(m.result);
      });
    });
  }
  call(method,params={}){
    const id=++this.id;
    return new Promise((resolve,reject)=>{
      this.pending.set(id,{resolve,reject});
      this.ws.send(JSON.stringify({id,method,params}));
    });
  }
  close(){this.ws.close();}
}

async function sleep(ms){await new Promise(r=>setTimeout(r,ms));}

async function evalValue(cdp,expression){
  const r=await cdp.call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error('PAGE_EVAL_FAILED');
  return r.result?.value;
}

async function editorAdapter(cdp){
  return evalValue(cdp,`(()=>{const cm=document.querySelector('.CodeMirror')?.CodeMirror;if(cm)return 'codemirror5';const aceEl=document.querySelector('.ace_editor');if(aceEl&&window.ace)return 'ace';const tas=[...document.querySelectorAll('textarea')].sort((a,b)=>(b.value||'').length-(a.value||'').length);if(tas[0])return 'textarea';const ces=[...document.querySelectorAll('[contenteditable="true"]')].sort((a,b)=>(b.innerText||'').length-(a.innerText||'').length);if(ces[0])return 'contenteditable';return null})()`);
}

function readExpr(adapter){
  if(adapter==='codemirror5') return `document.querySelector('.CodeMirror').CodeMirror.getValue()`;
  if(adapter==='ace') return `window.ace.edit(document.querySelector('.ace_editor')).getValue()`;
  if(adapter==='textarea') return `[...document.querySelectorAll('textarea')].sort((a,b)=>(b.value||'').length-(a.value||'').length)[0].value`;
  if(adapter==='contenteditable') return `[...document.querySelectorAll('[contenteditable="true"]')].sort((a,b)=>(b.innerText||'').length-(a.innerText||'').length)[0].innerText`;
  throw new Error('BLOGGER_EDITOR_ADAPTER_NOT_FOUND');
}

function setExpr(adapter,html){
  const v=JSON.stringify(html);
  if(adapter==='codemirror5') return `(()=>{const cm=document.querySelector('.CodeMirror').CodeMirror;cm.setValue(${v});cm.save?.();cm.refresh?.();return cm.getValue().length})()`;
  if(adapter==='ace') return `(()=>{const e=window.ace.edit(document.querySelector('.ace_editor'));e.setValue(${v},-1);return e.getValue().length})()`;
  if(adapter==='textarea') return `(()=>{const el=[...document.querySelectorAll('textarea')].sort((a,b)=>(b.value||'').length-(a.value||'').length)[0];el.value=${v};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return el.value.length})()`;
  if(adapter==='contenteditable') return `(()=>{const el=[...document.querySelectorAll('[contenteditable="true"]')].sort((a,b)=>(b.innerText||'').length-(a.innerText||'').length)[0];el.textContent=${v};el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText'}));return el.innerText.length})()`;
  throw new Error('BLOGGER_EDITOR_ADAPTER_NOT_FOUND');
}

export function classifyCdpTabs(tabs){
  const tab=tabs.find(x=>String(x.url||'').includes(EDITOR_URL_PART));
  if(tab?.webSocketDebuggerUrl) return {status:'EDITOR_READY',tab};
  const loginRequired=tabs.some(x=>{
    const url=String(x.url||'');
    return url.includes('accounts.google.com') || url.includes('/ServiceLogin') || url.includes('/signin/');
  });
  if(loginRequired) return {status:'BLOGGER_LOGIN_REQUIRED',tab:null};
  return {status:'BLOGGER_THEME_EDITOR_TAB_NOT_FOUND',tab:null};
}

async function main(){
  const apply=process.argv.includes('--apply');
  const syncSource=process.argv.includes('--sync-source');
  const endpoint=process.env.BLOGGER_CDP_URL||DEFAULT_CDP_ENDPOINT;
  const tabs=await fetch(endpoint.replace(/\/$/,'')+'/json/list').then(r=>{if(!r.ok)throw new Error('CDP_HTTP_'+r.status);return r.json();});
  const classified=classifyCdpTabs(tabs);
  if(classified.status!=='EDITOR_READY') throw new Error(classified.status);
  const tab=classified.tab;

  const cdp=new Cdp(tab.webSocketDebuggerUrl);
  await cdp.open();
  try{
    await cdp.call('Runtime.enable');
    const adapter=await editorAdapter(cdp);
    if(!adapter) throw new Error('BLOGGER_EDITOR_ADAPTER_NOT_FOUND');
    const before=await evalValue(cdp,readExpr(adapter));
    if(typeof before!=='string' || before.length<50000) throw new Error('BLOGGER_EDITOR_CONTENT_TOO_SMALL');

    mkdirSync('backups',{recursive:true});
    const stamp=new Date().toISOString().replace(/[:.]/g,'-');
    const backup=`backups/blogger-theme-before-info-preview-${stamp}.xml`;
    writeFileSync(backup,before,'utf8');

    const patched=syncSource
      ? {html:readFileSync('akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml','utf8'),status:'SOURCE_SYNC_READY'}
      : patchThemeHtml(before);
    const expected=patched.html;
    const changed=sha256(before)!==sha256(expected);
    console.log(JSON.stringify({phase:'prepared',mode:syncSource?'SOURCE_SYNC':'MINIMAL_PATCH',adapter,backup,beforeLength:before.length,beforeSha256:sha256(before),afterLength:expected.length,afterSha256:sha256(expected),status:changed?patched.status:'ALREADY_APPLIED'}));

    if(!changed){
      console.log(JSON.stringify({result:'ALREADY_APPLIED',backup}));
      return;
    }

    await evalValue(cdp,setExpr(adapter,expected));
    const roundTrip=await evalValue(cdp,readExpr(adapter));
    if(roundTrip.length!==expected.length || sha256(roundTrip)!==sha256(expected)) throw new Error('EDITOR_ROUNDTRIP_MISMATCH');
    console.log(JSON.stringify({phase:'roundtrip',length:roundTrip.length,sha256:sha256(roundTrip),match:true}));

    if(!apply){
      await evalValue(cdp,setExpr(adapter,before));
      console.log(JSON.stringify({result:'DRY_RUN_PASS',restored:true,backup}));
      return;
    }

    const click=await evalValue(cdp,`(()=>{const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&!e.disabled};const all=[...document.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"]')].filter(visible);const hits=all.filter(e=>{const t=(e.innerText||e.value||e.getAttribute('aria-label')||e.title||'').trim();return /^(저장|Save)$/i.test(t)});if(hits.length!==1)return {ok:false,count:hits.length,candidates:all.map(e=>(e.innerText||e.value||e.getAttribute('aria-label')||e.title||'').trim()).filter(Boolean).slice(0,30)};hits[0].click();return {ok:true,label:(hits[0].innerText||hits[0].value||hits[0].getAttribute('aria-label')||'').trim()}})()`);
    if(!click?.ok) throw new Error('BLOGGER_SAVE_BUTTON_NOT_UNIQUE_'+JSON.stringify(click));
    console.log(JSON.stringify({phase:'save-click',count:1,label:click.label}));

    await sleep(6000);
    await evalValue(cdp,'location.reload()');
    await sleep(7000);
    const adapter2=await editorAdapter(cdp);
    if(!adapter2) throw new Error('BLOGGER_EDITOR_ADAPTER_NOT_FOUND_AFTER_RELOAD');
    const persisted=await evalValue(cdp,readExpr(adapter2));
    const state=inspectThemeHtml(persisted);
    const structurallyApplied=state.snippets===2 && state.hasJumpLink>=2 && state.feedGeneric>=2 && state.oldSafeText===0 && state.feedCss>=1;
    console.log(JSON.stringify({phase:'persisted',adapter:adapter2,length:persisted.length,sha256:sha256(persisted),exactHash:sha256(persisted)===sha256(expected),structurallyApplied,state}));
    if(!structurallyApplied) throw new Error('BLOGGER_SAVE_NOT_PERSISTED');
    console.log(JSON.stringify({result:'DONE',saved:1,backup,structurallyApplied:true}));
  } finally {
    cdp.close();
  }
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(error=>{console.error(JSON.stringify({result:'FAILED',error:String(error?.message||error)}));process.exitCode=1;});
}
