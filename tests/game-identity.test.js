import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveGame} from '../src/game-identity.js';
test('generic labels and reordered labels do not become game names',()=>{
 for(const labels of [['게임','교환코드','쿠폰','후더덕 서바이벌'],['후더덕 서바이벌','쿠폰','게임']]){
 const game=resolveGame({title:'후더덕 서바이벌 쿠폰 2026년 10월',category:labels,content:'<article data-ncp-article="duck-survival-codes-202610">'});
 assert.deepEqual(game,{id:'duck-survival-codes',name:'후더덕 서바이벌'});
 }
});
test('legacy primary keys preserve existing votes',()=>{
 assert.equal(resolveGame({title:'원신 쿠폰',category:['쿠폰','게임','원신']},['원신']).id,'원신');
});
test('explicit ids survive display-name changes',()=>{
 assert.deepEqual(resolveGame({title:'새 게임 쿠폰',content:'<article data-game-id="stable" data-game-name="새 이름">'}),{id:'stable',name:'새 이름'});
});
