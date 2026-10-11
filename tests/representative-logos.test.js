import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import logos from '../data/representative-logos.json' with {type:'json'};
import {validateRepresentativeLogo} from '../src/representative-logo-policy.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
import {auditRepresentativeImages} from '../tools/audit-representative-images.mjs';

test('registered representative logos are the first article image and have packaged assets',()=>{
 const articles=['data/articles.json','data/articles-supplemental.json'].flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')));
 assert.equal(new Set(logos.map(x=>x.articleKey)).size,logos.length);
 for(const logo of logos){
  const article=articles.find(x=>x.articleKey===logo.articleKey);assert.ok(article,logo.articleKey);
  validateRepresentativeLogo(article);
  assert.ok(fs.existsSync('theme/assets'+new URL(logo.logoUrl).pathname));
  assert.throws(()=>validateRepresentativeLogo({...article,post:{...article.post,content:article.post.content.replace(logo.logoUrl,'https://example.com/promo.png')}}),/REPRESENTATIVE_LOGO_MISMATCH/);
 }
});

test('existing commerce logo refresh passes publish validation while repeated headings are rejected',()=>{
 const articles=JSON.parse(fs.readFileSync('data/articles.json','utf8'));
 for(const logo of logos)validateArticleDraft(articles.find(x=>x.articleKey===logo.articleKey));
 const article=articles.find(x=>x.articleKey==='namecheap-birthday-202610');
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

test('approved non-game representative image audit reports current debt and forbids any new image regression',()=>{
 const audit=auditRepresentativeImages();
 assert.ok(audit.total>0);
 assert.equal(audit.rows.length,audit.total);
 const expectedMissing=[
  'duolingo-super-coupons-202610','frombio-coupons-202610'
 ].sort();
 assert.deepEqual([...audit.missing].sort(),expectedMissing);
 assert.deepEqual([...audit.suspicious].sort(),[]);
 assert.deepEqual([...audit.firstImageMismatch].sort(),[]);
 assert.equal(audit.fail,expectedMissing.length);
 const missingDetails=audit.rows.filter(row=>row.issues.includes('MISSING_REGISTRY')).map(({articleKey,title,labels,sourceUrl,firstImageSrc})=>({articleKey,title,labels,sourceUrl,firstImageSrc}));
 const suspiciousDetails=audit.rows.filter(row=>row.issues.includes('SUSPICIOUS_SOURCE_ASSET')).map(({articleKey,title,registeredSourceAsset})=>({articleKey,title,registeredSourceAsset}));
 console.log('REPRESENTATIVE_IMAGE_AUDIT_TEST',JSON.stringify({total:audit.total,pass:audit.pass,fail:audit.fail,missing:audit.missing,legacy:audit.legacy,suspicious:audit.suspicious,firstImageMismatch:audit.firstImageMismatch,missingDetails,suspiciousDetails}));
});
