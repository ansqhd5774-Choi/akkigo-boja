import {readFile,writeFile} from 'node:fs/promises';
const input=JSON.parse(await readFile('data/operations/source-content-observations.json','utf8'));
const browser=await readFile('data/operations/source-browser-followup-20261010.json','utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return {items:[]};throw e;});
const items=input.observations.filter(x=>x.flags.length).map(x=>{
 let category,action;
 if(x.manualReview){category='MANUALLY_REVIEWED';action='Preserve recorded review and original evidence; do not infer coupon validity.';}
 else if(x.httpStatus===404){category='MISSING_SOURCE';action='Retain historical citation; require matching replacement evidence before restoring source claims.';}
 else if(x.httpStatus!==200){category='EXTERNAL_ACCESS_PENDING';action='Use scheduled backoff; preserve unverified status; never remove codes solely because access failed.';}
 else if(x.flags.includes('ACCESS_CHALLENGE_SUSPECTED')){category='CHALLENGE_REVIEW_PENDING';action='Review through normal browser when available; no bypass or automatic fact mutation.';}
 else if(/\.pdf(?:$|\?)/i.test(x.url)){category='NON_HTML_REVIEW_PENDING';action='Apply content-type-aware monitor; PDF text remains unverified until separately read.';}
 else if(x.flags.includes('CROSS_HOST_REDIRECT_REVIEW')){category='REDIRECT_REVIEW_PENDING';action='Check destination identity before substituting a source URL.';}
 else {category='RENDERED_BODY_REVIEW_PENDING';action='Inspect rendered source; short HTTP body is not proof of missing content.';}
 const browserFollowup=browser.items.find(b=>b.sourceId===x.sourceId);
 if(browserFollowup){category='BROWSER_FOLLOWUP_RECORDED';action='Preserve rendered-page observation separately; verify article-specific claims before changing coupon facts.';}
 return {sourceId:x.sourceId,url:x.url,originalFlags:x.flags,category,action,nextReviewAt:x.nextReviewAt,manualReview:x.manualReview||null,browserFollowup:browserFollowup?{reviewedAt:browserFollowup.reviewedAt,observation:browserFollowup.browserObservation,renderingObservationOnly:true}:null,claimVerified:false,accountInputVerified:false,resolution:['MANUALLY_REVIEWED','BROWSER_FOLLOWUP_RECORDED'].includes(category)?'REVIEW_RECORDED_NOT_FACT_COMPLETION':'PENDING_EXTERNAL_EVIDENCE'};
});
const counts={};for(const x of items)counts[x.category]=(counts[x.category]||0)+1;
const result={generatedAt:new Date().toISOString(),scope:'WARNING_ACTION_COVERAGE_NOT_SOURCE_FACT_COMPLETION',observations:input.observations.length,warningItems:items.length,counts,items};
await writeFile('data/operations/source-warning-actions-20261010.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({observations:result.observations,warningItems:items.length,counts,allWarningsHaveActions:items.every(x=>x.action&&x.nextReviewAt)}));
