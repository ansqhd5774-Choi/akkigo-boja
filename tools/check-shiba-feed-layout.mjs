import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const width=Number(process.argv[2]);
const output=process.argv[3];
if (![390,1440].includes(width) || !output) throw new Error('USAGE: node tools/check-shiba-feed-layout.mjs <390|1440> <output.html>');

const article=readFileSync(resolve('drafts/shibarpg-pickup-202610.html'),'utf8');
const jump=article.indexOf('<!--more-->');
if (jump<0) throw new Error('JUMP_BREAK_MISSING');
const preview=article.slice(0,jump).trim();
if (!preview.includes('data-ncp-feed-preview')) throw new Error('FEED_PREVIEW_MISSING');
for (const forbidden of ['pick7p2y','navigator.clipboard','<script','onclick=']) {
  if (preview.includes(forbidden)) throw new Error('FEED_PREVIEW_LEAK_'+forbidden);
}

const theme=readFileSync(resolve('akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml'),'utf8');
const gridRules=[...theme.matchAll(/\.ncp-feed-preview\{([^}]+)\}/g)].map(x=>x[1]);
if (gridRules.length<2) throw new Error('FEED_GRID_RULES_MISSING');
const rule=width<=700?gridRules[gridRules.length-1]:gridRules[0];
const grab=(re,name)=>{
  const m=theme.match(re);
  if(!m) throw new Error(name+'_RULE_MISSING');
  return m[0];
};
const css=[
  `.ncp-feed-preview{${rule}}`,
  grab(/\.ncp-feed-stat\{[^}]+\}/,'FEED_STAT'),
  grab(/\.ncp-feed-stat span\{[^}]+\}/,'FEED_LABEL'),
  grab(/\.ncp-feed-stat strong\{[^}]+\}/,'FEED_VALUE')
].join('\n');

const check=`
(function(){
  const failures=[];
  const root=document.querySelector('[data-ncp-feed-preview]');
  if(!root) failures.push('preview-missing');
  const viewport=document.documentElement.clientWidth;
  if(document.documentElement.scrollWidth>viewport+1) failures.push('document-overflow');
  if(root){
    const r=root.getBoundingClientRect();
    if(r.left<-1||r.right>viewport+1) failures.push('preview-overflow');
    const stats=[...root.querySelectorAll('.ncp-feed-stat')];
    if(stats.length!==3) failures.push('stat-count');
    const cols=getComputedStyle(root).gridTemplateColumns.trim().split(/\s+/).length;
    if(window.innerWidth<=700 && cols!==1) failures.push('mobile-columns');
    if(window.innerWidth>700 && cols!==3) failures.push('desktop-columns');
    if(window.innerWidth<=700 && r.height>260) failures.push('mobile-height');
    if(window.innerWidth>700 && r.height>150) failures.push('desktop-height');
  }
  document.body.dataset.feedResult=failures.length?'FAIL':'PASS';
  document.body.dataset.feedFailures=failures.join(',');
})();
`;

const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>:root{--ncp-line:#e2e8f0}html,body{margin:0;padding:0}body{font-family:Arial,sans-serif}.wrap{max-width:900px;margin:auto;padding:${width<=700?'16':'24'}px;box-sizing:border-box}${css}</style></head><body><div class="wrap">${preview}</div><script>${check}</script></body></html>`;
writeFileSync(output,html,'utf8');
console.log('FEED_FIXTURE_WRITTEN',width,output);
