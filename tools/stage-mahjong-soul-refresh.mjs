import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const KEY='mahjong-soul-kr-codes-202610';
const SOURCE_PATH='src/game-batch-20261012-h.js';
const CHECKED='2026-10-13';
const STORE='https://play.google.com/store/apps/details?hl=ko&id=com.YoStarKR.MahjongSoul';
const ICON='https://play-lh.googleusercontent.com/58OMjHdJO91jepPVficmQYxhLTI4A82gZj2AqYFLODmIV6ZpruzfAeXdb_xukt28B89cOhjS9Vy4bb1XP5IZA9E%3Dw240-h480';
const OFFICIAL='https://mahjongsoul.yo-star.com/kr/';
const CAFE='https://cafe.naver.com/mahjongsoul';
const X='https://twitter.com/MahjongSoul_KR';
const LEVEL='https://levelgeeks.net/mahjong-soul-codes/';
const VOYANT='https://gamevoyant.com/codes/mahjong-soul-codes';
const REDDIT_HAPPY='https://www.reddit.com/r/mahjongsoul/comments/1spgwza/livestream_gift_code/';
const REDDIT_SAO='https://www.reddit.com/r/mahjongsoul/comments/1sqdwnr/gift_code_from_todays_sao_tournament_final/';
const REDDIT_ZAWA='https://www.reddit.com/r/mahjongsoul/comments/1u5etah/zawa_zawa_cup_gift_code_rxdpsakma4a3/';
const JP_LOGIN='https://mahjongsoul.com/news/391';

let source=readFileSync(SOURCE_PATH,'utf8');
const start=source.indexOf("const mahjongStore=");
if(start<0)throw Error('MAHJONG_SOUL_BLOCK_START_MISSING');

const noticeHTML='<p data-refresh-evidence="mahjong-soul-20261013">2026년 10월 13일 재조사에서 한국판 공식 채널의 10월 신규 공용 쿠폰은 확인하지 못했습니다. HAPPYANNIV2026·WKJZSH7MA5AM은 10월 글로벌 제3자 목록에 계속 표시되지만 최초 공개일은 각각 2026년 4월 19일·4월 20일입니다. 한국판 공식 발급·현재 적용은 확인되지 않아 입력 후보로만 유지합니다. RXDPSAKMA4A3은 10월 일부 목록의 working 표기와 달리 최초 공개 글에 2026년 6월 15일 19:00(UTC-7) 만료가 명시되어 종료 기록을 우선합니다.</p>';
const guideHTML='<section><h3>입력</h3><p>2026년 글로벌 커뮤니티 사용 보고는 설정 → Other/기타 → Gift Code 경로를 안내합니다. HAPPYANNIV2026은 Steam·iPhone 사용 보고가 있었고, WKJZSH7MA5AM은 지역 제한 또는 중복 보상 제한으로 보이는 실패 보고도 함께 있습니다. 한국판에서 메뉴와 적용 여부가 다를 수 있으므로 게임 내 결과를 최종 기준으로 확인하세요.</p></section>';
const archiveHTML=`<p><a href="${OFFICIAL}" rel="noopener noreferrer">한국 공식 사이트</a> · <a href="${CAFE}" rel="noopener noreferrer">공식 카페</a> · <a href="${LEVEL}" rel="noopener noreferrer">10월 글로벌 목록</a> · <a href="${VOYANT}" rel="noopener noreferrer">9월 글로벌 목록</a></p><section data-regional-benefit="mahjong-soul-20261013"><h3>현재 코드 외 혜택</h3><p><a href="${JP_LOGIN}" rel="noopener noreferrer">일본판 공식 로그인 보너스</a>는 2026년 10월 12일 12:00부터 10월 21일 05:59까지 진행되며 기간 중 최대 7회 보상을 받을 수 있다고 안내합니다. 일본판 공식 혜택이며 한국판 동일 적용은 확인되지 않았습니다.</p></section>`;
const benefits=[{kind:'LOGIN_BONUS',region:'JP',method:'기간 중 매일 로그인 후 참배 버튼으로 수령·최대 7회',status:'ACTIVE',source:JP_LOGIN,sourcePublishedAt:null,startAt:'2026-10-12 12:00 JST',expiry:'2026-10-21 05:59 JST',publicCode:false,checkedAt:CHECKED,conditions:'일본판 공식 공지. 한국판 동일 적용 미확인'}];

