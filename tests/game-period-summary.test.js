import test from 'node:test';
import assert from 'node:assert/strict';
import articles from '../data/articles-supplemental.json' with {type:'json'};
import {summarizeGamePeriodModel} from '../src/game-period-summary.js';
test('Last Echo report counts all five expired source records',()=>{
 const model=articles.find(a=>a.articleKey==='last-echo-codes-202610').source.gamePeriodModel;
 const result=summarizeGamePeriodModel(model);
 assert.equal(result.total,24);
 assert.equal(result.expiredRecords,5);
 assert.equal(result.sourceDateUnknown,24);
 assert.deepEqual(result.expiredCodes,['FANPACK','CATDAYLC','FRIENDLE26','DRACULALE','LCEASTER26']);
});
test('report deduplicates rows exactly as renderer does',()=>{
 const result=summarizeGamePeriodModel({records:[{code:'A',statusLabel:'만료 기록'},{code:'A'},{code:'B'}]});
 assert.equal(result.total,2);
 assert.equal(result.copyButtons,2);
 assert.equal(result.shareButtons,2);
 assert.equal(result.expiredRecords,1);
});
