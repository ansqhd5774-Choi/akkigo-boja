import {assertPeriodHTML} from './period-test-helpers.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles-supplemental.json' with {type:'json'};
import appIcons from '../data/game-app-icons.json' with {type:'json'};
import candidates from '../data/game-code-candidates.json' with {type:'json'};
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {validateGameCouponLayout} from '../src/game-code-layout-contract.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';
import {validateGameCandidateCoverage} from '../src/game-code-candidate-policy.js';

const key='lordrush-codes-202610';
const article=articles.find(x=>x.articleKey===key);
const codes=['Brook','Farmer','Lordrush2026','SummerVibes','Summer','Autumn','CommentUs5','LR777','LR888','LR999','WELCOME2024','LORD2024'];

test('Lordrush source, 5-column 68px layout, code copy coverage and jump break',()=>{
 assert.ok(article);
 assert.equal(article.approvedForPublish,true);
 assert.equal(article.post.title,'로드러쉬');
 assert.deepEqual(article.post.labels,['게임','로드러쉬']);
 const html=readFileSync(new URL('../drafts/'+key+'.html',import.meta.url),'utf8').trim();
 const snap=JSON.parse(readFileSync(new URL('../drafts/'+key+'.json',import.meta.url),'utf8'));
 assert.equal(html,article.post.content);
 assert.deepEqual(snap.post,article.post);
 assert.equal((html.match(/<!--more-->/g)||[]).length,1);
 assert.equal(html.includes('<h1'),false);
 const copies=[...html.matchAll(/data-ncp-copy="([^"]+)"/g)].map(x=>x[1]);
 assert.deepEqual(copies,codes);
 assert.equal(new Set(copies).size,12);
 assert.equal((html.match(/class="ncp-code-card" role="row"/g)||[]).length,12);
  assertPeriodHTML(html);
 assert.equal(validateGameCouponLayout(key,article.post),true);
 assert.equal(validateGameCandidateCoverage(article),true);
 assert.equal(validateArticleDraft(article),true);
});
test('Lordrush tabs switch real CSS panels; no link-only fake tabs',()=>{
 const html=article.post.content;
 assertPeriodHTML(html);
 for(const period of ['latest','2026','2025','2024'])assert.ok(html.includes('value="'+period+'"'));
 assert.equal((html.match(/type="radio"/g)||[]).length,4);
});
test('Lordrush icon has official App Store identity, and candidate statuses are unverified',()=>{
 const icon=appIcons.find(x=>x.articleKey===key);
 assert.equal(icon?.gameName,'로드러쉬');
 assert.equal(icon?.appStoreUrl,'https://apps.apple.com/us/app/lordrush/id6759788962');
 assert.equal((article.post.content.match(/data-ncp-featured-image=/g)||[]).length,1);
 assert.equal(validateGameFeaturedImage(key,article.post),true);
 const own=candidates.filter(x=>x.gameName==='로드러쉬');
 assert.equal(own.length,12);
 assert.equal(new Set(own.map(x=>x.code)).size,12);
 assert.ok(own.every(x=>x.status==='UNVERIFIED'&&x.sourceAuthority==='THIRD_PARTY'));
 for(const row of own)assert.ok(codes.includes(row.code),'missing '+row.code);
 assert.ok(article.post.content.includes('발급사 공식 발급 증거가 확보되지 않은'));
 assert.ok(!article.post.content.includes('실사용 미검증'));
});
