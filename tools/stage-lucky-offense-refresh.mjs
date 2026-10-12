import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const KEY='lucky-offense-codes-202610';
const SOURCE_PATH='src/game-batch-20261012-h.js';
const CHECKED='2026-10-13';
const SOFT='https://softit.tistory.com/203';
const TIRED='https://tiredgamer.tistory.com/m/13';
const LOUNGE='https://game.naver.com/lounge/Lucky_Offense/home';
const STORE='https://play.google.com/store/apps/details?hl=ko&id=com.percent.aos.luckyrolling';
const UPDATE_COPY='https://gall.dcinside.com/mgallery/board/view/?id=luckydefense2&no=942';
const TIKTOK_FEB='https://bboddo.tistory.com/460';
const TIKTOK_JUNE='https://bjjy10261.tistory.com/12';
const EXPECTED_CODES=['LUCKY777','UNBBAL111','luckyoffens2e'];

let source=readFileSync(SOURCE_PATH,'utf8');

const oldMake="const make=({articleKey,title,english,storeUrl,iconUrl,sourceUrl,references,records,previewHTML,noticeHTML,guideHTML,archiveHTML,searchDescription,keywords,hashtags,benefits=[],type})=>{";
const newMake="const make=({articleKey,title,english,storeUrl,iconUrl,sourceUrl,references,records,previewHTML,noticeHTML,guideHTML,archiveHTML,searchDescription,keywords,hashtags,benefits=[],type,sourceCheckedAt=checkedAt})=>{";
if(source.includes(oldMake))source=source.replace(oldMake,newMake);
if(!source.includes(newMake))throw Error('LUCKY_OFFENSE_MAKE_SIGNATURE_MISSING');
source=source.replace("source:{type,url:sourceUrl,checkedAt,references,presentationVersion:'compact-r2'","source:{type,url:sourceUrl,checkedAt:sourceCheckedAt,references,presentationVersion:'compact-r2'");
if(!source.includes("checkedAt:sourceCheckedAt,references"))throw Error('LUCKY_OFFENSE_SOURCE_CHECKED_AT_HOOK_MISSING');

const anchor=`const luckySoft='${SOFT}';`;
if(!source.includes("const luckyCheckedAt='2026-10-13';")){
  if(!source.includes(anchor))throw Error('LUCKY_OFFENSE_SOURCE_ANCHOR_MISSING');
  const insertion=`${anchor}\nconst luckyCheckedAt='2026-10-13';\nconst luckyUpdateCopy='${UPDATE_COPY}';\nconst luckyTikTokFeb='${TIKTOK_FEB}';\nconst luckyTikTokJune='${TIKTOK_JUNE}';\nconst luckyTp=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt:luckyCheckedAt});`;
  source=source.replace(anchor,insertion);
}

const rowsStart=source.indexOf('const luckyRows=');
const articleStart=source.indexOf('export const luckyOffenseArticle=');
if(rowsStart<0||articleStart<0||articleStart<=rowsStart)throw Error('LUCKY_OFFENSE_BLOCK_MISSING');
let luckyBlock=source.slice(rowsStart,articleStart);
luckyBlock=luckyBlock.replaceAll('sources:[tp(','sources:[luckyTp(');
source=source.slice(0,rowsStart)+luckyBlock+source.slice(articleStart);

