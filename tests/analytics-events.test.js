import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const script=readFileSync(new URL('../theme/analytics-events.js',import.meta.url),'utf8');
function fixture(flags={}){
  const handlers={};const sent=[];
  const window={...flags,addEventListener:(name,handler)=>handlers[name]=handler,gtag:(...args)=>sent.push(args)};
  const context={window,navigator:{},document:{addEventListener:(name,handler)=>handlers[name]=handler},URL,CustomEvent:class {constructor(type,options){this.type=type;this.detail=options.detail;}},location:{origin:'https://lsifl.blogspot.com',href:'https://lsifl.blogspot.com/2026/10/post.html',pathname:'/2026/10/post.html',search:'?email=secret&uid=123'}};
  window.dispatchEvent=event=>handlers[event.type](event);
  vm.runInNewContext(script,context);
  return {sent,emit:detail=>handlers['ncp:action']({detail}),click:href=>handlers.click({target:{closest:()=>({href})}}),context};
}
test('analytics remains off without explicit enable and granted consent',()=>{
  for(const flags of [{},{ncpAnalyticsEnabled:true},{ncpAnalyticsConsent:'granted'}]){
    const f=fixture(flags);f.emit({name:'coupon_copy',outcome:'success'});assert.equal(f.sent.length,0);
  }
});
test('official registration records click only and excludes destination credentials',()=>{
  const f=fixture({ncpAnalyticsEnabled:true,ncpAnalyticsConsent:'granted'});
  f.click('https://official.example/redeem?uid=PRIVATE');
  assert.equal(f.sent.length,1);assert.equal(f.sent[0][1],'redeem_outbound');
  assert.equal(f.sent[0][2].outcome,'click');assert.equal(JSON.stringify(f.sent).includes('PRIVATE'),false);
  f.click('javascript:alert(1)');f.click('https://lsifl.blogspot.com/internal');
  assert.equal(f.sent.length,1);
});
test('success events strip arbitrary fields, query strings, titles and referrer',()=>{
  const f=fixture({ncpAnalyticsEnabled:true,ncpAnalyticsConsent:'granted'});
  f.emit({name:'coupon_copy',method:'clipboard',outcome:'success',code:'PRIVATE',uid:'123',email:'secret'});
  assert.equal(f.sent.length,1);const [action,name,payload]=f.sent[0];
  assert.equal(action,'event');assert.equal(name,'coupon_copy');
  assert.equal(payload.page_location,'https://lsifl.blogspot.com/2026/10/post.html');
  assert.equal(payload.page_title,'');assert.equal(payload.page_referrer,'');
  assert.equal(JSON.stringify(payload).includes('PRIVATE'),false);
  f.emit({name:'redemption_success',outcome:'success'});f.emit({name:'share',outcome:'error'});
  assert.equal(f.sent.length,1);
});
test('internal traffic and global privacy control suppress delivery; duplicate install adds no listeners',()=>{
  for(const internal of [true,false]){
    const f=fixture({ncpAnalyticsEnabled:true,ncpAnalyticsConsent:'granted',ncpAnalyticsInternalTraffic:internal});
    if(!internal)f.context.navigator.globalPrivacyControl=true;
    f.emit({name:'share',outcome:'success'});assert.equal(f.sent.length,0);
    vm.runInNewContext(script,f.context);
  }
});
