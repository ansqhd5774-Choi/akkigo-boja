import {execFileSync} from 'node:child_process';
import {existsSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {renderSiteFixture} from './render-site-fixture.mjs';
const chrome=[process.env.CHROME_PATH,...(process.platform==='linux' ? ['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'] : [join(process.env.PROGRAMFILES||'C:\\Program Files','Google/Chrome/Application/chrome.exe'),join(process.env['PROGRAMFILES(X86)']||'C:\\Program Files (x86)','Microsoft/Edge/Application/msedge.exe')])].find(p=>p&&existsSync(p));
if(!chrome)throw Error('CHROME_NOT_FOUND');
if(!process.env.RUNNER_TEMP)throw Error('RUNNER_TEMP_MISSING');
for(const width of [390,1440])for(const [kind,height,budget,marker,label] of [['layout',1200,2500,'data-layout-result','LAYOUT_OK'],['feed',900,800,'data-feed-result','FEED_LAYOUT_OK'],['site',1200,8000,'data-site-tools-result','SITE_TOOLS_OK']]) {
  const fixture=join(process.env.RUNNER_TEMP,`shiba-${kind}-${width}.html`);
  execFileSync(process.execPath,[kind==='layout'?'tools/check-shiba-layout.mjs':kind==='feed'?'tools/check-shiba-feed-layout.mjs':'tools/check-site-tools-layout.mjs',String(width),fixture],{stdio:'inherit'});
  const html=kind==='site'?await renderSiteFixture(chrome,fixture,width,process.env.RUNNER_TEMP):execFileSync(chrome,['--headless=new','--disable-gpu','--force-device-scale-factor=1',`--user-data-dir=${join(process.env.RUNNER_TEMP,`layout-chrome-${kind}-${width}`)}`,`--window-size=${width},${height}`,`--virtual-time-budget=${budget}`,'--dump-dom',pathToFileURL(fixture).href],{encoding:'utf8',maxBuffer:4*1024*1024,timeout:60000,stdio:['ignore','pipe','pipe']});
  writeFileSync(fixture+'.dump.html',html);
  if(!html.includes(`${marker}="PASS"`))throw Error(`${label}_FAILED_${width}`);
  console.log(`${label}_${width}`);
}
