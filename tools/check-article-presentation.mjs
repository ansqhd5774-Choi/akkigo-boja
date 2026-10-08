import {readFile} from 'node:fs/promises';
import {validateArticlePresentation} from '../src/article-presentation.js';
const root=new URL('../',import.meta.url);
const legacy=JSON.parse(await readFile(new URL('data/article-presentation-legacy.json',root),'utf8'));
const css=await readFile(new URL('theme/article-typography.css',root),'utf8');
const compactCss=await readFile(new URL('theme/article-compact.css',root),'utf8');
const r1=JSON.parse(await readFile(new URL('data/article-presentation-r1-existing.json',root),'utf8'));
for(const selector of ['.ncp-col-order','.ncp-col-source','.ncp-col-source a','.ncp-col-expiry']){
 const rule=css.split('\n').find(line=>line.includes(selector+'{')||line.includes(selector+','));
 if(!rule?.includes('font-weight:600!important'))throw Error('TABLE_METADATA_WEIGHT_MISSING: '+selector);
}
if(!css.includes('.ncp-col-code,')||!css.includes('font-weight:700!important'))throw Error('TABLE_CODE_WEIGHT_MISSING');
for(const path of ['akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml','akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml']){
 const xml=await readFile(new URL(path,root),'utf8');
 if(!xml.includes(compactCss))throw Error('GENERATED_THEME_COMPACT_DRIFT');
 for(const line of css.split('\n').filter(line=>line.includes('font-weight:')))if(!xml.includes(line))throw Error('GENERATED_THEME_WEIGHT_DRIFT');
}
let checked=0;
for(const path of ['data/articles.json','data/articles-supplemental.json']){
 for(const article of JSON.parse(await readFile(new URL(path,root),'utf8'))){
  if(!article.post?.labels?.includes('게임')||legacy.includes(article.articleKey))continue;
  if(article.source?.presentationVersion!=='compact-r2'&&!r1.includes(article.articleKey))throw Error('PRESENTATION_R2_REQUIRED: '+article.articleKey);
  validateArticlePresentation(article);
  const html=article.post.content;
  const copies=[...html.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
  const shares=[...html.matchAll(/data-ncp-share="([^"]+)"/g)].map(m=>m[1]);
  if(JSON.stringify(copies)!==JSON.stringify(shares))throw Error('PRESENTATION_SHARE_COVERAGE: '+article.articleKey);
  if(/content:\s*['"][^'"]*(?:&#|⌄)/.test(html))throw Error('PRESENTATION_ESCAPED_CHEVRON');
  checked++;
 }
}
console.log('PRESENTATION_POLICY_PASS: '+checked+' current-format articles; shared table weights and generated themes match');
