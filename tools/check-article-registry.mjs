import {readdir,readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {currentArticleCatalog,assertArticleCatalogIntegrity} from '../src/article-catalog.js';
import {changedRequestPaths} from './select-publish-requests.mjs';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'..');

export function assertApprovedRequestInCatalog(request,catalog=currentArticleCatalog){
  if(request?.approved===false)return null;
  if(request?.approved!==true || typeof request.articleKey!=='string' || !/^[a-z0-9-]{1,100}$/.test(request.articleKey)){
    throw new Error('LOCAL_REQUEST_NOT_APPROVED');
  }
  const matches=catalog.filter(x=>x.articleKey===request.articleKey);
  if(matches.length!==1 || matches[0]?.approvedForPublish!==true || !matches[0]?.post){
    throw new Error(`PUBLISH_REQUEST_ARTICLE_NOT_IN_REGISTRY:${request.articleKey}`);
  }
  return matches[0];
}

export async function discoverApprovedModuleKeys({srcDir=resolve(root,'src')}={}){
  const files=(await readdir(srcDir)).filter(name=>name.endsWith('-article.js')).sort();
  const keys=new Set();
  for(const name of files){
    const path=resolve(srcDir,name);
    const source=await readFile(path,'utf8');
    // Do not execute modules that are explicitly non-publishable. This keeps
    // the audit based on source intent and prevents runtime side effects from
    // promoting retained research/evidence modules such as OhMyZip.
    if(!/approvedForPublish\s*:\s*true\b/.test(source))continue;
    const mod=await import(pathToFileURL(path).href);
    for(const value of Object.values(mod)){
      if(value && typeof value==='object' && value.approvedForPublish===true && typeof value.articleKey==='string' && value.post){
        keys.add(value.articleKey);
      }
    }
  }
  return [...keys].sort();
}

export async function auditArticleRegistry(){
  assertArticleCatalogIntegrity(currentArticleCatalog);
  const registered=new Set(currentArticleCatalog.filter(x=>x.approvedForPublish===true).map(x=>x.articleKey));
  const discovered=await discoverApprovedModuleKeys();
  const missing=discovered.filter(key=>!registered.has(key));
  if(missing.length)throw new Error(`ARTICLE_REGISTRY_MISSING:${missing.join(',')}`);
  return {registered:[...registered].sort(),discovered};
}

export async function validateChangedPublishRequests(before,head,{cwd=root}={}){
  const selected=changedRequestPaths(before,head,{cwd});
  const seen=new Set();
  for(const path of selected.articlePaths){
    const request=JSON.parse(await readFile(resolve(cwd,path),'utf8'));
    const article=assertApprovedRequestInCatalog(request);
    if(!article)continue;
    if(seen.has(article.articleKey))continue;
    seen.add(article.articleKey);
  }
  return {articles:[...seen].sort(),hubs:selected.hubPaths};
}

async function main(){
  const [before,head]=process.argv.slice(2);
  const audit=await auditArticleRegistry();
  if((before&&!head)||(!before&&head))throw new Error('PUBLISH_REQUEST_RANGE_INCOMPLETE');
  let requests={articles:[],hubs:[]};
  if(before&&head)requests=await validateChangedPublishRequests(before,head);
  console.log('ARTICLE_REGISTRY_PASS',JSON.stringify({
    registeredApproved:audit.registered.length,
    discoveredApprovedModules:audit.discovered.length,
    requestArticles:requests.articles.length,
    requestHubs:requests.hubs.length
  }));
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
