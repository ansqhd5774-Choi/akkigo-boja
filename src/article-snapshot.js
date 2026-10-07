// Read-only source version check. Never queries Blogger or D1.
export async function articleSnapshot(articleKey,catalog){
  if(typeof articleKey!=='string'||!/^[a-z0-9-]{1,100}$/.test(articleKey))throw Error('INVALID_ARTICLE_KEY');
  const article=catalog.find(x=>x.articleKey===articleKey);
  if(!article || article.approvedForPublish!==true || !article.post) return {articleKey,approved:false};
  const bytes=new TextEncoder().encode(JSON.stringify(article.post));
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  return {articleKey,approved:true,postSha256:Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')};
}
