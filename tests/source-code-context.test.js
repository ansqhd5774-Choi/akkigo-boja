import test from 'node:test';
import assert from 'node:assert/strict';
import {observeDeclaredCode} from '../src/source-code-context.js';
test('reward words do not establish a code declaration',()=>{
 assert.equal(observeDeclaredCode('<li>LAiOSLA - Survivor Recruit Ticket x2</li>','SURVIVOR').state,'CODE_DECLARATION_NOT_OBSERVED');
 assert.equal(observeDeclaredCode('<li>Survivor Recruit Ticket x2</li>','SURVIVOR').state,'CODE_DECLARATION_NOT_OBSERVED');
 assert.equal(observeDeclaredCode('<tr><td>LAiOSLA</td><td>Survivor Recruit Ticket x2</td></tr>','SURVIVOR').state,'CODE_DECLARATION_NOT_OBSERVED');
});
test('list and table code declarations preserve casing evidence',()=>{
 assert.equal(observeDeclaredCode('<li><b>LAiOSLA</b> – rewards</li>','LAiOSLA').state,'EXACT_CODE_DECLARATION');
 assert.equal(observeDeclaredCode('<tr><td>01</td><td>VIP777</td><td>Gems</td></tr>','VIP777').state,'EXACT_CODE_DECLARATION');
 assert.deepEqual(observeDeclaredCode('<li>HearDuck - rewards</li>','HEARDUCK'),{state:'CASE_VARIANT_DECLARATION',observedSpelling:'HearDuck'});
 assert.equal(observeDeclaredCode('<script><code>FAKE</code></script>','FAKE').state,'CODE_DECLARATION_NOT_OBSERVED');
});

test('Japanese gift-code labelled paragraphs preserve exact tokens and reject ordinary prose',()=>{
 assert.equal(observeDeclaredCode('<p>ギフトコード：<strong>AJISAI26JP</strong><br>有効期限：未確認</p>','AJISAI26JP').state,'EXACT_CODE_DECLARATION');
 assert.equal(observeDeclaredCode('<p>ギフトコード：AJISAI26JP</p>','AJISAI26').state,'CODE_DECLARATION_NOT_OBSERVED');
 assert.deepEqual(observeDeclaredCode('<p>ギフトコード：syunnbun26jp</p>','SYUNNBUN26JP'),{state:'CASE_VARIANT_DECLARATION',observedSpelling:'syunnbun26jp'});
 assert.equal(observeDeclaredCode('<p>ギフトコードの報酬にはSURVIVORが含まれます</p>','SURVIVOR').state,'CODE_DECLARATION_NOT_OBSERVED');
 assert.equal(observeDeclaredCode('<script><p>ギフトコード：FAKE</p></script>','FAKE').state,'CODE_DECLARATION_NOT_OBSERVED');
});
