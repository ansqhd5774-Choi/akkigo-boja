import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectSourceContent} from '../src/source-content-review.js';
test('HTTP 200 challenge and missing code never become verified coupon evidence',()=>{
 const r=inspectSourceContent({url:'https://a.example/code',finalUrl:'https://a.example/code',status:200,html:'<title>Just a moment</title><p>Verify you are human</p>',expectedCodes:['CODE1']});
 assert.ok(r.flags.includes('ACCESS_CHALLENGE_SUSPECTED'));assert.ok(r.flags.includes('EXPECTED_CODE_NOT_OBSERVED'));assert.equal(r.claimVerified,false);assert.equal(r.accountInputVerified,false);
});
test('redirect and changed body require review while unchanged body avoids change flag',()=>{
 const input={url:'https://a.example/code',finalUrl:'https://a.example/code',status:200,html:'<title>Codes</title><p>'+('current code CODE1 '.repeat(20))+'</p>',expectedCodes:['CODE1']};
 const baseline=inspectSourceContent(input);
 assert.deepEqual(inspectSourceContent({...input,previousHash:baseline.contentHash}).flags,[]);
 const changed=inspectSourceContent({...input,finalUrl:'https://b.example/',html:'<title>404 page not found</title>',previousHash:baseline.contentHash});
 assert.ok(changed.flags.includes('SOFT_404_SUSPECTED'));assert.ok(changed.flags.includes('CROSS_HOST_REDIRECT_REVIEW'));assert.ok(changed.flags.includes('CONTENT_CHANGED_REVIEW'));
});
