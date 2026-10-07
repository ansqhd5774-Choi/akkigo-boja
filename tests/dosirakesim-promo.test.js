import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
test('도시락eSIM 10월 글은 20% 자동할인·신규 적립·통화 포인트를 구분한다',()=>{
 const article=articles.find(x=>x.articleKey==='dosirakesim-promo-202610'); assert.ok(article);
 assert.deepEqual(article.post.labels,['유심·로밍','도시락eSIM']);
 const html=readFileSync(new URL('../drafts/dosirakesim-promo-202610.html',import.meta.url),'utf8').trim();
 assert.equal(article.post.content,html);
 assert.match(html,/일본 소프트뱅크 eSIM 20%/); assert.match(html,/베트남 비나폰 eSIM 20%/);
 assert.match(html,/1,000P/); assert.match(html,/8,000P/); assert.match(html,/ISIC/); assert.match(html,/5% 할인/);
 assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
 assert.match(html,/<!--more-->/);
 assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|내부 운영 상태/);
});