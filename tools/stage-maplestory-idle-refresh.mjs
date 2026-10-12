import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const KEY='maplestory-idle-codes-202610';
const MODEL_PATH='data/game-period-articles.json';
const OLD_REDEEM='https://coupon.nexon.com/ko-kr/maplestoryidle';
const NEW_REDEEM='https://mcoupon.nexon.com/maplestoryidle?lang=ko';
const CHECKED='2026-10-13';
const OFFICIAL_PINK='https://forum.nexon.com/maplestoryidle-kr/board_view?board=6633&thread=3536440';

const models=JSON.parse(readFileSync(MODEL_PATH,'utf8'));
const index=models.findIndex(x=>x.articleKey===KEY);
if(index<0)throw Error('MAPLESTORY_IDLE_MODEL_MISSING');

// The legacy URL exists in both the current guide and preserved explanatory HTML.
// Replace only inside this article's canonical model so generated public content cannot retain it.
const replaceRedeem=value=>{
  if(typeof value==='string')return value.replaceAll(OLD_REDEEM,NEW_REDEEM);
  if(Array.isArray(value))return value.map(replaceRedeem);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,replaceRedeem(v)]));
  return value;
};
models[index]=replaceRedeem(models[index]);
const model=models[index];
if(!JSON.stringify(model).includes(NEW_REDEEM))throw Error('MAPLESTORY_IDLE_REDEEM_LINK_MISSING');
if(JSON.stringify(model).includes(OLD_REDEEM))throw Error('MAPLESTORY_IDLE_STALE_REDEEM_MODEL_REMAINS');

const confirmation='(공식 페이지 확인 · 2026-10-13)';
if(!model.guideHTML.includes(confirmation)){
  const label='넥슨 공식 쿠폰 등록 페이지</a>';
  if(!model.guideHTML.includes(label))throw Error('MAPLESTORY_IDLE_REDEEM_LABEL_MISSING');
  model.guideHTML=model.guideHTML.replace(label,label+' <span class="ncp-source-health">'+confirmation+'</span>');
}

const pink=model.records.find(r=>r.code==='PINKBEANATTACK');
if(!pink)throw Error('MAPLESTORY_IDLE_PINK_CODE_MISSING');
pink.sourcePublishedAt='2026-09-03';
pink.expiry='2026-10-14 23:59 (한국 공식 안내)';
pink.latest=true;
pink.latestEvidence=pink.latestEvidence||'넥슨 공식 공지에서 2026-10-14 23:59 KST까지 사용 기한을 확인했다.';
pink.sources=(pink.sources||[]).map(source=>source.url===OFFICIAL_PINK?{...source,sourcePublishedAt:'2026-09-03',checkedAt:CHECKED}:source);
if(!pink.sources.some(source=>source.url===OFFICIAL_PINK)){
  pink.sources.unshift({name:'넥슨 공식 핑크빈 쿠폰 공지',url:OFFICIAL_PINK,sourcePublishedAt:'2026-09-03',checkedAt:CHECKED,referenceType:'OFFICIAL_CODE_ISSUANCE'});
}
const refreshNote='<p data-refresh-evidence="maplestory-idle-20261013">2026-10-13 재확인: 넥슨 공식 공지에서 PINKBEANATTACK, 동료 소환권 300장, 2026년 10월 14일 23:59 KST까지, 계정당 1회를 다시 확인했습니다. 공식 웹 쿠폰 등록 페이지도 현재 열리며 회원코드·쿠폰번호 입력 화면을 확인했습니다.</p>';
if(!(pink.evidenceHTML||'').includes('maplestory-idle-20261013'))pink.evidenceHTML=(pink.evidenceHTML||'')+refreshNote;

writeFileSync(MODEL_PATH,JSON.stringify(models,null,2)+'\n');
execFileSync(process.execPath,['tools/render-game-period-articles.mjs',KEY],{stdio:'inherit'});
console.log('MAPLESTORY_IDLE_REFRESH_STAGED',KEY,model.records.length,NEW_REDEEM);
