import entries from '../data/game-app-icons.json' with {type:'json'};
// Older pages are not rewritten until their app-store identity is verified.
// New game posts and explicitly converted pages require a registered original store icon.
export const LEGACY_GAME_ICON_KEYS=new Set(["shibarpg-pickup-202610","cpbv26-codes-202610","trickcal-revive-codes-202610","browndust2-codes-202610","genshin-codes-202610","honkai-star-rail-codes-202610","blue-archive-codes-202610","roblox-promo-codes-202610","brawl-stars-rewards-202610","fortblox-mobile-go-codes-202610","whiteout-survival-codes-202610","maplestory-idle-codes-202610","kingshot-codes-202610","fc-mobile-codes-202610","lucky-defense-codes-202610","nikke-codes-202610"]);
const icons=new Map(entries.map(x=>[x.articleKey,x]));
export function validateGameFeaturedImage(articleKey,post){
  if(!post?.labels?.includes('게임'))return true;
  if(LEGACY_GAME_ICON_KEYS.has(articleKey))return true;
  const fail=code=>{throw new Error('GAME_APP_ICON_'+code);};
  const e=icons.get(articleKey);
  if(!e)fail('REGISTRY_REQUIRED');
  if(e.articleKey!==articleKey||!e.gameName||e.iconShape!=='square')fail('BAD_ICON_RECORD');
  let icon,store;
  try{icon=new URL(e.iconUrl);store=new URL(e.appStoreUrl);}catch{fail('BAD_URL');}
  const domains={'google-play':['play.google.com','play-lh.googleusercontent.com'],'apple-app-store':['apps.apple.com','is1-ssl.mzstatic.com']};
  if(icon.protocol!=='https:'||store.protocol!=='https:'||!domains[e.platform]||
    store.hostname!==domains[e.platform][0]||icon.hostname!==domains[e.platform][1])fail('NOT_OFFICIAL_STORE');
  const h=post.content||'';
  if((h.match(/data-ncp-featured-image=/g)||[]).length!==1||!h.includes('data-ncp-featured-image="'+articleKey+'"'))fail('BAD_FEATURED_MARKER');
  const figures=[...h.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/g)];
  const figure=figures.find(x=>x[1].includes('data-ncp-featured-image="'+articleKey+'"'));
  if(!figure||!figure[1].includes('data-ncp-app-icon="true"')||
     !figure[1].includes('data-ncp-app-icon-source="'+e.appStoreUrl+'"'))fail('APP_ICON_MARKER_REQUIRED');
  const img=figure[2].match(/<img\b[^>]*>/)?.[0];
  if(!img||!img.includes('src="'+e.iconUrl+'"'))fail('WRONG_FEATURED_IMAGE');
  if(h.match(/<img\b[^>]*>/)?.[0]!==img)fail('NOT_FIRST_IMAGE');
  if(!img.includes('alt="'+e.gameName+' 공식 앱 아이콘"'))fail('BAD_ALT');
  if(!img.includes('width="512"')||!img.includes('height="512"'))fail('BAD_DIMENSIONS');
  if(!h.includes('aspect-ratio:1/1')||!h.includes('object-fit:contain'))fail('NOT_SQUARE');
  if(!figure[2].includes('href="'+e.appStoreUrl+'"'))fail('STORE_SOURCE_LINK_REQUIRED');
  return true;
}
