import {test} from 'node:test';
import assert from 'node:assert/strict';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {validatePresentationDOM} from '../tools/validate-presentation-dom.mjs';
import {readFileSync} from 'node:fs';
const articles=[...primary,...supplemental].filter(x=>x.source?.presentationVersion==='compact-r2');
test('fresh publish checkout only performs dependency-free checks before install',()=>{
 const workflow=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
 const staticAt=workflow.indexOf('node tools/check-article-presentation.mjs --static');
 const installAt=workflow.indexOf('pnpm install --frozen-lockfile');
 const domAt=workflow.indexOf('name: Validate full DOM contract');
 assert.ok(staticAt>=0&&staticAt<installAt&&domAt>installAt);
 assert.match(workflow.slice(domAt,domAt+260),/verification.outputs.reused != 'true'/);
 const checker=readFileSync(new URL('../tools/check-article-presentation.mjs',import.meta.url),'utf8');
 assert.match(checker,/includes\('--static'\)\?null:\(await import/);
});
test('all current R2 drafts satisfy DOM structure',()=>{for(const a of articles)assert.equal(validatePresentationDOM(a),true,a.articleKey);});
test('DOM checks reject text icons, root info, visible provenance and SEO prose',()=>{
 const a=articles.find(x=>x.articleKey.startsWith('samgukji'));
 const mutate=f=>({...a,post:{...a.post,content:f(a.post.content)}});
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace(/(<summary aria-label="[^"]+">)<svg[\s\S]*?<\/svg>/,'$1ⓘ 안내'))),/ICON_REQUIRED/);
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace('<div class="ncp-brief">','<div class="wrong-container">'))),/INFO_CONTAINER/);
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace('<section class="ncp-period-panel" data-ncp-period="2026"','<section class="ncp-period-panel" data-ncp-period="2026"').replace('<h2>2026년 기록</h2>','<h2>2026년 기록</h2><p>출처 설명</p>'))),/VISIBLE_PROVENANCE/);
 assert.throws(()=>validatePresentationDOM(mutate(h=>h.replace('</article>','<p>검색 키워드: 게임</p></article>'))),/VISIBLE_SEO/);
 const long=articles.find(x=>x.articleKey.startsWith('infinite'));
 assert.throws(()=>validatePresentationDOM({...long,post:{...long.post,content:long.post.content.replace('class="ncp-list-more"','class="wrong-list"')}}),/FIVE_ROW_PREVIEW/);
});
