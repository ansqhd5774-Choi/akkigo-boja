import {test} from 'node:test';
import assert from 'node:assert/strict';
import {malhaevocaArticle} from '../src/malhaevoca-article.js';
import research from '../data/malhaevoca-offers-202610.json' with {type:'json'};
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {articleSnapshot} from '../src/article-snapshot.js';
test('말해보카 공식 할인 네 가지와 출처 원문 게시일을 보존한다',()=>{
 const h=malhaevocaArticle.post.content;
 assert.equal(research.offers.length,4);
 assert.equal(new Set(research.offers.map(x=>x.id)).size,4);
 assert.equal((h.match(/<tr><td>/g)||[]).length,4);
 assert.equal((h.match(/<!--more-->/g)||[]).length,1);
 assert.equal((h.match(/data-ncp-copy=/g)||[]).length,0);
 assert.equal(research.rawCodesFound.length,0);
 assert.equal(research.offers.find(x=>x.id==='HANA_NARA_12M').sourcePublishedAt,'2026-01-20');
 assert.equal(research.offers.find(x=>x.id==='KAKAO_STUDENT_30').sourcePublishedAt,'2024-06-19');
 assert.equal(research.offers.find(x=>x.id==='OFFICIAL_WEB_12M').sourcePublishedAt,null);
 assert.ok(h.includes('99,000원'));
 assert.ok(h.includes('69,000원'));
 assert.ok(h.includes('선착순'));
 assert.ok(h.includes('공식 웹사이트 대표 이미지'));
 assert.ok(!h.includes('현재 모든 계정에 적용 가능'));
 assert.equal(validateArticleDraft(malhaevocaArticle),true);
});
test('말해보카 승인 원고 snapshot is stable and approved',async()=>{
 const a=await articleSnapshot(malhaevocaArticle.articleKey,[malhaevocaArticle]);
 assert.equal(a.approved,true);
 assert.deepEqual(a,await articleSnapshot(malhaevocaArticle.articleKey,[malhaevocaArticle]));
});
