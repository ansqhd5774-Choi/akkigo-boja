import {test} from 'node:test';
import assert from 'node:assert/strict';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {validatePresentationDOM} from '../tools/validate-presentation-dom.mjs';
const articles=[...primary,...supplemental].filter(x=>x.source?.presentationVersion==='compact-r2');
test('all current R2 drafts satisfy DOM structure',()=>{for(const a of articles)assert.equal(validatePresentationDOM(a),true,a.articleKey);});
test('DOM checks reject text icons, root info, visible provenance and SEO prose',()=>{
 const a=articles.find(x=>x.articleKey.startsWith('samgukji'));
 const mutate=f=>({...a,post:{...a.post,content:f(a.post.content)}});
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace(/(<summary aria-label="[^"]+">)<svg[\s\S]*?<\/svg>/,'$1ⓘ 안내'))),/ICON_REQUIRED/);
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace('<div class="ncp-brief">','<div class="wrong-container">'))),/INFO_CONTAINER/);
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace('<section id="sg-event">','<section id="sg-event"><p>출처 설명</p>'))),/VISIBLE_PROVENANCE/);
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace('</article>','<p>검색 키워드: 게임</p></article>'))),/VISIBLE_SEO/);
 const long=articles.find(x=>x.articleKey.startsWith('infinite'));
 assert.throws(()=>validatePresentationDOM({...long,post:{...long.post,content:long.post.content.replace('class="ncp-list-more"','class="wrong-list"')}}),/FIVE_ROW_PREVIEW/);
});
