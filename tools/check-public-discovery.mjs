import {mkdir,writeFile} from 'node:fs/promises';
import {inspectPage} from '../src/search-audit.js';
const base='https://lsifl.blogspot.com/';
const read=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('DISCOVERY_HTTP_'+r.status);return r.text();};
const sitemap=await read(base+'sitemap.xml');
const targets=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1].replaceAll('&amp;','&')));
const pending=[base],visited=new Set(),found=new Set();
while(pending.length&&visited.size<60){
 const url=pending.shift();if(visited.has(url))continue;visited.add(url);
 for(const href of inspectPage(await read(url),url,200).anchors){
  const u=new URL(href);u.hash='';if(u.origin!==new URL(base).origin)continue;
  if(targets.has(u.href))found.add(u.href);
  // Follow native month archives and their older-post pagination; never /search.
  if(/^\/\d{4}\/(?:\d{2}\/)?$/.test(u.pathname)&&!visited.has(u.href))pending.push(u.href);
 }
}
const missing=[...targets].filter(u=>!found.has(u));
const report={checkedAt:new Date().toISOString(),scope:'PUBLIC_HTML_LINK_DISCOVERY_NOT_INDEXING',total:targets.size,reachable:found.size,missing,visited:[...visited]};
await mkdir('output',{recursive:true});await writeFile('output/public-discovery.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({total:targets.size,reachable:found.size,missing:missing.length}));
if(missing.length)process.exitCode=1;
