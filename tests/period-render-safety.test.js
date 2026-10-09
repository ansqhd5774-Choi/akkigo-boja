import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
const tool=resolve('tools/render-game-period-articles.mjs');
test('missing later input leaves earlier catalog and drafts unchanged',()=>{
 const folder=mkdtempSync(join(tmpdir(),'akkigo-render-safety-'));
 try{
  mkdirSync(join(folder,'data'));mkdirSync(join(folder,'drafts'));
  const model=JSON.parse(readFileSync('data/game-period-articles.json')).find(m=>m.articleKey==='warframe-promo-codes-202610');
  const article=JSON.parse(readFileSync('data/articles.json')).find(a=>a.articleKey===model.articleKey);
  const files={'data/game-period-articles.json':JSON.stringify([model]),'data/articles.json':JSON.stringify([article]),'data/articles-supplemental.json':JSON.stringify([{articleKey:'missing-model',post:{labels:['게임']}}]),['drafts/'+model.articleKey+'.html']:'KEEP_THIS_DRAFT'};
  for(const [path,text] of Object.entries(files))writeFileSync(join(folder,path),text);
  const result=spawnSync(process.execPath,[tool],{cwd:folder,encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/PERIOD_MODEL_MISSING missing-model/);
  for(const [path,text] of Object.entries(files))assert.equal(readFileSync(join(folder,path),'utf8'),text);
 }finally{if(!resolve(folder).startsWith(resolve(tmpdir())+requireSeparator()))throw Error('UNSAFE_FIXTURE_PATH');rmSync(folder,{recursive:true});}
});
function requireSeparator(){return process.platform==='win32'?'\\':'/';}