const noticeHTML='<p data-refresh-evidence="lucky-offense-20261013">2026년 10월 13일 재조사 기준 새 공식 공용 쿠폰은 확인하지 못했습니다. 2025년에 공개된 LUCKY777·UNBBAL111·luckyoffens2e는 과거 기록으로 보존합니다. 2026년에 확인된 TikTok Lite 제휴 혜택은 참여 후 개별 코드를 발급받는 방식이므로 공개 복사 쿠폰으로 표시하지 않습니다.</p>';
const guideHTML='<section><h3>입력</h3><p>쿠폰 기능은 2025년 v1.1.6 업데이트에서 추가됐습니다. 과거 공개 자료는 게임 화면 우측 하단 메뉴 → 설정 → 쿠폰 입력을 안내했습니다. 현재 메뉴 구성과 코드 적용 여부는 게임 내 화면을 최종 기준으로 확인하세요.</p></section>';
const archiveHTML=`<p><a href="${LOUNGE}" rel="noopener noreferrer">공식 라운지</a> · <a href="${STORE}" rel="noopener noreferrer">Google Play</a> · <a href="${SOFT}" rel="noopener noreferrer">2025 과거 코드 자료</a> · <a href="${UPDATE_COPY}" rel="noopener noreferrer">v1.1.6 쿠폰 기능 추가 기록</a></p><section data-partner-history="lucky-offense-20261013"><h3>2026년 제휴 발급 이력</h3><p><a href="${TIKTOK_FEB}" rel="noopener noreferrer">2026.02.25 제3자 보도</a>에서는 TikTok Lite 새학기 이벤트 참여 후 쿠폰 보관함에서 개별 코드를 받는 방식을 안내했습니다. 공개 공용 코드는 아니며 종료일과 현재 신규 발급 가능 여부는 확인되지 않았습니다.</p><p><a href="${TIKTOK_JUNE}" rel="noopener noreferrer">2026.05.30 제3자 보도</a>에서는 운빨돌격대 제휴 발급형 혜택을 2026.06.30까지로 안내했습니다. 현재는 해당 안내 기한이 지났으며 공개 공용 코드로 전환하지 않습니다.</p></section>`;
const benefits=[
  {kind:'PARTNER_ISSUED_CODE',partner:'TikTok Lite',method:'가입·이벤트 참여 후 쿠폰 보관함에서 개별 코드 발급',status:'UNVERIFIED',source:TIKTOK_FEB,sourcePublishedAt:'2026-02-25',expiry:null,publicCode:false,checkedAt:CHECKED},
  {kind:'PARTNER_ISSUED_CODE',partner:'TikTok Lite',method:'이벤트 참여 후 개별 코드 발급',status:'EXPIRED',source:TIKTOK_JUNE,sourcePublishedAt:'2026-05-30',expiry:'2026-06-30',publicCode:false,checkedAt:CHECKED}
];
const refreshedLine=`export const luckyOffenseArticle=make({articleKey:'${KEY}',title:'운빨돌격대',english:'Lucky Offense',storeUrl:luckyStore,iconUrl:luckyIcon,sourceUrl:luckyLounge,sourceCheckedAt:luckyCheckedAt,references:[luckyStore,luckyLounge,luckyTired,luckySoft,luckyUpdateCopy,luckyTikTokFeb,luckyTikTokJune],records:luckyRecords,type:'LUCKY_OFFENSE_HISTORICAL_CODES_AND_PARTNER_HISTORY',previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="운빨돌격대 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>과거 기록</span><strong>3개</strong></div><div class="ncp-feed-stat"><span>제휴 발급 이력</span><strong>2건</strong></div></div>',noticeHTML:${JSON.stringify(noticeHTML)},guideHTML:${JSON.stringify(guideHTML)},archiveHTML:${JSON.stringify(archiveHTML)},searchDescription:'운빨돌격대 쿠폰을 2026년 10월 13일 다시 확인했습니다. 새 공식 공용 쿠폰은 확인되지 않았으며 2025 과거 코드 3개와 2026 제휴 발급형 혜택 이력을 구분해 정리했습니다.',keywords:['운빨돌격대 쿠폰','운빨돌격대 코드','LUCKY777','UNBBAL111'],hashtags:['#운빨돌격대','#운빨돌격대쿠폰','#게임쿠폰'],benefits:${JSON.stringify(benefits)}});`;
if(!/^export const luckyOffenseArticle=.*$/m.test(source))throw Error('LUCKY_OFFENSE_EXPORT_LINE_MISSING');
source=source.replace(/^export const luckyOffenseArticle=.*$/m,refreshedLine);
writeFileSync(SOURCE_PATH,source);

const moduleUrl=pathToFileURL(resolve(SOURCE_PATH)).href+'?refresh='+Date.now();
const {luckyOffenseArticle}=await import(moduleUrl);
if(!luckyOffenseArticle)throw Error('LUCKY_OFFENSE_IMPORT_FAILED');
if(luckyOffenseArticle.source.checkedAt!==CHECKED)throw Error('LUCKY_OFFENSE_CHECKED_AT_DRIFT');
if(luckyOffenseArticle.source.gamePeriodModel.records.length!==3)throw Error('LUCKY_OFFENSE_HISTORY_DRIFT');
if(luckyOffenseArticle.source.gamePeriodModel.records.some(x=>x.latest))throw Error('LUCKY_OFFENSE_FALSE_CURRENT_CODE');
if((luckyOffenseArticle.source.benefits||[]).length!==2)throw Error('LUCKY_OFFENSE_BENEFIT_DRIFT');
const body=luckyOffenseArticle.post.content;
const copies=[...body.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
if(copies.length!==3||new Set(copies).size!==3)throw Error('LUCKY_OFFENSE_COPY_COUNT_DRIFT_'+copies.length);
for(const code of EXPECTED_CODES){if(!copies.includes(code))throw Error('LUCKY_OFFENSE_COPY_MISSING_'+code);}
if(!body.includes('lucky-offense-20261013'))throw Error('LUCKY_OFFENSE_REFRESH_MARKER_MISSING');
if(!body.includes('2026년 제휴 발급 이력'))throw Error('LUCKY_OFFENSE_PARTNER_HISTORY_MISSING');
const draftHtml='drafts/'+KEY+'.html';
if(existsSync(draftHtml))writeFileSync(draftHtml,body+'\n');
const draftJson='drafts/'+KEY+'.json';
if(existsSync(draftJson))writeFileSync(draftJson,JSON.stringify(luckyOffenseArticle,null,2)+'\n');
console.log('LUCKY_OFFENSE_REFRESH_STAGED',KEY,copies.length,luckyOffenseArticle.source.benefits.length,CHECKED);
