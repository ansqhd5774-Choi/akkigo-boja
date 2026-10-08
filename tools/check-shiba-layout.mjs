import {readFileSync,writeFileSync} from 'node:fs';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
const width=Number(process.argv[2]),output=process.argv[3];
if(![390,1440].includes(width)||!output)throw Error('LAYOUT_FIXTURE_ARGUMENTS');
// Exercise one shared template with latest, historical years, undated, empty,
// and a long list. Exact source/code preservation is enforced by the DOM gate.
const keys=['random-dice-2-codes-202610','infinite-stairs-codes-202610','maplestory-idle-codes-202610','brawl-stars-rewards-202610','coop-td-together-codes-202610'];
const content=keys.map(key=>[...primary,...supplemental].find(a=>a.articleKey===key)?.post.content||(()=>{throw Error('LAYOUT_ARTICLE_MISSING')})()).join('\n');
const css=['theme/article-compact.css','theme/article-typography.css','theme/coupon-copy.css'].map(p=>readFileSync(p,'utf8')).join('\n');
const copy=readFileSync('theme/coupon-copy.js','utf8');
const check=`
(async()=>{
 const failures=[],viewport=document.documentElement.clientWidth;
 const shown=n=>n.getBoundingClientRect().width>0;
 const checkVisible=article=>{
  if(document.documentElement.scrollWidth>viewport+1)failures.push('document-overflow');
  for(const s of article.querySelectorAll('section')){
   if(!shown(s))continue;
   const h=s.querySelector(':scope>h2'),i=s.querySelector(':scope>.ncp-info');
   if(h&&i){const a=h.getBoundingClientRect(),b=i.getBoundingClientRect();if(Math.abs(a.y+a.height/2-b.y-b.height/2)>1)failures.push('heading-info-alignment');}
  }
  for(const b of article.querySelectorAll('[data-ncp-copy],[data-ncp-share]'))if(shown(b)){
   const r=b.getBoundingClientRect();if(r.x<0||r.right>viewport+1)failures.push('button-overflow');if(r.height<44)failures.push('touch-height');if(b.hasAttribute('data-ncp-share')&&r.width!==44)failures.push('share-width');
  }
 };
 for(const article of document.querySelectorAll('article[data-ncp-template]')){
  const choices=[...article.querySelectorAll('.ncp-period-option>input')];
  if(!choices[0]?.checked||choices[0].value!=='latest')failures.push('default-latest');
  for(const choice of choices){
   choice.click();const panel=document.getElementById(choice.getAttribute('aria-controls'));
   if(!shown(panel)||article.querySelectorAll('.ncp-period-panel').length!==choices.length)failures.push('period-mapping');
   if([...article.querySelectorAll('.ncp-period-panel')].filter(shown).length!==1)failures.push('period-visibility');
   checkVisible(article);
  }
  for(const list of article.querySelectorAll('.ncp-card-list')){
   const rows=list.querySelectorAll('.ncp-code-card'),more=list.querySelector(':scope>.ncp-list-more');
   if(rows.length>5){
    if(!more||more.open||list.querySelectorAll(':scope>.ncp-code-card').length!==5)failures.push('five-preview');
    more.querySelector('summary').click();await new Promise(r=>setTimeout(r,0));if(!more.open)failures.push('disclosure-open');
    if(shown(list)){
     const bottom=more.querySelector('summary').getBoundingClientRect(),last=rows[rows.length-1].getBoundingClientRect();
     if(bottom.top<last.bottom)failures.push('collapse-button-not-last');
     if(more.querySelector('summary').textContent!=='접기')failures.push('collapse-label');
    }
    more.querySelector('summary').click();await new Promise(r=>setTimeout(r,0));if(more.open)failures.push('disclosure-close');
    if(!more.querySelector('summary').textContent.startsWith('더 보기'))failures.push('more-label-restore');
   }
  }
  choices[0].click();
 }
 const button=[...document.querySelectorAll('[data-ncp-copy]')].find(shown);
 button.click();await new Promise(r=>setTimeout(r,80));
 if(window.__copied!==button.dataset.ncpCopy||button.textContent.trim()!=='복사 완료'||button.disabled)failures.push('mock-copy-result');
 document.body.dataset.layoutResult=failures.length?'FAIL':'PASS';document.body.dataset.layoutFailures=failures.join(',');
})();`;
writeFileSync(output,'<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0}body{font-family:Arial,sans-serif}.post-body{max-width:736px;margin:auto;padding:16px;box-sizing:border-box}*{box-sizing:border-box}'+css+'</style><body class="item-view"><script>Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async v=>{window.__copied=v;}}});</script><main class="post-body">'+content+'</main><script>'+copy+'</script><script>'+check+'</script></body></html>');
console.log('COMMON_PERIOD_FIXTURE_WRITTEN',width);
