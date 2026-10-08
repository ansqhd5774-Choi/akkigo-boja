import {test} from 'node:test';
import assert from 'node:assert/strict';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {renderGameCouponTable,gameCouponGridCSS} from '../src/game-coupon-table.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import candidates from '../data/game-code-candidates.json' with {type:'json'};
import {validateGameCodeCandidates,validateGameCandidateCoverage} from '../src/game-code-candidate-policy.js';
test('canonical table uses exactly five ordered columns, 68px and stable code copy',()=>{
 const html=renderGameCouponTable([{code:'TEST123',source:'공식',expiry:'미확인'},{code:'WELCOME2',source:'해외',expiry:'2026-10-31'}],{label:'게임 쿠폰',start:8});
 assert.equal((html.match(/role="columnheader"/g)||[]).length,5);
 assert.equal((html.match(/class="ncp-code-card" role="row"/g)||[]).length,2);
 assert.ok(html.includes('data-ncp-copy="TEST123"'));
 assert.ok(html.includes('class="ncp-col-order" role="cell">08'));
 const css=gameCouponGridCSS('demo-game');
 assert.ok(css.includes('height:68px;min-height:68px'));
 assert.ok(css.includes('grid-template-columns:46px 116px 108px minmax(0,1fr) 74px'));
 assert.ok(css.includes('grid-template-columns:26px 61px 63px minmax(0,1fr) 54px'));
});
test('canonical table refuses duplicate and unsafe coupon values',()=>{
 assert.throws(()=>renderGameCouponTable([{code:'ABC',source:'공식',expiry:'미확인'},{code:'ABC',source:'공식',expiry:'미확인'}]),/DUPLICATE/);
 assert.throws(()=>renderGameCouponTable([{code:'BAD CODE',source:'공식',expiry:'미확인'}]),/INVALID_CODE/);
 assert.throws(()=>renderGameCouponTable([{code:'X',source:'',expiry:'미확인'}]),/MISSING_METADATA/);
});
test('article preflight rejects repeated title and incomplete jump break',()=>{
 const a=[...primary,...supplemental].find(x=>x.articleKey==='outerplane-codes-202610');
 assert.ok(a);
 assert.equal(validateArticleDraft(a),true);
 assert.throws(()=>validateArticleDraft({...a,post:{...a.post,content:a.post.content+'<h1>중복</h1>'}}),/DUPLICATE_TITLE/);
 assert.throws(()=>validateArticleDraft({...a,post:{...a.post,content:a.post.content.replace('<!--more-->','')}}),/JUMP_BREAK_COUNT/);
});

test('externally listed generic Cat Gunner strings stay as UNVERIFIED research candidates',()=>{
 const catCandidates=candidates.filter(x=>x.gameName==='총잡이 고양이');
 const expected=['GAMEEDU','VIP111','VIP333','VIP555','VIP666','VIP777','VIP888','VIP999','VIP2024','GO2024','FBGIFT','DCGIFT'];
 assert.deepEqual(catCandidates.map(x=>x.code),expected);
 assert.equal(validateGameCodeCandidates(),true);
 assert.ok(catCandidates.every(x=>x.status==='UNVERIFIED' && x.sourceUrl.startsWith('https://')));
 const html=renderGameCouponTable(catCandidates.map(x=>({code:x.code,source:'제보',expiry:'미확인'})));
 const article={post:{labels:['게임','총잡이 고양이'],content:html+'<p>입력 시도 후보입니다.</p>'}};
 assert.equal(validateGameCandidateCoverage(article),true);
 const incomplete={post:{labels:['게임','총잡이 고양이'],content:html.replace('data-ncp-copy="VIP777"','data-ncp-copy="OTHER"')+'<p>입력 시도 후보입니다.</p>'}};
 assert.throws(()=>validateGameCandidateCoverage(incomplete),/GAME_CANDIDATE_OMITTED_VIP777/);
 assert.throws(()=>validateGameCodeCandidates([{...candidates[0],status:'EXPIRED'}]),/EVIDENCE_REQUIRED/);
});
