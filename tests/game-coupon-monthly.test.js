import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mergeMonthlyGameCodes,groupMonthlyGameCodes,renderMonthlyGameCouponSections,validateMonthlyGameCouponTimeline} from '../src/game-coupon-monthly.js';
import {gameCouponGridCSS} from '../src/game-coupon-table.js';
import {validateGameCouponLayout} from '../src/game-code-layout-contract.js';

const september=[
 {code:'SEPTEMBER9',source:'공식 공지',expiry:'미확인',firstSeenMonth:'2026-09'},
 {code:'OLDVIP123',source:'공식 공지',expiry:'2026-12-31',firstSeenMonth:'2026-09'}
];
const october=[
 {code:'SEPTEMBER9',source:'공식 재확인',expiry:'미확인'},
 {code:'OCTOBER10',source:'공식 공지',expiry:'2026-11-30'}
];

test('October new code is distinct from September original code; existing firstSeenMonth never resets',()=>{
 const result=mergeMonthlyGameCodes(september,october,{observationMonth:'2026-10'});
 assert.deepEqual(result.map(r=>[r.code,r.firstSeenMonth]),[
   ['SEPTEMBER9','2026-09'],['OLDVIP123','2026-09'],['OCTOBER10','2026-10']
 ]);
 assert.equal(result[0].source,'공식 재확인');
 assert.deepEqual(groupMonthlyGameCodes(result,{currentMonth:'2026-10'}).map(g=>[g.month,g.codes.length,g.isNew]),[
   ['2026-10',1,true],['2026-09',2,false]
 ]);
});

test('monthly tables are visible by default, October above September, every row has copy',()=>{
 const rows=mergeMonthlyGameCodes(september,october,{observationMonth:'2026-10'});
 const html=renderMonthlyGameCouponSections(rows,{currentMonth:'2026-10'});
 const article={articleKey:'monthly-demo',post:{labels:['게임'],content:gameCouponGridCSS('monthly-demo')+html},source:{gameCouponTimeline:{currentMonth:'2026-10',codes:rows}}};
 assert.ok(html.indexOf('2026년 10월 신규 쿠폰')<html.indexOf('2026년 9월 이전 쿠폰'));
 assert.equal((html.match(/class="ncp-code-card" role="row"/g)||[]).length,3);
 assert.equal((html.match(/data-ncp-copy="/g)||[]).length,3);
 assert.ok(!html.includes('<details'));
 assert.ok(!html.includes('<summary'));
 assert.ok(html.includes('height:68px')===false); // CSS supplied at article level.
 assert.equal(validateGameCouponLayout(article.articleKey,article.post),true);
 assert.equal(validateMonthlyGameCouponTimeline(article),true);
 const broken={...article,post:{...article.post,content:article.post.content.replace('data-ncp-copy="OCTOBER10"','data-ncp-copy="OLDVIP123"')}};
 assert.throws(()=>validateMonthlyGameCouponTimeline(broken),/GAME_MONTH_WRONG_CODE/);
});

test('unknown historic first-seen month never becomes fake new coupon',()=>{
 const previous=[{code:'LEGACYABC',source:'이전 글',expiry:'미확인',firstSeenMonth:null}];
 const merged=mergeMonthlyGameCodes(previous,[{code:'LEGACYABC',source:'재확인',expiry:'미확인'},{code:'FRESHXYZ',source:'새 공지',expiry:'미확인'}],{observationMonth:'2026-10'});
 assert.equal(merged[0].firstSeenMonth,null);
 assert.deepEqual(groupMonthlyGameCodes(merged,{currentMonth:'2026-10'}).map(g=>g.month),['2026-10','unknown']);
 const html=renderMonthlyGameCouponSections(merged,{currentMonth:'2026-10'});
 assert.ok(html.includes('최초 발견 월 미상 쿠폰'));
 assert.ok(!html.includes('2026년 9월'));
});

test('future, duplicate and invalid month histories fail closed',()=>{
 assert.throws(()=>mergeMonthlyGameCodes([],[],{observationMonth:'October'}),/GAME_MONTH_INVALID/);
 assert.throws(()=>mergeMonthlyGameCodes([{code:'DUPCODE',firstSeenMonth:'2026-09'},{code:'DUPCODE',firstSeenMonth:'2026-09'}],[],{observationMonth:'2026-10'}),/GAME_MONTH_DUPLICATE_OR_INVALID_CODE/);
 assert.throws(()=>groupMonthlyGameCodes([{code:'FUTUREX',firstSeenMonth:'2026-12'}],{currentMonth:'2026-10'}),/GAME_MONTH_IN_FUTURE/);
 assert.throws(()=>groupMonthlyGameCodes([{code:'PASTCODE',firstSeenMonth:'2026-13'}],{currentMonth:'2026-10'}),/GAME_MONTH_INVALID/);
});

test('Korean official coupon codes remain exact and copyable in monthly groups',()=>{
 const codes=[{code:'애플1위풍악을울려라',source:'카카오게임즈 공식',expiry:'2026-11-11',firstSeenMonth:'2026-10'},{code:'도깨비1008',source:'공식 라이브',expiry:'미확인',firstSeenMonth:'2026-09'}];
 const html=renderMonthlyGameCouponSections(codes,{currentMonth:'2026-10'});
 assert.ok(html.includes('data-ncp-copy="애플1위풍악을울려라"'));
 assert.ok(html.indexOf('2026년 10월 신규 쿠폰')<html.indexOf('2026년 9월 이전 쿠폰'));
 assert.ok(html.includes('data-ncp-copy="도깨비1008"'));
 assert.equal(validateMonthlyGameCouponTimeline({post:{labels:['게임'],content:html},source:{gameCouponTimeline:{currentMonth:'2026-10',codes}}}),true);
});
