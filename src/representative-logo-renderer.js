import logos from '../data/representative-logos.json' with {type:'json'};
import {isGameArticle,representativeLogoFor,validateRepresentativeLogoEntry} from './representative-logo-policy.js';

function esc(value=''){
  return String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

function figure(article,logo){
  const brand=logo.brand||article.post?.labels?.find(label=>label&&label!=='VPN'&&label!=='교육'&&label!=='건강'&&label!=='해외직구'&&label!=='유심·로밍')||article.post?.title||article.articleKey;
  return `<figure data-ncp-featured-image="${esc(article.articleKey)}" style="margin:0 0 24px"><img src="${esc(logo.logoUrl)}" alt="${esc(brand)} 공식 대표 로고" data-ncp-brand-logo="true" width="512" height="512" loading="eager" decoding="async" style="display:block;width:180px;height:180px;object-fit:contain;margin:auto;border-radius:14px"></figure>`;
}

export function applyRepresentativeLogo(article,{registry=logos}={}){
  if(!article||article.approvedForPublish!==true||!article.post||isGameArticle(article))return article;
  const logo=representativeLogoFor(article.articleKey,registry);
  if(!logo)return article;
  validateRepresentativeLogoEntry(logo,{allowLegacy:false,strictSource:true});
  let content=article.post.content||'';
  const current=content.match(/<figure\b[^>]*data-ncp-featured-image="[^"]+"[^>]*>[\s\S]*?<\/figure>/i)?.[0]||'';
  const target=figure(article,logo);
  if(current){
    if(current.includes(`src="${logo.logoUrl}"`)&&current.includes('data-ncp-brand-logo="true"'))return article;
    content=content.replace(current,target);
  }else{
    const styleEnd=content.indexOf('</style>');
    if(styleEnd>=0)content=content.slice(0,styleEnd+8)+target+content.slice(styleEnd+8);
    else{
      const articleOpen=content.match(/<article\b[^>]*>/i);
      if(articleOpen)content=content.replace(articleOpen[0],articleOpen[0]+target);
      else content=target+content;
    }
  }
  return {...article,post:{...article.post,content}};
}

export function applyRepresentativeLogos(catalog,{registry=logos}={}){
  return catalog.map(article=>applyRepresentativeLogo(article,{registry}));
}
