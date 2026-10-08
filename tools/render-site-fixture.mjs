import {spawn} from 'node:child_process';
import {mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

// Isolated test browser only. Never attach to a user's Chrome profile.
export async function renderSiteFixture(chrome,path,width,temp){
 const profile=await mkdtemp(join(temp,'site-fixture-chrome-'));
 const child=spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore',windowsHide:true});
 let ws;const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 try{
  let port;for(let i=0;i<150;i++){try{port=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await pause(50);}}
  if(!port)throw Error('FIXTURE_BROWSER_START_TIMEOUT');
  const tabs=await fetch(`http://127.0.0.1:${port}/json/list`).then(r=>r.json());const tab=tabs.find(row=>row.type==='page');if(!tab)throw Error('FIXTURE_TAB_MISSING');
  ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let id=0;const pending=new Map();ws.addEventListener('message',event=>{const message=JSON.parse(event.data);const item=pending.get(message.id);if(!item)return;pending.delete(message.id);clearTimeout(item.timer);message.error?item.reject(Error(message.error.message)):item.resolve(message.result);});
  const call=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;const timer=setTimeout(()=>{pending.delete(key);reject(Error('FIXTURE_CDP_TIMEOUT'));},10000);pending.set(key,{resolve,reject,timer});ws.send(JSON.stringify({id:key,method,params}));});
  await call('Emulation.setDeviceMetricsOverride',{width,height:1200,deviceScaleFactor:1,mobile:false});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await call('Page.navigate',{url:pathToFileURL(path).href});
  let result;for(let i=0;i<180;i++){result=await call('Runtime.evaluate',{expression:'document.documentElement?.dataset.siteToolsResult',returnByValue:true});if(result.result?.value)break;await pause(50);}
  const dom=await call('Runtime.evaluate',{expression:'document.documentElement.outerHTML',returnByValue:true});
  const shot=await call('Page.captureScreenshot',{format:'png'});await writeFile(path+'.png',Buffer.from(shot.data,'base64'));
  return dom.result.value;
 }finally{ws?.close();child.kill();}
}
