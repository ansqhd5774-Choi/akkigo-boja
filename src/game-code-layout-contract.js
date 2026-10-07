// R1 layout enforcement: old posts are grandfathered only by explicit article key.
// All new game-code articles must use the five-column 68px list, including on mobile.
export const LEGACY_GAME_ARTICLE_KEYS = new Set([
  "shibarpg-pickup-202610",
  "cpbv26-codes-202610",
  "trickcal-revive-codes-202610",
  "browndust2-codes-202610",
  "genshin-codes-202610",
  "honkai-star-rail-codes-202610",
  "blue-archive-codes-202610",
  "roblox-promo-codes-202610",
  "whiteout-survival-codes-202610",
  "maplestory-idle-codes-202610",
  "kingshot-codes-202610",
  "fc-mobile-codes-202610",
  "lucky-defense-codes-202610",
  "nikke-codes-202610"
]);
const header='<div class="ncp-list-header" role="row"><span role="columnheader">순서</span><span role="columnheader">출처</span><span role="columnheader">만료 기간</span><span role="columnheader">쿠폰</span><span role="columnheader">복사</span></div>';
export function validateGameCouponLayout(articleKey,post){
  if (!post?.labels?.includes('게임') || !post?.content?.includes('data-ncp-copy='))return true;
  if (LEGACY_GAME_ARTICLE_KEYS.has(articleKey))return true;
  const h=post.content;
  const fail=(why)=>{throw new Error('GAME_COUPON_LAYOUT_'+why);};
  if(h.includes('<h1'))fail('DUPLICATE_TITLE');
  if(h.includes('class="ncp-historical-list"'))fail('UNAPPROVED_TWO_COLUMN_LIST');
  if(!h.includes('class="ncp-card-list ncp-compact-list" role="table"'))fail('MISSING_GRID');
  const headings=h.split(header).length-1;
  if(headings<1 || headings>2)fail('HEADERS');
  if(!h.includes('grid-template-columns:46px 116px 108px minmax(0,1fr) 74px')||
     !h.includes('grid-template-columns:26px 61px 63px minmax(0,1fr) 54px'))fail('GRID_COLUMNS');
  if(!h.includes('height:68px;min-height:68px'))fail('HEIGHT');
  const rows=h.split('<div class="ncp-code-card" role="row">').slice(1).map(s=>s.split('</div>')[0]);
  const buttons=[...h.matchAll(/data-ncp-copy="([^"]+)"/g)].map(x=>x[1]);
  if(!buttons.length||rows.length!==buttons.length||new Set(buttons).size!==buttons.length)fail('ROW_COUNT');
  for(let i=0;i<rows.length;i++){
    const r=rows[i];
    for(const col of ['ncp-col-order','ncp-col-source','ncp-col-expiry','ncp-col-action']){
      if(!r.includes('class="'+col+'" role="cell"'))fail('MISSING_COLUMN');
    }
    const val=r.split('<code class="ncp-col-code" role="cell">')[1]?.split('</code>')[0];
    if(!val||val!==buttons[i]||!r.includes('data-ncp-copy="'+val+'"'))fail('COPY_VALUE');
  }
  return true;
}
