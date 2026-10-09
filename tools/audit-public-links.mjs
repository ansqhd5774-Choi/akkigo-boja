import {readFile, writeFile} from 'node:fs/promises';
import {safeInternalTarget, bodySignals} from '../src/public-link-audit.js';
const base = 'https://lsifl.blogspot.com/';
const audit = JSON.parse(await readFile('output/search-foundation-audit.json', 'utf8'));
const targets = new Set([base, ...audit.pages.flatMap(page => [page.url, ...page.anchors])].map(url => safeInternalTarget(url, base)).filter(Boolean));
if (targets.size > 250) throw Error('AUDIT_REQUEST_LIMIT');
const results = [];
for (let start = 0, urls = [...targets]; start < urls.length; start += 4) {
  await Promise.all(urls.slice(start, start + 4).map(async url => {
    let current = url;
    const chain = [];
    try {
      for (let hop = 0; hop < 6; hop++) {
        if (chain.some(step => step.url === current)) throw Error('REDIRECT_LOOP');
        const response = await fetch(current, {redirect: 'manual', signal: AbortSignal.timeout(20000)});
        chain.push({url: current, status: response.status});
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get('location');
          current = location && safeInternalTarget(location, current);
          if (!current) throw Error('REDIRECT_OUTSIDE_AUDIT_SCOPE');
          await response.body?.cancel();
          continue;
        }
        const signals = bodySignals(await response.text(), current);
        results.push({url, finalUrl: current, status: response.status, chain, ...signals});
        return;
      }
      throw Error('REDIRECT_LIMIT');
    } catch (error) { results.push({url, chain, error: error.message}); }
  }));
}
const report = {checkedAt: new Date().toISOString(), scope: 'PUBLIC_INTERNAL_STATIC_ANCHORS_ONLY', sourceAuditCheckedAt: audit.checkedAt,
  externalLinks: 'NOT_CHECKED', googleSoft404Classification: 'UNVERIFIED',
  summary: {targets: targets.size, httpErrors: results.filter(row => row.status && row.status !== 200).length,
    fetchOrRedirectErrors: results.filter(row => row.error).length, soft404Candidates: results.filter(row => row.soft404Candidate).length,
    redirected: results.filter(row => row.chain.length > 1).length}, results};
await writeFile('output/public-link-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary));
if (report.summary.httpErrors || report.summary.fetchOrRedirectErrors || report.summary.soft404Candidates) process.exitCode = 1;
