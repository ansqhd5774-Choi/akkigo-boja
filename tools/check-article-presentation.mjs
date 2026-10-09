import {catHeroArticle} from '../src/cat-hero-article.js';
import {readFile} from 'node:fs/promises';
import {validateArticlePresentation} from '../src/article-presentation.js';
import {validateGamePeriodArticle,renderGamePeriodArticle} from '../src/game-period-article.js';
const root=new URL('../',import.meta.url);
const css=await readFile(new URL('theme/article-typography.css',root),'utf8');
const compactCss=await readFile(new URL('theme/article-compact.css',root),'utf8');
const r1=JSON.parse(await readFile(new URL('data/article-presentation-r1-existing.json',root),'utf8'));
const domCheck=process.argv.includes('--static')?null:(await import('./validate-presentation-dom.mjs')).validatePresentationDOM;
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
const checkedKeys=new Set();
for(const path of ['data/articles.json','data/articles-supplemental.json']){
 for(const article of JSON.parse(await readFile(new URL(path,root),'utf8'))){
  if(!article.post?.labels?.includes('게임'))continue;
  if(checkedKeys.has(article.articleKey))throw Error('PERIOD_DUPLICATE_ARTICLE_KEY');
  checkedKeys.add(article.articleKey);
  validateGamePeriodArticle(article);
  if(article.source?.presentationVersion!=='compact-r2'&&!(article.source?.presentationVersion==='compact-r1'&&r1.includes(article.articleKey)))throw Error('PRESENTATION_R2_REQUIRED: '+article.articleKey);
  validateArticlePresentation(article);
  if(domCheck)domCheck(article);
  const html=article.post.content;
  const copies=[...html.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
  const shares=[...html.matchAll(/data-ncp-share="([^"]+)"/g)].map(m=>m[1]);
  if(JSON.stringify(copies)!==JSON.stringify(shares))throw Error('PRESENTATION_SHARE_COVERAGE: '+article.articleKey);
  if(/content:\s*['"][^'"]*(?:&#|⌄)/.test(html))throw Error('PRESENTATION_ESCAPED_CHEVRON');
  checked++;
 }
}
if(checkedKeys.has(catHeroArticle.articleKey))throw Error('PERIOD_DUPLICATE_ARTICLE_KEY');
checkedKeys.add(catHeroArticle.articleKey);
validateGamePeriodArticle(catHeroArticle);
validateArticlePresentation(catHeroArticle);
if(domCheck)domCheck(catHeroArticle);
const catCopies=[...catHeroArticle.post.content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
const catShares=[...catHeroArticle.post.content.matchAll(/data-ncp-share="([^"]+)"/g)].map(m=>m[1]);
if(JSON.stringify(catCopies)!==JSON.stringify(catShares))throw Error('PRESENTATION_SHARE_COVERAGE_CAT_HERO');
checked++;
const hubModels=JSON.parse(await readFile(new URL('data/game-period-hubs.json',root),'utf8'));
const {buildHubDraft}=await import('../src/hubs.js');
const coupons=JSON.parse(await readFile(new URL('data/coupons.json',root),'utf8'));
for(const [articleKey,model] of Object.entries(hubModels)){
 const content=buildHubDraft(articleKey,coupons).content;
 if(content!==renderGamePeriodArticle(model).replace('<article ','<article data-ncp-hub="'+articleKey+'" '))throw Error('HUB_PERIOD_GENERATED_DRIFT');
 if(domCheck)domCheck({articleKey,source:{presentationVersion:'compact-r2'},post:{content}});
}
const models=JSON.parse(await readFile(new URL('data/game-period-articles.json',root),'utf8'));
for(const m of models){
 const articles=[...JSON.parse(await readFile(new URL('data/articles.json',root),'utf8')),...JSON.parse(await readFile(new URL('data/articles-supplemental.json',root),'utf8'))];
 if(articles.find(a=>a.articleKey===m.articleKey)?.post.content!==renderGamePeriodArticle(m))throw Error('PERIOD_INPUT_CATALOG_DRIFT');
}
console.log('PRESENTATION_POLICY_PASS: '+checked+' current-format articles; shared table weights and generated themes match');