const block=`const mahjongStore='${STORE}';
const mahjongIcon='${ICON}';
const mahjongOfficial='${OFFICIAL}';
const mahjongCafe='${CAFE}';
const mahjongX='${X}';
const mahjongLevel='${LEVEL}';
const mahjongVoyant='${VOYANT}';
const mahjongHappyReddit='${REDDIT_HAPPY}';
const mahjongSaoReddit='${REDDIT_SAO}';
const mahjongZawaReddit='${REDDIT_ZAWA}';
const mahjongJpLogin='${JP_LOGIN}';
const mahjongCheckedAt='${CHECKED}';
const mahjongTp=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt:mahjongCheckedAt});
const mahjongRecords=[
  {code:'HAPPYANNIV2026',sourcePublishedAt:'2026-04-19',latest:true,latestEvidence:'2026-10-05 LevelGeeks와 2026-09-23 GameVoyant가 working/verified 후보로 계속 표시하지만 한국판 공식 발급·현재 적용은 확인되지 않음',expiry:'미확인',statusLabel:'글로벌 제3자 최신 후보·한국판 적용 미확인',evidenceHTML:p('2026년 4월 19일 글로벌 커뮤니티에서 공개·사용 보고가 있었고 10월 제3자 목록에도 남아 있습니다. 다만 한국판 공식 채널의 발급 공지는 확인하지 못했습니다.'),sources:[mahjongTp('Mahjong Soul livestream gift code',mahjongHappyReddit,'2026-04-19'),mahjongTp('LevelGeeks Mahjong Soul codes',mahjongLevel,'2026-10-05'),mahjongTp('GameVoyant Mahjong Soul codes',mahjongVoyant,'2026-09-23')]},
  {code:'WKJZSH7MA5AM',sourcePublishedAt:'2026-04-20',latest:true,latestEvidence:'2026-10-05 LevelGeeks와 2026-09-23 GameVoyant가 현재 후보로 표시함. 2026-04-20 원문 댓글에는 성공·지역 제한/중복 제한 가능성 보고가 함께 있음',expiry:'미확인',statusLabel:'글로벌 제3자 최신 후보·지역 제한 보고·한국판 적용 미확인',evidenceHTML:p('최초 공개 근거는 2026년 4월 20일 SAO Tournament 결승 코드입니다. 성공 보고가 있으나 다른 지역판에서는 실패했다는 댓글도 있어 한국판 적용을 단정하지 않습니다.'),sources:[mahjongTp('SAO Tournament final gift code',mahjongSaoReddit,'2026-04-20'),mahjongTp('LevelGeeks Mahjong Soul codes',mahjongLevel,'2026-10-05'),mahjongTp('GameVoyant Mahjong Soul codes',mahjongVoyant,'2026-09-23')]},
  {code:'RXDPSAKMA4A3',sourcePublishedAt:'2026-06-14',latest:false,expiry:'2026-06-15 19:00 UTC-7',statusLabel:'명시 만료·10월 제3자 목록과 상충',evidenceHTML:p('최초 공개 커뮤니티 글에 2026년 6월 15일 19:00(UTC-7)까지라고 명시되어 있습니다. 10월 LevelGeeks와 9월 GameVoyant가 working으로 남겨 둔 내용과 상충하므로 명시 만료 근거를 우선해 종료 이력으로 보존합니다.'),sources:[mahjongTp('Zawa Zawa Cup gift code',mahjongZawaReddit,'2026-06-14'),mahjongTp('LevelGeeks Mahjong Soul codes',mahjongLevel,'2026-10-05'),mahjongTp('GameVoyant Mahjong Soul codes',mahjongVoyant,'2026-09-23')]},
  {code:'EESQSXTMADAH',sourcePublishedAt:'2026-02-02',latest:false,expiry:'종료 보고',statusLabel:'글로벌 과거 종료 기록',evidenceHTML:p('글로벌 커뮤니티에서 공개 뒤 만료로 수정된 과거 코드입니다.'),sources:[mahjongTp('Mahjong Soul community archive','https://www.reddit.com/r/mahjongsoul/','2026-02-02')]},
  {code:'Q7DDQQWMARAG',sourcePublishedAt:'2025-04-12',latest:false,expiry:'종료·정확한 기한 미확인',statusLabel:'글로벌 과거 기록',evidenceHTML:p('2025년 글로벌 커뮤니티에서 사용 보고가 있던 과거 문자열입니다.'),sources:[mahjongTp('Mahjong Soul community archive','https://www.reddit.com/r/mahjongsoul/','2025-04-12')]},
  {code:'E3G9QQCMA7AW',sourcePublishedAt:'2025-03-17',latest:false,expiry:'종료·정확한 기한 미확인',statusLabel:'글로벌 과거 기록',evidenceHTML:p('2025년 글로벌 커뮤니티에서 사용 보고가 있던 과거 문자열입니다.'),sources:[mahjongTp('Mahjong Soul community archive','https://www.reddit.com/r/mahjongsoul/','2025-03-17')]}
];
export const mahjongSoulKrArticle=make({articleKey:'${KEY}',title:'작혼: 리치 마작',english:'Mahjong Soul',storeUrl:mahjongStore,iconUrl:mahjongIcon,sourceUrl:mahjongOfficial,sourceCheckedAt:mahjongCheckedAt,references:[mahjongStore,mahjongOfficial,mahjongCafe,mahjongX,mahjongLevel,mahjongVoyant,mahjongHappyReddit,mahjongSaoReddit,mahjongZawaReddit,mahjongJpLogin],records:mahjongRecords,type:'MAHJONG_SOUL_GLOBAL_CANDIDATES_KR_UNVERIFIED_WITH_JP_BENEFIT',previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="작혼 쿠폰 요약"><div class="ncp-feed-stat"><span>최신 후보</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>과거 기록</span><strong>4개</strong></div><div class="ncp-feed-stat"><span>지역 공식 혜택</span><strong>1건</strong></div></div>',noticeHTML:${JSON.stringify(noticeHTML)},guideHTML:${JSON.stringify(guideHTML)},archiveHTML:${JSON.stringify(archiveHTML)},searchDescription:'작혼 리치 마작 쿠폰을 2026년 10월 13일 다시 확인했습니다. 글로벌 최신 후보 2개, 명시 만료·과거 기록 4개, 일본판 공식 로그인 보너스를 한국판 적용 여부와 구분해 정리했습니다.',keywords:['작혼 쿠폰','작혼 리치 마작 쿠폰','Mahjong Soul codes','HAPPYANNIV2026','WKJZSH7MA5AM'],hashtags:['#작혼','#작혼리치마작','#리치마작','#MahjongSoul','#게임쿠폰'],benefits:${JSON.stringify(benefits)}});
`;

