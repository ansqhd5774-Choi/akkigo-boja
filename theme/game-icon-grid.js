// Only mounted by the Blogger label condition.
(async function(){
  const root=document.getElementById('ncp-game-hub');
  if(!root)return;
  const category=root.dataset.category||'게임';
  const grid=root.querySelector('.ncp-game-grid');
  const status=root.querySelector('[role="status"]');
  const imageObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(items=>{
    for(const item of items){if(!item.isIntersecting)continue;const image=item.target;
      image.src=image.dataset.ncpDeferredSrc;delete image.dataset.ncpDeferredSrc;imageObserver.unobserve(image);
    }
  },{rootMargin:'200px 0px'}):null;

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
  try{
    const entries=window.ncpCardFeed?await window.ncpCardFeed(category):window.ncpFeed?await window.ncpFeed(category):await fetch('/feeds/posts/default/-/'+encodeURIComponent(category)+'?alt=json&max-results=150',{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw Error('FEED_HTTP');return r.json();}).then(data=>data.feed.entry||[]);
    const seen=new Set();
    for(const entry of entries){
      const identity=category==='게임'?window.ncpResolveGame(entry):window.ncpResolveBrand(entry);const name=identity.name;
      const url=(entry.link||[]).find(x=>x.rel==='alternate')?.href;
      if(!name||!url||seen.has(name)||new URL(url,location.href).origin!==location.origin)continue;
      const card=document.createElement('a');card.className='ncp-game-card ncp-game-visual'+(category==='게임'?'':' ncp-brand-visual');if(category!=='게임'&&identity.logoShift)card.style.setProperty('--ncp-logo-shift',identity.logoShift);card.href=url;card.setAttribute('aria-label',name+' 쿠폰 보기');
      const wrap=document.createElement('span');wrap.className='ncp-game-icon-wrap';
      const image=document.createElement('img');image.className='ncp-game-icon';image.alt=name;image.loading='lazy';image.decoding='async';
      const content=new DOMParser().parseFromString(String(entry.content?.$t||'').replace(/\bsrc\s*=/gi,'data-ncp-src='),'text/html');
      const codeCount=Number.isSafeInteger(entry.ncpCodeCount)&&entry.ncpCodeCount>=0?entry.ncpCodeCount:new Set([...content.querySelectorAll('[data-ncp-copy]')].map(el=>el.getAttribute('data-ncp-copy')).filter(Boolean)).size;
      if(category==='게임'&&codeCount===0)continue;
      seen.add(name);
      const src=content.querySelector('img')?.getAttribute('data-ncp-src')||entry.media$thumbnail?.url||'https://api.iconify.design/twemoji/video-game.svg';
      image.referrerPolicy='no-referrer';
      if(src&&new URL(src,location.href).protocol==='https:'){
        const iconUrl=new URL(src,location.href);
        if(iconUrl.href==='https://zeuscommunity-fn.com2us.com/zeuscommunity/public/common/og/og_default.jpg')iconUrl.href='https://akkigo-boja.ansqhd5774.workers.dev/cards/zeus-og-320.webp';
        if(iconUrl.hostname==='play-lh.googleusercontent.com')iconUrl.pathname=iconUrl.pathname.replace(/(?:=|%3D)[^/]*$/i, '')+'=w240-h240-rw';
        if(/^lh[0-9]+\.googleusercontent\.com$/.test(iconUrl.hostname))iconUrl.pathname=iconUrl.pathname.replace(/=[^/]*$/, '')+'=s320-rw';
        if(iconUrl.hostname.endsWith('.mzstatic.com'))iconUrl.pathname=iconUrl.pathname.replace(/\/\d+x\d+bb\.(jpg|png)$/, '/320x320bb.jpg');
        if(iconUrl.hostname.endsWith('.mzstatic.com'))iconUrl.pathname=iconUrl.pathname.replace(/\/1024x1024wd\.png$/, '/320x320wd.jpg').replace(/\/1920x1080ia-80\.png$/, '/320x320ia-80.jpg');
        if(iconUrl.hostname==='akkigo-boja.ansqhd5774.workers.dev'&&/^\/logos\/[^/]+-representative\.png$/.test(iconUrl.pathname))iconUrl.pathname=iconUrl.pathname.replace(/\.png$/,'.webp');
        if(grid.children.length<2){image.loading='eager';image.fetchPriority='high';}
        if(imageObserver&&grid.children.length>=2){image.dataset.ncpDeferredSrc=iconUrl.href;imageObserver.observe(image);}
        else image.src=iconUrl.href;
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
      if(category==='게임'){
        date.textContent=codeCount>0?'코드 '+codeCount+'개 · 사용 여부는 본문 확인':'쿠폰 안내';
        wrap.append(title);
        {const badge=document.createElement('span');badge.className='ncp-coupon-count';badge.textContent=category==='게임'?'기록 '+codeCount+'개':(codeCount?'코드 '+codeCount+'개':'혜택 안내');wrap.append(badge);}
        card.append(wrap);
      }else{wrap.append(title);const badge=document.createElement('span');badge.className='ncp-coupon-count';badge.textContent=category==='게임'?'기록 '+codeCount+'개':(codeCount?'코드 '+codeCount+'개':'혜택 안내');wrap.append(badge);card.append(wrap);}
      {const shell=document.createElement('div');shell.className='ncp-game-heart-shell';shell.append(card);addHeart(shell,category==='게임'?identity.id:name);grid.append(shell);}
    }
    status.textContent=grid.children.length?'':'등록된 쿠폰 안내가 없습니다.';
  }catch{status.textContent='목록을 불러오지 못했습니다. 잠시 후 다시 확인해주세요.';}
})();
