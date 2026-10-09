import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {inspectConsistency, compareUrlSets, samePublishedSecond} from '../src/search-consistency.js';

const base = 'https://lsifl.blogspot.com/';
const audit = JSON.parse(await readFile('output/search-foundation-audit.json', 'utf8'));
async function read(url) {
  const response = await fetch(url, {signal: AbortSignal.timeout(20000)});
  if (!response.ok) throw Error(`PUBLIC_READ_FAILED_${response.status}`);
  return {text: await response.text(), finalUrl: response.url};
}
const [sitemap, feed] = await Promise.all([
  read(base + 'sitemap.xml'),
  read(base + 'feeds/posts/default?alt=json&max-results=500')
]);
const sitemapUrls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
const feedData = JSON.parse(feed.text).feed;
const entries = [...(feedData.entry || [])];
const total = Number(feedData['openSearch$totalResults']?.$t);
if (!Number.isFinite(total) || total > 500) throw Error('PUBLIC_FEED_SIZE_UNSUPPORTED');
while (entries.length < total) {
  const next = JSON.parse((await read(base + `feeds/posts/default?alt=json&max-results=20&start-index=${entries.length + 1}`)).text).feed;
  const batch = next.entry || [];
  if (!batch.length || Number(next['openSearch$totalResults']?.$t) !== total) throw Error('PUBLIC_FEED_CHANGED_OR_EMPTY');
  const ids = new Set(entries.map(entry => entry.id.$t));
  if (batch.some(entry => ids.has(entry.id.$t))) throw Error('PUBLIC_FEED_PAGE_REPEATED');
  entries.push(...batch);
}
if (!Number.isFinite(total) || total !== entries.length) throw Error('PUBLIC_FEED_INCOMPLETE');
const feedUrls = entries.map(entry => entry.link.find(link => link.rel === 'alternate' && link.type === 'text/html')?.href);
if (feedUrls.some(url => !url || new URL(url).origin !== new URL(base).origin)) throw Error('PUBLIC_FEED_URL_INVALID');
const sitemapDates = new Map([...sitemap.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => [
  match[1].match(/<loc>([^<]+)<\/loc>/)?.[1], match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]
]));
const dateIssues = entries.flatMap((entry, index) => {
  const lastmod = sitemapDates.get(feedUrls[index]);
  const updated = entry.updated?.$t;
  // Blogger sitemap has second precision; the feed retains milliseconds.
  return !samePublishedSecond(updated, lastmod)
    ? [{url: feedUrls[index], lastmod: lastmod || null, updated: updated || null}] : [];
});
const report = {
  checkedAt: new Date().toISOString(), pageAuditCheckedAt: audit.checkedAt,
  scope: 'PUBLIC_FEED_SITEMAP_AND_STATIC_PAGE_METADATA',
  providerLedger: 'UNVERIFIED', googleSelectedCanonical: 'UNVERIFIED',
  counts: {sitemap: sitemapUrls.length, feed: feedUrls.length, pages: audit.pages.length},
  sitemapVsFeed: compareUrlSets(feedUrls, sitemapUrls),
  auditedVsSitemap: compareUrlSets(sitemapUrls, audit.pages.map(page => page.url)),
  sitemapVsFeedDateIssues: dateIssues,
  ...inspectConsistency(audit.pages)
};
await mkdir('output', {recursive: true});
await writeFile('output/search-consistency-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({...report, sitemapVsFeedDateIssues: dateIssues.length}));
if (report.canonicalIssues.length || report.duplicateDescriptions.length || report.sitemapVsFeed.missing.length || report.sitemapVsFeed.extra.length) process.exitCode = 1;
