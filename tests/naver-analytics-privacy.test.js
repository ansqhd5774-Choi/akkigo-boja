import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const xml=fs.readFileSync(new URL('../theme/naver-analytics.xml',import.meta.url),'utf8');
const js=xml.split('//<![CDATA[')[1].split('//]]>')[0];
function fixture({href='https://lsifl.blogspot.com/',referrer='',flags={},gpc=false,optOut=false,existing=false}={}){
  const scripts=[];let calls=0;
  const window={...flags,wcs:{},wcs_do:()=>calls++};
  const context={window,navigator:{globalPrivacyControl:gpc},localStorage:{getItem:()=>optOut?'1':null},location:{href},URL,document:{referrer,querySelector:()=>existing?{}:null,createElement:()=>({}),head:{append:script=>scripts.push(script)}}};
  const run=()=>vm.runInNewContext(js,context);run();
  return {scripts,run,calls:()=>calls};
}
test('clean homepage, article and mobile links load once and emit exactly one PV',()=>{
  for(const href of ['https://lsifl.blogspot.com/','https://lsifl.blogspot.com/2026/10/blog-post.html','https://lsifl.blogspot.com/?m=1','https://lsifl.blogspot.com/?m=0']){
    const f=fixture({href});assert.equal(f.scripts.length,1);f.run();assert.equal(f.scripts.length,1);
    f.scripts[0].onload();f.scripts[0].onload();assert.equal(f.calls(),1);
  }
});
test('query or fragment capable of carrying private input never loads vendor script',()=>{
  for(const suffix of ['?uid=private','?q=private','?email=private','?utm_source=share','?m=1&m=1','?m=2','#private']){
    assert.equal(fixture({href:'https://lsifl.blogspot.com/'+suffix}).scripts.length,0);
  }
  for(const referrer of ['https://source.example/?q=private','https://source.example/#private'])assert.equal(fixture({referrer}).scripts.length,0);
  assert.equal(fixture({referrer:'https://source.example/path'}).scripts.length,1);
});
test('GPC, operator flag and persisted opt-out prevent all vendor loading',()=>{
  for(const options of [{gpc:true},{flags:{ncpAnalyticsInternalTraffic:true}},{flags:{ncpNaverAnalyticsOptOut:true}},{optOut:true},{existing:true}])assert.equal(fixture(options).scripts.length,0);
});
