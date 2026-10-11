import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import baseLogos from '../data/representative-logos.json' with {type:'json'};
import {currentArticleCatalog} from '../src/article-catalog.js';
import {representativeLogoRegistry,validateRepresentativeLogo} from '../src/representative-logo-policy.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {auditRepresentativeImages} from '../tools/audit-representative-images.mjs';

test('registered representative logos are the first article image and packaged local assets remain present',()=>{
 assert.equal(new Set(representativeLogoRegistry.map(x=>x.articleKey)).size,representativeLogoRegistry.length);
 const baseKeys=new Set(baseLogos.map(x=>x.articleKey));
 for(const logo of representativeLogoRegistry){
  const article=currentArticleCatalog.find(x=>x.articleKey===logo.articleKey);assert.ok(article,logo.articleKey);
  validateRepresentativeLogo(article);
  if(baseKeys.has(logo.articleKey)&&logo.logoUrl.startsWith('https://akkigo-boja.ansqhd5774.workers.dev/logos/')){
   assert.ok(fs.existsSync('theme/assets'+new URL(logo.logoUrl).pathname),logo.articleKey);
  }
  const mutated=article.post.content.replace(/(<img\b[^>]*\bsrc=")[^"]+/i,'$1https://example.com/promo.png');
  assert.notEqual(mutated,article.post.content,logo.articleKey);
  assert.throws(()=>validateRepresentativeLogo({...article,post:{...article.post,content:mutated}}),/REPRESENTATIVE_LOGO_MISMATCH/);
 }
});

test('existing commerce logo refresh passes publish validation while repeated headings are rejected',()=>{
 for(const logo of representativeLogoRegistry){
  const article=currentArticleCatalog.find(x=>x.articleKey===logo.articleKey);assert.ok(article,logo.articleKey);validateArticleDraft(article);
 }
 const article=currentArticleCatalog.find(x=>x.articleKey==='namecheap-birthday-202610');
 assert.ok(article);
 assert.throws(()=>validateArticleDraft({...article,post:{...article.post,content:article.post.content+'<h1>duplicate</h1>'}}),/ARTICLE_DUPLICATE_TITLE/);
});

test('approved non-game publication requires an official brand/service logo registry entry',()=>{
 const article={articleKey:'brand-demo',approvedForPublish:true,post:{title:'Brand',labels:['VPN'],content:'<p>benefit</p>'}};
 assert.throws(()=>validateRepresentativeLogo(article,{required:true,allowLegacy:false,strictSource:true,registry:[]}),/REPRESENTATIVE_LOGO_REQUIRED:brand-demo/);
});

test('promotional or event assets cannot be promoted to representative company logos',()=>{
 const logo={articleKey:'brand-demo',kind:'OFFICIAL_BRAND_LOGO',logoUrl:'https://brand.example/logo.svg',sourceUrl:'https://brand.example/',sourceAsset:'https://brand.example/images/banner/sale-event.jpg'};
 const article={articleKey:'brand-demo',approvedForPublish:true,post:{title:'Brand',labels:['VPN'],content:'<img src="https://brand.example/logo.svg" data-ncp-brand-logo="true" alt="Brand">'}};
 assert.throws(()=>validateRepresentativeLogo(article,{required:true,allowLegacy:false,strictSource:true,registry:[logo]}),/REPRESENTATIVE_LOGO_SUSPICIOUS_SOURCE:brand-demo/);
});

test('official company logo must be the first article image',()=>{
 const logo={articleKey:'brand-demo',kind:'OFFICIAL_SERVICE_LOGO',logoUrl:'https://brand.example/logo.svg',sourceUrl:'https://brand.example/',sourceAsset:'https://brand.example/assets/logo.svg'};
 const valid={articleKey:'brand-demo',approvedForPublish:true,post:{title:'Brand',labels:['VPN'],content:'<img src="https://brand.example/logo.svg" data-ncp-brand-logo="true" alt="Brand"><img src="https://brand.example/product.jpg" alt="product">'}};
 assert.equal(validateRepresentativeLogo(valid,{required:true,allowLegacy:false,strictSource:true,registry:[logo]}),true);
 const invalid={...valid,post:{...valid.post,content:'<img src="https://brand.example/product.jpg" alt="product"><img src="https://brand.example/logo.svg" data-ncp-brand-logo="true" alt="Brand">'}};
 assert.throws(()=>validateRepresentativeLogo(invalid,{required:true,allowLegacy:false,strictSource:true,registry:[logo]}),/REPRESENTATIVE_LOGO_MISMATCH:brand-demo/);
});

test('game articles remain under the official app-icon policy rather than company-logo policy',()=>{
 const game={articleKey:'game-demo',approvedForPublish:true,post:{title:'Game',labels:['게임','Game'],content:'<p>game body</p>'}};
 assert.equal(validateRepresentativeLogo(game,{required:true,allowLegacy:false,strictSource:true,registry:[]}),true);
});

test('approved non-game representative image audit requires zero current debt',()=>{
 const audit=auditRepresentativeImages();
 assert.ok(audit.total>0);
 assert.equal(audit.rows.length,audit.total);
 assert.deepEqual([...audit.missing].sort(),[]);
 assert.deepEqual([...audit.suspicious].sort(),[]);
 assert.deepEqual([...audit.firstImageMismatch].sort(),[]);
 assert.equal(audit.fail,0);
 const missingDetails=audit.rows.filter(row=>row.issues.includes('MISSING_REGISTRY')).map(({articleKey,title,labels,sourceUrl,firstImageSrc})=>({articleKey,title,labels,sourceUrl,firstImageSrc}));
 const suspiciousDetails=audit.rows.filter(row=>row.issues.includes('SUSPICIOUS_SOURCE_ASSET')).map(({articleKey,title,registeredSourceAsset})=>({articleKey,title,registeredSourceAsset}));
 console.log('REPRESENTATIVE_IMAGE_AUDIT_TEST',JSON.stringify({total:audit.total,pass:audit.pass,fail:audit.fail,missing:audit.missing,legacy:audit.legacy,suspicious:audit.suspicious,firstImageMismatch:audit.firstImageMismatch,missingDetails,suspiciousDetails}));
});
