import {test} from 'node:test';
import assert from 'node:assert/strict';
import articles from '../data/articles.json' with {type:'json'};
import {readFileSync} from 'node:fs';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
test('무한의 계단 49개 쿠폰 및 원문 게시 날짜 검증',()=>{
const a=articles.find(x=>x.articleKey==='infinite-stairs-codes-202610');assert.ok(a);assert.equal(a.post.title,'무한의 계단');assert.equal(validateArticleDraft(a),true);
const r=JSON.parse(readFileSync(new URL('../drafts/infinite-stairs-global-research-20261009.json',import.meta.url),'utf8'));
assert.equal(r.records.length,49);assert.equal(new Set(r.records.map(x=>x.code)).size,49);
assert.equal(r.records.filter(x=>x.publishedAt!==null).length,22);
assert.equal(r.records.filter(x=>x.publishedAt===null).length,27);
assert.equal(r.records.find(x=>x.code==='ming4rs29a').publishedAt,'2021-05-31');
assert.equal(r.records.find(x=>x.code==='gb2pu7nt').publishedAt,'2023-07-25');
assert.equal(r.records.find(x=>x.code==='mXR772rn').publishedAt,'2017-10-16');
assert.equal(r.records.find(x=>x.code==='STAIRS').publishedAt,null);
const codes=[...a.post.content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);assert.equal(codes.length,49);for(const item of r.records)assert.ok(codes.includes(item.code),item.code);
const h=readFileSync(new URL('../drafts/infinite-stairs-codes-202610.html',import.meta.url),'utf8').trim();assert.equal(h,a.post.content);
});
