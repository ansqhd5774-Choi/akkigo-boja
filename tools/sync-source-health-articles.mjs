import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {renderGamePeriodArticle} from '../src/game-period-article.js';
const keys=new Set(JSON.parse(readFileSync('output/source-health-changed-keys.json')));
for(const path of ['data/articles.json','data/articles-supplemental.json']){
 const articles=JSON.parse(readFileSync(path));
 for(const a of articles){if(!a.source?.gamePeriodModel)continue;const html=renderGamePeriodArticle(a.source.gamePeriodModel);if(html!==a.post.content){a.post.content=html;keys.add(a.articleKey);}
  if(!keys.has(a.articleKey))continue;
  for(const ext of ['json','html']){const file='drafts/'+a.articleKey+'.'+ext;if(existsSync(file))writeFileSync(file,ext==='html'?html+'\n':JSON.stringify({...JSON.parse(readFileSync(file)),...a},null,2)+'\n');}
  writeFileSync('publish-requests/'+a.articleKey+'-source-health-20261010.json',JSON.stringify({articleKey:a.articleKey,approved:true,existingOnly:true,requestedAt:'2026-10-10',reason:'승인된 출처 품질 개선: 404 원문 식별 보존 및 접근 오류 표시. 기존 코드·postId·URL 보존.'},null,2)+'\n');
 }
 writeFileSync(path,JSON.stringify(articles,null,2)+'\n');
}
writeFileSync('output/source-health-changed-keys.json',JSON.stringify([...keys]));console.log('SOURCE_HEALTH_REQUESTS',keys.size);
