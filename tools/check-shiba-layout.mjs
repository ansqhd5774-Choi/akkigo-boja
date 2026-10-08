import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const width=Number(process.argv[2]);
const output=process.argv[3];
if (![390,1440].includes(width) || !output) {
  throw new Error('USAGE: node tools/check-shiba-layout.mjs <390|1440> <output.html>');
}

const article=readFileSync(resolve('drafts/shibarpg-pickup-202610.html'),'utf8');
const theme=readFileSync(resolve('akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml'),'utf8');
const scripts=[...theme.matchAll(/<script type='text\/javascript'>\/\/<!\[CDATA\[\n([\s\S]*?)\n\/\/\]\]><\/script>/g)].map(x=>x[1]);
const copyScript=scripts.find(x=>x.includes('[data-ncp-copy]'));
if (!copyScript) throw new Error('COPY_SCRIPT_NOT_FOUND');

const checkScript=`
(async function(){
  const failures=[];
  const viewport=document.documentElement.clientWidth;
  const within=(el,name)=>{
    const r=el.getBoundingClientRect();
    if(r.left<-1||r.right>viewport+1) failures.push(name+'-overflow');
  };

  if(document.documentElement.scrollWidth>viewport+1) failures.push('document-overflow');

  for(const [selector,name] of [
    ['.ncp-coupon-card','card'],
    ['.ncp-code','code'],
    ['.ncp-copy','copy'],
    ['.ncp-btn','redeem']
  ]){
    const el=document.querySelector(selector);
    if(!el) failures.push(name+'-missing');
    else within(el,name);
  }

  const copy=document.querySelector('.ncp-copy');
  const redeem=document.querySelector('.ncp-btn');
  if(copy&&copy.getBoundingClientRect().height<44) failures.push('copy-touch-height');
  if(redeem&&redeem.getBoundingClientRect().height<44) failures.push('redeem-touch-height');

  if(window.innerWidth<=640){
    const step=document.querySelector('.ncp-step-grid');
    const info=document.querySelector('.ncp-coupon-info');
    const copyWrap=document.querySelector('.ncp-copy-wrap');
    if(step&&getComputedStyle(step).gridTemplateColumns.trim().split(/\s+/).length!==1) failures.push('mobile-step-columns');
    if(info&&getComputedStyle(info).gridTemplateColumns.trim().split(/\s+/).length!==1) failures.push('mobile-info-columns');
    if(copyWrap&&copyWrap.getBoundingClientRect().width<250) failures.push('mobile-copy-width');
  } else {
    const cards=[...document.querySelectorAll('.ncp-step-card')].map(x=>x.getBoundingClientRect());
    if(cards.length===2&&Math.abs(cards[0].top-cards[1].top)>4) failures.push('desktop-step-stack');
  }

  if(copy){
    copy.click();
    await new Promise(r=>setTimeout(r,80));
    if(window.__copied!=='pick7p2y') failures.push('clipboard-value');
    if(copy.textContent.trim()!=='복사 완료') failures.push('copy-success-text');
    if(copy.dataset.ncpCopied!=='true'||getComputedStyle(copy).backgroundColor!=='rgb(8, 127, 91)') failures.push('copy-success-color');
    const status=document.querySelector('.ncp-copy-state');
    if(!status||!status.textContent.includes('복사')) failures.push('copy-status');
    await new Promise(r=>setTimeout(r,1500));
    if(copy.textContent.trim()!=='복사 완료'||copy.disabled) failures.push('copy-history-lost');
  }

  document.body.dataset.layoutResult=failures.length?'FAIL':'PASS';
  document.body.dataset.layoutFailures=failures.join(',');
})();
`;

const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0}body{font-family:Arial,sans-serif;background:#fff}main{max-width:920px;margin:0 auto;padding:${width<=640?'16':'24'}px;box-sizing:border-box}</style><script>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async function(value){window.__copied=value;}}});</script></head><body><main>${article}</main><script>${copyScript}</script><script>${checkScript}</script></body></html>`;
writeFileSync(output,html,'utf8');
console.log('FIXTURE_WRITTEN',width,output);
