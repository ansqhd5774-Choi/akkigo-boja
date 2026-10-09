import {mkdir,writeFile} from 'node:fs/promises';
import {inspectPage,compareCoverage} from '../src/search-audit.js';
const base='https://lsifl.blogspot.com/';
const out=process.env.SEARCH_AUDIT_OUTPUT||'output/search-foundation-audit.json';
async function read(url){const r=await fetch(url,{signal:AbortSignal.timeout(20000)});return {status:r.status,url:r.url,text:await r.text(),headers:{xRobots:r.headers.get('x-robots-tag')}};}
const sm=await read(base+'sitemap.xml');
if(sm.status!==200||!/<urlset\b/.test(sm.text))throw Error('SITEMAP_UNAVAILABLE');
const urls=[...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
if(urls.some(u=>new URL(u).origin!==new URL(base).origin))throw Error('UNEXPECTED_SITEMAP_ORIGIN');
const homeRaw=await read(base); const home=inspectPage(homeRaw.text,base,homeRaw.status,homeRaw.headers);
const pages=[];const errors=[];
for(let i=0;i<urls.length;i+=4)await Promise.all(urls.slice(i,i+4).map(async u=>{try{const r=await read(u);pages.push(inspectPage(r.text,u,r.status,r.headers));}catch(e){errors.push({url:u,error:e.name});}}));
const robots=await read(base+'robots.txt');
const report={checkedAt:new Date().toISOString(),scope:'PUBLIC_HTTP_AND_STATIC_HTML_ONLY',indexing:'UNVERIFIED_REQUIRES_PROVIDER',summary:compareCoverage(pages,home),fetchErrors:errors,sitemap:{status:sm.status,count:urls.length,duplicates:urls.filter((u,i)=>urls.indexOf(u)!==i)},robots:{status:robots.status,text:robots.text},home,pages};
await mkdir(out.replace(/[/\\][^/\\]+$/,''),{recursive:true});await writeFile(out,JSON.stringify(report,null,2));
console.log(JSON.stringify({output:out,...report.summary,fetchErrors:errors.length}));
if(errors.length||report.summary.httpErrors.length||report.summary.noindex.length||report.summary.missingDescription.length||report.summary.missingCanonical.length||report.summary.schemaErrors.length)process.exitCode=1;
