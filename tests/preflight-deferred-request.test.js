import test from 'node:test';
import assert from 'node:assert/strict';
import {approvedRequestKey} from '../tools/check-article-readiness.mjs';
test('a deferred identity mismatch does not enter the mutation preflight cohort',()=>{
 assert.equal(approvedRequestKey({approved:false,articleKey:'esim4travel-promo-202610'}),null);
 assert.equal(approvedRequestKey({approved:true,articleKey:'valid-article'}),'valid-article');
 assert.throws(()=>approvedRequestKey({articleKey:'missing-approval'}),/NOT_APPROVED/);
});
