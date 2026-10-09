// Shared helpers use safe text nodes; feed HTML never enters the live page.
(function(){
  // Shared company identity for home and category cards.
  const brandLogos={"/logos/tripcom-representative.png":"트립닷컴","/logos/dominos-representative.png":"도미노피자","/logos/hostinger-representative.png":"Hostinger","/logos/spaceship-representative.png":"Spaceship","/logos/namecheap-representative.png":"Namecheap","/logos/cafe24-representative.png":"카페24","/logos/dothome-representative.png":"닷홈","/logos/whois-representative.png":"후이즈","/logos/hostingkr-representative.png":"호스팅케이알","/logos/geniezip-representative.png":"지니집","/logos/nutrione-representative.png":"뉴트리원","/logos/angukhealth-representative.png":"안국건강","/logos/denps-representative.png":"덴프스","/logos/ckdhcmall-representative.png":"종근당건강몰","/logos/esthermall-representative.png":"에스더몰","/logos/haiip-representative.png":"하이아이피","/logos/coolip-representative.png":"쿨아이피","/logos/momoip-representative.png":"모모아이피","/logos/hackers-representative.png":"해커스공무원","/logos/fastcampus-representative.png":"패스트캠퍼스","/logos/gabia-representative.png":"가비아","/logos/iporter-representative.png":"아이포터","/logos/nygirlz-representative.png":"뉴욕걸즈","/logos/malltail-representative.png":"몰테일","/logos/jungkwanjang-representative.png":"정관장","/logos/lactiv-representative.png":"락티브","/logos/doctorlean-representative.png":"닥터린"};
  window.ncpResolveBrand=function(entry){
    const doc=new DOMParser().parseFromString(entry.content?.$t||'','text/html');
    const image=doc.querySelector('img');
    const src=image?.getAttribute('src')||entry.media$thumbnail?.url||'';
    let path='';try{path=new URL(src,location.href).pathname;}catch{}
    const official=brandLogos[path];
    const name=official||image?.getAttribute('alt')?.match(/^(.+?) 공식 대표 로고$/)?.[1]||String(entry.title?.$t||'').split(/\s*(?:할인|쿠폰|프로모션|도메인|\(|\|)/)[0].trim();
    return {name,logoShift:official?(path.includes('/gabia-')?'33.4%':'24.61%'):null};
  };
  const worker='https://akkigo-boja.ansqhd5774.workers.dev';
  const timeout=ms=>AbortSignal.timeout(ms);
  window.ncpFeed=function(category){
    const key=category||'';window.ncpFeedCache ||= new Map();
    if(!window.ncpFeedCache.has(key)){
      const path='/feeds/posts/default'+(key?'/-/'+encodeURIComponent(key):'')+'?alt=json&max-results=150&orderby=updated';
      const promise=(async()=>{
        const entries=[],seen=new Set();let offset=1,total,target;
        for(let page=0;page<150;page++){
          const response=await fetch(path+(offset===1?'':'&start-index='+offset),{signal:timeout(12000)});
          if(!response.ok)throw Error('FEED_HTTP');
          const feed=(await response.json()).feed;if(!feed)throw Error('FEED_INVALID');
          const batch=feed.entry||[];if(!Array.isArray(batch))throw Error('FEED_INVALID');
          const rawTotal=feed.openSearch$totalResults?.$t;
          // Older compatible feeds omit this field; their single response remains bounded.
          if(rawTotal===undefined&&page===0)return batch.slice(0,150);
          if(!/^\d+$/.test(String(rawTotal)))throw Error('FEED_TOTAL_INVALID');
          const currentTotal=Number(rawTotal);if(!Number.isSafeInteger(currentTotal))throw Error('FEED_TOTAL_INVALID');
          if(page===0){total=currentTotal;target=Math.min(total,150);}else if(currentTotal!==total)throw Error('FEED_CHANGED');
          if(target===0)return [];
          if(!batch.length)throw Error('FEED_PAGE_EMPTY');
          let added=0;
          for(const entry of batch){
            const id=entry.id?.$t;if(typeof id!=='string'||!id)throw Error('FEED_ENTRY_ID_MISSING');
            if(seen.has(id))continue;seen.add(id);entries.push(entry);added++;
            if(entries.length===target)return entries;
          }
          if(!added)throw Error('FEED_PAGE_REPEATED');
          offset+=batch.length;
          if(offset>total)throw Error('FEED_INCOMPLETE');
        }
        throw Error('FEED_PAGE_LIMIT');
      })();
      window.ncpFeedCache.set(key,promise);promise.catch(()=>window.ncpFeedCache.delete(key));
    }
    return window.ncpFeedCache.get(key);
  };
  window.ncpSafeUrl=function(value){try{const url=new URL(value,location.href);return url.protocol==='https:'?url.href:null;}catch{return null;}};
  window.ncpEntryUrl=function(entry){const url=window.ncpSafeUrl(entry.link?.find(link=>link.rel==='alternate')?.href);return url&&new URL(url).origin===location.origin?url:null;};
  const normalize=value=>String(value||'').normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g,' ').trim();
  let indexPromise;
  function searchIndex(){
    if(!indexPromise){
      const library=new Promise((resolve,reject)=>{
        if(window.Fuse)return resolve();
        const script=document.createElement('script');script.src=worker+'/fuse-7.5.0.min.js';script.async=true;
        script.onload=()=>window.Fuse?resolve():reject(Error('SEARCH_LIBRARY'));script.onerror=()=>reject(Error('SEARCH_LIBRARY'));document.head.append(script);
      });
      indexPromise=Promise.all([library,window.ncpFeed()]).then(([,entries])=>{
        const rows=entries.map(entry=>({title:entry.title?.$t||'',name:window.ncpResolveGame(entry).name,url:window.ncpEntryUrl(entry),labels:(entry.category||[]).map(row=>row.term).join(' ')})).filter(row=>row.url);
        return new window.Fuse(rows,{keys:['title','name','labels'],threshold:.32,ignoreLocation:true,getFn:(row,key)=>normalize(row[key])});
      }).catch(error=>{indexPromise=null;throw error;});
    }
    return indexPromise;
  }
  function mountSearch(){
    let sequence=0;
    document.querySelectorAll('.ncp-r4-search,.ncp-r3-search').forEach(form=>{
      const input=form.querySelector('input[name="q"]');if(!input||form.dataset.ncpSuggest)return;form.dataset.ncpSuggest='true';
      const box=document.createElement('div');box.className='ncp-search-results';box.id='ncp-search-results-'+(++sequence);box.setAttribute('role','listbox');box.setAttribute('aria-label','최근 게시물 검색 추천');box.hidden=true;
      const note=document.createElement('span');note.className='ncp-search-note';note.textContent='최근 게시물에서 추천 · 전체 검색은 검색 버튼';
      form.append(box);input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls',box.id);input.setAttribute('aria-expanded','false');input.autocomplete='off';
      let timer,revision=0,selected=-1;
      const close=()=>{clearTimeout(timer);box.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');selected=-1;};
      const highlight=()=>{const options=[...box.querySelectorAll('[role="option"]')];options.forEach((link,i)=>link.setAttribute('aria-selected',String(i===selected)));if(options[selected]){input.setAttribute('aria-activedescendant',options[selected].id);options[selected].scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');};
      async function update(){
        const turn=++revision,query=normalize(input.value);if(query.length<2){close();return;}
        try{const index=await searchIndex();if(turn!==revision||document.activeElement!==input)return;
          const matches=index.search(query,{limit:6});box.replaceChildren();selected=-1;
          if(!matches.length){close();return;}
          for(const [i,{item}] of matches.entries()){const link=document.createElement('a');link.href=item.url;link.id=box.id+'-'+i;link.setAttribute('role','option');link.setAttribute('aria-selected','false');link.textContent=item.title;box.append(link);}
          box.append(note);box.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');
        }catch{close();}
      }
      input.addEventListener('input',event=>{revision++;clearTimeout(timer);if(!event.isComposing)timer=setTimeout(update,180);});
      input.addEventListener('compositionend',()=>{clearTimeout(timer);timer=setTimeout(update,180);});
      input.addEventListener('focus',()=>{if(input.value.trim().length>=2)update();});
      input.addEventListener('keydown',event=>{if(event.isComposing)return;
        const options=[...box.querySelectorAll('[role="option"]')];
        if(event.key==='Escape'){revision++;close();return;}
        if(box.hidden)return;
        if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();selected=(selected+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;highlight();}
        else if(event.key==='Enter'&&selected>=0){event.preventDefault();options[selected].click();}
      });
      form.addEventListener('focusout',()=>setTimeout(()=>{if(!form.contains(document.activeElement)){revision++;close();}},0));
      document.addEventListener('pointerdown',event=>{if(!form.contains(event.target)){revision++;close();}});
      form.addEventListener('submit',()=>{revision++;close();});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountSearch,{once:true});else mountSearch();
})();
