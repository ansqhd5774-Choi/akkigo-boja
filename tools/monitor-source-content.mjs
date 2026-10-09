import {readFile,writeFile} from 'node:fs/promises';
import {inspectSourceContent} from '../src/source-content-review.js';
const path='data/operations/source-content-observations.json';
const ledger=JSON.parse(await readFile('data/operations/source-quality-ledger-20261010.json','utf8'));
const previous=await readFile(path,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return {observations:[]};throw e;});
const observations=previous.observations;
const limit=Math.min(12,Number(process.argv.find(x=>x.startsWith('--limit='))?.split('=')[1]||4));
const now=Date.now(),hosts=new Set();let checked=0;
const initial=process.argv.includes('--initial');
for(const record of ledger.records){
 if(checked>=limit)break;
 const old=observations.find(x=>x.sourceId===record.sourceId);
 if(!(initial&&!old)&&Date.parse(old?.nextReviewAt||record.nextReviewAt)>now)continue;
 const host=new URL(record.originalUrl).hostname;if(hosts.has(host))continue;hosts.add(host);
 // Sequential requests, one URL per host per run. Never retry challenges.
 let result;
 try{
  const response=await fetch(record.originalUrl,{signal:AbortSignal.timeout(12000)});
  const type=response.headers.get('content-type')||'';
  const html=type.includes('html')?(await response.text()).slice(0,1000000):'';
  result={httpStatus:response.status,finalUrl:response.url,...inspectSourceContent({url:record.originalUrl,finalUrl:response.url,status:response.status,html,previousHash:old?.lastObservedBodyHash,expectedCodes:[...new Set((record.claimLinks||[]).map(c=>c.code))]})};
 }catch(e){result={flags:['ACCESS_UNVERIFIED'],error:e.name,claimVerified:false,accountInputVerified:false};}
 const checkedAt=new Date().toISOString();
 const transient=result.httpStatus>=500||result.error;
 const consecutiveTransientFailures=transient?(old?.consecutiveTransientFailures||0)+1:0;
 const waitMs=transient?(consecutiveTransientFailures===1?86400000:259200000):604800000;
 const bodyObserved=result.httpStatus===200&&!result.flags.includes('ACCESS_CHALLENGE_SUSPECTED')&&!result.flags.includes('SOFT_404_SUSPECTED')&&!result.flags.includes('BODY_TOO_SHORT_REVIEW');
 const entry={sourceId:record.sourceId,url:record.originalUrl,checkedAt,nextReviewAt:new Date(Date.now()+waitMs).toISOString(),consecutiveTransientFailures,lastObservedBodyHash:bodyObserved?result.contentHash:(old?.lastObservedBodyHash||null),...result};
 const index=observations.findIndex(x=>x.sourceId===record.sourceId);if(index<0)observations.push(entry);else observations[index]=entry;
 await writeFile(path,JSON.stringify({scope:'CONTENT_CHANGE_REVIEW_NOT_FACT_VERIFICATION',observations},null,2));checked++;
}
console.log(JSON.stringify({checked,checkpointRecords:observations.length,reviewFlags:observations.filter(x=>x.flags.length).length,noFactMutation:true}));
