import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {currentArticleCatalog,assertArticleCatalogIntegrity} from '../src/article-catalog.js';
import {auditArticleRegistry,assertApprovedRequestInCatalog} from '../tools/check-article-registry.mjs';

test('all approved module articles are reachable through the single article registry',async()=>{
  const audit=await auditArticleRegistry();
  for(const key of ['gigaip-benefits-202610','ohmyzip-benefits-202610']){
    assert.ok(audit.discovered.includes(key),key);
    assert.ok(audit.registered.includes(key),key);
    assert.equal(currentArticleCatalog.filter(x=>x.articleKey===key).length,1,key);
  }
  assert.ok(audit.registered.includes('dragon-village3-codes-202610'));
  assert.equal(currentArticleCatalog.filter(x=>x.articleKey==='dragon-village3-codes-202610').length,1);
});

test('canonical migration supersedes the legacy registration without weakening duplicate detection',()=>{
  assert.equal(currentArticleCatalog.filter(x=>x.articleKey==='dragon-village3-codes-202610').length,1);
  const sample=currentArticleCatalog[0];
  assert.throws(()=>assertArticleCatalogIntegrity([sample,sample]),/ARTICLE_REGISTRY_DUPLICATE_KEY:/);
});

test('worker readiness and publisher consume the shared registry instead of private catalogs',async()=>{
  const files=['../src/worker.js','../tools/check-article-readiness.mjs','../tools/publish-approved-requests.mjs'];
  for(const file of files){
    const text=await readFile(new URL(file,import.meta.url),'utf8');
    assert.match(text,/currentArticleCatalog.*article-catalog\.js/);
    assert.doesNotMatch(text,/const articleCatalogBase=/);
  }
});

test('approved publish requests fail before publication when the article is absent from the registry',()=>{
  assert.equal(assertApprovedRequestInCatalog({approved:true,articleKey:'gigaip-benefits-202610'}).articleKey,'gigaip-benefits-202610');
  assert.throws(
    ()=>assertApprovedRequestInCatalog({approved:true,articleKey:'missing-approved-article'}),
    /PUBLISH_REQUEST_ARTICLE_NOT_IN_REGISTRY:missing-approved-article/
  );
});
