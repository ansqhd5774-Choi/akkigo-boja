import {readFileSync,writeFileSync} from 'node:fs';
import {renderGamePeriodArticle} from '../src/game-period-article.js';

const key='lucky-defense-codes-202610';
const checkedAt='2026-10-14';
const pocketUrl='https://www.pocketgamer.com/lucky-defense-omfg/codes/';
const helpUrl='https://111percent.helpshift.com/hc/en/22-lucky-defense/faq/825-how-to-use-coupons/?p=all';
const playUrl='https://play.google.com/store/apps/details?hl=ko&id=com.percent.aos.luckydefense';
const candidates=['LUCKYDISCORD','LUCKYCOMMU50K','LUCKYJOIN30K','LUCKY10KFANS'];
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const save=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
const hasRef=(refs,url)=>Array.isArray(refs)&&refs.some(r=>(typeof r==='string'?r:r?.url)===url);
const stripRefresh=s=>String(s||'').replace(/<p data-lucky-defense-refresh="2026-10-14">[\s\S]*?<\/p>/g,'').trim();

const articles=load('data/articles-supplemental.json');
const article=articles.find(a=>a.articleKey===key);
assert(article,'LUCKY_DEFENSE_ARTICLE_MISSING');
assert(article.post?.title==='운빨존많겜','LUCKY_DEFENSE_TITLE_DRIFT');
const model=article.source?.gamePeriodModel;
assert(model?.articleKey===key,'LUCKY_DEFENSE_PERIOD_MODEL_MISSING');
assert(Array.isArray(model.records)&&model.records.length===31,'LUCKY_DEFENSE_HISTORY_COUNT_CHANGED');
assert(new Set(model.records.map(r=>r.code)).size===31,'LUCKY_DEFENSE_HISTORY_DUPLICATE');
for(const code of candidates)assert(model.records.some(r=>r.code===code),'LUCKY_DEFENSE_CANDIDATE_MISSING_'+code);

for(const r of model.records){
  r.latest=candidates.includes(r.code);
  if(r.latest){
    r.latestEvidence='2026-10-11 Pocket Gamer current OMFG Lucky Me code list; third-party current claim only; Korean account success and official reissue not independently verified';
    r.sources=Array.isArray(r.sources)?r.sources:[];
    if(!r.sources.some(s=>s?.url===pocketUrl))r.sources.push({
      name:'Pocket Gamer 2026-10-11 글로벌 현재 코드 목록',
      url:pocketUrl,
      sourcePublishedAt:'2026-10-11',
      checkedAt,
      referenceType:'THIRD_PARTY_CODE_MENTION'
    });
    const prior=stripRefresh(r.evidenceHTML);
    const current=r.code==='LUCKYDISCORD'
      ?'2026년 10월 11일 Pocket Gamer의 글로벌 OMFG Lucky Me 현재 코드 목록에 다시 등장했습니다. 다만 111% 공식 재발급 공지와 한국 계정 입력 성공은 별도로 확인되지 않아 현재 입력 후보로만 분류합니다.'
      :'2026년 10월 11일 Pocket Gamer 글로벌 현재 코드 목록에 다시 등장했지만, 한국 과거 종료 기록과 충돌합니다. 글로벌판 재사용 가능성은 제3자 주장으로만 확인되어 한국판 사용 가능으로 단정하지 않습니다.';
    r.evidenceHTML=(prior?prior:'')+`<p data-lucky-defense-refresh="2026-10-14">${current}</p>`;
  }else{
    delete r.latestEvidence;
    r.evidenceHTML=stripRefresh(r.evidenceHTML);
  }
}

const byCode=Object.fromEntries(model.records.map(r=>[r.code,r]));
byCode.LUCKYDISCORD.statusLabel='글로벌 10월 현재 후보 · 한국 계정 성공 미확인';
byCode.LUCKYDISCORD.expiry='공식 종료일 미확인';
byCode.LUCKYCOMMU50K.statusLabel='글로벌 10월 재등장 · 한국 과거 종료와 충돌';
byCode.LUCKYJOIN30K.statusLabel='글로벌 10월 재등장 · 한국 과거 종료와 충돌';
byCode.LUCKY10KFANS.statusLabel='글로벌 10월 재등장 · 한국 과거 종료와 충돌';

model.previewHTML='<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="운빨존많겜 쿠폰 요약"><div class="ncp-feed-stat"><span>보존 기록</span><strong>31개</strong></div><div class="ncp-feed-stat"><span>10월 글로벌 후보</span><strong>4개</strong></div><div class="ncp-feed-stat"><span>한국 공식 현재 확인</span><strong>0개</strong></div></div>';
const note='<p data-lucky-defense-refresh="2026-10-14">2026년 10월 14일 전세계 재조사에서 Pocket Gamer의 10월 11일 글로벌 목록이 LUCKYDISCORD, LUCKYCOMMU50K, LUCKYJOIN30K, LUCKY10KFANS 4개를 현재 코드로 제시한 것을 확인했습니다. 그러나 뒤 3개는 한국 과거 종료 기록과 충돌하며, 111% 공식 재발급 공지·한국 계정 입력 성공은 확인되지 않았습니다. 따라서 4개 모두 현재 입력 후보로만 표시하고 공식 사용 가능으로 단정하지 않습니다.</p>';
model.noticeHTML=stripRefresh(model.noticeHTML)+note;
let archive=String(model.archiveHTML||'');
for(const ref of [
  [pocketUrl,'Pocket Gamer 2026-10-11 글로벌 현재 코드 목록'],
  [helpUrl,'111% 공식 쿠폰 입력 방법'],
  [playUrl,'한국 Google Play 운빨존많겜 공식 앱']
]){
  if(!archive.includes(ref[0]))archive+=`<p><a href="${ref[0]}" rel="noopener noreferrer">${ref[1]}</a></p>`;
}
model.archiveHTML=archive;
model.researchCheckedAt=checkedAt;

article.source={...article.source,checkedAt,gamePeriodModel:model};
article.source.references=Array.isArray(article.source.references)?article.source.references:[];
for(const url of [pocketUrl,helpUrl,playUrl])if(!hasRef(article.source.references,url))article.source.references.push(url);
article.post.content=renderGamePeriodArticle(model);
article.post.searchDescription='운빨존많겜 쿠폰 31개 기록과 2026년 10월 글로벌 현재 후보 4개를 출처·만료 이력과 함께 확인합니다. 한국 공식 현재 사용 가능 여부는 별도 검증되지 않았습니다.';

save('data/articles-supplemental.json',articles);
writeFileSync('drafts/lucky-defense-codes-202610.html',article.post.content+'\n');
console.log('LUCKY_DEFENSE_STAGE_PASS',JSON.stringify({records:model.records.length,latest:model.records.filter(r=>r.latest===true).map(r=>r.code),checkedAt}));
