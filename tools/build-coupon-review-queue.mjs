import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const articles=JSON.parse(await readFile('data/game-period-articles.json','utf8'));
const hubs=JSON.parse(await readFile('data/game-period-hubs.json','utf8'));
const queue=[];const seen=new Set();
for(const model of [...articles,...Object.values(hubs)]) for(const row of model.records||[]){
 const key=model.articleKey+'::'+row.code;if(seen.has(key))continue;seen.add(key);
 const sources=(row.sources||[]).map(s=>({name:s.name||null,url:s.url||null,publishedAt:s.publishedAt||s.sourcePublishedAt||null}));
 const reasons=[];
 if(!sources.some(s=>s.url))reasons.push('MISSING_SOURCE_URL');
 if(!row.sourcePublishedAt)reasons.push('SOURCE_DATE_UNKNOWN');
 if(!row.expiry||/미확인|불명|별도|공지/.test(row.expiry))reasons.push('EXPIRY_REVIEW');
 if(row.latest&&!row.latestEvidence)reasons.push('LATEST_EVIDENCE_REVIEW');
 const expired=/만료|종료/.test(row.statusLabel||'');
 queue.push({key,articleKey:model.articleKey,title:model.title,code:row.code,sourcePublishedAt:row.sourcePublishedAt||null,expiry:row.expiry||null,sources,statusLabel:row.statusLabel||null,priority:row.latest?'HIGH':expired?'LOW':'NORMAL',reasons,status:'REVIEW_PENDING',checkedAt:null,nextReviewAt:null,sourceFingerprint:createHash('sha256').update(JSON.stringify({sources,expiry:row.expiry,status:row.statusLabel,evidence:row.evidenceHTML||null})).digest('hex')});
}
queue.sort((a,b)=>({HIGH:0,NORMAL:1,LOW:2}[a.priority]-{HIGH:0,NORMAL:1,LOW:2}[b.priority]));
await mkdir('output',{recursive:true});
await writeFile('output/coupon-review-queue.json',JSON.stringify({generatedAt:new Date().toISOString(),scope:'LOCAL_MODEL_REVIEW_CANDIDATES_NOT_REVERIFIED',items:queue},null,2));
console.log(JSON.stringify({records:queue.length,highPriority:queue.filter(r=>r.priority==='HIGH').length,missingSources:queue.filter(r=>r.reasons.includes('MISSING_SOURCE_URL')).length,output:'output/coupon-review-queue.json'}));
