import {readFile,writeFile} from 'node:fs/promises';
import {homeR4,categoryHeaderR4} from '../theme/home-r4.mjs';
import {icons} from '../theme/site-icons.mjs';
const [width,path]=process.argv.slice(2);if(!path)throw Error('OUTPUT_REQUIRED');
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [css,extra,site,home,fuse]=await Promise.all(['theme/home-r4.css','theme/site-tools.css','theme/site-tools.js','theme/home-r4.js','theme/assets/fuse-7.5.0.min.js'].map(read));
const categories=['게임','유심·로밍','호스팅·도메인','해외직구','건강','VPN','교육'];
const markup=homeR4(categories).replace(/<\/?b:if[^>]*>/g,'').replace(/<picture>[\s\S]*?<\/picture>/,'');
const names=['후더덕 서바이벌','원신','브라운더스트2','Royal Kingdom',...Array.from({length:20},(_,i)=>'테스트 게임 '+(i+5))];
const entries=names.map((name,i)=>({title:{$t:name+' 쿠폰 안내'},category:[{term:'게임'},{term:name}],content:{$t:'<button data-ncp-copy="CODE'+i+'">복사</button>'},link:[{rel:'alternate',href:'https://lsifl.blogspot.com/2026/10/test-'+i+'.html'}],published:{$t:new Date(Date.UTC(2026,9,8,0,24-i)).toISOString()}}));
const test=`
 const assert=(condition,message)=>{if(!condition)throw Error(message);};
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 async function waitFor(predicate){for(let i=0;i<80;i++){if(predicate())return;await pause(50);}throw Error('WAIT_TIMEOUT');}
 document.addEventListener('DOMContentLoaded',async()=>{try{
   assert(window.ncpResolveBrand({title:{$t:'가비아 도메인 할인'},content:{$t:'<img src="https://akkigo-boja.ansqhd5774.workers.dev/logos/gabia-representative.png">'}}).name==='가비아','COMPANY_NAME_ONLY');
   const grid=document.querySelector('.ncp-r4-game-list');const size=Number(${width})<601?4:6;const total=Math.ceil(24/size);await waitFor(()=>grid.children.length===size);
   assert(document.documentElement.scrollWidth<=Number(${width})+1,'HORIZONTAL_OVERFLOW');
   assert(getComputedStyle(grid).gridTemplateColumns.split(' ').length===(Number(${width})<601?4:6),'GRID_COLUMNS');
   assert(grid.querySelector('.ncp-game-heart').textContent.includes('—'),'UNKNOWN_HEART_IS_NOT_ZERO');
   grid.setPointerCapture=()=>{};grid.hasPointerCapture=()=>false;const pager=grid.nextElementSibling;const pageText=n=>n+'페이지, 전체 '+total+'페이지';assert(pager.textContent.includes(pageText(1)),'INITIAL_PAGE');
   grid.focus();grid.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await waitFor(()=>pager.textContent.includes(pageText(2)));await pause(450);
   assert(grid.children.length===size,'SECOND_PAGE_COUNT');for(let n=3;n<=total;n++){grid.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await waitFor(()=>pager.textContent.includes(pageText(n)));await pause(450);}assert(pager.querySelector('button:last-child').disabled,'LAST_PAGE_BOUNDARY');for(let n=total-1;n>=2;n--){grid.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));await waitFor(()=>pager.textContent.includes(pageText(n)));await pause(450);}
   grid.dispatchEvent(new PointerEvent('pointerdown',{isPrimary:true,button:0,pointerType:'touch',pointerId:9,clientX:80,clientY:60,bubbles:true}));
   grid.dispatchEvent(new PointerEvent('pointermove',{isPrimary:true,button:0,pointerType:'touch',pointerId:9,clientX:180,clientY:63,bubbles:true}));
   grid.dispatchEvent(new PointerEvent('pointerup',{isPrimary:true,button:0,pointerType:'touch',pointerId:9,clientX:180,clientY:63,bubbles:true}));await waitFor(()=>pager.textContent.includes(pageText(1)));await pause(450);
   assert(pager.querySelector('button:first-child').disabled,'FIRST_PAGE_BOUNDARY');
   grid.dispatchEvent(new PointerEvent('pointerdown',{isPrimary:true,button:0,pointerType:'touch',pointerId:10,clientX:180,clientY:60,bubbles:true}));
   grid.dispatchEvent(new PointerEvent('pointerup',{isPrimary:true,button:0,pointerType:'touch',pointerId:10,clientX:70,clientY:200,bubbles:true}));await pause(100);assert(pager.textContent.includes(pageText(1)),'VERTICAL_SCROLL_NOT_PAGINATION');
   const input=document.querySelector('input[name=q]');input.focus();input.value='후더덕 서바이블';input.dispatchEvent(new Event('input',{bubbles:true}));
   const box=document.querySelector('.ncp-search-results');await waitFor(()=>!box.hidden);assert(box.textContent.includes('후더덕 서바이벌'),'FUZZY_KOREAN_SEARCH');
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));assert(input.getAttribute('aria-activedescendant'),'KEYBOARD_SELECTION');
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(box.hidden,'ESCAPE_CLOSE');
   input.value='존재하지않는브랜드';input.dispatchEvent(new Event('input',{bubbles:true}));await pause(250);assert(box.hidden,'NO_RESULTS_FALLBACK');
   assert(input.form.action.endsWith('/search'),'NATIVE_SEARCH_PRESERVED');
   document.documentElement.dataset.siteToolsResult='PASS';
 }catch(error){document.documentElement.dataset.siteToolsResult='FAIL';document.body.append(JSON.stringify({error:error.message,innerWidth:window.innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>window.innerWidth+1).slice(0,8).map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right}))}));}});
`;
const data=JSON.stringify(entries).replace(/</g,'\\u003c');
const runtime=`(()=>{const location=new URL('https://lsifl.blogspot.com/');const fetch=async url=>String(url).includes('/games/hearts')?new Promise(()=>{}):({ok:true,json:async()=>({feed:{entry:${data}}})});window.ncpIcons=${JSON.stringify(icons)};window.ncpResolveGame=entry=>({id:entry.category[1].term,name:entry.category[1].term});${site}\n${home}\n${test}\n})();`;
await writeFile(path,`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}${css}\n${extra}</style><script>${fuse}</script></head><body>${markup}<script>${runtime}</script></body></html>`);
console.log('SITE_TOOLS_FIXTURE_'+width);
