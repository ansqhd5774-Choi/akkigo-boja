// AKKIGO persistent copy feedback: copying is not redemption confirmation.
(function(){
 const key=button=>'ncp-copied:'+location.pathname+':'+button.dataset.ncpCopy;
 const mark=button=>{delete button.dataset.ncpCopyError;button.dataset.ncpCopied='true';button.textContent='복사 완료';};
 const restore=()=>document.querySelectorAll('[data-ncp-copy]').forEach(button=>{try{if(localStorage.getItem(key(button))==='1')mark(button);}catch{}});
 restore();document.addEventListener('DOMContentLoaded',restore,{once:true});
 document.addEventListener('click',async event=>{
  const share=event.target.closest('[data-ncp-share]');
  if(share){
   event.preventDefault();event.stopImmediatePropagation();
   const code=share.dataset.ncpShare;const url=location.origin+location.pathname;
   const label=code+' 공유';const payload={title:document.title,text:code,url};
   const fallback=share.dataset.ncpShareFallback==='true';
   share.setAttribute('aria-label',label);share.title='공유';delete share.dataset.ncpShareError;
   const shareStatus=share.closest?.('.ncp-code-card')?.querySelector('[role="status"]');if(shareStatus)shareStatus.textContent='';
   share.disabled=true;
   try{
    if(!fallback&&navigator.share&&(!navigator.canShare||navigator.canShare(payload)))await navigator.share(payload);
    else {await navigator.clipboard.writeText(code+'\n'+url);share.setAttribute('aria-label','공유 링크 복사 완료');share.title='공유 링크 복사 완료';delete share.dataset.ncpShareFallback;}
   }catch(error){if(error.name!=='AbortError'){
    share.dataset.ncpShareError=error.name||'Error';share.dataset.ncpShareFallback='true';
    const message=fallback?'링크 복사 실패 · 다시 시도':'공유 링크 복사 · 다시 누르세요';
    share.setAttribute('aria-label',message);share.title=message;
    if(shareStatus)shareStatus.textContent=message;
   }}
   finally{share.disabled=false;}
   return;
  }
  const button=event.target.closest('[data-ncp-copy]');if(!button)return;
  event.preventDefault();event.stopImmediatePropagation();
  const scope=button.closest('.ncp-code-card,.ncp-coupon-card,.ncp-r3-card')||button.parentElement;
  const status=scope?.querySelector('.ncp-copy-state,[role="status"]');
  button.disabled=true;
  try{
   await navigator.clipboard.writeText(button.dataset.ncpCopy||'');
   mark(button);try{localStorage.setItem(key(button),'1');}catch{}
   if(status)status.textContent='코드를 복사했습니다.';
  }catch{
   button.textContent='복사 실패';button.dataset.ncpCopyError='true';
   if(status)status.textContent='복사하지 못했습니다. 코드를 직접 선택해 복사하세요.';
  }finally{button.disabled=false;}
 },true);
})();
