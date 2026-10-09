import {readFile,writeFile} from 'node:fs/promises';
import {attributes} from '../src/search-audit.js';
const failures=JSON.parse(await readFile('data/operations/external-source-link-evidence-20261010.json','utf8')).failures;
const audit=JSON.parse(await readFile('output/search-foundation-audit.json','utf8'));
const queue=JSON.parse(await readFile('output/coupon-review-queue.json','utf8')).items;
const decode=s=>String(s||'').replaceAll('&amp;','&');
const targets=new Map(failures.map(f=>[decode(f.url),{...f,publicUses:[],codeRecords:queue.filter(q=>q.sources?.some(s=>decode(s.url)===decode(f.url))).map(q=>({articleKey:q.articleKey,code:q.code,priority:q.priority,statusLabel:q.statusLabel}))}]));
const errors=[];
for(let i=0;i<audit.pages.length;i+=4){
 await Promise.all(audit.pages.slice(i,i+4).map(async page=>{
  try{const r=await fetch(page.url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('HTTP_'+r.status);const html=await r.text();
   for(const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){
    const a=attributes(m[1]);const target=targets.get(decode(a.href));if(!target)continue;
    const label=decode(m[2].replace(/<[^>]+>/g,'').trim());
    if(!target.publicUses.some(x=>x.page===page.url&&x.label===label))target.publicUses.push({page:page.url,label});
   }
  }catch(e){errors.push({page:page.url,error:e.message});}
 }));
}
const rows=[...targets.values()].map(r=>({...r,priority:r.codeRecords.some(c=>c.priority==='HIGH')?'P0_LATEST':r.status===404&&r.publicUses.length?'P0_PUBLIC_404':r.publicUses.length?'P1_PUBLIC_SOURCE':'P2_CATALOG_ONLY',impactMapping:'EXACT_URL_ONLY_NOT_INFERRED_CODE_PROVENANCE'}));
const result={checkedAt:new Date().toISOString(),scope:'PUBLIC_EXACT_SOURCE_LINK_IMPACT',pages:audit.pages.length,errors,summary:{sources:rows.length,publicSources:rows.filter(r=>r.publicUses.length).length,affectedPages:new Set(rows.flatMap(r=>r.publicUses.map(u=>u.page))).size,latestSources:rows.filter(r=>r.priority==='P0_LATEST').length},rows};
await writeFile('data/operations/public-source-impact-20261010.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.summary));if(errors.length)process.exitCode=1;
