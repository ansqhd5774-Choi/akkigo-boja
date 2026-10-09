import test from 'node:test';
import assert from 'node:assert/strict';
import {annotateSourceHealth} from '../src/source-health.js';
test('confirmed 404 preserves citation identity without a broken clickable destination',()=>{
 const out=annotateSourceHealth('<a href="https://example.org/dead?a=1&amp;b=2">과거 근거</a>',[{url:'https://example.org/dead?a=1&b=2',status:404,checkedDate:'2026-10-10'}]);
 assert.ok(!out.includes('<a '));assert.ok(out.includes('data-source-original-url="https://example.org/dead?a=1&amp;b=2"'));assert.ok(out.includes('과거 근거'));assert.ok(!out.includes('만료'));
});
test('restricted sources retain usable links and do not imply expired coupons',()=>{
 const input='<a href="https://example.org/private">공식 근거</a>';
 const out=annotateSourceHealth(input,[{url:'https://example.org/private',status:403,checkedDate:'2026-10-10'}]);
 assert.ok(out.includes(input));assert.ok(out.includes('재확인'));assert.ok(!out.includes('만료'));
 assert.equal(annotateSourceHealth(input,[]),input);
});
