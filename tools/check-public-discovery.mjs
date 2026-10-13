import {mkdir,writeFile} from 'node:fs/promises';
import {inspectPage} from '../src/search-audit.js';

const base='https://lsifl.blogspot.com/';
const rateLimitCode='BLOGGER_DISCOVERY_RATE_LIMIT';
const read=async url=>{
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  if(response.status===429){
    const error=Error('DISCOVERY_HTTP_429');
    error.code=rateLimitCode;
    throw error;
  }
  if(!response.ok)throw Error('DISCOVERY_HTTP_'+response.status);
  return response.text();
};
const persist=async report=>{
  await mkdir('output',{recursive:true});
  await writeFile('output/public-discovery.json',JSON.stringify(report,null,2));
};

let targets=new Set();
const visited=new Set();
const found=new Set();

async function run(){
  const sitemap=await read(base+'sitemap.xml');
  targets=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1].replaceAll('&amp;','&')));
  const pending=[base];
  while(pending.length&&visited.size<60){
    const url=pending.shift();
    if(visited.has(url))continue;
    visited.add(url);
    for(const href of inspectPage(await read(url),url,200).anchors){
      const target=new URL(href);
      target.hash='';
      if(target.origin!==new URL(base).origin)continue;
      if(targets.has(target.href))found.add(target.href);
      // Follow native month archives and their older-post pagination; never /search.
      if(/^\/\d{4}\/(?:\d{2}\/)?$/.test(target.pathname)&&!visited.has(target.href))pending.push(target.href);
    }
  }
  const missing=[...targets].filter(url=>!found.has(url));
  const report={
    checkedAt:new Date().toISOString(),
    scope:'PUBLIC_HTML_LINK_DISCOVERY_NOT_INDEXING',
    state:missing.length?'INCOMPLETE':'COMPLETE',
    total:targets.size,
    reachable:found.size,
    missing,
    visited:[...visited]
  };
  await persist(report);
  console.log(JSON.stringify({state:report.state,total:targets.size,reachable:found.size,missing:missing.length}));
  if(missing.length)process.exitCode=1;
}

try{
  await run();
}catch(error){
  if(error?.code!==rateLimitCode)throw error;
  const report={
    checkedAt:new Date().toISOString(),
    scope:'PUBLIC_HTML_LINK_DISCOVERY_NOT_INDEXING',
    state:'THROTTLED',
    reason:'BLOGGER_HTTP_429',
    total:targets.size||null,
    reachable:found.size,
    missing:null,
    visited:[...visited]
  };
  await persist(report);
  console.log('PUBLIC_DISCOVERY_THROTTLED_429 '+JSON.stringify({visited:visited.size,reachable:found.size,total:targets.size||null}));
}
