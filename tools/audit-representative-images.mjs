import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {currentArticleCatalog} from '../src/article-catalog.js';
import {
  LEGACY_REPRESENTATIVE_LOGO_KIND,
  REPRESENTATIVE_LOGO_KINDS,
  isGameArticle,
  isSuspiciousRepresentativeAsset,
  representativeLogoFor,
  representativeLogoRegistry,
  validateRepresentativeLogo
} from '../src/representative-logo-policy.js';

function firstImage(html=''){
  return html.match(/<img\b[^>]*>/i)?.[0]||'';
}

function firstImageSrc(html=''){
  return firstImage(html).match(/\bsrc="([^"]+)"/i)?.[1]||null;
}

export function auditRepresentativeImages(catalog=currentArticleCatalog,registry=representativeLogoRegistry){
  const rows=[];
  for(const article of catalog){
    if(article?.approvedForPublish!==true||!article?.post||isGameArticle(article))continue;
    const logo=representativeLogoFor(article.articleKey,registry);
    const issues=[];
    if(!logo){
      issues.push('MISSING_REGISTRY');
    }else{
      if(!REPRESENTATIVE_LOGO_KINDS.has(logo.kind))issues.push('INVALID_KIND');
      if(isSuspiciousRepresentativeAsset(logo.sourceAsset))issues.push('SUSPICIOUS_SOURCE_ASSET');
      const first=firstImage(article.post.content);
      if(!first.includes(`src="${logo.logoUrl}"`)||!first.includes('data-ncp-brand-logo="true"'))issues.push('FIRST_IMAGE_MISMATCH');
      try{
        validateRepresentativeLogo(article,{required:true,allowLegacy:false,strictSource:true,registry});
      }catch(error){
        const code=String(error?.message||error).split(':')[0];
        if(!issues.includes(code))issues.push(code);
      }
    }
    rows.push({
      articleKey:article.articleKey,
      title:article.post.title||'',
      labels:Array.isArray(article.post.labels)?article.post.labels:[],
      sourceUrl:typeof article?.source?.url==='string'?article.source.url:null,
      firstImageSrc:firstImageSrc(article.post.content),
      registeredLogoUrl:logo?.logoUrl||null,
      registeredSourceAsset:logo?.sourceAsset||null,
      kind:logo?.kind||null,
      issues
    });
  }
  const failing=rows.filter(row=>row.issues.length>0);
  return {
    total:rows.length,
    pass:rows.length-failing.length,
    fail:failing.length,
    missing:failing.filter(row=>row.issues.includes('MISSING_REGISTRY')).map(row=>row.articleKey),
    legacy:rows.filter(row=>row.kind===LEGACY_REPRESENTATIVE_LOGO_KIND).map(row=>row.articleKey),
    suspicious:failing.filter(row=>row.issues.includes('SUSPICIOUS_SOURCE_ASSET')).map(row=>row.articleKey),
    firstImageMismatch:failing.filter(row=>row.issues.includes('FIRST_IMAGE_MISMATCH')).map(row=>row.articleKey),
    rows
  };
}

function main(){
  const audit=auditRepresentativeImages();
  console.log('REPRESENTATIVE_IMAGE_AUDIT',JSON.stringify({
    total:audit.total,
    pass:audit.pass,
    fail:audit.fail,
    missing:audit.missing,
    legacy:audit.legacy,
    suspicious:audit.suspicious,
    firstImageMismatch:audit.firstImageMismatch
  }));
  for(const row of audit.rows.filter(item=>item.issues.length)){
    console.log('REPRESENTATIVE_IMAGE_ISSUE',JSON.stringify(row));
  }
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
