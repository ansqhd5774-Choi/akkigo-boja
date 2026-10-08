import {test} from 'node:test';
import assert from 'node:assert/strict';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {renderGameCouponTable,gameCouponGridCSS} from '../src/game-coupon-table.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
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
