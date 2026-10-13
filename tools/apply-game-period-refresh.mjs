import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const MODEL_PATH='data/game-period-articles.json';
const CATALOG_PATHS=['data/articles.json','data/articles-supplemental.json'];
const PATCH_RE=/^data\/game-period-refreshes\/[a-z0-9-]+\.json$/;
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const save=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const fail=m=>{throw Error(m);};
const exactUnique=list=>[...new Map((list||[]).map(x=>[JSON.stringify(x),x])).values()];
const sourceKey=s=>JSON.stringify([s?.url||'',s?.name||'',s?.sourcePublishedAt??null,s?.updatedAt??null,s?.referenceType||'']);
const mergeSource=(record,source)=>{
  record.sources=Array.isArray(record.sources)?record.sources:[];
  if(!record.sources.some(s=>sourceKey(s)===sourceKey(source)))record.sources.push(source);
};
const RECORD_SET_KEYS=new Set(['sourcePublishedAt','expiry','latest','latestEvidence','statusLabel']);
const SOURCE_SET_KEYS=new Set(['name','sourcePublishedAt','updatedAt','checkedAt','referenceType']);

const paths=process.argv.slice(2);
if(!paths.length)fail('GAME_PERIOD_REFRESH_INPUT_REQUIRED');
if(paths.some(p=>!PATCH_RE.test(p)||!existsSync(p)))fail('GAME_PERIOD_REFRESH_INPUT_INVALID');

const models=load(MODEL_PATH);
const catalogs=Object.fromEntries(CATALOG_PATHS.map(p=>[p,load(p)]));
const touched=new Set();

for(const path of paths){
  const patch=load(path);
  if(patch.version!==1)fail('GAME_PERIOD_REFRESH_VERSION_UNSUPPORTED');
  if(!/^[a-z0-9-]+$/.test(patch.articleKey||''))fail('GAME_PERIOD_REFRESH_ARTICLE_KEY_INVALID');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(patch.checkedAt||''))fail('GAME_PERIOD_REFRESH_CHECKED_AT_INVALID');
  if(touched.has(patch.articleKey))fail('GAME_PERIOD_REFRESH_DUPLICATE_ARTICLE');
  touched.add(patch.articleKey);

  const model=models.find(m=>m.articleKey===patch.articleKey);
  if(!model)fail('GAME_PERIOD_REFRESH_MODEL_MISSING');
  const articleHits=[];
  for(const [catalogPath,articles] of Object.entries(catalogs)){
    const article=articles.find(a=>a.articleKey===patch.articleKey);
    if(article)articleHits.push([catalogPath,article]);
  }
  if(articleHits.length!==1)fail('GAME_PERIOD_REFRESH_ARTICLE_REGISTRY_MISMATCH');
  const article=articleHits[0][1];

  if(!Array.isArray(model.records))fail('GAME_PERIOD_REFRESH_RECORDS_MISSING');
  if(Number.isInteger(patch.expectedBeforeRecords)&&model.records.length!==patch.expectedBeforeRecords)fail(`GAME_PERIOD_REFRESH_BEFORE_COUNT:${model.records.length}`);
  if(new Set(model.records.map(r=>r.code)).size!==model.records.length)fail('GAME_PERIOD_REFRESH_EXISTING_DUPLICATE_CODE');

  if(patch.dedupeExactSources===true){
    for(const record of model.records)record.sources=exactUnique(record.sources||[]);
  }

  for(const item of patch.updateRecords||[]){
    const record=model.records.find(r=>r.code===item.code);
    if(!record)fail('GAME_PERIOD_REFRESH_UPDATE_CODE_MISSING:'+item.code);
    for(const [key,value] of Object.entries(item.set||{})){
      if(!RECORD_SET_KEYS.has(key))fail('GAME_PERIOD_REFRESH_RECORD_SET_KEY:'+key);
      record[key]=value;
    }
    if(item.appendEvidenceHTML&&!String(record.evidenceHTML||'').includes(item.appendEvidenceHTML))record.evidenceHTML=String(record.evidenceHTML||'')+item.appendEvidenceHTML;
    for(const sourceUpdate of item.updateSources||[]){
      if(!sourceUpdate?.url)fail('GAME_PERIOD_REFRESH_SOURCE_UPDATE_URL_REQUIRED');
      const source=(record.sources||[]).find(s=>s.url===sourceUpdate.url);
      if(!source)fail('GAME_PERIOD_REFRESH_SOURCE_UPDATE_MISSING:'+item.code+':'+sourceUpdate.url);
      for(const [key,value] of Object.entries(sourceUpdate.set||{})){
        if(!SOURCE_SET_KEYS.has(key))fail('GAME_PERIOD_REFRESH_SOURCE_SET_KEY:'+key);
        source[key]=value;
      }
    }
  }

  for(const item of patch.mergeSources||[]){
    const record=model.records.find(r=>r.code===item.code);
    if(!record)fail('GAME_PERIOD_REFRESH_MERGE_CODE_MISSING:'+item.code);
    mergeSource(record,item.source);
    if(item.evidenceHTML&&!String(record.evidenceHTML||'').includes(item.evidenceHTML))record.evidenceHTML=String(record.evidenceHTML||'')+item.evidenceHTML;
  }

  for(const record of patch.addRecords||[]){
    if(!record?.code||/[<>"'&\s]/.test(record.code))fail('GAME_PERIOD_REFRESH_NEW_CODE_INVALID');
    if(model.records.some(r=>r.code===record.code))fail('GAME_PERIOD_REFRESH_NEW_CODE_ALREADY_EXISTS:'+record.code);
    model.records.push(record);
  }

  for(const [key,value] of Object.entries(patch.modelPatch||{})){
    if(!['previewHTML','noticeHTML','guideHTML','archiveHTML','researchCheckedAt'].includes(key))fail('GAME_PERIOD_REFRESH_MODEL_PATCH_KEY:'+key);
    model[key]=value;
  }
  model.researchCheckedAt=patch.checkedAt;

  article.source={...article.source,checkedAt:patch.checkedAt};
  if(patch.articlePatch?.searchDescription)article.post.searchDescription=patch.articlePatch.searchDescription;
  if(Array.isArray(patch.articlePatch?.references)){
    article.source.references=Array.isArray(article.source.references)?article.source.references:[];
    for(const ref of patch.articlePatch.references)if(!article.source.references.includes(ref))article.source.references.push(ref);
  }

  if(Number.isInteger(patch.expectedAfterRecords)&&model.records.length!==patch.expectedAfterRecords)fail(`GAME_PERIOD_REFRESH_AFTER_COUNT:${model.records.length}`);
  if(new Set(model.records.map(r=>r.code)).size!==model.records.length)fail('GAME_PERIOD_REFRESH_RESULT_DUPLICATE_CODE');
  if(patch.forbidLatest===true&&model.records.some(r=>r.latest===true))fail('GAME_PERIOD_REFRESH_UNSUPPORTED_LATEST');
  for(const code of patch.forbiddenCodes||[])if(model.records.some(r=>r.code===code))fail('GAME_PERIOD_REFRESH_FORBIDDEN_CODE:'+code);
}

save(MODEL_PATH,models);
for(const [path,articles] of Object.entries(catalogs))save(path,articles);
for(const key of touched)execFileSync(process.execPath,['tools/render-game-period-articles.mjs',key],{stdio:'inherit'});
console.log('GAME_PERIOD_REFRESH_APPLIED',JSON.stringify([...touched]));