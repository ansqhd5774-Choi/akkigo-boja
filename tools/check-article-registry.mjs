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

export async function discoverApprovedModuleEntries({srcDir=resolve(root,'src')}={}){
  const files=(await readdir(srcDir)).filter(name=>name.endsWith('-article.js')).sort();
  const entries=[];
  const seen=new Set();
  for(const name of files){
    const path=resolve(srcDir,name);
    const source=await readFile(path,'utf8');
    if(!/approvedForPublish\s*:\s*true\b/.test(source))continue;
    const mod=await import(pathToFileURL(path).href);
    for(const value of Object.values(mod)){
      if(value && typeof value==='object' && value.approvedForPublish===true && typeof value.articleKey==='string' && value.post){
        const id=`${name}:${value.articleKey}`;
        if(seen.has(id))continue;
        seen.add(id);
        entries.push({file:name,articleKey:value.articleKey});
      }
    }
  }
  return entries.sort((a,b)=>a.articleKey.localeCompare(b.articleKey)||a.file.localeCompare(b.file));
}

export async function discoverApprovedModuleKeys(options={}){
  return [...new Set((await discoverApprovedModuleEntries(options)).map(x=>x.articleKey))].sort();
}

export async function auditArticleRegistry(){
  assertArticleCatalogIntegrity(currentArticleCatalog);
  const registered=new Set(currentArticleCatalog.filter(x=>x.approvedForPublish===true).map(x=>x.articleKey));
  const entries=await discoverApprovedModuleEntries();
  const discovered=[...new Set(entries.map(x=>x.articleKey))].sort();
  const missing=discovered.filter(key=>!registered.has(key));
  if(missing.length){
    const origins=entries.filter(x=>missing.includes(x.articleKey)).map(x=>`${x.articleKey}@${x.file}`);
    throw new Error(`ARTICLE_REGISTRY_MISSING:${origins.join(',')}`);
  }
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
