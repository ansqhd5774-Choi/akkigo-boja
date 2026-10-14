const categories=new Set(['게임','유심·로밍','호스팅·도메인','해외직구','건강','VPN','교육']);
export function compactEntry(entry,{countsOnly=false}={}){
  const html=String(entry.content?.$t||'');
  // Keep original attributes for brand/game identity and coupon counts.
  const image=html.match(/<img\b[^>]*>/i)?.[0]||'';
  const identity=[...html.matchAll(/data-(?:game-name|game-id|ncp-article)=["'][^"']*["']/g)].map(x=>x[0]).join(' ');
  const codes=[...new Set([...html.matchAll(/data-ncp-copy=["']([^"']+)["']/g)].map(x=>x[1]))];
  const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  return {id:entry.id,title:entry.title,updated:entry.updated,published:entry.published,category:entry.category,link:entry.link,media$thumbnail:entry.media$thumbnail,
    ...(countsOnly?{ncpCodeCount:codes.length}:{}),
    content:{$t:`<div ${identity}>${image}${countsOnly?'':codes.map(code=>`<button data-ncp-copy="${escape(code)}"></button>`).join('')}</div>`}};
}
export async function cardFeed(request,{fetcher=fetch,cache=globalThis.caches?.default}={}){
  const category=new URL(request.url).searchParams.get('category');
  const format=new URL(request.url).searchParams.get('format');
  if(format!==null&&format!=='counts')return Response.json({error:'INVALID_FORMAT'},{status:400});
  const headers={'Access-Control-Allow-Origin':'https://lsifl.blogspot.com','Cache-Control':'public, max-age=120'};
  if(!categories.has(category))return Response.json({error:'INVALID_CATEGORY'},{status:400,headers});
  const key=new Request('https://akkigo-boja.ansqhd5774.workers.dev/public/card-feed?category='+encodeURIComponent(category)+'&revision=parallel-v1'+(format?'&format=counts':''));
  const cached=await cache?.match(key);if(cached)return cached;
  try{
    const entries=[],seen=new Set();let total,requests=0;
    const started=performance.now();
    async function page(offset,limit){
      if(++requests>150)throw Error('FEED_PAGE_LIMIT');
      const response=await fetcher('https://lsifl.blogspot.com/feeds/posts/default/-/'+encodeURIComponent(category)+'?alt=json&max-results='+limit+'&orderby=updated&start-index='+offset,{signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw Error('UPSTREAM_HTTP');
      const feed=(await response.json()).feed,batch=feed?.entry||[];
      const current=Number(feed?.openSearch$totalResults?.$t);
      if(!Number.isSafeInteger(current)||current<0||!Array.isArray(batch))throw Error('UPSTREAM_INVALID');
      if(total===undefined)total=current;else if(current!==total)throw Error('FEED_CHANGED');
      if(batch.length>limit)throw Error('FEED_RANGE_OVERFLOW');
      return batch;
    }
    const first=await page(1,10);const ranges=[];
    if(total&&first.length===0)throw Error('INCOMPLETE_FEED');
    for(let offset=first.length+1;offset<=total;offset+=10)ranges.push({offset,end:Math.min(offset+9,total)});
    const batches=new Array(ranges.length);let next=0;
    // Three bounded requests in flight; truncated pages fill their own range.
    await Promise.all(Array.from({length:Math.min(3,ranges.length)},async()=>{
      while(next<ranges.length){const index=next++,range=ranges[index],batch=[];let offset=range.offset;
        while(offset<=range.end){const values=await page(offset,range.end-offset+1);if(!values.length)throw Error('INCOMPLETE_FEED');batch.push(...values);offset+=values.length;}
        batches[index]=batch;
      }
    }));
    for(const entry of first.concat(...batches)){
      if(!entry.id?.$t||seen.has(entry.id.$t))throw Error('FEED_DUPLICATE_OR_INVALID');
      seen.add(entry.id.$t);entries.push(compactEntry(entry,{countsOnly:format==='counts'}));
    }
    if(entries.length!==total)throw Error('INCOMPLETE_FEED');
    const response=Response.json({entries,total},{headers:{...headers,'Server-Timing':`upstream;dur=${Math.round(performance.now()-started)}`,'X-Card-Feed-Requests':String(requests)}});await cache?.put(key,response.clone());return response;
  }catch{return Response.json({error:'CARD_FEED_UNAVAILABLE'},{status:503,headers:{...headers,'Cache-Control':'no-store'}});}
}
