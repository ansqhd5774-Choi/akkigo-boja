import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../theme/site-tools.js',import.meta.url),'utf8');
test('company identity uses asset-host URLs without advertising nonexistent Blogger logo paths',()=>{
 const registry=JSON.parse(source.match(/const brandLogos=(\{[^\n]+\});/)[1]);
 for(const url of Object.keys(registry))assert.equal(new URL(url).origin,'https://akkigo-boja.ansqhd5774.workers.dev');
 const window={};
 class DOMParser {parseFromString(src){return {querySelector:()=>({getAttribute:name=>name==='src'?src:null})};}}
 runInNewContext(source,{window,DOMParser,URL,location:{href:'https://lsifl.blogspot.com/'},document:{readyState:'loading',addEventListener(){}},AbortSignal,Map,setTimeout,clearTimeout});
 for(const [url,name] of Object.entries(registry))assert.equal(window.ncpResolveBrand({content:{$t:url},title:{$t:'different name'}}).name,name);
});
