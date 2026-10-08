// Reusable canonical game coupon rows. Data is HTML-escaped and checked before publication.
const escapeHTML=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export const FIVE_COLUMN_HEADER='<div class="ncp-list-header" role="row">'+['순서','출처','만료 기간','쿠폰','복사'].map(x=>'<span role="columnheader">'+x+'</span>').join('')+'</div>';
export function renderGameCouponTable(items,{label='게임 쿠폰',start=1}={}){
  if(!Array.isArray(items)||!items.length)throw Error('GAME_TABLE_EMPTY');
  if(!Number.isInteger(start)||start<1)throw Error('GAME_TABLE_INVALID_START');
  const used=new Set();
  const rows=items.map((item,i)=>{
    if(typeof item.code!=='string'||!item.code.trim()||item.code!==item.code.trim()||/[<>"'&\s]/.test(item.code))throw Error('GAME_TABLE_INVALID_CODE');
    if(used.has(item.code))throw Error('GAME_TABLE_DUPLICATE_CODE');
    used.add(item.code);
    if(!item.source||!item.expiry)throw Error('GAME_TABLE_MISSING_METADATA');
    const code=escapeHTML(item.code);
    return '<div class="ncp-code-card" role="row"><span class="ncp-col-order" role="cell">'+String(start+i).padStart(2,'0')+'</span><span class="ncp-col-source" role="cell">'+escapeHTML(item.source)+'</span><span class="ncp-col-expiry" role="cell">'+escapeHTML(item.expiry)+'</span><code class="ncp-col-code" role="cell">'+code+'</code><span class="ncp-col-action" role="cell"><button class="ncp-copy" type="button" data-ncp-copy="'+code+'" aria-label="'+code+' 쿠폰 복사">복사</button><span class="ncp-copy-state" role="status" aria-live="polite"></span></span></div>';
  });
  return '<div class="ncp-card-list ncp-compact-list" role="table" aria-label="'+escapeHTML(label)+'">'+FIVE_COLUMN_HEADER+'\n'+rows.join('\n')+'\n</div>';
}
export function gameCouponGridCSS(key){
  if(!/^[a-z0-9-]+$/.test(key))throw Error('GAME_TABLE_INVALID_KEY');
  const s='[data-ncp-article="'+key+'"] .ncp-compact-list ';
  return s+'.ncp-list-header,'+s+'.ncp-code-card{display:grid;grid-template-columns:46px 116px 108px minmax(0,1fr) 74px;column-gap:10px;align-items:center;min-width:0;box-sizing:border-box;padding:0 12px}\n'
   +s+'.ncp-code-card{height:68px;min-height:68px}\n'
   +'@media(max-width:650px){'+s+'.ncp-list-header,'+s+'.ncp-code-card{grid-template-columns:26px 61px 63px minmax(0,1fr) 54px;column-gap:5px;padding:0 7px}}';
}
