export function normalizePublicUrl(value, base) {
  const url = new URL(value, base);
  if (!['http:', 'https:'].includes(url.protocol)) throw Error('UNSUPPORTED_URL');
  url.hash = '';
  return url.href;
}

export function compareUrlSets(expected, actual) {
  const wanted = new Set(expected);
  const found = new Set(actual);
  return {missing: [...wanted].filter(url => !found.has(url)), extra: [...found].filter(url => !wanted.has(url))};
}

export function samePublishedSecond(a, b) {
  const first = Date.parse(a);
  const second = Date.parse(b);
  return Number.isFinite(first) && Number.isFinite(second) && Math.floor(first / 1000) === Math.floor(second / 1000);
}

export function inspectConsistency(pages) {
  const canonicalIssues = [];
  const descriptions = new Map();
  for (const page of pages) {
    try {
      if (page.canonical.length !== 1 || normalizePublicUrl(page.canonical[0], page.url) !== page.url) {
        canonicalIssues.push({url: page.url, canonical: page.canonical, reason: 'CANONICAL_MISMATCH'});
      }
    } catch {
      canonicalIssues.push({url: page.url, canonical: page.canonical, reason: 'INVALID_CANONICAL'});
    }
    const description = page.descriptions.length === 1 ? page.descriptions[0].replace(/\s+/g, ' ').trim() : '';
    if (description) descriptions.set(description, [...(descriptions.get(description) || []), page.url]);
  }
  return {canonicalIssues, duplicateDescriptions: [...descriptions].filter(([, urls]) => urls.length > 1).map(([description, urls]) => ({description, urls}))};
}
