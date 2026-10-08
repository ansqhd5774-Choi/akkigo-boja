// Shared visual primitives. Supplementary evidence stays accessible on click/tap.
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderArticleInfo(html, label='확인 사항') {
 return '<details class="ncp-info"><summary aria-label="'+escape(label)+'">ⓘ</summary><div>'+html+'</div></details>';
}
export const compactArticleCSS=`
[data-ncp-presentation="compact-r1"] .ncp-maple-nav{display:flex;gap:8px;padding:6px;background:#f1f5fd;border-radius:16px;flex-wrap:wrap}
[data-ncp-presentation="compact-r1"] .ncp-maple-nav a{display:flex;align-items:center;justify-content:center;gap:6px;flex:1 1 auto;min-height:44px;padding:10px 14px;border:0;border-radius:11px;color:#233b60;background:#fff;font-weight:700;text-decoration:none;box-shadow:0 2px 5px #1837590d}
[data-ncp-presentation="compact-r1"] .ncp-maple-nav a:first-child{background:#2155e8;color:white}
[data-ncp-presentation="compact-r1"] .ncp-maple-nav a:hover{filter:brightness(.95)}
[data-ncp-presentation="compact-r1"] summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:44px}
[data-ncp-presentation="compact-r1"] summary::-webkit-details-marker{display:none}
[data-ncp-presentation="compact-r1"] .ncp-maple-history summary::after{content:'⌄';font-size:22px;transition:transform .18s}
[data-ncp-presentation="compact-r1"] .ncp-maple-history[open]>summary::after{transform:rotate(180deg)}
[data-ncp-presentation="compact-r1"] .ncp-info{position:relative;margin:8px 0;color:#526581}
[data-ncp-presentation="compact-r1"] .ncp-info>summary{display:inline-flex;justify-content:center;width:44px;border-radius:50%;font-size:22px;cursor:pointer;background:#eef3fc}
[data-ncp-presentation="compact-r1"] .ncp-info>div{padding:12px 16px;border:1px solid #e1e8f3;border-radius:12px;background:#f8faff;margin:6px 0;line-height:1.65}
[data-ncp-presentation="compact-r1"] summary:focus-visible,[data-ncp-presentation="compact-r1"] .ncp-maple-nav a:focus-visible{outline:3px solid #7298ff;outline-offset:3px}
`;

export function validateArticlePresentation(article) {
 if(article.source?.presentationVersion!=='compact-r1')return true;
 const html=article.post.content||'';
 if(!html.includes('data-ncp-presentation="compact-r1"'))throw Error('PRESENTATION_MARKER_MISSING');
 if(/<summary\b[^>]*>[^<]*펼쳐보기/.test(html))throw Error('PRESENTATION_TEXT_TOGGLE');
 if(!html.includes('class="ncp-info"'))throw Error('PRESENTATION_INFO_MISSING');
 for(const match of html.matchAll(/<h2\b[^>]*>(.*?)<\/h2>/gs)){
  if(match[1].replace(/<[^>]*>/g,'').length>24)throw Error('PRESENTATION_HEADING_VERBOSE');
 }
 return true;
}
