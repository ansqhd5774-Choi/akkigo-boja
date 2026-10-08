import {DOMParser} from '@xmldom/xmldom';
export function validatePresentationDOM(article){
 if(article.source?.presentationVersion!=='compact-r2')return true;
 const d=new DOMParser({onError:()=>{}}).parseFromString('<html><body>'+article.post.content+'</body></html>','text/html');
 const elements=n=>Array.from(n.getElementsByTagName('*'));
 const has=(n,c)=>(n.getAttribute('class')||'').split(/\s+/).includes(c);
 const children=n=>Array.from(n.childNodes).filter(x=>x.nodeType===1);
 const root=elements(d).find(n=>n.getAttribute('data-ncp-article')===article.articleKey);
 if(!root)throw Error('PRESENTATION_ARTICLE_ROOT_REQUIRED');
 for(const info of elements(root).filter(n=>has(n,'ncp-info'))){
  if(info.tagName!=='details'||!(info.parentNode.tagName==='section'||has(info.parentNode,'ncp-brief')))throw Error('PRESENTATION_INFO_CONTAINER');
  const s=children(info).find(n=>n.tagName==='summary');
  if(!s?.getAttribute('aria-label')||!s.getElementsByTagName('svg').length||s.textContent.trim())throw Error('PRESENTATION_ICON_REQUIRED');
 }
 for(const section of elements(root).filter(n=>n.tagName==='section')){
  if(elements(section).some(n=>has(n,'ncp-code-card'))&&children(section).some(n=>n.tagName==='p'))throw Error('PRESENTATION_VISIBLE_PROVENANCE');
 }
 for(const list of elements(root).filter(n=>has(n,'ncp-card-list'))){
  const rows=elements(list).filter(n=>has(n,'ncp-code-card'));
  if(rows.length<=5)continue;
  const more=children(list).find(n=>has(n,'ncp-list-more'));
  if(!more||more.tagName!=='details'||more.hasAttribute('open')||children(list).filter(n=>has(n,'ncp-code-card')).length!==5)throw Error('PRESENTATION_FIVE_ROW_PREVIEW');
  const hidden=elements(more).filter(n=>has(n,'ncp-code-card')).length;
  const summary=children(more).find(n=>n.tagName==='summary');
  if(hidden!==rows.length-5||!summary?.getAttribute('aria-label')||!summary.textContent.trim().endsWith(String(hidden)))throw Error('PRESENTATION_DISCLOSURE_COUNT');
 }
 if(elements(root).filter(n=>n.tagName==='p').some(n=>/검색 키워드:|연관 검색어:|#[가-힣A-Za-z]{3}/.test(n.textContent)))throw Error('PRESENTATION_VISIBLE_SEO');
 return true;
}
