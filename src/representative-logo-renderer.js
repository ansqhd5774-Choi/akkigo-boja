import {isGameArticle,representativeLogoFor,representativeLogoRegistry,validateRepresentativeLogoEntry} from './representative-logo-policy.js';

function esc(value=''){
  return String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

function figure(article,logo){
  const brand=logo.brand||article.post?.labels?.find(label=>label&&label!=='VPN'&&label!=='교육'&&label!=='건강'&&label!=='해외직구'&&label!=='유심·로밍')||article.post?.title||article.articleKey;
  return `<figure data-ncp-featured-image="${esc(article.articleKey)}" style="margin:0 0 24px"><img src="${esc(logo.logoUrl)}" alt="${esc(brand)} 공식 대표 로고" data-ncp-brand-logo="true" width="512" height="512" loading="eager" decoding="async" style="display:block;width:180px;height:180px;object-fit:contain;margin:auto;border-radius:14px"></figure>`;
}

export function applyRepresentativeLogo(article,{registry=representativeLogoRegistry}={}){
  if(!article||article.approvedForPublish!==true||!article.post||isGameArticle(article))return article;
  const logo=representativeLogoFor(article.articleKey,registry);
  if(!logo)return article;
  try{
    validateRepresentativeLogoEntry(logo,{allowLegacy:false,strictSource:true});
  }catch{
    // Historical bad registrations stay unchanged and remain visible to the audit/publish gate.
    // Do not let one quarantined record prevent the full article catalog from loading.
    return article;
  }
  let content=article.post.content||'';
  const target=figure(article,logo);
  const current=content.match(/<figure\b[^>]*data-ncp-featured-image="[^"]+"[^>]*>[\s\S]*?<\/figure>/i)?.[0]||'';

  // Blogger selects the first image as the representative image. A valid brand/service
  // logo therefore has to be the first <img> in the entire post, not merely the first
  // image inside the article body. Remove any prior generated figure and prepend the
  // canonical one before feed previews, jump breaks, promotional art, or product images.
  if(current)content=content.replace(current,'');
  content=target+content;

  return {...article,post:{...article.post,content}};
}

export function applyRepresentativeLogos(catalog,{registry=representativeLogoRegistry}={}){
  return catalog.map(article=>applyRepresentativeLogo(article,{registry}));
}
