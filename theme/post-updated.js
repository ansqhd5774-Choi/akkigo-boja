// Use Blogger's server-rendered modification date, never the visitor's current date.
(function(){
  if(!/^\/\d{4}\/\d{2}\/.+\.html$/.test(location.pathname))return;
  const time=document.querySelector('.post-header time.published');if(!time)return;
  for(const script of document.querySelectorAll('script[type="application/ld+json"]')){
    try{
      const data=JSON.parse(script.textContent);
      const rows=Array.isArray(data)?data:(data['@graph']||[data]);
      const post=rows.find(row=>row['@type']==='BlogPosting'&&new URL(row.mainEntityOfPage?.['@id']||row.url,location.href).pathname===location.pathname);
      if(!post?.dateModified||!/^\d{4}-\d{2}-\d{2}T/.test(post.dateModified))continue;
      const date=new Date(post.dateModified);if(!Number.isFinite(date.getTime()))continue;
      time.dateTime=post.dateModified;time.title='최종 업데이트 (한국시간)';
      time.textContent='업데이트 · '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'numeric',day:'numeric'}).format(date);
      time.classList.add('ncp-post-updated');return;
    }catch{/* Invalid structured data must not produce a fabricated date. */}
  }
  time.closest('.post-timestamp')?.setAttribute('hidden','');
})();
