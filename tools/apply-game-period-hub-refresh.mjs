import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const HUBS_PATH='data/game-period-hubs.json';
const PATCH_RE=/^data\/game-period-hub-refreshes\/[a-z0-9-]+\.json$/;
const allowed=new Set(['zeus','lineagem','wuthering']);
const paths=process.argv.slice(2);
const fail=m=>{throw Error(m);};
if(!paths.length)fail('GAME_PERIOD_HUB_REFRESH_INPUT_REQUIRED');
if(paths.some(p=>!PATCH_RE.test(p)||!existsSync(p)))fail('GAME_PERIOD_HUB_REFRESH_INPUT_INVALID');
const hubs=JSON.parse(readFileSync(HUBS_PATH,'utf8'));
const touched=new Set();
for(const path of paths){
  const patch=JSON.parse(readFileSync(path,'utf8'));
  if(patch.version!==1)fail('GAME_PERIOD_HUB_REFRESH_VERSION_UNSUPPORTED');
  if(!allowed.has(patch.hubKey))fail('GAME_PERIOD_HUB_REFRESH_KEY_INVALID');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(patch.checkedAt||''))fail('GAME_PERIOD_HUB_REFRESH_CHECKED_AT_INVALID');
  if(touched.has(patch.hubKey))fail('GAME_PERIOD_HUB_REFRESH_DUPLICATE_HUB');
  const before=hubs[patch.hubKey];
  const model=patch.model;
  if(!before||!model||model.articleKey!==patch.hubKey||model.title!==before.title)fail('GAME_PERIOD_HUB_REFRESH_MODEL_INVALID');
  if(!Array.isArray(model.records))fail('GAME_PERIOD_HUB_REFRESH_RECORDS_INVALID');
  const codes=model.records.map(r=>r?.code);
  if(codes.some(code=>typeof code!=='string'||!code||/[<>"'&\s]/.test(code)))fail('GAME_PERIOD_HUB_REFRESH_CODE_INVALID');
  if(new Set(codes).size!==codes.length)fail('GAME_PERIOD_HUB_REFRESH_DUPLICATE_CODE');
  for(const old of before.records||[])if(!codes.includes(old.code))fail('GAME_PERIOD_HUB_REFRESH_HISTORY_OMITTED:'+old.code);
  hubs[patch.hubKey]={...model,researchCheckedAt:patch.checkedAt};
  touched.add(patch.hubKey);
}
writeFileSync(HUBS_PATH,JSON.stringify(hubs,null,2)+'\n');
execFileSync(process.execPath,['tools/build-drafts.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['tools/build-theme.mjs'],{stdio:'inherit'});
console.log('GAME_PERIOD_HUB_REFRESH_APPLIED',JSON.stringify([...touched]));
