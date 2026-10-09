import {createHash} from 'node:crypto';
export function sourceText(html) {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|quot|lt|gt);/g,' ').replace(/\s+/g,' ').trim();
}
export function containsCode(text,code) {
  const escaped=code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp(`(^|[^A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`,'i').test(text);
}
export function observeSource({url,status,html,checkedAt,codes,previous}) {
  const text=sourceText(html);
  const blocked=status!==200||/just a moment|verify you are human|access denied|captcha/i.test(text.slice(0,1500))||text.length<100;
  if(blocked)return {url,status,checkedAt,state:'ACCESS_UNVERIFIED',changed:null,fingerprint:null,codes:codes.map(code=>({code,state:'UNVERIFIED'}))};
  // Changes are candidates only. Dynamic counters may also change this hash.
  const fingerprint=createHash('sha256').update(text).digest('hex');
  return {url,status,checkedAt,state:'SOURCE_READ',fingerprint,changed:previous?.fingerprint?previous.fingerprint!==fingerprint:null,codes:codes.map(code=>({code,state:containsCode(text,code)?'MENTION_FOUND':'MENTION_NOT_FOUND'}))};
}
export function articleSourceCandidates(model,origin='https://lsifl.blogspot.com') {
  const html=[model.guideHTML,model.archiveHTML,model.noticeHTML].filter(Boolean).join(' ');
  const candidates=new Set();
  for(const match of html.matchAll(/href\s*=\s*["'](https?:\/\/[^"']+)["']/gi)){
    try{const url=new URL(match[1].replaceAll('&amp;','&'));if(url.origin!==origin)candidates.add(url.href);}catch{}
  }
  return [...candidates]; // Article-wide links are not evidence for an individual code.
}
