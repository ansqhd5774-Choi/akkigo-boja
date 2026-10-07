import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
test('로밍도깨비 10월 글은 신규 5%·더블팩 5%·친구초대를 구분한다',()=>{
 const article=articles.find(x=>x.articleKey==='rokebi-promo-202610'); assert.ok(article);
 assert.deepEqual(article.post.labels,['유심·로밍','로밍도깨비']);
 const html=readFileSync(new URL('../drafts/rokebi-promo-202610.html',import.meta.url),'utf8').trim();
 assert.equal(article.post.content,html);
 assert.match(html,/WELCOME COUPON/); assert.match(html,/더블팩 5%/); assert.match(html,/500캐시/); assert.match(html,/150개국/);
 assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
 assert.match(html,/<!--more-->/);
 assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|내부 운영 상태/);
});