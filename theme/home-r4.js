// Home R4: public Blogger feed, no fabricated coupon status or benefit.
(async function(){
  const root=document.getElementById('ncp-home-r4');if(!root)return;
  const allowed=['게임','유심·로밍','호스팅·도메인','해외직구','건강','VPN','교육','취미','포토·굿즈','스포츠·레저'];
  const status=root.querySelector('[role="status"]');
  function card(entry,game){
    const url=entry.link?.find(x=>x.rel==='alternate')?.href;
    if(!url||new URL(url,location.href).origin!==location.origin)return null;
    const labels=(entry.category||[]).map(x=>x.term);
    const category=allowed.find(x=>labels.includes(x));
    const name=game?(labels.find(x=>x!=='게임')||entry.title.$t):entry.title.$t;
    const article=document.createElement('article');article.className='ncp-r4-card';
    const doc=new DOMParser().parseFromString(entry.content?.$t||'','text/html');
    let src=doc.querySelector('img')?.getAttribute('src')||entry.media$thumbnail?.url||'https://api.iconify.design/twemoji/video-game.svg';
    if(src&&new URL(src,location.href).protocol==='https:'){
      const image=document.createElement('img');image.className='ncp-r4-cover';image.alt=name;image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';
      const icon=new URL(src,location.href);if(icon.hostname==='play-lh.googleusercontent.com')icon.pathname=icon.pathname.replace(/=[^/]*$/, '=w400-h240-rw');image.src=icon.href;
      image.addEventListener('error',()=>{const fallback=entry.media$thumbnail?.url;if(fallback&&fallback!==image.src)image.src=fallback;else image.remove();},{once:true});article.append(image);
    }
    const body=document.createElement('div');body.className='ncp-r4-card-body';
    const heading=document.createElement('h3');const link=document.createElement('a');link.href=url;link.textContent=name;heading.append(link);
    const info=document.createElement('p');const updated=new Date(entry.updated?.$t);info.textContent=(category||'쿠폰 안내')+' · '+(!Number.isNaN(updated.getTime())?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric'}).format(updated)+' 업데이트':'입력 방법');
    const detail=document.createElement('a');detail.href=url;detail.className='ncp-r4-detail';detail.textContent='쿠폰 · 사용 방법 보기';
    body.append(heading,info,detail);article.append(body);return article;
  }
  try{
    const response=await fetch('/feeds/posts/default?alt=json&max-results=150&orderby=updated');if(!response.ok)throw Error('FEED_HTTP');
    const entries=(await response.json()).feed.entry||[];const games=root.querySelector('.ncp-r4-game-list'),latest=root.querySelector('.ncp-r4-latest-list');
    const seen=new Set();for(const entry of entries){const labels=(entry.category||[]).map(x=>x.term);if(labels.includes('게임')&&seen.size<6){const name=labels.find(x=>x!=='게임')||entry.title.$t;if(!seen.has(name)){const item=card(entry,true);if(item){games.append(item);seen.add(name);}}}}
    for(const entry of entries.filter(x=>x.category?.some(c=>allowed.includes(c.term))).slice(0,8)){const item=card(entry,false);if(item)latest.append(item);}
    status.textContent='';if(!games.children.length)games.textContent='게임 쿠폰 안내를 준비 중입니다.';if(!latest.children.length)status.textContent='새 쿠폰 안내를 준비 중입니다.';
  }catch{status.textContent='목록을 불러오지 못했습니다. 카테고리 또는 검색으로 쿠폰을 찾아주세요.';}
})();
