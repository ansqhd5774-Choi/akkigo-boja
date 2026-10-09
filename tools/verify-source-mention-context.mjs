import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const review=JSON.parse(await readFile('data/operations/source-gap-review-20261010.json','utf8'));
const path='data/operations/source-mention-context-20261010.json';
const previous=await readFile(path,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return {sources:[]};throw e;});
const sources=previous.sources;
const aliases={trickcal:/trickcal|트릭컬/i,pokemon:/pok[eé]mon|포켓몬|포케토리/i,fortblox:/fortblox/i,kingshot:/kingshot|킹샷|キングショット/i,nikke:/nikke|니케|ニケ/i,duck:/duck survival|후더덕/i,outerplane:/outerplane|アウタープレーン|아우터플레인/i,'top-force':/top force|topforce|탑포스/i,aniimo:/aniimo|아니모/i,'last-asylum':/last asylum|라스트.*어사일럼/i,lordrush:/lordrush|lord rush/i};
const urls=[...new Set(review.items.flatMap(i=>i.candidateMentions.map(s=>s.url)))];
const limit=Number(process.argv.find(x=>x.startsWith('--limit='))?.split('=')[1]||6);
let processed=0;
for(const url of urls){
 if(processed>=limit)break;if(sources.some(s=>s.url===url))continue;
 const items=review.items.filter(i=>i.candidateMentions.some(s=>s.url===url));
 let result={url,checkedAt:new Date().toISOString(),codes:[],claimVerified:false,accountInputVerified:false};
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(12000)});const html=await response.text();
  const title=(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'').replace(/<[^>]*>/g,'').trim();
  const body=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ');
  const contexts=[...body.matchAll(/<(tr|li|code)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>m[2].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim());
  const safe=response.status===200&&!/captcha|just a moment|access denied|verify you are human/i.test(title);
  for(const item of items){
   const alias=Object.entries(aliases).find(([key])=>item.articleKey.startsWith(key))?.[1];
   const escaped=item.code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   const boundary=new RegExp('(?<![A-Za-z0-9])'+escaped+'(?![A-Za-z0-9])','i');
   if(safe&&alias?.test(title)&&contexts.some(text=>boundary.test(text)))result.codes.push({articleKey:item.articleKey,code:item.code,referenceType:new URL(url).hostname==='pokemongo.com'?'OFFICIAL_PAGE_CODE_MENTION':'THIRD_PARTY_CODE_MENTION'});
  }
  result={...result,httpStatus:response.status,finalUrl:response.url,title:title.slice(0,220),bodyHash:createHash('sha256').update(body).digest('hex'),state:result.codes.length?'GAME_CONTEXT_AND_CODE_LIST_OBSERVED':'CONTEXT_NOT_ESTABLISHED'};
 }catch(e){result={...result,state:'ACCESS_UNVERIFIED',error:e.name};}
 sources.push(result);processed++;
 await writeFile(path,JSON.stringify({scope:'REFERENCE_ASSOCIATION_NOT_DATE_REWARD_OR_REDEMPTION_VERIFICATION',sources},null,2));
}
console.log(JSON.stringify({sources:sources.length,processed,associatedRecords:new Set(sources.flatMap(s=>s.codes.map(c=>c.articleKey+':'+c.code))).size,pending:urls.length-sources.length}));
