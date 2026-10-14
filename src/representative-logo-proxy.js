const PROXY_ROUTES=new Map([
  ['/logos/gigaip-representative.png','https://gigaip.net/resources/img/top_logo.png']
]);

export function representativeLogoProxySource(path){
  return PROXY_ROUTES.get(path)||null;
}

export async function serveRepresentativeLogo(path,transport=fetch){
  const source=representativeLogoProxySource(path);
  if(!source)return null;
  let upstream;
  try{
    upstream=await transport(source,{headers:{'User-Agent':'Mozilla/5.0 (compatible; akkigo-boja/1.0)','Accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'}});
  }catch{
    return new Response('Image upstream unavailable',{status:502,headers:{'Cache-Control':'no-store'}});
  }
  if(!upstream.ok)return new Response('Image upstream unavailable',{status:502,headers:{'Cache-Control':'no-store'}});
  const type=upstream.headers.get('content-type')||'image/png';
  if(!type.toLowerCase().startsWith('image/'))return new Response('Invalid image upstream',{status:502,headers:{'Cache-Control':'no-store'}});
  return new Response(upstream.body,{status:200,headers:{'Content-Type':type,'Cache-Control':'public, max-age=86400, s-maxage=604800','X-Content-Type-Options':'nosniff'}});
}
