import {readFile,writeFile} from 'node:fs/promises';
import {attributes} from '../src/search-audit.js';
const prior=JSON.parse(await readFile('output/search-foundation-audit.json','utf8'));
const decode=s=>String(s||'').replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"');
const result={checkedAt:new Date().toISOString(),scope:'PUBLIC_STATIC_SCHEMA_OG_IMAGE_ATTRIBUTES',pages:[],images:[],errors:[]};
for(let i=0;i<prior.pages.length;i+=4)await Promise.all(prior.pages.slice(i,i+4).map(async p=>{
 try{
  const r=await fetch(p.url,{signal:AbortSignal.timeout(20000)}),html=await r.text();
  const metas=[...html.matchAll(/<meta\b[^>]*>/gi)].map(m=>attributes(m[0]));
  const get=k=>metas.find(m=>(m.property||m.name)===k)?.content;
  const schemas=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>attributes(m[1]).type==='application/ld+json').flatMap(m=>{const s=JSON.parse(m[2]);return Array.isArray(s)?s:s['@graph']||[s];});
  const article=schemas.find(s=>/BlogPosting|Article/.test(String(s['@type'])));
  const h1=decode(html.match(/<h[1-6]\b[^>]*class=['"][^'"]*\bpost-title\b[^'"]*['"][^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1]?.replace(/<[^>]*>/g,'').trim());
  const imgs=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>attributes(m[0]));
  result.pages.push({url:p.url,status:r.status,h1,schema:article||null,schemaHeadlineMatches:article?decode(article.headline).trim()===h1:null,schemaCanonicalMatches:article?String(article.mainEntityOfPage?.['@id']||article.mainEntityOfPage||article.url)===p.url:null,og:{title:decode(get('og:title')),description:decode(get('og:description')),image:decode(get('og:image')),url:decode(get('og:url'))},imageAttributes:{count:imgs.length,missingAlt:imgs.filter(x=>!('alt'in x)).length,missingDimensions:imgs.filter(x=>!x.width||!x.height).length,missingLoading:imgs.filter(x=>!x.loading).length}});
 }catch(e){result.errors.push({url:p.url,error:e.name});}
}));
const urls=[...new Set(result.pages.map(p=>p.og.image).filter(Boolean))];
for(let i=0;i<urls.length;i+=4)await Promise.all(urls.slice(i,i+4).map(async url=>{try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const body=await r.arrayBuffer();result.images.push({url,status:r.status,contentType:r.headers.get('content-type'),bytes:body.byteLength});}catch(e){result.images.push({url,error:e.name});}}));
result.summary={pages:result.pages.length,fetchErrors:result.errors.length,missingArticleSchema:result.pages.filter(p=>!p.schema).length,headlineMismatch:result.pages.filter(p=>p.schema&&p.schemaHeadlineMatches===false).map(p=>p.url),schemaCanonicalMismatch:result.pages.filter(p=>p.schema&&p.schemaCanonicalMatches===false).map(p=>p.url),missingOgImage:result.pages.filter(p=>!p.og.image).length,ogUrlMismatch:result.pages.filter(p=>p.og.url!==p.url).map(p=>p.url),ogImageFailures:result.images.filter(i=>i.error||i.status!==200||!i.contentType?.startsWith('image/')),missingAltPages:result.pages.filter(p=>p.imageAttributes.missingAlt).length,missingDimensionPages:result.pages.filter(p=>p.imageAttributes.missingDimensions).length};
await writeFile('output/public-semantic-audit.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result.summary));
