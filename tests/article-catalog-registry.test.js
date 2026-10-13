import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {currentArticleCatalog,assertArticleCatalogIntegrity,mergeCanonicalAndLegacy} from '../src/article-catalog.js';
import {auditArticleRegistry,assertApprovedRequestInCatalog} from '../tools/check-article-registry.mjs';

test('all approved module articles are reachable through the single article registry',async()=>{
  const audit=await auditArticleRegistry();
  for(const key of audit.discovered){
    assert.ok(audit.registered.includes(key),key);
    assert.equal(currentArticleCatalog.filter(x=>x.articleKey===key).length,1,key);
  }
});

test('canonical migration supersedes legacy registration without weakening duplicate detection',()=>{
  const base=currentArticleCatalog[0];
  const canonical={...base,articleKey:'migration-fixture',post:'canonical'};
  const legacy={...base,articleKey:'migration-fixture',post:'legacy'};
  const legacyOnly={...base,articleKey:'legacy-only-fixture',post:'legacy-only'};
  const merged=mergeCanonicalAndLegacy([canonical],[legacy,legacyOnly]);
  assert.deepEqual(merged.map(x=>x.articleKey),['migration-fixture','legacy-only-fixture']);
  assert.equal(merged.find(x=>x.articleKey==='migration-fixture').post,'canonical');
  assert.equal(assertArticleCatalogIntegrity(merged),true);
  assert.throws(()=>assertArticleCatalogIntegrity([canonical,canonical]),/ARTICLE_REGISTRY_DUPLICATE_KEY:migration-fixture/);
  assert.throws(
    ()=>assertArticleCatalogIntegrity(mergeCanonicalAndLegacy([], [legacyOnly,{...legacyOnly}])),
    /ARTICLE_REGISTRY_DUPLICATE_KEY:legacy-only-fixture/
  );
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
