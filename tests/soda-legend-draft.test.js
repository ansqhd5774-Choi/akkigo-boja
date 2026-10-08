import {test} from 'node:test';
import assert from 'node:assert/strict';
import articles from '../data/articles.json' with {type:'json'};
import {readFileSync} from 'node:fs';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
test('소다전설 33개 코드·발행일 구분 및 R2 표 구조',()=>{
 const a=articles.find(x=>x.articleKey==='soda-legend-codes-202610');assert.ok(a);assert.equal(a.post.title,'소다전설');assert.equal(a.source.presentationVersion,'compact-r2');assert.equal(validateArticleDraft(a),true);
 const x=JSON.parse(readFileSync(new URL('../drafts/soda-legend-global-research-20261009.json',import.meta.url),'utf8'));
 assert.equal(x.records.length,33);assert.equal(new Set(x.records.map(r=>r.code)).size,33);
 assert.equal(x.records.filter(r=>r.classification==='GAME_NAMED_THIRD_PARTY').length,3);
 assert.equal(x.records.filter(r=>r.classification==='CROSS_GAME_GENERIC').length,13);
 assert.equal(x.records.filter(r=>r.classification==='UNVERIFIED_RANDOM_STRING').length,17);
 assert.ok(x.records.every(r=>r.publishedAt===null&&r.sourcePublishedAt===null&&r.status==='UNVERIFIED'));
 const copy=[...a.post.content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
 const share=[...a.post.content.matchAll(/data-ncp-share="([^"]+)"/g)].map(m=>m[1]);assert.equal(copy.length,33);assert.deepEqual(copy,share);
 for(const row of x.records)assert.ok(copy.includes(row.code),row.code);
 assert.equal(a.post.content,readFileSync(new URL('../drafts/soda-legend-codes-202610.html',import.meta.url),'utf8').trim());
});
