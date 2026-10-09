import {readFile,writeFile} from 'node:fs/promises';
const model=JSON.parse(await readFile('data/operations/content-intent-review-20261010.json','utf8'));
const path='output/external-source-link-audit.json';
const previous=await readFile(path,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return {items:[]};throw e;});
const urls=[...new Set(model.articles.flatMap(a=>a.externalSourceUrls||[]).map(s=>s.replaceAll('&amp;','&')))].filter(s=>{
  const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password&&!/token|secret|auth|login|session/i.test(u.search);
});
const items=previous.items.filter(i=>urls.includes(i.url));
const pending=urls.filter(u=>!items.some(i=>i.url===u));
const limit=Number(process.argv.find(s=>s.startsWith('--limit='))?.split('=')[1]||80);
for(let i=0;i<Math.min(pending.length,limit);i+=4){
 await Promise.all(pending.slice(i,Math.min(i+4,limit)).map(async url=>{
  try{const r=await fetch(url,{signal:AbortSignal.timeout(12000)});await r.body?.cancel();items.push({url,status:r.status,finalUrl:r.url,checkedAt:new Date().toISOString(),state:r.ok?'REACHABLE':([401,403,429].includes(r.status)?'ACCESS_RESTRICTED':'HTTP_ERROR')});}
  catch(e){items.push({url,state:'ACCESS_UNVERIFIED',error:e.name,checkedAt:new Date().toISOString()});}
 }));
 await writeFile(path,JSON.stringify({scope:'CATALOG_SOURCE_LINKS_NOT_CONTENT_FACT_VERIFICATION',total:urls.length,checked:items.length,pending:urls.length-items.length,items},null,2));
}
console.log(JSON.stringify({total:urls.length,checked:items.length,pending:urls.length-items.length,reachable:items.filter(i=>i.state==='REACHABLE').length,restricted:items.filter(i=>i.state==='ACCESS_RESTRICTED').length,httpErrors:items.filter(i=>i.state==='HTTP_ERROR').length,unverified:items.filter(i=>i.state==='ACCESS_UNVERIFIED').length}));
