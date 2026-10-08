import {test} from 'node:test';
import assert from 'node:assert/strict';
import entries from '../data/articles-supplemental.json' with {type:'json'};
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

const original=entries.find(x=>x.articleKey==='aniimo-codes-202610');
function withContent(content){return {...original,post:{...original.post,content}};}
test('Aniimo coupon article passes editorial publication gate',()=>{
 assert.ok(original);
 assert.equal(validateArticleDraft(original),true);
 const codes=[...original.post.content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(codes.length,16);
 assert.equal(new Set(codes).size,16);
});
test('Aniimo tabs must be truly interactive, not just anchor navigation',()=>{
 const broken=original.post.content.replace('#aniimo-tab-current:checked~.ncp-aniimo-panels','.broken-current-tab');
 assert.throws(()=>validateArticleDraft(withContent(broken)),/ANIIMO_TABS_NOT_INTERACTIVE/);
});
test('Aniimo source and expiration reward must not silently disappear',()=>{
 assert.throws(()=>validateArticleDraft(withContent(original.post.content.replace('aniimoparty</strong> 안내 보상: 글리머 50개 · 고급 애니팟 5개 · 성장의 꽃 5개','aniimoparty</strong> 안내 보상: 보상 미상'))),/ANIIMO_EXPIRED_REWARD_MISSING/);
 assert.throws(()=>validateArticleDraft(withContent(original.post.content.replaceAll('미국 서버 전용','해외 서버'))),/ANIIMO_PROVENANCE_MISSING/);
});
