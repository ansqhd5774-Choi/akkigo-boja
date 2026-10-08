import {test} from 'node:test';
import assert from 'node:assert/strict';
import articles from '../data/articles.json' with {type:'json'};
import {readFileSync} from 'node:fs';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
test('랜덤 다이스 2: 33개 원문 문자열과 R2 표시 계약을 검증한다',()=>{
const a=articles.find(x=>x.articleKey==='random-dice-2-codes-202610');assert.ok(a);assert.equal(a.post.title,'랜덤 다이스 2');assert.equal(a.source.presentationVersion,'compact-r2');assert.equal(validateArticleDraft(a),true);
const r=JSON.parse(readFileSync(new URL('../drafts/random-dice-2-global-research-20261009.json',import.meta.url),'utf8'));
assert.equal(r.records.length,33);assert.equal(new Set(r.records.map(x=>x.code)).size,33);
assert.equal(r.records.filter(x=>x.sourceType==='GENERIC_CROSS_GAME_STRINGS').length,13);
assert.equal(r.records.find(x=>x.code==='RD2GLOBAL2026').publishedAt,'2026-08-31');
assert.equal(r.records.find(x=>x.code==='DICE2SPECIAL').publishedAt,'2026-08-25');
assert.equal(r.records.find(x=>x.code==='WELCOME2RD2').publishedAt,null);
assert.equal(r.records.find(x=>x.code==='GOGODICE2').status,'EXPIRED');
const code=[...a.post.content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);const share=[...a.post.content.matchAll(/data-ncp-share="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(code,share);assert.equal(code.length,33);
assert.ok(!a.post.content.includes('<h1'));assert.equal((a.post.content.match(/<!--more-->/g)||[]).length,1);
assert.equal(a.post.content,readFileSync(new URL('../drafts/random-dice-2-codes-202610.html',import.meta.url),'utf8').trim());
});
