import {test} from 'node:test';
import assert from 'node:assert/strict';
import {duolingoArticle} from '../src/duolingo-article.js';
import research from '../data/duolingo-super-research-202610.json' with {type:'json'};
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {articleSnapshot} from '../src/article-snapshot.js';
test('Duolingo source dates and unique records are preserved in published HTML',()=>{
 const h=duolingoArticle.post.content;
 assert.equal(research.records.length,51);
 assert.equal(new Set(research.records.map(x=>x.code)).size,51);
 assert.equal((h.match(/<tr><td>/g)||[]).length,51);
 assert.equal((h.match(/data-ncp-copy=/g)||[]).length,5);
 assert.equal((h.match(/<!--more-->/g)||[]).length,1);
 assert.equal(research.records.find(x=>x.code==='LOVELANGUAGE').sourcePublishedAt,null);
 assert.equal(research.records.find(x=>x.code==='DUOBNB2026').sourcePublishedAt,'2026-04-10');
 assert.ok(h.includes('11월 15일'));
 assert.equal(validateArticleDraft(duolingoArticle),true);
});
test('Duolingo approved source fingerprint is deterministic',async()=>{
 const a=await articleSnapshot(duolingoArticle.articleKey,[duolingoArticle]);
 assert.equal(a.approved,true);
 assert.deepEqual(a,await articleSnapshot(duolingoArticle.articleKey,[duolingoArticle]));
});
