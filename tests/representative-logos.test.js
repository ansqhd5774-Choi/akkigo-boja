import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import logos from '../data/representative-logos.json' with {type:'json'};
import {validateRepresentativeLogo} from '../src/representative-logo-policy.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

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
