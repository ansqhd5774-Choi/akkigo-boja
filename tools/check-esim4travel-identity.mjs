import {readFile,writeFile} from 'node:fs/promises';
const urls=JSON.parse(await readFile('output/search-foundation-audit.json','utf8')).pages.map(p=>p.url);
const out=[];
for(let i=0;i<urls.length;i+=4)await Promise.all(urls.slice(i,i+4).map(async url=>{
 const h=await(await fetch(url,{signal:AbortSignal.timeout(15000)})).text();const title=h.match(/<title>([^<]+)/)?.[1];
 if(/esim4travel|이심포트래블/i.test(title||'')||h.includes('esim4travel-promo-202610'))out.push({url,title,marker:h.match(/data-ncp-article.{0,90}/)?.[0],postId:h.match(/id=['"]post-body-(\d+)/)?.[1]});
}));
await writeFile('data/operations/esim4travel-identity-check-20261010.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out));
