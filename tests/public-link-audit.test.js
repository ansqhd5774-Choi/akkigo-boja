import {test} from 'node:test';
import assert from 'node:assert/strict';
import {safeInternalTarget, bodySignals} from '../src/public-link-audit.js';
test('link audit restricts requests to public internal pages and excludes arbitrary queries', () => {
  const base = 'https://example.com/';
  assert.equal(safeInternalTarget('/2026/10/a.html#coupon', base), base + '2026/10/a.html');
  for (const value of ['https://other.test/a', '/admin', '/?token=secret', 'javascript:alert(1)']) assert.equal(safeInternalTarget(value, base), null);
});
test('HTTP success without a Blogger post body is a soft404 candidate, not an indexing verdict', () => {
  const url = 'https://example.com/2026/10/a.html';
  assert.equal(bodySignals('<h1>Sorry, this page does not exist</h1>', url).soft404Candidate, true);
  assert.equal(bodySignals('<div id="post-body-123">coupon</div>', url).soft404Candidate, false);
});
