import {readFileSync} from 'node:fs';
import {summarizeGamePeriodModel} from '../src/game-period-summary.js';
const models=['data/articles.json','data/articles-supplemental.json'].flatMap(path=>JSON.parse(readFileSync(path,'utf8'))).filter(a=>a.post?.labels?.includes('게임')).map(a=>{
 if(!a.source?.gamePeriodModel)throw Error('REPORT_MODEL_MISSING '+a.articleKey);
 return a.source.gamePeriodModel;
});
const hubs=JSON.parse(readFileSync('data/game-period-hubs.json','utf8'));
const all=[...models,...Object.values(hubs)];
const key=process.argv[2];
const selected=key?all.filter(m=>m.articleKey===key||m.title===key):all;
if(!selected.length)throw Error('REPORT_MODEL_NOT_FOUND');
console.log(JSON.stringify(selected.map(summarizeGamePeriodModel),null,2));
