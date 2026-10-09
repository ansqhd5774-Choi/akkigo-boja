import {readFileSync,writeFileSync} from 'node:fs';
import {renderGamePeriodArticle} from '../src/game-period-article.js';
const path='data/articles.json';const articles=JSON.parse(readFileSync(path));
const article=articles.find(a=>a.articleKey==='trickcal-revive-codes-202610');
const record=article.source.gamePeriodModel.records.find(r=>r.code==='GOOGLETOP3');
const url='https://game.naver.com/lounge/Trickcal/board/detail/8271053';
if(!record.sources.some(s=>s.url===url)){
 record.sources.unshift({name:'트릭컬 리바이브 공식 매출 순위 기념 공지',url,referenceType:'OFFICIAL_CODE_CONTEXT',checkedAt:'2026-10-10',sourcePublishedAt:null});
 record.evidenceHTML='<p>공식 공지에서 GOOGLETOP3 코드, 교주의 빛무리 선택권 1개·참! 잘했어요 333개, 10월 22일 10:59까지의 사용 기한을 확인했습니다. 최초 게시일의 연도와 실제 계정 입력 성공은 별도로 확인하지 않았습니다.</p>'+record.evidenceHTML;
}
article.post.content=renderGamePeriodArticle(article.source.gamePeriodModel);
writeFileSync(path,JSON.stringify(articles,null,2)+'\n');
const models=JSON.parse(readFileSync('data/game-period-articles.json')).map(m=>m.articleKey===article.articleKey?article.source.gamePeriodModel:m);
writeFileSync('data/game-period-articles.json',JSON.stringify(models,null,2)+'\n');
writeFileSync('drafts/'+article.articleKey+'.html',article.post.content+'\n');
writeFileSync('drafts/'+article.articleKey+'.json',JSON.stringify({...JSON.parse(readFileSync('drafts/'+article.articleKey+'.json')),...article},null,2)+'\n');
const request='publish-requests/'+article.articleKey+'-source-reference-20261010.json';const r=JSON.parse(readFileSync(request));r.reason='공식 공지에서 GOOGLETOP3 코드·보상·기간 확인, 연도와 실사용 미확인 유지';writeFileSync(request,JSON.stringify(r,null,2)+'\n');
const observations=JSON.parse(readFileSync('data/operations/source-content-observations.json'));
for(const o of observations.observations){
 if(o.url==='https://coupon.withhive.com/shibarpg')o.manualReview={decision:'REGISTRATION_PAGE_NOT_CODE_LIST',falsePositiveFlag:'EXPECTED_CODE_NOT_OBSERVED',reviewedAt:'2026-10-10'};
 if(o.url==='https://game.naver.com/lounge/Trickcal/board/31')o.manualReview={decision:'BROWSER_RENDERED_OFFICIAL_BOARD_CONFIRMED',reason:'JavaScript 렌더링 전 짧은 HTML을 실제 페이지 장애로 판단하지 않음',reviewedAt:'2026-10-10'};
}
writeFileSync('data/operations/source-content-observations.json',JSON.stringify(observations,null,2));
console.log('OFFICIAL_CONTEXT_AND_DIAGNOSTIC_REVIEW_SAVED');
