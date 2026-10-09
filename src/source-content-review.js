import {createHash} from 'node:crypto';
// Diagnostic flags request review. They never change coupon facts or validity.
export function inspectSourceContent({url,finalUrl,status,html,contentType='text/html',previousHash=null,expectedCodes=[]}) {
 if(!/html/i.test(contentType)) {
  const flags=['NON_HTML_CONTENT_REVIEW_REQUIRED'];
  if(status!==200)flags.push('HTTP_BODY_UNCONFIRMED');
  if(new URL(url).hostname!==new URL(finalUrl).hostname)flags.push('CROSS_HOST_REDIRECT_REVIEW');
  return {title:'',contentHash:null,textLength:null,flags,missingCodes:[],claimVerified:false,accountInputVerified:false};
 }
 const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 const title=(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'').replace(/<[^>]+>/g,'').trim().slice(0,180);
 const contentHash=createHash('sha256').update(text).digest('hex');
 const flags=[];
 if(status!==200)flags.push('HTTP_BODY_UNCONFIRMED');
 if(/just a moment|verify you are human|prove your humanity|checking your browser|access denied|blocked by network security/i.test(title+' '+text.slice(0,1500))||/captcha/i.test(title))flags.push('ACCESS_CHALLENGE_SUSPECTED');
 if(/404|page not found|페이지를 찾을 수|존재하지 않는 페이지/i.test(title))flags.push('SOFT_404_SUSPECTED');
 if(new URL(url).hostname!==new URL(finalUrl).hostname)flags.push('CROSS_HOST_REDIRECT_REVIEW');
 if(text.length<120)flags.push('BODY_TOO_SHORT_REVIEW');
 if(previousHash&&previousHash!==contentHash)flags.push('CONTENT_CHANGED_REVIEW');
 const missingCodes=expectedCodes.filter(code=>!text.includes(code));
 if(missingCodes.length)flags.push('EXPECTED_CODE_NOT_OBSERVED');
 return {title,contentHash,textLength:text.length,flags,missingCodes,claimVerified:false,accountInputVerified:false};
}
export function preserveReviewHistory(old) {
 const history=[...(old?.manualReviewHistory||[])];
 if(old?.manualReview)history.push({observationCheckedAt:old.checkedAt,contentHash:old.contentHash||null,review:old.manualReview});
 return history;
}
