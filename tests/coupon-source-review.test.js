import {test} from 'node:test';
import assert from 'node:assert/strict';
import {containsCode,observeSource,articleSourceCandidates} from '../src/coupon-source-review.js';
test('source mention excludes prefix matches and hidden script data',()=>{
 assert.equal(containsCode('LUCKYDISCORD30K','LUCKYDISCORD'),false);
 assert.equal(containsCode('Code: SAKURASPIKE! now','SAKURASPIKE!'),true);
 const s=observeSource({url:'https://example.org',status:200,checkedAt:'2026-10-10',codes:['ABC'],html:'<script>ABC</script><p>'+('ordinary text '.repeat(15))+'</p>'});
 assert.equal(s.codes[0].state,'MENTION_NOT_FOUND');
});
test('denied or challenge pages never imply expiry or changed source',()=>{
 const s=observeSource({url:'https://example.org',status:403,html:'expired ABC',checkedAt:'2026-10-10',codes:['ABC'],previous:{fingerprint:'old'}});
 assert.equal(s.state,'ACCESS_UNVERIFIED');assert.equal(s.changed,null);assert.equal(s.codes[0].state,'UNVERIFIED');
});
test('article links remain candidates rather than fabricated code sources',()=>{
 assert.deepEqual(articleSourceCandidates({guideHTML:'<a href="https://example.org/x?a=1&amp;b=2">source</a><a href="https://lsifl.blogspot.com/x">related</a>'}),['https://example.org/x?a=1&b=2']);
});
test('source changes create review candidates without coupon status mutation',()=>{
 const input={url:'https://example.org',status:200,checkedAt:'2026-10-10',codes:['ABC'],html:'<p>ABC '+('ordinary text '.repeat(15))+'</p>'};
 const first=observeSource(input);assert.equal(first.changed,null);
 assert.equal(observeSource({...input,previous:first}).changed,false);
 const changed=observeSource({...input,html:input.html+' new claim',previous:first});
 assert.equal(changed.changed,true);assert.equal(changed.codes[0].state,'MENTION_FOUND');
 assert.equal(changed.expired,undefined);
});
