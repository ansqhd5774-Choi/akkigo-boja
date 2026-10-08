import {test} from 'node:test';
import assert from 'node:assert/strict';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import legacy from '../data/article-presentation-legacy.json' with {type:'json'};
import {validateArticlePresentation,renderArticleInfo} from '../src/article-presentation.js';
import {readFileSync} from 'node:fs';
test('theme owns aligned heading rows and full-width share actions',()=>{
 const css=readFileSync(new URL('../theme/article-compact.css',import.meta.url),'utf8');
 assert.match(css,/section\{display:grid!important/);
 assert.match(css,/section>\.ncp-info\{position:relative!important/);
 assert.match(css,/min-width:44px!important;flex:0 0 44px!important/);
 for(const file of ['blogger-theme-r1.xml','blogger-theme-r1_modified.xml'])assert.ok(readFileSync(new URL('../akkigo_blogger_r1_bundle/theme/'+file,import.meta.url),'utf8').includes(css));
});
test('new game drafts require compact presentation version; grandfathered articles stay unchanged',()=>{
 for(const a of [...primary,...supplemental]){
  if(!a.post?.labels?.includes('게임')||legacy.includes(a.articleKey))continue;
  assert.ok(['compact-r1','compact-r2'].includes(a.source?.presentationVersion),a.articleKey);
  assert.equal(validateArticlePresentation(a),true);
 }
});
test('R2 rejects unfolded long lists and visible section provenance',()=>{
 const make=content=>({source:{presentationVersion:'compact-r2'},post:{content:'<article data-ncp-presentation="compact-r2">'+renderArticleInfo('안내')+content+'</article>'}});
 assert.throws(()=>validateArticlePresentation(make('<section><h2>기록</h2><p>긴 출처 안내</p><div class="ncp-card-list"></div></section>')),/SECTION_INFO_REQUIRED/);
 assert.throws(()=>validateArticlePresentation(make('<section>'+('<div class="ncp-code-card"></div>'.repeat(6))+'</section>')),/LIST_DISCLOSURE_REQUIRED/);
 assert.equal(validateArticlePresentation(make('<section><details class="ncp-list-more">'+('<div class="ncp-code-card"></div>'.repeat(6))+'</details></section>')),true);
});
test('compact presentation rejects verbose headings and text-only expansion controls',()=>{
 const base={source:{presentationVersion:'compact-r1'},post:{content:'<article data-ncp-presentation="compact-r1">'+renderArticleInfo('보충 설명')+'</article>'}};
 assert.equal(validateArticlePresentation(base),true);
 assert.throws(()=>validateArticlePresentation({...base,post:{content:base.post.content+'<summary>2026년 펼쳐보기</summary>'}}),/TEXT_TOGGLE/);
 assert.throws(()=>validateArticlePresentation({...base,post:{content:base.post.content+'<h2>'+'긴'.repeat(25)+'</h2>'}}),/HEADING_VERBOSE/);
});
