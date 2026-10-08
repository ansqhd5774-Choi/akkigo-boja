// Shared visual primitives. Supplementary evidence stays accessible on click/tap.
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderArticleInfo(html, label='확인 사항') {
 return '<details class="ncp-info"><summary aria-label="'+escape(label)+'"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/></svg></summary><div>'+html+'</div></details>';
}
export const compactArticleCSS=`
[data-ncp-presentation="compact-r1"] .ncp-maple-nav{display:flex;gap:8px;padding:6px;background:#f1f5fd;border-radius:16px;flex-wrap:wrap}
[data-ncp-presentation="compact-r1"] .ncp-maple-nav a{display:flex;align-items:center;justify-content:center;gap:6px;flex:1 1 auto;min-height:44px;padding:10px 14px;border:0;border-radius:11px;color:#233b60;background:#fff;font-weight:700;text-decoration:none;box-shadow:0 2px 5px #1837590d}
[data-ncp-presentation="compact-r1"] .ncp-maple-nav a:first-child{background:#2155e8;color:white}
[data-ncp-presentation="compact-r1"] .ncp-maple-nav a:hover{filter:brightness(.95)}
[data-ncp-presentation="compact-r1"] summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:44px}
[data-ncp-presentation="compact-r1"] summary::-webkit-details-marker{display:none}
[data-ncp-presentation="compact-r1"] .ncp-maple-history summary::after{content:'';width:10px;height:10px;border-right:3px solid currentColor;border-bottom:3px solid currentColor;transform:rotate(45deg);transition:transform .18s;margin:0 6px 6px auto;flex-shrink:0}
[data-ncp-presentation="compact-r1"] .ncp-maple-history summary span{margin-left:auto}
[data-ncp-presentation="compact-r1"] .ncp-maple-history[open]>summary::after{transform:rotate(225deg)}
[data-ncp-presentation="compact-r1"] section,[data-ncp-presentation="compact-r1"] .ncp-brief{position:relative}
[data-ncp-presentation="compact-r1"] .ncp-brief .ncp-maple-summary{padding-right:58px}
[data-ncp-presentation="compact-r1"] .ncp-info{position:absolute;top:12px;right:12px;margin:0;color:#2155e8;z-index:3;border:0!important;padding:0!important;background:transparent!important}
[data-ncp-presentation="compact-r1"] .ncp-info>summary{display:flex;justify-content:center;width:44px;height:44px;cursor:pointer;background:transparent;border:0!important}
[data-ncp-presentation="compact-r1"] .ncp-info>div{position:absolute;right:0;top:44px;width:min(420px,calc(100vw - 64px));padding:16px;border:0;border-radius:12px;background:#edf3ff;box-shadow:0 8px 26px #18375926;line-height:1.65;color:#233b60}
[data-ncp-presentation="compact-r1"] .ncp-compact-list .ncp-list-header,[data-ncp-presentation="compact-r1"] .ncp-compact-list .ncp-code-card{grid-template-columns:46px 116px 108px minmax(0,1fr) 126px}
[data-ncp-presentation="compact-r1"] .ncp-col-action{display:flex;gap:6px;align-items:center}
[data-ncp-presentation="compact-r1"] .ncp-col-action .ncp-share{width:44px!important;min-width:44px;flex:0 0 44px;background:#edf3ff!important;color:#2155e8!important;display:flex;align-items:center;justify-content:center;padding:0!important}
[data-ncp-presentation="compact-r1"] .ncp-col-action [data-ncp-copy]{flex:1;min-width:0}
@media(max-width:600px){[data-ncp-presentation="compact-r1"] .ncp-compact-list .ncp-code-card{grid-template-columns:minmax(0,1fr) 126px!important}[data-ncp-presentation="compact-r1"] .ncp-compact-list .ncp-list-header{grid-template-columns:26px 61px 63px minmax(0,1fr) 126px}}
[data-ncp-presentation="compact-r1"] summary:focus-visible,[data-ncp-presentation="compact-r1"] .ncp-maple-nav a:focus-visible{outline:3px solid #7298ff;outline-offset:3px}
`;

export function validateArticlePresentation(article) {
 if(!['compact-r1','compact-r2'].includes(article.source?.presentationVersion))return true;
 const html=article.post.content||'';
 if(!html.includes('data-ncp-presentation="'+article.source.presentationVersion+'"'))throw Error('PRESENTATION_MARKER_MISSING');
 if(article.source.presentationVersion==='compact-r2'){
  if(/<\/h2>\s*<p>[\s\S]*?<\/p>\s*<div class="ncp-card-list/.test(html))throw Error('PRESENTATION_SECTION_INFO_REQUIRED');
  for(const section of html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)){
   const count=(section[1].match(/class="ncp-code-card"/g)||[]).length;
   if(count>5&&!section[1].includes('class="ncp-list-more"'))throw Error('PRESENTATION_LIST_DISCLOSURE_REQUIRED');
  }
 }
 if(/<summary\b[^>]*>[^<]*펼쳐보기/.test(html))throw Error('PRESENTATION_TEXT_TOGGLE');
 if(!html.includes('class="ncp-info"'))throw Error('PRESENTATION_INFO_MISSING');
 for(const match of html.matchAll(/<h2\b[^>]*>(.*?)<\/h2>/gs)){
  if(match[1].replace(/<[^>]*>/g,'').length>24)throw Error('PRESENTATION_HEADING_VERBOSE');
 }
 return true;
}
