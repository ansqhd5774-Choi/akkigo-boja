import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const audit=await read('output/external-source-link-audit.json');
const impact=await read('data/operations/public-source-impact-20261010.json');
const gap=await read('data/operations/source-gap-review-20261010.json');
const catalog=[...await read('data/articles.json'),...await read('data/articles-supplemental.json')];
const records=audit.items.map(item=>({
 sourceId:createHash('sha256').update(item.url).digest('hex').slice(0,20),
 originalUrl:item.url,finalUrl:item.finalUrl||null,
 publisher:new URL(item.url).hostname,title:null,originalPublishedAt:null,
 lastAccessAt:item.checkedAt,lastContentVerifiedAt:null,contentHash:null,
 accessStatus:item.status===202?'BODY_UNCONFIRMED':item.state,
 httpStatus:item.status??null,claimStatus:'NOT_VERIFIED_BY_HTTP_AUDIT',accountInputStatus:'UNCONFIRMED',
 archiveUrl:null,archiveDate:null,replacementHistory:[],
 claimLinks:catalog.flatMap(a=>(a.source?.gamePeriodModel?.records||[]).filter(r=>r.sources?.some(s=>s.url?.replaceAll('&amp;','&')===item.url)).map(r=>({articleKey:a.articleKey,code:r.code}))),
 nextReviewAt:new Date(Date.parse(item.checkedAt)+((item.status>=500)?86400000:604800000)).toISOString(),
 reviewAction:'REVIEW_CONTENT_WITHOUT_AUTOMATIC_CLAIM_CHANGE'
}));
await writeFile('data/operations/source-quality-ledger-20261010.json',JSON.stringify({
 generatedAt:new Date().toISOString(),scope:'ACCESS_LEDGER_NOT_COUPON_FACT_VERIFICATION',
 policy:{separateAccessClaimAndAccount:true,neverInferExpiryFromHttp:true,neverReplaceWithUnrelatedHomepage:true,perHostConcurrency:1,serverErrorBackoffHours:[24,72],normalReviewDays:7,retainHistoricalCitation:true},
 summary:{sources:records.length,sourceGapsReviewed:gap.summary.reviewed},records
},null,2));
console.log(JSON.stringify({sources:records.length,sourceGapsReviewed:gap.summary.reviewed,impactEvidencePresent:Boolean(impact)}));
