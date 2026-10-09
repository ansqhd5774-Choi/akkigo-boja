import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectSourceContent,preserveReviewHistory} from '../src/source-content-review.js';
test('PDF requires binary review without pretending its body is empty HTML',()=>{
 const r=inspectSourceContent({url:'https://a.example/a.pdf',finalUrl:'https://a.example/a.pdf',status:200,html:'',contentType:'application/pdf',expectedCodes:['CODE']});
 assert.deepEqual(r.flags,['NON_HTML_CONTENT_REVIEW_REQUIRED']);assert.equal(r.contentHash,null);assert.equal(r.claimVerified,false);
});
test('manual review survives a later observation as historical evidence',()=>{
 const review={decision:'BROWSER_CONFIRMED'};
 const old={checkedAt:'2026-10-10',contentHash:'old',manualReview:review,manualReviewHistory:[{review:{decision:'EARLIER'}}]};
 const result=preserveReviewHistory(old);assert.equal(result.length,2);assert.deepEqual(result[1].review,review);assert.equal(old.manualReviewHistory.length,1);
});
test('ordinary reCAPTCHA footer does not mark useful content as an access challenge',()=>{
 const r=inspectSourceContent({url:'https://a.example/help',finalUrl:'https://a.example/help',status:200,html:'<title>How to apply a promo code</title><main>'+('Enter your code at checkout. '.repeat(8))+'</main><footer>This site is protected by reCAPTCHA.</footer>'});
 assert.ok(!r.flags.includes('ACCESS_CHALLENGE_SUSPECTED'));
 const challenge=inspectSourceContent({url:'https://a.example/',finalUrl:'https://a.example/',status:200,html:'<title>Prove your humanity</title>'});assert.ok(challenge.flags.includes('ACCESS_CHALLENGE_SUSPECTED'));
});
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
