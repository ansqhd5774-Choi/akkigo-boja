import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const chrome=process.env.CHROME_PATH;
if(!chrome)throw Error('CHROME_PATH_REQUIRED');
const css=readFileSync('theme/game-icon-grid.css','utf8');
for(const width of [375,390,430,600,768,1024,1280,1440,1920]){
 const cols=width<480?4:width<768?5:width<1024?6:width<1280?7:8;
 const file=`backups/game-grid-${width}.html`;
 writeFileSync(file,`<!doctype html><meta name="viewport" content="width=device-width"><style>${css}</style><div class="ncp-game-grid">${Array.from({length:17},(_,i)=>`<a class="ncp-game-card"><span class="ncp-game-icon-wrap"></span><strong class="ncp-game-name">게임 ${i}</strong><span class="ncp-game-updated">10.06 업데이트</span></a>`).join('')}</div><script>const cards=[...document.querySelectorAll('.ncp-game-card')].map(e=>e.getBoundingClientRect());const row=cards.filter(x=>Math.abs(x.top-cards[0].top)<1);const last=cards.filter(x=>Math.abs(x.top-cards.at(-1).top)<1);const grid=document.querySelector('.ncp-game-grid').getBoundingClientRect();const ok=row.length===${cols}&&document.documentElement.scrollWidth<=innerWidth&&Math.abs((last[0].left+last.at(-1).right)/2-(grid.left+grid.right)/2)<2;document.body.setAttribute('data-result',ok?'PASS':'FAIL');</script>`);
 // A fixed-width iframe avoids Chrome's minimum desktop window width.
 const fixture=readFileSync(file,'utf8');
 writeFileSync(file,`<!doctype html><iframe style="border:0;width:${width}px;height:850px" srcdoc="${fixture.replaceAll('&','&amp;').replaceAll('"','&quot;')}"></iframe><script>document.querySelector('iframe').onload=function(){document.body.setAttribute('data-result',this.contentDocument.body.getAttribute('data-result'));}</script>`);
 const r=spawnSync(chrome,['--headless=new','--no-sandbox','--disable-gpu',`--window-size=${Math.max(width,800)},1000`,'--virtual-time-budget=1000','--force-device-scale-factor=1','--dump-dom',new URL('../'+file,import.meta.url).href],{encoding:'utf8'});
 if(!r.stdout.includes('data-result="PASS"'))throw Error('GAME_LAYOUT_FAIL_'+width);
 console.log('GAME_LAYOUT_OK_'+width);
}
