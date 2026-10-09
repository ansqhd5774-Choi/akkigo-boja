import fs from 'node:fs';
import logos from '../data/representative-logos.json' with {type:'json'};

for(const file of ['data/articles.json','data/articles-supplemental.json']){
  const articles=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const article of articles){
    const logo=logos.find(item=>item.articleKey===article.articleKey);if(!logo)continue;
    const tag=`<img src="${logo.logoUrl}" alt="${logo.brand} 공식 대표 로고" data-ncp-brand-logo="true" width="512" height="512" loading="eager" decoding="async" style="display:block;width:180px;height:180px;object-fit:contain;margin:auto;border-radius:14px">`;
    let content=article.post.content;
    if(/<img\b/i.test(content))content=content.replace(/<img\b[^>]*>/i,tag);
    else content=content.replace(/(<article\b[^>]*>)/i,`$1\n<figure data-ncp-featured-image="${article.articleKey}" style="margin:0 0 16px">${tag}</figure>`);
    article.post.content=content;
    const draft=`drafts/${article.articleKey}`;
    if(fs.existsSync(draft+'.json')){const value=JSON.parse(fs.readFileSync(draft+'.json','utf8'));value.post=article.post;fs.writeFileSync(draft+'.json',JSON.stringify(value,null,2)+'\n');}
    if(fs.existsSync(draft+'.html'))fs.writeFileSync(draft+'.html',content+'\n');
  }
  fs.writeFileSync(file,JSON.stringify(articles,null,2)+'\n');
}
