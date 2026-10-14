import test from 'node:test';
import assert from 'node:assert/strict';
import {serveRepresentativeLogo,representativeLogoProxySource} from '../src/representative-logo-proxy.js';
import {currentArticleCatalog} from '../src/article-catalog.js';

test('GIGA IP representative image uses the stable Worker URL while preserving official provenance',()=>{
  const article=currentArticleCatalog.find(x=>x.articleKey==='gigaip-benefits-202610');
  assert.ok(article);
  const first=article.post.content.match(/<img\b[^>]*>/i)?.[0]||'';
  assert.match(first,/https:\/\/akkigo-boja\.ansqhd5774\.workers\.dev\/logos\/gigaip-representative\.png/);
  assert.match(first,/data-ncp-brand-logo="true"/);
  assert.equal(representativeLogoProxySource('/logos/gigaip-representative.png'),'https://gigaip.net/resources/img/top_logo.png');
});

test('representative logo proxy returns only a successful image response',async()=>{
  const calls=[];
  const ok=await serveRepresentativeLogo('/logos/gigaip-representative.png',async(url,init)=>{
    calls.push({url,init});
    return new Response(new Uint8Array([137,80,78,71]),{status:200,headers:{'content-type':'image/png'}});
  });
  assert.equal(ok.status,200);
  assert.equal(ok.headers.get('content-type'),'image/png');
  assert.match(ok.headers.get('cache-control'),/max-age=86400/);
  assert.equal(calls.length,1);
  assert.equal(calls[0].url,'https://gigaip.net/resources/img/top_logo.png');

  const bad=await serveRepresentativeLogo('/logos/gigaip-representative.png',async()=>new Response('<html>blocked</html>',{status:200,headers:{'content-type':'text/html'}}));
  assert.equal(bad.status,502);
  assert.equal(await serveRepresentativeLogo('/logos/not-registered.png',async()=>{throw Error('must not fetch');}),null);
});
