import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
const runId=process.argv[2]||'37976233366';
const expected=Number(process.argv[3]||25);
const log=execFileSync('gh',['run','view',runId,'--log'],{encoding:'utf8',maxBuffer:8000000});
const records=log.split('\n').flatMap(l=>{const s=l.indexOf('{"articleKey"');if(s<0)return [];try{return [JSON.parse(l.slice(s))];}catch{return [];}}).filter(r=>r.status==='LIVE');
const pages=[];
for(let i=0;i<records.length;i+=4)await Promise.all(records.slice(i,i+4).map(async r=>{
 const response=await fetch(r.url,{signal:AbortSignal.timeout(20000)});const html=await response.text();
 const removedUrls=['https://danmaek.com/posts/lucky-defense-coupons/','https://www.taptap.cn/moment/855187337099871515?group_id=1069519'];
 pages.push({...r,httpStatus:response.status,articlePresent:html.includes('post-body-'+r.postId),healthMarkers:(html.match(/class="ncp-source-(?:health|unavailable)"/g)||[]).length,sourceGapMarkers:(html.match(/data-source-provenance="unconfirmed"/g)||[]).length,thirdPartyReferenceMarkers:(html.match(/data-source-provenance="third-party-reference"/g)||[]).length,broken404Anchor:removedUrls.some(u=>html.includes('href="'+u.replaceAll('&','&amp;')+'"'))});
}));
const result={checkedAt:new Date().toISOString(),runId,scope:'PROVIDER_AND_INDEPENDENT_PUBLIC_HTML',summary:{published:records.length,checked:pages.length,errors:pages.filter(p=>p.httpStatus!==200||!p.articlePresent||p.broken404Anchor||!p.publicVerified).length},pages};
await writeFile('data/operations/source-health-public-evidence-'+runId+'.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.summary));if(result.summary.errors||records.length!==expected)process.exitCode=1;
