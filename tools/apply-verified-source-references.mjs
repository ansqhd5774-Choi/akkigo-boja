import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {renderGamePeriodArticle} from '../src/game-period-article.js';
const evidence=JSON.parse(readFileSync('data/operations/source-mention-context-20261010.json'));
const official=[
 {code:'ADIDASxPOKEMON',url:'https://pokemongo.com/en/news/pokemon-x-adidas-2026',note:'공식 공지에서 아바타 신발 코드와 2027년 1월 15일까지의 교환 기간을 확인했습니다. 계정 입력 성공은 미확인입니다.'},
 {code:'FENDIxFRGMTxPOKEMON',url:'https://pokemongo.com/ko/news/FENDIxFRGMTxPOKEMON',note:'공식 공지의 코드 유효기간은 2024년 1월 4일부터 2025년 1월 5일까지입니다. 종료된 공식 행사 기록입니다.'},
 {code:'LEGOxPOKEMONGOxCAP',url:'https://pokemongo.com/news/lego-pokemon-go-2026',note:'공식 공지에서 코드를 확인했습니다. 리서치 완료·보상 수령 기한은 2026년 9월 30일 23:59(현지 시각)입니다. 코드 교환 종료일과 보상 수령 기한은 구분합니다.'}
];
const reportPath='data/operations/source-reference-application-20261010.json';
const prior=existsSync(reportPath)?JSON.parse(readFileSync(reportPath)):{linkedRecords:0,changedArticles:[]};
const changed=[];let linked=0;
for(const path of ['data/articles.json','data/articles-supplemental.json']){
 const articles=JSON.parse(readFileSync(path));
 for(const article of articles){
  const model=article.source?.gamePeriodModel;if(!model)continue;
  let affected=false;
  for(const record of model.records){
   const candidates=evidence.sources.filter(s=>s.state==='GAME_CONTEXT_AND_CODE_LIST_OBSERVED'&&s.codes.some(c=>c.articleKey===article.articleKey&&c.code===record.code));
   const direct=article.articleKey==='pokemon-go-codes-202610'?official.find(o=>o.code===record.code):null;
   if(!candidates.length&&!direct)continue;
   if(record.sources?.some(s=>s.url))continue;
   record.sources=(direct?[{name:'Pokémon GO 공식 행사 원문',url:direct.url,referenceType:'OFFICIAL_CODE_CONTEXT',checkedAt:'2026-10-10',sourcePublishedAt:null}]:candidates.slice(0,2).map(s=>({name:new URL(s.url).hostname+' · 제3자 코드 목록',url:s.url,referenceType:'THIRD_PARTY_CODE_MENTION',checkedAt:'2026-10-10',sourcePublishedAt:null})));
   if(direct){record.evidenceHTML='<p>'+direct.note+'</p>'+(record.evidenceHTML||'');}
   if(direct?.code==='ADIDASxPOKEMON'){record.latest=true;record.latestEvidence='공식 행사 원문에서 2027-01-15까지 코드 교환 기간 확인; 계정 입력 미검증';record.statusLabel='공식 행사 입력 후보 · 실사용 미확인';}
   if(direct?.code==='FENDIxFRGMTxPOKEMON')record.statusLabel='공식 행사 기간 종료';
   if(direct?.code==='LEGOxPOKEMONGOxCAP'){record.expiry='보상 수령 2026-09-30 23:59 (현지)';record.statusLabel='공식 보상 수령 기간 종료';}
   affected=true;linked++;
  }
  const html=renderGamePeriodArticle(model);
  if(!affected&&html===article.post.content)continue;
  article.post.content=html;changed.push(article.articleKey);
  for(const ext of ['json','html']){const f='drafts/'+article.articleKey+'.'+ext;if(existsSync(f))writeFileSync(f,ext==='html'?html+'\n':JSON.stringify({...JSON.parse(readFileSync(f)),...article},null,2)+'\n');}
  writeFileSync('publish-requests/'+article.articleKey+'-source-reference-20261010.json',JSON.stringify({articleKey:article.articleKey,approved:true,existingOnly:true,requestedAt:'2026-10-10',reason:'검증된 게임 문맥의 코드 목록 출처 연결. 제3자 수록과 실사용 성공 구분, 기존 ID와 URL 보존.'},null,2)+'\n');
 }
 writeFileSync(path,JSON.stringify(articles,null,2)+'\n');
}
writeFileSync(reportPath,JSON.stringify({linkedRecords:prior.linkedRecords+linked,changedArticles:[...new Set([...prior.changedArticles,...changed])],scope:'CODE_REFERENCE_CONTEXT_NOT_UNIVERSAL_REDEMPTION_SUCCESS',officialEvidence:official},null,2));
// Persist the same evidence in the generator input, so a later workflow render
// cannot silently restore the old source-less version.
const catalog=[...JSON.parse(readFileSync('data/articles.json')),...JSON.parse(readFileSync('data/articles-supplemental.json'))];
const changedKeys=new Set([...prior.changedArticles,...changed]);
const models=JSON.parse(readFileSync('data/game-period-articles.json')).map(m=>changedKeys.has(m.articleKey)?catalog.find(a=>a.articleKey===m.articleKey).source.gamePeriodModel:m);
writeFileSync('data/game-period-articles.json',JSON.stringify(models,null,2)+'\n');
console.log(JSON.stringify({linked,changed}));
