import test from 'node:test';
import assert from 'node:assert/strict';
import {renderGamePeriodArticle,groupPeriodRecords} from '../src/game-period-article.js';
test('a third-party code list reference does not promote unknown publication or redemption status',()=>{
 const records=[{code:'TESTCODE',sourcePublishedAt:null,latest:false,statusLabel:'사용 여부 미확인',sources:[{url:'https://example.com/game-codes',name:'제3자 목록',referenceType:'THIRD_PARTY_CODE_MENTION',checkedAt:'2026-10-10'}]}];
 const html=renderGamePeriodArticle({articleKey:'test-game',title:'게임',records});
 assert.match(html,/data-source-provenance="third-party-reference"/);
 assert.match(html,/최초 공식 원문·원문 게시일·계정 입력 성공은 미확인/);
 assert.match(html,/사용 여부 미확인/);
 assert.equal(groupPeriodRecords(records).find(x=>x.period==='latest').rows.length,0);
 assert.equal(groupPeriodRecords(records).find(x=>x.period==='unknown').rows.length,1);
});
