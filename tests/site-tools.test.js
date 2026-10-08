import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {icons} from '../theme/site-icons.mjs';
import {planMinimalThemePatch} from '../tools/prepare-site-theme-patch.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const vendor=read('theme/assets/fuse-7.5.0.min.js');
test('vendored search ranks Korean typo and English game names without injecting HTML',()=>{
 const window={};runInNewContext(vendor,{window});
 const rows=[{title:'후더덕 서바이벌'},{title:'Royal Kingdom'},{title:'원신'}];
 const index=new window.Fuse(rows,{keys:['title'],threshold:.32,ignoreLocation:true});
 assert.equal(index.search('후더덕 서바이블')[0].item.title,'후더덕 서바이벌');
 assert.equal(index.search('royal kingdm')[0].item.title,'Royal Kingdom');
 assert.equal(index.search('존재하지않는게임').length,0);
});
test('shared feed accepts only same-origin HTTPS article links',()=>{
 const window={};const document={readyState:'loading',addEventListener(){}};
 runInNewContext(read('theme/site-tools.js'),{window,document,location:new URL('https://lsifl.blogspot.com/'),URL,AbortSignal,setTimeout,clearTimeout});
 const entry=url=>({link:[{rel:'alternate',href:url}]});
 assert.equal(window.ncpEntryUrl(entry('/2026/10/a.html')),'https://lsifl.blogspot.com/2026/10/a.html');
 for(const url of ['https://other.example/a','javascript:alert(1)','http://lsifl.blogspot.com/a'])assert.equal(window.ncpEntryUrl(entry(url)),null);
});
test('shared feed deduplicates requests and clears failed promises for recovery',async()=>{
 let calls=0,fail=true;const window={};const document={readyState:'loading',addEventListener(){}};
 runInNewContext(read('theme/site-tools.js'),{window,document,location:new URL('https://lsifl.blogspot.com/'),URL,AbortSignal,setTimeout,clearTimeout,fetch:async()=>{calls++;return {ok:!fail,json:async()=>({feed:{entry:[{title:{$t:'원신'}}]}})};}});
 const first=window.ncpFeed();assert.equal(first,window.ncpFeed());await assert.rejects(first);fail=false;
 assert.equal((await window.ncpFeed())[0].title.$t,'원신');assert.equal(calls,2);
});
test('licensed SVGs and compressed hero are included without third-party icon requests',()=>{
 for(const name of ['heart','chevron-left','chevron-right','gamepad-2']){assert.match(icons[name],/viewBox="0 0 24 24"/);assert.doesNotMatch(icons[name],/<script|onload|href=/);}
 const license=read('theme/assets/licenses/lucide.txt');assert.match(license,/ISC License/);assert.match(license,/MIT License/);
 const xml=read('akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml');assert.match(xml,/home-hero.webp/);assert.ok(xml.includes(read('theme/site-tools.js')));assert.ok(xml.includes(read('theme/site-tools.css')));
 const hero=readFileSync(new URL('../theme/assets/home-hero.webp',import.meta.url)),png=readFileSync(new URL('../theme/assets/home-hero.png',import.meta.url));assert.ok(hero.length<png.length*.2);
});
const patchOptions={oldHome:'old-home',newHome:'new-home',oldGrid:'old-grid',newGrid:'new-grid',css:'/* scoped styles */',mount:'<!-- shared tools -->'};
const patchFixture=()=>`<b:skin><![CDATA[]]></b:skin><b:includable id='postBody' var='post'><data:post.body/></b:includable>`+`<b:includable id='postBodySnippet' var='post'><data:post.body/></b:includable>`.repeat(2)+`<div id='ncp-coupon-home'>old-home</div><div>old-grid</div>`+`<a class='ncp-r4-category' href='/search/label/game'><span><img src='https://api.iconify.design/twemoji/video-game.svg'/></span>게임</a>`.repeat(14)+`<img src='https://akkigo-boja.ansqhd5774.workers.dev/home-hero.png'/><script type='text/javascript'>//<![CDATA[\n// AKKIGO persistent copy feedback:\n[data-ncp-copy]\n//]]></script>`;
test('minimal theme plan preserves postBody, snippets, copy and original hero fallback',()=>{
 const plan=planMinimalThemePatch(patchFixture(),patchOptions);assert.equal(plan.edits.length,19);assert.ok(plan.patched.includes("<b:includable id='postBody' var='post'><data:post.body/></b:includable>"));assert.match(plan.patched,/\[data-ncp-copy\]/);assert.match(plan.patched,/home-hero\.png/);assert.notEqual(plan.beforeSha256,plan.afterSha256);
 let roundTrip=plan.patched;for(const edit of [...plan.edits].reverse())roundTrip=roundTrip.slice(0,edit.afterIndex)+edit.oldText+roundTrip.slice(edit.afterIndex+edit.newText.length);assert.equal(roundTrip,patchFixture());
});
test('minimal theme plan refuses missing or duplicated target scripts',()=>{
 assert.throws(()=>planMinimalThemePatch(patchFixture().replace('old-home','missing-home'),patchOptions),/PATCH_TARGET_NOT_UNIQUE_home-script/);
 assert.throws(()=>planMinimalThemePatch(patchFixture()+'old-grid',patchOptions),/PATCH_TARGET_NOT_UNIQUE_category-script/);
});
