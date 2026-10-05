const BASE='https://lsifl.blogspot.com';

async function get(path) {
  const url=BASE+path;
  const response=await fetch(url,{redirect:'follow',headers:{
    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36',
    'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
    'accept-language':'ko-KR,ko;q=0.9,en;q=0.8',
    'cache-control':'no-cache'
  }});
  const text=await response.text();
  return {url:response.url,status:response.status,contentType:response.headers.get('content-type')||'',text};
}

function assert(condition,code,details={}) {
  if (!condition) {
    const error=new Error(code);
    error.details=details;
    throw error;
  }
}

const results={checkedAt:new Date().toISOString(),base:BASE};

try {
  const home=await get('/');
  if (home.status===429 && /\/sorry\//.test(home.url)) {
    console.log(JSON.stringify({ok:false,blocked:true,reason:'GOOGLE_ANTI_BOT_429',checkedAt:new Date().toISOString(),base:BASE,status:home.status,url:home.url},null,2));
    process.exit(2);
  }
  assert(home.status===200,'HOME_HTTP_FAILED',{status:home.status,url:home.url});
  const canonical=home.text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    || home.text.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || null;
  assert(canonical===BASE+'/' || canonical===BASE,'HOME_CANONICAL_INVALID',{canonical});
  const robotsMeta=[...home.text.matchAll(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/ig)].map(x=>x[1].toLowerCase());
  assert(!robotsMeta.some(x=>x.includes('noindex')),'HOME_NOINDEX',{robotsMeta});
  results.home={status:home.status,canonical,robotsMeta};

  const robots=await get('/robots.txt');
  assert(robots.status===200,'ROBOTS_HTTP_FAILED',{status:robots.status});
  assert(robots.text.trim().length>0,'ROBOTS_EMPTY');
  results.robots={status:robots.status,contentType:robots.contentType,hasSitemap:/^\s*Sitemap\s*:/im.test(robots.text)};

  const sitemap=await get('/sitemap.xml');
  assert(sitemap.status===200,'SITEMAP_HTTP_FAILED',{status:sitemap.status});
  assert(/<(?:urlset|sitemapindex)\b/i.test(sitemap.text),'SITEMAP_XML_INVALID',{sample:sitemap.text.slice(0,200)});
  results.sitemap={status:sitemap.status,contentType:sitemap.contentType,kind:/<sitemapindex\b/i.test(sitemap.text)?'sitemapindex':'urlset'};

  const rss=await get('/feeds/posts/default?alt=rss');
  assert(rss.status===200,'RSS_HTTP_FAILED',{status:rss.status});
  assert(/<rss\b/i.test(rss.text),'RSS_XML_INVALID',{sample:rss.text.slice(0,200)});
  results.rss={status:rss.status,contentType:rss.contentType};

  const privacy=await get('/p/blog-page.html');
  assert(privacy.status===200,'PRIVACY_HTTP_FAILED',{status:privacy.status});
  results.privacy={status:privacy.status};

  console.log(JSON.stringify({ok:true,...results},null,2));
} catch (error) {
  console.error(JSON.stringify({ok:false,...results,error:error.message,details:error.details||null},null,2));
  process.exit(1);
}
