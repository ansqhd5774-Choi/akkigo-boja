import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {observeSource,articleSourceCandidates} from '../src/coupon-source-review.js';
const queue=JSON.parse(await readFile('output/coupon-review-queue.json','utf8'));
const models=[...JSON.parse(await readFile('data/game-period-articles.json','utf8')),...Object.values(JSON.parse(await readFile('data/game-period-hubs.json','utf8')))];
const out='output/coupon-source-observations.json';
const previous=await readFile(out,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return readFile('data/operations/coupon-source-baseline.json','utf8').then(JSON.parse).catch(err=>{if(err.code==='ENOENT')return {sources:[]};throw err;});throw e;});
const unique=new Map();
for(const row of queue.items.filter(r=>r.priority==='HIGH'))for(const s of row.sources){if(!s.url)continue;const u=new URL(s.url);if(u.protocol!=='https:')throw Error('HTTPS_SOURCE_REQUIRED');const codes=unique.get(u.href)||new Set();codes.add(row.code);unique.set(u.href,codes);}
const sources=[];
const resume=process.argv.includes('--resume');
let reused=0;
await mkdir('output',{recursive:true});
for(let i=0,entries=[...unique];i<entries.length;i+=4){
 await Promise.all(entries.slice(i,i+4).map(async([url,codes])=>{
  const checkedAt=new Date().toISOString();const prior=previous.sources.find(s=>s.url===url);
  if(resume&&prior&&Date.now()-Date.parse(prior.checkedAt)<86400000&&[...codes].every(code=>prior.codes?.some(c=>c.code===code))){sources.push(prior);reused++;return;}
  try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const html=await r.text();sources.push({...observeSource({url,status:r.status,html,checkedAt,codes:[...codes],previous:prior}),finalUrl:r.url});}
  catch(e){sources.push({url,checkedAt,state:'ACCESS_UNVERIFIED',error:e.name,changed:null,codes:[...codes].map(code=>({code,state:'UNVERIFIED'}))});}
 }));
 // Persist one bounded chunk at a time, avoiding concurrent checkpoint writes.
 await writeFile(out,JSON.stringify({scope:'SOURCE_MENTION_ONLY_NOT_REDEMPTION',sources},null,2));
}
const missing=queue.items.filter(r=>r.reasons.includes('MISSING_SOURCE_URL')).map(r=>({...r,articleSourceCandidates:articleSourceCandidates(models.find(m=>m.articleKey===r.articleKey)||{}),candidatePolicy:'ARTICLE_LINK_NOT_CODE_EVIDENCE'}));
await mkdir('output',{recursive:true});
await writeFile('output/coupon-source-missing-context.json',JSON.stringify({scope:'STRUCTURED_SOURCE_GAPS_NOT_PUBLIC_SOURCE_ABSENCE',items:missing},null,2));
const reviews=queue.items.filter(r=>r.priority==='HIGH').map(row=>{
 const observations=sources.filter(s=>s.codes.some(c=>c.code===row.code)&&row.sources.some(r=>r.url===s.url));
 const found=observations.some(s=>s.codes.some(c=>c.code===row.code&&c.state==='MENTION_FOUND'));
 return {...row,attemptedAt:observations.map(s=>s.checkedAt).sort().at(-1)||null,checkedAt:observations.filter(s=>s.state==='SOURCE_READ').map(s=>s.checkedAt).sort().at(-1)||null,status:found?'SOURCE_MENTION_REVIEWED':'EVIDENCE_REVIEW_REQUIRED',verificationState:'ACCOUNT_REDEMPTION_UNVERIFIED',observations:observations.map(s=>({url:s.url,state:s.state,codeState:s.codes.find(c=>c.code===row.code)?.state,changed:s.changed})),nextAction:'REVIEW_REWARD_EXPIRY_APPLICABILITY',nextReviewAt:row.nextReviewAt};
});
await writeFile('output/coupon-high-priority-review.json',JSON.stringify({scope:'39_LATEST_SOURCE_REVIEW_NOT_ACCOUNT_SUCCESS',items:reviews},null,2));
console.log(JSON.stringify({sources:sources.length,reused,read:sources.filter(s=>s.state==='SOURCE_READ').length,accessUnverified:sources.filter(s=>s.state!=='SOURCE_READ').length,latestReviewed:reviews.length,mentionsFound:reviews.filter(r=>r.status==='SOURCE_MENTION_REVIEWED').length,missingStructured:missing.length,articleCandidates:missing.filter(r=>r.articleSourceCandidates.length).length}));
