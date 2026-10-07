import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {articleSnapshot} from '../src/article-snapshot.js';
import {probeSnapshots} from '../tools/check-article-readiness.mjs';
import {renderGameCouponTable,renderGameCouponGridCss,renderGameAppIcon} from '../tools/game-coupon-components.mjs';
const all=[...articles,...supplemental];
const key='outerplane-codes-202610';
test('approved source fingerprint is deterministic and changes with body',async()=>{
 const article=all.find(a=>a.articleKey===key);
 const a=await articleSnapshot(key,all), b=await articleSnapshot(key,all);
 assert.equal(a.approved,true);
 assert.match(a.postSha256,/^[0-9a-f]{64}$/);
 assert.deepEqual(a,b);
 const updated={...article,post:{...article.post,content:article.post.content+'changed'}};
 const c=await articleSnapshot(key,[updated]);
 assert.notEqual(a.postSha256,c.postSha256);
 assert.deepEqual(await articleSnapshot('not-approved',all),{articleKey:'not-approved',approved:false});
});
test('matching remote version skips redundant deployment without mutating Blogger',async()=>{
 const version=await articleSnapshot(key,all);
 let calls=0;
 const result=await probeSnapshots([key],{token:'test-oidc',transport:async(url,init)=>{
  calls++; assert.ok(url.endsWith('/preflight'));assert.equal(init.method,'POST');
  assert.equal(JSON.parse(init.body).articleKey,key);
  return Response.json(version);
 }});
 assert.equal(result.ready,true);assert.equal(calls,1);
});
test('transient stale Worker is retried ONLY by read-only preflight',async()=>{
 const version=await articleSnapshot(key,all);
 let calls=0,waits=0;
 const result=await probeSnapshots([key],{token:'test-oidc',attempts:3,delayMs:1,sleep:async()=>{waits++;},transport:async(url)=>{
  calls++;assert.ok(url.includes('/preflight'));
  return Response.json(calls===1?{...version,postSha256:'0'.repeat(64)}:version);
 }});
 assert.equal(result.ready,true);assert.equal(calls,2);assert.equal(waits,1);
});
test('source mismatch fails closed; auth failures are never retried',async()=>{
 const mismatch=await probeSnapshots([key],{token:'fixture',attempts:1,transport:async()=>Response.json({articleKey:key,approved:false})});
 assert.equal(mismatch.ready,false);
 let calls=0;
 await assert.rejects(probeSnapshots([key],{token:'fixture',attempts:3,transport:async()=>{calls++;return new Response('no',{status:401});}}),/PREFLIGHT_AUTH_FAILED/);
 assert.equal(calls,1);
});
test('shared components generate approved 5-column 68px tables and official square app icon',()=>{
 const key='new-game';
 const rows=[{code:'WELCOME2026',source:'공식',expiry:'2026-12-31'},{code:'DUCK777',source:'커뮤니티'}];
 const table=renderGameCouponTable(rows,{start:1});
 const style=renderGameCouponGridCss(key);
 assert.equal((table.match(/role="columnheader"/g)||[]).length,5);
 assert.equal((table.match(/class="ncp-code-card" role="row"/g)||[]).length,2);
 assert.equal((table.match(/data-ncp-copy=/g)||[]).length,2);
 assert.ok(style.includes('height:68px;min-height:68px'));
 assert.ok(style.includes('grid-template-columns:46px 116px 108px minmax(0,1fr) 74px'));
 assert.ok(style.includes('grid-template-columns:26px 61px 63px minmax(0,1fr) 54px'));
 assert.throws(()=>renderGameCouponTable([{code:'AA'},{code:'AA'}]),/DUPLICATE/);
 const fig=renderGameAppIcon({articleKey:key,gameName:'New Game',iconUrl:'https://is1-ssl.mzstatic.com/icon.png',appStoreUrl:'https://apps.apple.com/app/id123'});
 assert.ok(fig.includes('data-ncp-app-icon="true"'));
 assert.ok(fig.includes('aspect-ratio:1/1'));
 assert.ok(fig.includes('data-ncp-featured-image="new-game"'));
});
test('workflow enforces source match both before repair and after deploy, never retries mutation',()=>{
 const y=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
 const before=y.indexOf('Read-only Worker source check before repair');
 const repair=y.indexOf('Repair Worker deployment when required');
 const after=y.indexOf('Confirm exact Worker source before any Blogger mutation');
 const publish=y.indexOf('Publish only changed approved requests');
 assert.ok(before>0 && repair>before && after>repair && publish>after);
 assert.ok(y.includes('worker_ready'));
 assert.ok(y.includes('--once')&&y.includes('--wait'));
 const p=readFileSync(new URL('../tools/publish-approved-requests.mjs',import.meta.url),'utf8');
 assert.ok(p.includes('postSha256:source.postSha256'));
 assert.equal((p.match(/\/internal\/articles\/publish/g)||[]).length,1);
 const worker=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');
 assert.ok(worker.includes("/internal/articles/preflight"));
 assert.ok(worker.indexOf('ARTICLE_SNAPSHOT_MISMATCH')<worker.indexOf('publishApprovedArticle(env,'));
});
