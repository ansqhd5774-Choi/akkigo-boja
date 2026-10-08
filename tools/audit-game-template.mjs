import {readFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {renderGameCouponTable} from '../src/game-coupon-table.js';

// Read-only inventory: this does not approve, publish, or rewrite an article.
const rows = [];
for (const name of ['articles.json', 'articles-supplemental.json']) {
  const catalog = JSON.parse(await readFile(new URL('../data/' + name, import.meta.url), 'utf8'));
  for (const article of catalog) {
    if (!article.post?.labels?.includes('게임')) continue;
    const html = article.post.content || '';
    rows.push({articleKey: article.articleKey,
      layout: html.includes('ncp-year-tabs') ? 'period-tabs'
        : html.includes('aniimo-tab-current') ? 'content-tabs' : 'sections',
      declaredTimeline: Boolean(article.source?.gameCouponTimeline),
      copyButtons: [...html.matchAll(/data-ncp-copy="([^"]+)"/g)].length});
  }
}
const samples = [];
const input = Array.from({length:163}, (_, i) => ({code:'BENCH_' + i, source:'測定用', expiry:'測定用'}));
for (let i = 0; i < 100; i++) {
  const start = performance.now();
  renderGameCouponTable(input);
  samples.push(performance.now() - start);
}
samples.sort((a,b) => a-b);
console.log(JSON.stringify({scope:'source-only; no publication', total:rows.length,
  counts:Object.fromEntries(['period-tabs','content-tabs','sections'].map(kind =>
    [kind, rows.filter(row => row.layout === kind).length])), articles:rows,
  benchmark:{rows:163, iterations:100, medianMs:samples[50], p95Ms:samples[95],
    limitation:'table generation only; excludes research, review, tests and publishing'}}, null, 2));