source=source.slice(0,start)+block;
writeFileSync(SOURCE_PATH,source);

const moduleUrl=pathToFileURL(resolve(SOURCE_PATH)).href+'?refresh='+Date.now();
const {mahjongSoulKrArticle}=await import(moduleUrl);
if(!mahjongSoulKrArticle)throw Error('MAHJONG_SOUL_IMPORT_FAILED');
if(mahjongSoulKrArticle.source.checkedAt!==CHECKED)throw Error('MAHJONG_SOUL_CHECKED_AT_DRIFT');
const rows=mahjongSoulKrArticle.source.gamePeriodModel.records;
if(rows.length!==6)throw Error('MAHJONG_SOUL_RECORD_COUNT_DRIFT_'+rows.length);
const latest=rows.filter(x=>x.latest).map(x=>x.code).sort().join(',');
if(latest!==['HAPPYANNIV2026','WKJZSH7MA5AM'].sort().join(','))throw Error('MAHJONG_SOUL_LATEST_DRIFT_'+latest);
const sao=rows.find(x=>x.code==='WKJZSH7MA5AM');
if(sao?.sourcePublishedAt!=='2026-04-20')throw Error('MAHJONG_SOUL_SAO_SOURCE_DATE_DRIFT');
const zawa=rows.find(x=>x.code==='RXDPSAKMA4A3');
if(zawa?.latest!==false||zawa?.expiry!=='2026-06-15 19:00 UTC-7')throw Error('MAHJONG_SOUL_ZAWA_EXPIRY_DRIFT');
if((mahjongSoulKrArticle.source.benefits||[]).length!==1)throw Error('MAHJONG_SOUL_BENEFIT_DRIFT');
const body=mahjongSoulKrArticle.post.content;
if(!body.includes('mahjong-soul-20261013'))throw Error('MAHJONG_SOUL_REFRESH_MARKER_MISSING');
if(!body.includes('일본판 공식 로그인 보너스'))throw Error('MAHJONG_SOUL_JP_BENEFIT_MISSING');
const copies=[...body.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
if(copies.length!==6||new Set(copies).size!==6)throw Error('MAHJONG_SOUL_COPY_COUNT_DRIFT_'+copies.length);
const draftHtml='drafts/'+KEY+'.html';
if(existsSync(draftHtml))writeFileSync(draftHtml,body+'\n');
const draftJson='drafts/'+KEY+'.json';
if(existsSync(draftJson))writeFileSync(draftJson,JSON.stringify(mahjongSoulKrArticle,null,2)+'\n');
console.log('MAHJONG_SOUL_REFRESH_STAGED',KEY,copies.length,mahjongSoulKrArticle.source.benefits.length,CHECKED);
