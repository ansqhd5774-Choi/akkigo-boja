import registry from '../data/source-health.json' with {type:'json'};
const decode=s=>s.replaceAll('&amp;','&');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
export function annotateSourceHealth(html,entries=registry){
 const byUrl=new Map(entries.map(e=>[e.url,e]));
 return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi,(all,attrs,label)=>{
  if(attrs.includes('data-source-health-state='))return all;
  const href=attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];if(!href)return all;
  const state=byUrl.get(decode(href));if(!state)return all;
  if(state.status===404)return '<span class="ncp-source-unavailable" data-source-original-url="'+esc(state.url)+'">'+label+' — 원문 삭제 또는 이동·대체 근거 확인 중 ('+state.checkedDate+')</span>';
  return all.replace('<a','<a data-source-health-state="review-pending"')+' <span class="ncp-source-health">('+ (state.status>=500?'원문 접속 오류·재확인 중':'원문 접근 재확인 중')+' · '+state.checkedDate+')</span>';
 });
}
