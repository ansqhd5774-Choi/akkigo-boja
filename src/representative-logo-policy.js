import logos from '../data/representative-logos.json' with {type:'json'};

export function validateRepresentativeLogo(article) {
  const logo=logos.find(item=>item.articleKey===article.articleKey);
  if(!logo)return;
  const first=article.post.content.match(/<img\b[^>]*>/i)?.[0]||'';
  if(!first.includes(`src="${logo.logoUrl}"`)||!first.includes('data-ncp-brand-logo="true"'))throw Error('REPRESENTATIVE_LOGO_MISMATCH');
}
