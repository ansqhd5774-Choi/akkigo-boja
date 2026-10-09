import {readFile,writeFile} from 'node:fs/promises';
import {summarizeSourceGaps} from '../src/source-gap-summary.js';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const base='data/operations/';
const [ledger,observed,actions,gaps,primary,supplemental]=await Promise.all([read(base+'source-quality-ledger-20261010.json'),read(base+'source-content-observations.json'),read(base+'source-warning-actions-20261010.json'),read(base+'source-gap-review-20261010.json'),read('data/articles.json'),read('data/articles-supplemental.json')]);
const observations=new Map(observed.observations.map(x=>[x.sourceId,x]));
const actionMap=new Map(actions.items.map(x=>[x.sourceId,x]));
if(observations.size!==observed.observations.length||actionMap.size!==actions.items.length)throw Error('DUPLICATE_SOURCE_ID');
const records=ledger.records.map(record=>{
 const o=observations.get(record.sourceId),a=actionMap.get(record.sourceId);
 if(!o||o.url!==record.originalUrl)throw Error('OBSERVATION_REFERENCE_MISMATCH');
 if(o.flags.length&&!a)throw Error('WARNING_ACTION_MISSING');
 return {sourceId:record.sourceId,url:record.originalUrl,historicalAccess:{observedAt:record.lastAccessAt,httpStatus:record.httpStatus??null},latestObservation:{observedAt:o.checkedAt,httpStatus:o.httpStatus??null,error:o.error||null,flags:o.flags,contentType:o.contentType||null},httpStatusDiffers:record.httpStatus!==o.httpStatus,manualReview:o.manualReview||null,browserObservation:a?.browserFollowup||null,nextReviewAt:o.nextReviewAt,claimVerified:false,accountInputVerified:false};
});
const result={generatedAt:new Date().toISOString(),scope:'LATEST_OBSERVATION_VIEW_NOT_RECOVERY_OR_FACT_VERIFICATION',historicalBaseline:'source-content-baseline-complete-20261010.json',summary:{sources:records.length,warnings:records.filter(r=>r.latestObservation.flags.length).length,httpStatusDifferences:records.filter(r=>r.httpStatusDiffers).length,sourceGaps:summarizeSourceGaps(gaps.items,[...primary,...supplemental])},records};
await writeFile(base+'source-current-status-20261010.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.summary));
