const categories=new Set(['게임','유심·로밍','호스팅·도메인','해외직구','건강','VPN','교육']);
export function compactEntry(entry){
  const html=String(entry.content?.$t||'');
  // Keep original attributes for brand/game identity and coupon counts.
  const image=html.match(/<img\b[^>]*>/i)?.[0]||'';
  const identity=[...html.matchAll(/data-(?:game-name|game-id|ncp-article)=["'][^"']*["']/g)].map(x=>x[0]).join(' ');
  const codes=[...new Set([...html.matchAll(/data-ncp-copy=["']([^"']+)["']/g)].map(x=>x[1]))];
  const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  return {id:entry.id,title:entry.title,updated:entry.updated,published:entry.published,category:entry.category,link:entry.link,media$thumbnail:entry.media$thumbnail,
    content:{$t:`<div ${identity}>${image}${codes.map(code=>`<button data-ncp-copy="${escape(code)}"></button>`).join('')}</div>`}};
}
export async function cardFeed(request,{fetcher=fetch,cache=globalThis.caches?.default}={}){
  const category=new URL(request.url).searchParams.get('category');
  const headers={'Access-Control-Allow-Origin':'https://lsifl.blogspot.com','Cache-Control':'public, max-age=120'};
  if(!categories.has(category))return Response.json({error:'INVALID_CATEGORY'},{status:400,headers});
  const key=new Request('https://akkigo-boja.ansqhd5774.workers.dev/public/card-feed?category='+encodeURIComponent(category));
  const cached=await cache?.match(key);if(cached)return cached;
  try{
    const entries=[],seen=new Set();let offset=1,total;
    for(let page=0;page<150;page++){
      const response=await fetcher('https://lsifl.blogspot.com/feeds/posts/default/-/'+encodeURIComponent(category)+'?alt=json&max-results=150&orderby=updated&start-index='+offset,{signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw Error('UPSTREAM_HTTP');
      const feed=(await response.json()).feed,batch=feed?.entry||[];
      const current=Number(feed?.openSearch$totalResults?.$t);
      if(!Number.isSafeInteger(current)||current<0||!Array.isArray(batch))throw Error('UPSTREAM_INVALID');
      if(total===undefined)total=current;else if(current!==total)throw Error('FEED_CHANGED');
      if(total===0)break;
      let added=0;for(const entry of batch){if(!entry.id?.$t||seen.has(entry.id.$t))continue;seen.add(entry.id.$t);entries.push(compactEntry(entry));added++;}
      if(entries.length>=total)break;
      if(!added)throw Error('INCOMPLETE_FEED');offset+=batch.length;
    }
    if(entries.length!==total)throw Error('INCOMPLETE_FEED');
    const response=Response.json({entries,total},{headers});await cache?.put(key,response.clone());return response;
  }catch{return Response.json({error:'CARD_FEED_UNAVAILABLE'},{status:503,headers:{...headers,'Cache-Control':'no-store'}});}
}
