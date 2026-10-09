import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {renderServiceBenefitArticle} from '../src/service-benefit-article.js';
import {malhaevocaArticle} from '../src/malhaevoca-article.js';
import {duolingoArticle} from '../src/duolingo-article.js';
import {validateArticleDraft} from './validate-article-draft.mjs';
const url=new URL('../data/articles.json',import.meta.url);
const catalog=JSON.parse(await readFile(url,'utf8'));
const keys=['hackers-gosi-direct-codes-202610','fastcampus-rag-code-202610'];
for(const key of keys){const a=catalog.find(a=>a.articleKey===key);if(!a)throw Error('EDUCATION_ARTICLE_MISSING');a.post.content=renderServiceBenefitArticle(key,a.post.content);validateArticleDraft(a);await writeFile(new URL('../drafts/'+key+'.html',import.meta.url),a.post.content+'\n');const draftUrl=new URL('../drafts/'+key+'.json',import.meta.url);const draft=JSON.parse(await readFile(draftUrl,'utf8'));draft.post.content=a.post.content;await writeFile(draftUrl,JSON.stringify(draft,null,2)+'\n');}
await writeFile(url,JSON.stringify(catalog,null,2)+'\n');
await mkdir(new URL('../output/education-preview/',import.meta.url),{recursive:true});
for(const a of [...catalog.filter(a=>keys.includes(a.articleKey)),malhaevocaArticle,duolingoArticle]){
 validateArticleDraft(a);
 await writeFile(new URL('../output/education-preview/'+a.articleKey+'.html',import.meta.url),'<!DOCTYPE html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+a.post.title+'</title><body style="margin:24px auto;max-width:1100px;padding:0 16px"><h1 style="font:700 24px system-ui">'+a.post.title+'</h1>'+a.post.content+'</body></html>');
 console.log('EDUCATION_VALIDATED',a.articleKey);
}
