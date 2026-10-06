// Only mounted by the Blogger label condition.
(async function(){
  const root=document.getElementById('ncp-game-hub');
  if(!root)return;
  const category=root.dataset.category||'게임';
  const grid=root.querySelector('.ncp-game-grid');
  const status=root.querySelector('[role="status"]');
  try{
    const response=await fetch('/feeds/posts/default/-/'+encodeURIComponent(category)+'?alt=json&max-results=150');
    if(!response.ok)throw Error('FEED_HTTP');
    const feed=await response.json();
    const seen=new Set();
    for(const entry of feed.feed.entry||[]){
      const name=(entry.category||[]).map(x=>x.term).find(x=>x!==category)||entry.title?.$t;
      const url=(entry.link||[]).find(x=>x.rel==='alternate')?.href;
      if(!name||!url||seen.has(name)||new URL(url,location.href).origin!==location.origin)continue;
      seen.add(name);
      const card=document.createElement('a');card.className='ncp-game-card';card.href=url;card.setAttribute('aria-label',name+' 쿠폰 보기');
      const wrap=document.createElement('span');wrap.className='ncp-game-icon-wrap';
      const image=document.createElement('img');image.className='ncp-game-icon';image.alt=name;image.loading='lazy';image.decoding='async';
      const content=new DOMParser().parseFromString(entry.content?.$t||'','text/html');
      const src=content.querySelector('img')?.getAttribute('src')||entry.media$thumbnail?.url||'https://api.iconify.design/twemoji/video-game.svg';
      image.referrerPolicy='no-referrer';
      if(src&&new URL(src,location.href).protocol==='https:'){
        const iconUrl=new URL(src,location.href);
        if(iconUrl.hostname==='play-lh.googleusercontent.com')iconUrl.pathname=iconUrl.pathname.replace(/=[^/]*$/, '=w240-h240-rw');
        image.src=iconUrl.href;
        image.addEventListener('error',()=>{
          const fallback=entry.media$thumbnail?.url;
          if(fallback&&fallback!==image.src&&new URL(fallback,location.href).protocol==='https:')image.src=fallback;
          else image.src='https://api.iconify.design/twemoji/video-game.svg';
        },{once:true});
      }
      if(src)wrap.append(image);
      else{wrap.textContent=name.slice(0,2);wrap.setAttribute('aria-hidden','true');}
      const title=document.createElement('strong');title.className='ncp-game-name';title.textContent=name;
      const date=document.createElement('span');date.className='ncp-game-updated';
      const updated=new Date(entry.updated?.$t);
      if(!Number.isNaN(updated.getTime())){
        const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit'}).formatToParts(updated);
        date.textContent=parts.find(x=>x.type==='month').value+'.'+parts.find(x=>x.type==='day').value+' 업데이트';
      }else date.textContent='업데이트 날짜 미확인';
      card.append(wrap,title,date);grid.append(card);
    }
    status.textContent=grid.children.length?'':'등록된 쿠폰 안내가 없습니다.';
  }catch{status.textContent='목록을 불러오지 못했습니다. 잠시 후 다시 확인해주세요.';}
})();

