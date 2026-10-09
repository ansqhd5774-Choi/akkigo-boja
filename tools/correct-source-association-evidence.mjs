import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {renderGamePeriodArticle} from '../src/game-period-article.js';
import {summarizeSourceGaps} from '../src/source-gap-summary.js';
const save=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');const changed=[];
for(const p of ['data/articles.json','data/articles-supplemental.json']){const articles=JSON.parse(readFileSync(p));for(const a of articles){const m=a.source?.gamePeriodModel;if(!m)continue;
 if(a.articleKey==='last-asylum-plague-codes-202610'){
  const r=m.records.find(r=>r.code==='SURVIVOR');if(r?.sources?.length){r.withdrawnSourceAssociations=r.sources.map(s=>({...s,withdrawnAt:'2026-10-10',reason:'REWARD_DESCRIPTION_WORD_NOT_CODE_DECLARATION'}));r.sources=[];r.latest=false;r.statusLabel='코드 발급 근거 미확인';r.evidenceHTML='<p>이전 출처 연결에서 보상 설명의 Survivor Recruit Ticket을 쿠폰 코드 근거로 잘못 인식해 연결을 철회했습니다. SURVIVOR 기록은 보존하지만 실제 발급·사용 성공은 미확인입니다.</p>'+(r.evidenceHTML||'');changed.push(a.articleKey);}
 }
 if(a.articleKey==='duck-survival-codes-202610'){
  const r=m.records.find(r=>r.code==='HEARDUCK');if(r){for(const s of r.sources||[])s.referenceType='THIRD_PARTY_CASE_VARIANT';const note='<p data-evidence-id="duck-case-variant">제3자 원문 표기는 HearDuck 또는 hearduck입니다. 현재 기록 HEARDUCK과 대소문자가 달라 동일한 사용 가능 코드로 단정하지 않습니다. 원문의 사용 가능·만료 분류도 서로 달라 실제 계정 입력 확인 전까지 미확인으로 유지합니다.</p>';if(!r.evidenceHTML.includes('duck-case-variant'))r.evidenceHTML=note+(r.evidenceHTML||'');r.latest=false;changed.push(a.articleKey);}
 }
 if(changed.includes(a.articleKey)){a.post.content=renderGamePeriodArticle(m);writeFileSync('drafts/'+a.articleKey+'.html',a.post.content+'\n');if(existsSync('drafts/'+a.articleKey+'.json'))save('drafts/'+a.articleKey+'.json',{...JSON.parse(readFileSync('drafts/'+a.articleKey+'.json')),...a});save('publish-requests/'+a.articleKey+'-source-reference-20261010.json',{articleKey:a.articleKey,approved:true,existingOnly:true,requestedAt:'2026-10-10',reason:'출처 연관 오탐 및 코드 대소문자 차이 정정, 기록과 기존 URL 보존'});}
 }save(p,articles);}
const all=[...JSON.parse(readFileSync('data/articles.json')),...JSON.parse(readFileSync('data/articles-supplemental.json'))];save('data/game-period-articles.json',JSON.parse(readFileSync('data/game-period-articles.json')).map(m=>changed.includes(m.articleKey)?all.find(a=>a.articleKey===m.articleKey).source.gamePeriodModel:m));
const gapSummary=summarizeSourceGaps(JSON.parse(readFileSync('data/operations/source-gap-review-20261010.json')).items,all);
save('data/operations/source-association-corrections-20261010.json',{checkedAt:new Date().toISOString(),withdrawnRecord:'last-asylum-plague-codes-202610:SURVIVOR',retainedCaseVariant:'duck-survival-codes-202610:HEARDUCK',linkedRecordsAfterCorrection:gapSummary.linked,sourceGapsAfterCorrection:gapSummary.unconfirmed,accountInputVerified:false});

