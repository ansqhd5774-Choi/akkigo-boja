import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const KEY='lucky-offense-codes-202610';
const MODEL_PATH='data/game-period-articles.json';
const CHECKED='2026-10-13';
const RESEARCH_PATH='data/lucky-offense-refresh-20261013.json';
const SOFT='https://softit.tistory.com/203';
const TIRED='https://tiredgamer.tistory.com/m/13';
const LOUNGE='https://game.naver.com/lounge/Lucky_Offense/home';
const STORE='https://play.google.com/store/apps/details?hl=ko&id=com.percent.aos.luckyrolling';
const UPDATE_COPY='https://gall.dcinside.com/mgallery/board/view/?id=luckydefense2&no=942';
const TIKTOK_FEB='https://bboddo.tistory.com/460';
const TIKTOK_JUNE='https://bjjy10261.tistory.com/12';
const EXPECTED_CODES=['LUCKY777','UNBBAL111','luckyoffens2e'];

const models=JSON.parse(readFileSync(MODEL_PATH,'utf8'));
const index=models.findIndex(x=>x.articleKey===KEY);
if(index<0)throw Error('LUCKY_OFFENSE_MODEL_MISSING');
const model=models[index];
if(model.records.length!==3)throw Error('LUCKY_OFFENSE_HISTORY_DRIFT_'+model.records.length);
for(const code of EXPECTED_CODES){if(!model.records.some(r=>r.code===code))throw Error('LUCKY_OFFENSE_CODE_MISSING_'+code);}
for(const record of model.records){
  record.latest=false;
  record.sources=(record.sources||[]).map(source=>[SOFT,TIRED].includes(source.url)?{...source,checkedAt:CHECKED}:source);
}

model.noticeHTML='<p data-refresh-evidence="lucky-offense-20261013">2026년 10월 13일 재조사 기준 새 공식 공용 쿠폰은 확인하지 못했습니다. 2025년에 공개된 LUCKY777·UNBBAL111·luckyoffens2e는 과거 기록으로 보존합니다. 2026년에 확인된 TikTok Lite 제휴 혜택은 참여 후 개별 코드를 발급받는 방식이므로 공개 복사 쿠폰으로 표시하지 않습니다.</p>';
const partnerMarker='data-partner-history="lucky-offense-20261013"';
if(!(model.archiveHTML||'').includes(partnerMarker)){
  model.archiveHTML=(model.archiveHTML||'')+`<section ${partnerMarker}><h3>2026년 제휴 발급 이력</h3><p><a href="${TIKTOK_FEB}" rel="noopener noreferrer">2026.02.25 제3자 보도</a>에서는 TikTok Lite 새학기 이벤트 참여 후 쿠폰 보관함에서 개별 코드를 받는 방식을 안내했습니다. 공개 공용 코드는 아니며 종료일과 현재 신규 발급 가능 여부는 확인되지 않았습니다.</p><p><a href="${TIKTOK_JUNE}" rel="noopener noreferrer">2026.05.30 제3자 보도</a>에서는 운빨돌격대 제휴 발급형 혜택을 2026.06.30까지로 안내했습니다. 현재는 해당 안내 기한이 지났으며 공개 공용 코드로 전환하지 않습니다.</p></section>`;
}
writeFileSync(MODEL_PATH,JSON.stringify(models,null,2)+'\n');
execFileSync(process.execPath,['tools/render-game-period-articles.mjs',KEY],{stdio:'inherit'});

const benefits=[
  {
    kind:'PARTNER_ISSUED_CODE',
    partner:'TikTok Lite',
    method:'가입·이벤트 참여 후 쿠폰 보관함에서 개별 코드 발급',
    status:'UNVERIFIED',
    source:TIKTOK_FEB,
    sourcePublishedAt:'2026-02-25',
    expiry:null,
    publicCode:false,
    checkedAt:CHECKED
  },
  {
    kind:'PARTNER_ISSUED_CODE',
    partner:'TikTok Lite',
    method:'이벤트 참여 후 개별 코드 발급',
    status:'EXPIRED',
    source:TIKTOK_JUNE,
    sourcePublishedAt:'2026-05-30',
    expiry:'2026-06-30',
    publicCode:false,
    checkedAt:CHECKED
  }
];
const extraRefs=[STORE,LOUNGE,SOFT,TIRED,UPDATE_COPY,TIKTOK_FEB,TIKTOK_JUNE];
let updatedArticle=null;
for(const path of ['data/articles.json','data/articles-supplemental.json']){
  const articles=JSON.parse(readFileSync(path,'utf8'));
  const article=articles.find(x=>x.articleKey===KEY);
  if(article){
    article.source={...article.source,checkedAt:CHECKED,references:[...new Set([...(article.source?.references||[]),...extraRefs])],benefits,refreshResearch:RESEARCH_PATH};
    updatedArticle=article;
    writeFileSync(path,JSON.stringify(articles,null,2)+'\n');
  }
}
if(!updatedArticle)throw Error('LUCKY_OFFENSE_ARTICLE_MISSING');
const draftJson='drafts/'+KEY+'.json';
if(existsSync(draftJson)){
  const draft=JSON.parse(readFileSync(draftJson,'utf8'));
  draft.source=updatedArticle.source;
  draft.post=updatedArticle.post;
  writeFileSync(draftJson,JSON.stringify(draft,null,2)+'\n');
}
const body=updatedArticle.post.content;
if(!body.includes('lucky-offense-20261013'))throw Error('LUCKY_OFFENSE_REFRESH_MARKER_MISSING');
if(!body.includes('2026년 제휴 발급 이력'))throw Error('LUCKY_OFFENSE_PARTNER_HISTORY_MISSING');
const copies=[...body.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
if(copies.length!==3||new Set(copies).size!==3)throw Error('LUCKY_OFFENSE_COPY_COUNT_DRIFT_'+copies.length);
for(const code of EXPECTED_CODES){if(!copies.includes(code))throw Error('LUCKY_OFFENSE_COPY_MISSING_'+code);}
console.log('LUCKY_OFFENSE_REFRESH_STAGED',KEY,copies.length,benefits.length,CHECKED);
