import baseLogos from '../data/representative-logos.json' with {type:'json'};
import supplementalLogos from '../data/representative-logos-supplemental.json' with {type:'json'};

export const LEGACY_REPRESENTATIVE_LOGO_KIND='OFFICIAL_HEADER_LOGO';
export const REPRESENTATIVE_LOGO_KINDS=new Set(['OFFICIAL_BRAND_LOGO','OFFICIAL_SERVICE_LOGO',LEGACY_REPRESENTATIVE_LOGO_KIND]);
const SUSPICIOUS_ASSET=/(?:^|[\/_-])(banner|promo|event|product|thumbnail|thumb)(?:[\/_.-]|$)/i;

const supplementalKeys=new Set(supplementalLogos.map(item=>item.articleKey));
export const representativeLogoRegistry=[
  ...baseLogos.filter(item=>!supplementalKeys.has(item.articleKey)),
  ...supplementalLogos
];

export function isGameArticle(article){
  return Array.isArray(article?.post?.labels)&&article.post.labels.includes('게임');
}

export function isSuspiciousRepresentativeAsset(sourceAsset){
  if(typeof sourceAsset!=='string'||!sourceAsset)return false;
  const basename=sourceAsset.split(/[\\/]/).filter(Boolean).at(-1)||'';
  if(/(?:^|[_-])(logo|brand)(?:[_.-]|$)/i.test(basename)||/(logo|brand)/i.test(basename))return false;
  return SUSPICIOUS_ASSET.test(sourceAsset);
}

export function representativeLogoFor(articleKey,registry=representativeLogoRegistry){
  return registry.find(item=>item.articleKey===articleKey)||null;
}

export function validateRepresentativeLogoEntry(logo,{allowLegacy=true,strictSource=false}={}){
  if(!logo||typeof logo.articleKey!=='string'||!logo.articleKey)throw Error('REPRESENTATIVE_LOGO_ENTRY_INVALID');
  const allowed=REPRESENTATIVE_LOGO_KINDS.has(logo.kind)||(allowLegacy&&logo.kind===LEGACY_REPRESENTATIVE_LOGO_KIND);
  if(!allowed)throw Error(`REPRESENTATIVE_LOGO_INVALID_KIND:${logo.articleKey}:${logo.kind||'MISSING'}`);
  if(typeof logo.logoUrl!=='string'||!/^https:\/\//i.test(logo.logoUrl))throw Error(`REPRESENTATIVE_LOGO_URL_INVALID:${logo.articleKey}`);
  if(typeof logo.sourceUrl!=='string'||!/^https:\/\//i.test(logo.sourceUrl)||typeof logo.sourceAsset!=='string'||!logo.sourceAsset){
    throw Error(`REPRESENTATIVE_LOGO_PROVENANCE_REQUIRED:${logo.articleKey}`);
  }
  if(strictSource&&isSuspiciousRepresentativeAsset(logo.sourceAsset))throw Error(`REPRESENTATIVE_LOGO_SUSPICIOUS_SOURCE:${logo.articleKey}`);
  return true;
}

function decodeHtmlAttribute(value=''){
  return String(value).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
}

export function validateRepresentativeLogo(article,{required=false,allowLegacy=true,strictSource=required,registry=representativeLogoRegistry}={}){
  if(isGameArticle(article))return true;
  const logo=representativeLogoFor(article?.articleKey,registry);
  if(!logo){
    if(required)throw Error(`REPRESENTATIVE_LOGO_REQUIRED:${article?.articleKey||'UNKNOWN'}`);
    return true;
  }
  validateRepresentativeLogoEntry(logo,{allowLegacy,strictSource});
  const first=article?.post?.content?.match(/<img\b[^>]*>/i)?.[0]||'';
  const firstSrc=decodeHtmlAttribute(first.match(/\bsrc="([^"]+)"/i)?.[1]||'');
  if(firstSrc!==logo.logoUrl||!first.includes('data-ncp-brand-logo="true"')){
    throw Error(`REPRESENTATIVE_LOGO_MISMATCH:${article.articleKey}`);
  }
  return true;
}
