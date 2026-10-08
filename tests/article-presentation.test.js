import {test} from 'node:test';
import assert from 'node:assert/strict';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import legacy from '../data/article-presentation-legacy.json' with {type:'json'};
import {validateArticlePresentation,renderArticleInfo} from '../src/article-presentation.js';
test('new game drafts require compact presentation version; grandfathered articles stay unchanged',()=>{
 for(const a of [...primary,...supplemental]){
  if(!a.post?.labels?.includes('게임')||legacy.includes(a.articleKey))continue;
  assert.equal(a.source?.presentationVersion,'compact-r1',a.articleKey);
  assert.equal(validateArticlePresentation(a),true);
 }
});
test('compact presentation rejects verbose headings and text-only expansion controls',()=>{
 const base={source:{presentationVersion:'compact-r1'},post:{content:'<article data-ncp-presentation="compact-r1">'+renderArticleInfo('보충 설명')+'</article>'}};
 assert.equal(validateArticlePresentation(base),true);
 assert.throws(()=>validateArticlePresentation({...base,post:{content:base.post.content+'<summary>2026년 펼쳐보기</summary>'}}),/TEXT_TOGGLE/);
 assert.throws(()=>validateArticlePresentation({...base,post:{content:base.post.content+'<h2>'+'긴'.repeat(25)+'</h2>'}}),/HEADING_VERBOSE/);
});
