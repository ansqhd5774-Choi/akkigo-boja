// AKKIGO game detail: enhance existing content without changing codes or URLs.
(async function(){
  if(!/^\/\d{4}\/\d{2}\/.+\.html$/.test(location.pathname))return;
  const body=document.querySelector('.post-body');if(!body)return;
  try{
    const response=await fetch('/feeds/posts/default/-/'+encodeURIComponent('게임')+'?alt=json&max-results=150');
    if(!response.ok)return;
    const entries=(await response.json()).feed.entry||[];
    const urlOf=entry=>(entry.link||[]).find(link=>link.rel==='alternate')?.href;
    const current=entries.find(entry=>{try{return new URL(urlOf(entry)).pathname===location.pathname;}catch{return false;}});
    if(!current||body.querySelector('.ncp-detail-overview'))return;
    const parse=entry=>new DOMParser().parseFromString(entry.content?.$t||'','text/html');
    const count=doc=>new Set([...doc.querySelectorAll('[data-ncp-copy]')].filter(el=>!el.disabled&&!el.closest('[data-ncp-history],#ncp-expired')).map(el=>el.dataset.ncpCopy).filter(Boolean)).size;
    const source=parse(current),identity=window.ncpResolveGame(current),total=count(source);
    const overview=document.createElement('section');overview.className='ncp-detail-overview';overview.setAttribute('aria-label',identity.name+' 쿠폰 현황');
    const image=body.querySelector('img');
    if(image){const icon=image.cloneNode();icon.className='ncp-detail-icon';icon.removeAttribute('style');icon.alt=identity.name;overview.append(icon);image.classList.add('ncp-detail-duplicate-media');}
    const info=document.createElement('div');info.className='ncp-detail-info';
    const name=document.createElement('strong');name.textContent=identity.name;
    const state=document.createElement('p');state.textContent=total?'등록된 입력 코드 '+total+'개 · 적용 조건은 아래에서 확인하세요.':'현재 등록된 사용 가능 코드가 없습니다.';info.append(name,state);overview.append(info);
    const official=[...body.querySelectorAll('a[href]')].find(a=>/공식.*(등록|입력)/.test(a.textContent)&&/^https:\/\//.test(a.href)&&new URL(a.href).hostname!==location.hostname);
    if(official){const link=document.createElement('a');link.href=official.href;link.rel='noopener noreferrer';link.className='ncp-detail-register';link.textContent='공식 쿠폰 등록';overview.append(link);}
    body.classList.add('ncp-game-detail');body.prepend(overview);
    // Preserve the outer Blogger title as the single page heading.
    if(document.querySelector('.post-title'))body.querySelectorAll('h1').forEach(h=>h.classList.add('ncp-detail-duplicate-heading'));
    const featured=body.querySelector('[data-ncp-featured-image]');if(featured)featured.classList.add('ncp-detail-duplicate-media');
    const related=document.createElement('section');related.className='ncp-detail-related';
    const heading=document.createElement('h2');heading.textContent='다른 게임 쿠폰';related.append(heading);
    const list=document.createElement('div');list.className='ncp-detail-related-list';
    const seen=new Set([identity.id]);
    for(const entry of entries){const game=window.ncpResolveGame(entry);if(seen.has(game.id))continue;
      const doc=parse(entry),codes=count(doc),url=urlOf(entry);if(!codes||!url||new URL(url).origin!==location.origin)continue;
      seen.add(game.id);const link=document.createElement('a');link.href=url;
      const title=document.createElement('strong');title.textContent=game.name;
      const meta=document.createElement('span');meta.textContent='입력 코드 '+codes+'개 →';link.append(title,meta);list.append(link);if(list.children.length===3)break;
    }
    if(list.children.length){related.append(list);body.append(related);}
    if(identity.name==='리니지M'){
      const note=document.createElement('p');note.className='ncp-detail-note';note.textContent='TJ 쿠폰 등 게임 내 이벤트 보상은 공용 입력 코드와 다릅니다. 이벤트의 지급 대상과 사용 기간은 공식 공지에서 확인하세요.';overview.after(note);
    }
  }catch{/* The original article and official instructions remain available. */}
})();

