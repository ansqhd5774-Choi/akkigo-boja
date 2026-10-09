import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeSourceGaps} from '../src/source-gap-summary.js';
test('source gap counts change with evidence and do not count registration links',()=>{
 const gaps=[{articleKey:'a',code:'ONE'},{articleKey:'a',code:'TWO'},{articleKey:'missing',code:'THREE'}];
 const articles=[{articleKey:'a',source:{gamePeriodModel:{records:[{code:'ONE',sources:[{referenceType:'OFFICIAL_CODE_CONTEXT'}]},{code:'TWO',sources:[{referenceType:'REGISTRATION_PAGE'}]}]}}}];
 assert.deepEqual(summarizeSourceGaps(gaps,articles),{original:3,linked:1,unconfirmed:2});
 articles[0].source.gamePeriodModel.records[1].sources.push({referenceType:'THIRD_PARTY_CASE_VARIANT'});
 assert.deepEqual(summarizeSourceGaps(gaps,articles),{original:3,linked:2,unconfirmed:1});
});
