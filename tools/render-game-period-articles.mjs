import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {renderGamePeriodArticle,GAME_PERIOD_VERSION} from '../src/game-period-article.js';
const models=JSON.parse(readFileSync('data/game-period-articles.json','utf8'));
const requested=new Set(process.argv.slice(2));
if([...requested].some(key=>!models.some(m=>m.articleKey===key)))throw Error('PERIOD_REQUEST_MODEL_MISSING');
const seen=new Set();
for(const m of models){if(seen.has(m.articleKey))throw Error('PERIOD_DUPLICATE_MODEL');seen.add(m.articleKey);}
const writes=[];
let rendered=0;
for(const path of ['data/articles.json','data/articles-supplemental.json']){
 const articles=JSON.parse(readFileSync(path,'utf8'));
 for(const a of articles.filter(a=>a.post.labels.includes('게임')&&(!requested.size||requested.has(a.articleKey)))){
  const model=models.find(m=>m.articleKey===a.articleKey);
  if(!model)throw Error('PERIOD_MODEL_MISSING '+a.articleKey);
  a.source={...a.source,presentationVersion:'compact-r2',templateVersion:GAME_PERIOD_VERSION,gamePeriodModel:model};
  a.post.content=renderGamePeriodArticle(model);
  const jsonPath='drafts/'+a.articleKey+'.json';
  if(existsSync(jsonPath))writes.push([jsonPath,JSON.stringify({...JSON.parse(readFileSync(jsonPath,'utf8')),...a},null,2)+'\n']);
  if(existsSync('drafts/'+a.articleKey+'.html'))writes.push(['drafts/'+a.articleKey+'.html',a.post.content+'\n']);
  rendered++;
 }
 writes.push([path,JSON.stringify(articles,null,2)+'\n']);
}
// Validate all selected inputs before writing, so a missing model cannot leave a partial catalog.
for(const [path,text] of writes)writeFileSync(path,text);
console.log('PERIOD_RENDERED',rendered);
