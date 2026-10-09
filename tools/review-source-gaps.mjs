import {readFile,writeFile} from 'node:fs/promises';
const gaps=JSON.parse(await readFile('output/coupon-source-missing-context.json','utf8')).items;
const access=JSON.parse(await readFile('output/external-source-link-audit.json','utf8')).items;
const path='output/source-gap-observations.json';
const old=await readFile(path,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
const urls=[...new Set(gaps.flatMap(r=>r.articleSourceCandidates))];
const observations=[...old];
for(let i=0;i<urls.length;i+=4){
 await Promise.all(urls.slice(i,i+4).filter(url=>!observations.some(o=>o.url===url)).map(async url=>{
  const before=access.find(a=>a.url===url);const codes=[...new Set(gaps.filter(r=>r.articleSourceCandidates.includes(url)).map(r=>r.code))];
  if(before&&before.status!==200){observations.push({url,state:'ACCESS_NOT_CONFIRMED',codes:[],priorStatus:before.status});return;}
  if(/discord\.gg|play\.google|apps\.apple|\/giftcode|\/coupon|offer-redemption|x\.com|\/topic\?|\/pre_campaign|board\/31$/.test(url)){observations.push({url,state:'DISCOVERY_OR_REGISTRATION_NOT_CODE_EVIDENCE',codes:[]});return;}
  try{const r=await fetch(url,{signal:AbortSignal.timeout(12000)});const html=await r.text();const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ');
   const blocked=/just a moment|checking your browser|access denied|captcha|verify you are human/i.test(text);
   observations.push({url,status:r.status,checkedAt:new Date().toISOString(),state:r.status===200&&!blocked?'TEXT_READ':'ACCESS_NOT_CONFIRMED',codes:r.status===200&&!blocked?codes.filter(c=>new RegExp('(?<![A-Za-z0-9])'+c.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![A-Za-z0-9])','i').test(text)):[]});
  }catch(e){observations.push({url,state:'ACCESS_NOT_CONFIRMED',error:e.name,codes:[]});}
 }));
 await writeFile(path,JSON.stringify(observations,null,2));
}
const items=gaps.map(g=>({articleKey:g.articleKey,code:g.code,decision:'ORIGINAL_SOURCE_LINK_UNCONFIRMED',candidateMentions:observations.filter(o=>g.articleSourceCandidates.includes(o.url)&&o.codes.includes(g.code)).map(o=>({url:o.url,checkedAt:o.checkedAt})),claimVerified:false,nextAction:'CHECK_GAME_CONTEXT_DATE_REWARD_AND_ORIGINAL_PROVENANCE'}));
const report={checkedAt:new Date().toISOString(),scope:'501_SOURCE_GAPS_MENTION_SCREENING_NOT_FACT_VERIFICATION',summary:{reviewed:items.length,withMention:items.filter(i=>i.candidateMentions.length).length,withoutMention:items.filter(i=>!i.candidateMentions.length).length,sources:observations.length},items};
await writeFile('data/operations/source-gap-review-20261010.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary));
