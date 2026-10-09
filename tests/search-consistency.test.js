import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compareUrlSets, inspectConsistency, samePublishedSecond} from '../src/search-consistency.js';

test('Blogger second precision accounts for timezones but rejects a different second or missing date', () => {
  assert.equal(samePublishedSecond('2026-10-10T02:45:37.382+09:00', '2026-10-09T17:45:37Z'), true);
  assert.equal(samePublishedSecond('2026-10-10T02:45:38+09:00', '2026-10-09T17:45:37Z'), false);
  assert.equal(samePublishedSecond(undefined, '2026-10-09T17:45:37Z'), false);
});

test('URL comparison preserves query variants and identifies missing and extra pages', () => {
  assert.deepEqual(compareUrlSets(['https://example.com/a'], ['https://example.com/a?m=1']), {
    missing: ['https://example.com/a'], extra: ['https://example.com/a?m=1']
  });
});

test('canonical audit rejects another page and non-http URLs; descriptions normalize whitespace', () => {
  const result = inspectConsistency([
    {url: 'https://example.com/a', canonical: ['/a'], descriptions: ['same   description']},
    {url: 'https://example.com/b', canonical: ['/a'], descriptions: ['same description']},
    {url: 'https://example.com/c', canonical: ['javascript:alert(1)'], descriptions: []}
  ]);
  assert.equal(result.canonicalIssues.length, 2);
  assert.deepEqual(result.duplicateDescriptions[0].urls, ['https://example.com/a', 'https://example.com/b']);
});
