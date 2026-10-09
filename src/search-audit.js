export function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m=>[m[1].toLowerCase(),m[2]??m[3]??m[4]]));
}
export function inspectPage(html, url, status, headers={}) {
  const metas=[...html.matchAll(/<meta\b[^>]*>/gi)].map(m=>attributes(m[0]));
  const links=[...html.matchAll(/<link\b[^>]*>/gi)].map(m=>attributes(m[0]));
  const get=name=>metas.filter(m=>(m.name||m.property||'').toLowerCase()===name).map(m=>m.content||'');
  const anchors=[...html.matchAll(/<a\b[^>]*>/gi)].map(m=>attributes(m[0]).href).filter(Boolean);
  const canonical=links.filter(l=>(l.rel||'').toLowerCase().split(/\s+/).includes('canonical')).map(l=>l.href);
  const robots=[...get('robots'),...get('googlebot'),headers.xRobots||''];
  const schemas=[]; const schemaErrors=[];
  for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) if(attributes(m[1]).type==='application/ld+json'){
    try{const parsed=JSON.parse(m[2]);if(!parsed||typeof parsed!=='object')throw Error();schemas.push(...(Array.isArray(parsed)?parsed:[parsed]));}catch{schemaErrors.push('INVALID_JSON_LD');}
  }
  return {url,status,title:html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||null,descriptions:get('description'),canonical,noindex:robots.some(v=>/\bnoindex\b/i.test(v)),robots,icons:links.filter(l=>(l.rel||'').split(/\s+/).includes('icon')).map(l=>l.href),og:{title:get('og:title'),description:get('og:description'),image:get('og:image')},schemaTypes:schemas.flatMap(s=>[s,...(s['@graph']||[])]).map(s=>s['@type']).filter(Boolean),schemaErrors,anchors:anchors.flatMap(h=>{try{return[new URL(h.replaceAll('&amp;','&'),url).href];}catch{return[];}})};
}
export function compareCoverage(pages, home) {
  const normalize=u=>{const x=new URL(u);x.search='';x.hash='';return x.href;};
  const linked=new Set(home.anchors.filter(u=>/^https?:/i.test(u)).map(normalize));
  return {pages:pages.length,httpErrors:pages.filter(p=>p.status!==200).map(p=>p.url),noindex:pages.filter(p=>p.noindex).map(p=>p.url),missingDescription:pages.filter(p=>p.descriptions.length!==1||!p.descriptions[0]).map(p=>p.url),missingCanonical:pages.filter(p=>p.canonical.length!==1).map(p=>p.url),notLinkedFromHome:pages.filter(p=>!linked.has(normalize(p.url))).map(p=>p.url),schemaErrors:pages.filter(p=>p.schemaErrors.length).map(p=>p.url)};
}
