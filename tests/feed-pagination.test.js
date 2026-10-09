import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../theme/site-tools.js',import.meta.url),'utf8');
const entry=id=>({id:{$t:String(id)},title:{$t:'글 '+id}});
const page=(total,ids)=>({feed:{openSearch$totalResults:{$t:String(total)},entry:ids.map(entry)}});
function setup(handler){const calls=[],window={};const document={readyState:'loading',addEventListener(){}};runInNewContext(source,{window,document,location:new URL('https://lsifl.blogspot.com/'),URL,AbortSignal,setTimeout,clearTimeout,fetch:async path=>{calls.push(path);const value=await handler(path,calls.length);return value?.ok===false?value:{ok:true,json:async()=>value};}});return {window,calls};}
test('Blogger partial responses advance by actual entry count until all 77 posts are available',async()=>{
 const sizes=[18,32,27];let cursor=0;const {window,calls}=setup(()=>{const size=sizes.shift(),ids=Array.from({length:size},()=>++cursor);return page(77,ids);});
 const pending=window.ncpFeed();assert.equal(pending,window.ncpFeed());const rows=await pending;
 assert.equal(rows.length,77);assert.equal(new Set(rows.map(r=>r.id.$t)).size,77);
 assert.equal(calls.length,3);assert.match(calls[1],/start-index=19$/);assert.match(calls[2],/start-index=51$/);
});
test('category pagination encodes category, deduplicates IDs and preserves order',async()=>{
 const {window,calls}=setup((_,n)=>n===1?page(3,[1,2]):page(3,[2,3]));
 const rows=await window.ncpFeed('게임');assert.equal(rows.map(r=>r.id.$t).join(','),'1,2,3');assert.match(calls[0],/\/-\/%EA%B2%8C%EC%9E%84\?/);assert.match(calls[1],/start-index=3$/);
});
test('feed retains the 150-entry contract even when the reported total is larger',async()=>{
 const {window,calls}=setup((_,n)=>page(400,Array.from({length:80},(_,i)=>(n-1)*80+i+1)));
 assert.equal((await window.ncpFeed()).length,150);assert.equal(calls.length,2);
});
test('repeated and prematurely empty pages fail instead of caching an incomplete feed',async()=>{
 for(const [second,expected] of [[page(3,[1,2]),/FEED_PAGE_REPEATED/],[page(3,[]),/FEED_PAGE_EMPTY/]]){
  let recovered=false;const {window}=setup((_,n)=>recovered?page(1,[9]):n===1?page(3,[1,2]):second);
  await assert.rejects(window.ncpFeed(),expected);recovered=true;assert.equal((await window.ncpFeed())[0].id.$t,'9');
 }
});
test('invalid or changing totals and later HTTP errors are rejected and retryable',async()=>{
 for(const [second,expected]of [[page('NaN',[3]),/FEED_TOTAL_INVALID/],[page(4,[3]),/FEED_CHANGED/],[{ok:false},/FEED_HTTP/]]){
  const {window}=setup((_,n)=>n===1?page(3,[1,2]):second);await assert.rejects(window.ncpFeed(),expected);assert.equal(window.ncpFeedCache.size,0);
 }
 const {window}=setup(()=>page(-1,[]));await assert.rejects(window.ncpFeed(),/FEED_TOTAL_INVALID/);
});
test('zero total resolves empty without attempting another page',async()=>{
 const {window,calls}=setup(()=>page(0,[]));assert.equal((await window.ncpFeed()).length,0);assert.equal(calls.length,1);
});
test('game detail uses the shared complete feed to find an older article and build related links',async()=>{
 const source=readFileSync(new URL('../theme/game-detail.js',import.meta.url),'utf8');
 class Node{constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.classList={add(){}};}append(...nodes){this.children.push(...nodes);}prepend(node){this.children.unshift(node);}setAttribute(k,v){this.attributes[k]=v;}querySelector(){return null;}querySelectorAll(){return [];}after(){}}
 const body=new Node('body'),calls=[];
 const old={id:{$t:'old'},title:{$t:'오래된 게임'},content:{$t:'OLD'},link:[{rel:'alternate',href:'https://lsifl.blogspot.com/2026/10/old.html'}]};
 const other={id:{$t:'other'},title:{$t:'다른 게임'},content:{$t:'OTHER'},link:[{rel:'alternate',href:'https://lsifl.blogspot.com/2026/10/other.html'}]};
 const window={ncpFeed:async category=>{calls.push(category);return [other,old];},ncpResolveGame:e=>({id:e.id.$t,name:e.title.$t})};
 class Parser{parseFromString(value){return {querySelector:()=>null,querySelectorAll:()=>[{disabled:false,closest:()=>null,dataset:{ncpCopy:value}}]};}}
 await runInNewContext(source,{window,document:{querySelector:s=>s==='.post-body'?body:null,createElement:tag=>new Node(tag)},location:new URL('https://lsifl.blogspot.com/2026/10/old.html'),URL,DOMParser:Parser,fetch:()=>{throw Error('UNEXPECTED_DIRECT_FEED');}});
 assert.equal(calls.join(','),'게임');assert.equal(body.children[0].className,'ncp-detail-overview');assert.equal(body.children[0].attributes['aria-label'],'오래된 게임 쿠폰 현황');
 const related=body.children.find(x=>x.className==='ncp-detail-related');assert.equal(related.children[1].children[0].href,'https://lsifl.blogspot.com/2026/10/other.html');
});
