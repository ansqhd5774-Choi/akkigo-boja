// One shared generator for every new game coupon article.
// Place the returned table after <!--more-->, never in the feed preview.
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const gameCouponColumns=['순서','출처','만료 기간','쿠폰','복사'];
const codePattern=/^[A-Za-z0-9_-]{2,80}$/;
export function renderGameCouponTable(rows,{label='쿠폰 코드 목록',start=1}={}){
  if(!Array.isArray(rows)||!rows.length||!Number.isInteger(start)||start<1)throw Error('GAME_TABLE_ROWS_REQUIRED');
  const codes=new Set();
  const cells=rows.map((r,i)=>{
    if(!r || !codePattern.test(r.code||'') || codes.has(r.code))throw Error('GAME_TABLE_CODE_INVALID_OR_DUPLICATE');
    codes.add(r.code);
    const order=String(start+i).padStart(2,'0');
    const exp=r.expiry||'미확인';
    return '<div class="ncp-code-card" role="row">'+
      '<span class="ncp-col-order" role="cell">'+order+'</span>'+
      '<span class="ncp-col-source" role="cell">'+esc(r.source||'확인 필요')+'</span>'+
      '<span class="ncp-col-expiry" role="cell">'+esc(exp)+'</span>'+
      '<code class="ncp-col-code" role="cell">'+esc(r.code)+'</code>'+
      '<span class="ncp-col-action" role="cell"><button class="ncp-copy" type="button" data-ncp-copy="'+esc(r.code)+'" aria-label="'+esc(r.code)+' 쿠폰 복사">복사</button><span class="ncp-copy-state" role="status" aria-live="polite"></span></span></div>';
  });
  const heading='<div class="ncp-list-header" role="row">'+gameCouponColumns.map(x=>'<span role="columnheader">'+x+'</span>').join('')+'</div>';
  return '<div class="ncp-card-list ncp-compact-list" role="table" aria-label="'+esc(label)+'">'+heading+'\n'+cells.join('\n')+'\n</div>';
}
export function renderGameCouponGridCss(articleKey){
  if(!/^[a-z0-9-]{1,100}$/.test(articleKey))throw Error('GAME_TABLE_INVALID_KEY');
  const p='[data-ncp-article="'+articleKey+'"] .ncp-compact-list ';
  const shared=p+'.ncp-list-header,'+p+'.ncp-code-card';
  return '<style>'+
    shared+'{display:grid;grid-template-columns:46px 116px 108px minmax(0,1fr) 74px;column-gap:10px;align-items:center;box-sizing:border-box;min-width:0;padding:0 12px}'+
    p+'.ncp-code-card{height:68px;min-height:68px;border:1px solid #cad5e6;border-radius:10px}'+
    p+'.ncp-copy{display:block;width:100%;min-height:42px;padding:0;cursor:pointer}'+
    '@media(max-width:650px){'+shared+'{grid-template-columns:26px 61px 63px minmax(0,1fr) 54px;column-gap:5px;padding:0 7px}'+p+'.ncp-col-code{overflow-wrap:anywhere}'+p+'.ncp-copy{min-height:42px}}'+
    '</style>';
}
export function renderGameAppIcon({articleKey,gameName,iconUrl,appStoreUrl}){
  if(!/^[a-z0-9-]{1,100}$/.test(articleKey||'')||!gameName||!iconUrl||!appStoreUrl)throw Error('GAME_APP_ICON_FIELDS_REQUIRED');
  const store=new URL(appStoreUrl),icon=new URL(iconUrl);
  if(store.protocol!=='https:'||icon.protocol!=='https:')throw Error('GAME_APP_ICON_HTTPS_REQUIRED');
  return '<figure data-ncp-featured-image="'+esc(articleKey)+'" data-ncp-app-icon="true" data-ncp-app-icon-source="'+esc(appStoreUrl)+'">'+
    '<img src="'+esc(iconUrl)+'" alt="'+esc(gameName)+' 공식 앱 아이콘" width="512" height="512" loading="eager" decoding="async" style="display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:contain">'+
    '<figcaption><a href="'+esc(appStoreUrl)+'" rel="noopener noreferrer">공식 앱 아이콘 출처</a></figcaption></figure>';
}
