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
 assert.equal(copied,false);assert.equal(state.button.disabled,false);assert.deepEqual(state.attrs,{});
});
test('chevrons use borders instead of CSS text susceptible to Blogger entity escaping',()=>{
 assert.match(compactArticleCSS,/summary::after\{content:''/);
 assert.doesNotMatch(compactArticleCSS,/content:'[^']*(?:⌄|&#)/);
});
