import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {compactArticleCSS} from '../src/article-presentation.js';
const js=readFileSync(new URL('../theme/coupon-copy.js',import.meta.url),'utf8');
function setup(navigator){
 let listener;const attrs={};const button={dataset:{ncpShare:'EXACTcode'},setAttribute(k,v){attrs[k]=v;}};
 runInNewContext(js,{navigator,location:{pathname:'/2026/10/example.html',origin:'https://lsifl.blogspot.com'},document:{title:'게임',querySelectorAll:()=>[],addEventListener(type,fn){if(type==='click')listener=fn;}}});
 return {button,attrs,click:()=>listener({target:{closest:selector=>selector==='[data-ncp-share]'?button:null},preventDefault(){},stopImmediatePropagation(){}})};
}
test('share fallback copies exact code and canonical URL without copied/redemption state',async()=>{
 let text;const state=setup({clipboard:{async writeText(value){text=value;}}});await state.click();
 assert.equal(text,'EXACTcode\nhttps://lsifl.blogspot.com/2026/10/example.html');
 assert.equal(state.attrs['aria-label'],'공유 링크 복사 완료');assert.equal(state.button.disabled,false);
 assert.equal(state.button.dataset.ncpCopied,undefined);
});
test('native share cancellation preserves button and does not copy anything',async()=>{
 let copied=false;const state=setup({async share(){throw Object.assign(Error('cancel'),{name:'AbortError'});},clipboard:{async writeText(){copied=true;}}});await state.click();
 assert.equal(copied,false);assert.equal(state.button.disabled,false);assert.equal(state.attrs['aria-label'],'EXACTcode 공유');
});
for(const name of ['NotAllowedError','TypeError'])test('native '+name+' exposes a separate-click clipboard fallback',async()=>{
 let text;const state=setup({async share(){throw Object.assign(Error('failure'),{name});},clipboard:{async writeText(t){text=t;}}});
 await state.click();assert.equal(text,undefined);assert.equal(state.button.dataset.ncpShareError,name);assert.equal(state.button.disabled,false);
 await state.click();assert.equal(text,'EXACTcode\nhttps://lsifl.blogspot.com/2026/10/example.html');assert.equal(state.attrs['aria-label'],'공유 링크 복사 완료');assert.equal(state.button.dataset.ncpShareError,undefined);
});
test('canShare=false uses clipboard and clipboard failures stay retryable',async()=>{
 let calls=0,copied;const state=setup({canShare:()=>false,async share(){calls++;},clipboard:{async writeText(t){if(!copied){copied=true;throw Object.assign(Error('denied'),{name:'NotAllowedError'});}assert.ok(t.includes('EXACTcode'));}}});
 await state.click();assert.equal(calls,0);assert.equal(state.button.disabled,false);await state.click();assert.equal(state.attrs['aria-label'],'공유 링크 복사 완료');
});
test('chevrons use borders instead of CSS text susceptible to Blogger entity escaping',()=>{
 assert.match(compactArticleCSS,/summary::after\{content:''/);
 assert.doesNotMatch(compactArticleCSS,/content:'[^']*(?:⌄|&#)/);
});
