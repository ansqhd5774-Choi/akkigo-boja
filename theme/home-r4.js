// Home R4: public Blogger feed, no fabricated coupon status or benefit.
(async function(){
  const root=document.getElementById('ncp-home-r4');if(!root)return;
  const allowed=['게임','유심·로밍','호스팅·도메인','해외직구','건강','VPN','교육'];
  const status=root.querySelector('[role="status"]');
  function card(entry,game,count){
    const url=entry.link?.find(x=>x.rel==='alternate')?.href;
    if(!url||new URL(url,location.href).origin!==location.origin)return null;
    const labels=(entry.category||[]).map(x=>x.term);
    const name=game?(labels.find(x=>x!=='게임')||entry.title.$t):entry.title.$t;
    const article=document.createElement('article');article.className='ncp-r4-card'+(game?' ncp-game-visual':'');
    if(game){const badge=document.createElement('span');badge.className='ncp-coupon-count';badge.textContent='쿠폰 '+count+'개';article.append(badge);}
    const doc=new DOMParser().parseFromString(entry.content?.$t||'','text/html');
    let src=doc.querySelector('img')?.getAttribute('src')||entry.media$thumbnail?.url||'https://api.iconify.design/twemoji/video-game.svg';
    if(src&&new URL(src,location.href).protocol==='https:'){
      const image=document.createElement('img');image.className='ncp-r4-cover';image.alt=name;image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';
      const icon=new URL(src,location.href);if(icon.hostname==='play-lh.googleusercontent.com')icon.pathname=icon.pathname.replace(/=[^/]*$/, '=w400-h240-rw');image.src=icon.href;
      image.addEventListener('error',()=>{const fallback=entry.media$thumbnail?.url;if(fallback&&fallback!==image.src)image.src=fallback;else image.remove();},{once:true});const coverLink=document.createElement('a');coverLink.href=url;coverLink.className='ncp-game-cover-link';coverLink.append(image);article.append(coverLink);
    }
    const body=document.createElement('div');body.className='ncp-r4-card-body';
    const heading=document.createElement('h3');const link=document.createElement('a');link.href=url;link.textContent=name;if(game){link.textContent='';for(const part of name.split(/([A-Za-z0-9é]+(?:[ .:-][A-Za-z0-9é]+)*)/)){const segment=document.createElement('span');segment.textContent=part;if(/^[A-Za-z0-9é]/.test(part))segment.style.whiteSpace='nowrap';link.append(segment);}}heading.append(link);
    body.append(heading);article.append(body);return article;
  }
  function paginate(container,items,label){
    if(!items.length)return;const size=12,total=Math.ceil(items.length/size);let page=0;
    const controls=document.createElement('div');controls.className='ncp-r4-pager';controls.setAttribute('aria-label',label+' 페이지');
    const previous=document.createElement('button'),next=document.createElement('button'),position=document.createElement('span');
    previous.type=next.type='button';previous.textContent='←';next.textContent='→';previous.setAttribute('aria-label',label+' 이전 12개');next.setAttribute('aria-label',label+' 다음 12개');position.setAttribute('aria-live','polite');
    function render(){container.replaceChildren(...items.slice(page*size,(page+1)*size));previous.disabled=page===0;next.disabled=page===total-1;position.textContent=(page+1)+' / '+total;}
    previous.addEventListener('click',()=>{if(page>0){page--;render();}});next.addEventListener('click',()=>{if(page<total-1){page++;render();}});
    controls.append(previous,position,next);container.after(controls);render();
  }
  try{
    const policyResponse=await fetch('https://akkigo-boja.ansqhd5774.workers.dev/coupons/catalog',{cache:'no-store'});if(!policyResponse.ok)throw Error('POLICY_HTTP');
    const policy=await policyResponse.json();const currentBrands=new Map(policy.current.map(x=>[x.brand,x.count]));
    const eligible=e=>!e.category?.some(c=>c.term==='게임')||e.category.some(c=>currentBrands.has(c.term));
    const response=await fetch('/feeds/posts/default?alt=json&max-results=150&orderby=updated');if(!response.ok)throw Error('FEED_HTTP');
    const entries=((await response.json()).feed.entry||[]).filter(eligible);const games=root.querySelector('.ncp-r4-game-list'),latest=root.querySelector('.ncp-r4-latest-list');
    const gameCards=[],seen=new Set();for(const entry of entries){const labels=(entry.category||[]).map(x=>x.term);if(labels.includes('게임')){const name=labels.find(x=>x!=='게임')||entry.title.$t;if(!seen.has(name)){const item=card(entry,true,currentBrands.get(name));if(item){gameCards.push(item);seen.add(name);}}}}
    const latestCards=entries.filter(x=>x.category?.some(c=>allowed.includes(c.term))).map(entry=>card(entry,false)).filter(Boolean);
    paginate(games,gameCards,'게임 쿠폰');paginate(latest,latestCards,'최근 업데이트');
    status.textContent='';if(!games.children.length)games.textContent='현재 표시 기준에 맞는 게임 쿠폰이 없습니다.';if(!latest.children.length)status.textContent='새 쿠폰 안내를 준비 중입니다.';
  }catch{status.textContent='목록을 불러오지 못했습니다. 카테고리 또는 검색으로 쿠폰을 찾아주세요.';}
})();
