// Home R4: public Blogger feed, no fabricated coupon status or benefit.
(async function(){
  const root=document.getElementById('ncp-home-r4');if(!root)return;
  const status=root.querySelector('[role="status"]');
  // These are published game guides, not proof of currently redeemable coupons.
  const guideCodeCount=entry=>new Set([...String(entry.content?.$t||'').matchAll(/data-ncp-copy=["']([^"']+)["']/g)].map(match=>match[1])).size;

  const heartEndpoint='https://akkigo-boja.ansqhd5774.workers.dev/games/hearts';
  let heartCounts=new Map();let heartsReady=false;const heartLoad=(async()=>{try{const response=await fetch(heartEndpoint,{cache:'no-store',signal:AbortSignal.timeout(8000)});if(response.ok){heartCounts=new Map((await response.json()).hearts.map(row=>[row.gameId||row.brand,row.count]));heartsReady=true;}}catch{}})();
  function addHeart(host,brand){
    const button=document.createElement('button');button.type='button';button.className='ncp-game-heart';button.setAttribute('aria-label',brand+' 하트');button.title=heartsReady?'하트 누르기':'집계 불러오기 실패';
    const icon=document.createElement('span'),count=document.createElement('span');icon.className='ncp-heart-icon';icon.innerHTML=window.ncpIcons.heart;count.textContent=heartCounts.has(brand)?String(heartCounts.get(brand)):'—';button.append(icon,count);
    let visitor,liked=false;try{visitor=localStorage.getItem('ncp-heart-visitor');if(!visitor){visitor=crypto.randomUUID();localStorage.setItem('ncp-heart-visitor',visitor);}liked=localStorage.getItem('ncp-heart-'+brand)==='1';}catch{}
    const update=()=>{button.setAttribute('aria-pressed',String(liked));button.disabled=liked||!visitor||!heartCounts.has(brand);};update();
    button.addEventListener('click',async event=>{event.preventDefault();event.stopPropagation();if(liked)return;button.disabled=true;try{const response=await fetch(heartEndpoint,{method:'POST',signal:AbortSignal.timeout(8000),headers:{'Content-Type':'application/json'},body:JSON.stringify({brand,visitor})});if(!response.ok)throw Error('HEART_WRITE_FAILED');const result=await response.json();count.textContent=String(result.count);heartCounts.set(brand,result.count);liked=true;try{localStorage.setItem('ncp-heart-'+brand,'1');}catch{}}catch{button.title='저장하지 못했습니다. 다시 눌러주세요.';}finally{update();}});host.append(button);
    heartLoad.then(()=>{count.textContent=heartCounts.has(brand)?String(heartCounts.get(brand)):'—';button.title=heartsReady?'하트 누르기':'집계 불러오기 실패';update();});
  }
  function card(entry,game,count){
    const url=entry.link?.find(x=>x.rel==='alternate')?.href;
    if(!url||new URL(url,location.href).origin!==location.origin)return null;
    const labels=(entry.category||[]).map(x=>x.term);
    const identity=game?window.ncpResolveGame(entry):null;const name=game?identity.name:entry.title.$t;
    const article=document.createElement('article');article.className='ncp-r4-card'+(game?' ncp-game-visual':'');
    if(game&&count>0){const badge=document.createElement('span');badge.className='ncp-coupon-count';badge.textContent='코드 '+count+'개';article.append(badge);}
    const doc=new DOMParser().parseFromString(entry.content?.$t||'','text/html');
    let src=doc.querySelector('img')?.getAttribute('src')||entry.media$thumbnail?.url||'https://api.iconify.design/twemoji/video-game.svg';
    if(src&&new URL(src,location.href).protocol==='https:'){
      const image=document.createElement('img');image.className='ncp-r4-cover';image.alt=name;image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';
      const icon=new URL(src,location.href);if(icon.hostname==='play-lh.googleusercontent.com')icon.pathname=icon.pathname.replace(/=[^/]*$/, '=w400-h240-rw');image.src=icon.href;
      image.addEventListener('error',()=>{const fallback=entry.media$thumbnail?.url;if(fallback&&fallback!==image.src)image.src=fallback;else image.remove();},{once:true});const coverLink=document.createElement('a');coverLink.href=url;coverLink.className='ncp-game-cover-link';coverLink.append(image);article.append(coverLink);
    }
    const body=document.createElement('div');body.className='ncp-r4-card-body';
    const heading=document.createElement('h3');const link=document.createElement('a');link.href=url;link.textContent=name;if(game){link.textContent='';for(const part of name.split(/([A-Za-z0-9é]+(?:[ .:-][A-Za-z0-9é]+)*)/)){const segment=document.createElement('span');segment.textContent=part;if(/^[A-Za-z0-9é]/.test(part))segment.style.whiteSpace='nowrap';link.append(segment);}}heading.append(link);
    body.append(heading);article.append(body);if(game)addHeart(article,identity.id);return article;
  }
  function paginate(container,items,label){
    if(!items.length)return;const pageSize=()=>innerWidth<=600?4:innerWidth<=900?3:6;let size=pageSize(),total=Math.ceil(items.length/size),page=0;
    const controls=document.createElement('div');controls.className='ncp-r4-row-arrows';controls.setAttribute('aria-label',label+' 이동');
    const previous=document.createElement('button'),next=document.createElement('button'),position=document.createElement('span');
    const doubleArrow='<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 5 7 7-7 7M12 5l7 7-7 7"/></svg>';
    previous.type=next.type='button';previous.innerHTML=next.innerHTML=doubleArrow;previous.className='ncp-r4-row-previous';next.className='ncp-r4-row-next';previous.setAttribute('aria-label',label+' 이전 목록');next.setAttribute('aria-label',label+' 다음 목록');position.className='ncp-sr-only';position.setAttribute('aria-live','polite');
    function render(){container.replaceChildren(...items.slice(page*size,(page+1)*size));previous.disabled=page===0;next.disabled=page===total-1;controls.hidden=total<=1;position.textContent=(page+1)+'페이지, 전체 '+total+'페이지';}
    let moving=false;async function move(direction){const target=page+direction;if(moving||target<0||target>=total)return;moving=true;previous.disabled=next.disabled=true;const focusLost=container.contains(document.activeElement);try{if(typeof container.animate==='function'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){try{await container.animate([{transform:'translateX(0)',opacity:1},{transform:'translateX('+(-direction*24)+'px)',opacity:0}],{duration:140,easing:'ease-in'}).finished;}catch{}page=target;render();previous.disabled=next.disabled=true;try{await container.animate([{transform:'translateX('+(direction*32)+'px)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'}).finished;}catch{}}else{page=target;render();}if(focusLost)container.focus({preventScroll:true});}finally{moving=false;previous.disabled=page===0;next.disabled=page===total-1;}}
    previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    window.addEventListener('resize',()=>{const updated=pageSize();if(updated===size)return;const start=page*size;size=updated;total=Math.ceil(items.length/size);page=Math.min(Math.floor(start/size),total-1);render();});
    container.tabIndex=0;container.setAttribute('aria-label',label+' 목록');
    container.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
    let gesture,suppressClickUntil=0;
    const finishGesture=()=>{container.classList.remove('ncp-r4-dragging');container.style.transform='';};
    container.addEventListener('dragstart',event=>event.preventDefault());
    container.addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button!==0||event.target.closest('button'))return;gesture={id:event.pointerId,x:event.clientX,y:event.clientY,dragging:false};});
    container.addEventListener('pointermove',event=>{if(!gesture||gesture.id!==event.pointerId)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;if(!gesture.dragging&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.5){gesture.dragging=true;container.setPointerCapture(event.pointerId);container.classList.add('ncp-r4-dragging');}if(gesture.dragging){event.preventDefault();container.style.transform='translateX('+Math.max(-60,Math.min(60,dx*.35))+'px)';}});
    container.addEventListener('pointercancel',()=>{gesture=null;finishGesture();});
    container.addEventListener('pointerup',event=>{if(!gesture||gesture.id!==event.pointerId)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y,dragged=gesture.dragging;gesture=null;finishGesture();if(container.hasPointerCapture(event.pointerId))container.releasePointerCapture(event.pointerId);if(dragged)suppressClickUntil=Date.now()+500;if(dragged&&Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);});
    container.addEventListener('click',event=>{if(event.detail>0&&Date.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();}},{capture:true});
    const shell=document.createElement('div');shell.className='ncp-r4-row-shell';container.before(shell);shell.append(container,controls);controls.append(previous,position,next);render();
  }
  root.querySelectorAll('.ncp-r4-section-head a').forEach(link=>{link.textContent='전체 보기';link.classList.add('ncp-r4-view-all');});
  try{
    await Promise.all([...root.querySelectorAll('[data-ncp-home-category]')].map(async section=>{
      const category=section.dataset.ncpHomeCategory,game=category==='게임',items=[],seen=new Set();
      try{
      const feedEntries=window.ncpFeed?await window.ncpFeed(category):await fetch('/feeds/posts/default/-/'+encodeURIComponent(category)+'?alt=json&max-results=150&orderby=updated',{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw Error('FEED_HTTP');return r.json();}).then(data=>data.feed.entry||[]);
      const entries=feedEntries.filter(entry=>!game||guideCodeCount(entry)>0);
      for(const entry of [...entries].sort((a,b)=>(Date.parse(b.published?.$t)||0)-(Date.parse(a.published?.$t)||0))){
        if(!entry.category?.some(label=>label.term===category))continue;
        const key=game?window.ncpResolveGame(entry).id:entry.id?.$t;
        if(seen.has(key))continue;
        const item=game?card(entry,true,guideCodeCount(entry)):card(entry,false,0);
        if(item){items.push(item);seen.add(key);}
      }
      section.querySelector('h2').setAttribute('title','최신 등록순');
      paginate(section.querySelector('.ncp-r4-row-list'),items,category+' 쿠폰');
      section.querySelector('[role="status"]').textContent=items.length?'':'등록된 글이 없습니다.';
      }catch{section.querySelector('[role="status"]').textContent='목록을 불러오지 못했습니다. 전체 보기 또는 검색으로 찾아주세요.';}
    }));
  }catch{root.querySelectorAll('.ncp-r4-category-row [role="status"]').forEach(el=>{el.textContent='목록을 불러오지 못했습니다. 전체 보기 또는 검색으로 찾아주세요.';});}
})();
