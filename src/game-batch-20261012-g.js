import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-12';
const p=t=>`<p>${t}</p>`;
const tp=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});
const off=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'OFFICIAL_CODE_CONTEXT',sourcePublishedAt,checkedAt});
const featured=(key,title,storeUrl,iconUrl)=>`<figure data-ncp-featured-image="${key}" data-ncp-app-icon="true" data-ncp-app-icon-source="${storeUrl}" style="margin:0 0 24px"><a href="${storeUrl}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="${title} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const make=({articleKey,title,english,storeUrl,iconUrl,sourceUrl,references,records,previewHTML,noticeHTML,guideHTML,archiveHTML,searchDescription,keywords,hashtags,benefits=[],type,sourceCheckedAt=checkedAt})=>{
  const model={articleKey,title,previewHTML,featuredHTML:featured(articleKey,title,storeUrl,iconUrl),noticeHTML,guideHTML,archiveHTML,records};
  return {articleKey,approvedForPublish:true,post:{title,content:renderGamePeriodArticle(model),labels:[...new Set(['게임',title,english])]},source:{type,url:sourceUrl,checkedAt:sourceCheckedAt,references,presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,searchDescription,keywords,hashtags,searchMeasurement:{status:'NOT_MEASURED'},benefits}};
};

// 캣 히어로즈 - 고양이 머지 디펜스
const catStore='https://play.google.com/store/apps/details?hl=ko&id=com.poomgames.catheroes';
const catIcon='https://play-lh.googleusercontent.com/n8meM8r8GXp1at42U7k3XxKM9bIWdk2qa47K9dS9vMFbtFFM0oL1viklUXeBsWbfAeT3r3-WXB9SH8k1JWWU%3Dw240-h480';
const catSite='https://www.hykick.com/';
export const catHeroesMergeDefenseArticle=make({
  articleKey:'cat-heroes-merge-defense-codes-202610',title:'캣 히어로즈 - 고양이 머지 디펜스',english:'Cat Heroes Merge Defense',storeUrl:catStore,iconUrl:catIcon,sourceUrl:catStore,
  references:[catStore,catSite],records:[],type:'CAT_HEROES_NO_PUBLIC_REDEEM_CODE_FOUND',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="캣 히어로즈 쿠폰 요약"><div class="ncp-feed-stat"><span>공개 코드</span><strong>0개 확인</strong></div><div class="ncp-feed-stat"><span>공식 앱</span><strong>확인</strong></div><div class="ncp-feed-stat"><span>동명 자료</span><strong>분리</strong></div></div>',
  noticeHTML:'<p>HYKICK의 공식 Google Play 앱을 기준으로 국내외 공개 검색을 확인했지만 이 앱 전용 공개 리딤코드나 쿠폰 입력 체계는 확인하지 못했습니다. 검색에서 노출되는 ‘캣 히어로 쿠폰 알리미’는 다른 게임을 가리켜 제외했습니다.</p>',
  guideHTML:'<section><h3>현재 확인</h3><p>공식 스토어와 개발사 정보에는 공개 쿠폰 입력 경로가 안내되지 않습니다. 향후 게임 내 공지나 공식 개발사 채널에서 전용 코드가 확인되면 이 기록에 추가합니다.</p></section>',
  archiveHTML:`<p><a href="${catStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${catSite}" rel="noopener noreferrer">HYKICK</a></p>`,
  searchDescription:'캣 히어로즈 고양이 머지 디펜스의 쿠폰·리딤코드 공개 여부와 공식 앱 식별 정보를 확인했습니다.',
  keywords:['캣 히어로즈 쿠폰','캣 히어로즈 코드','고양이 머지 디펜스 쿠폰'],hashtags:['#캣히어로즈','#고양이머지디펜스','#게임쿠폰']
});

// Dark War Survival
const dwStore='https://play.google.com/store/apps/details?hl=en-US&id=com.readygo.dark.gp';
const dwIcon='https://play-lh.googleusercontent.com/gaanbGpciRZh801jTahoaImwr96KtBp2Uuez12ww9sIxFQhqieIZgTjB_dGzhCaR1ccM9Eku11FxhOWgoxifwdc%3Dw240-h480';
const dwOfficial='https://darkwar-survival.com/';
const dwGift='https://giftcenter.darkwar-survival.com/';
const dwRewards='https://www.darkwarrewards.com/giftcodes';
const dwVantera='https://vantera.app/de/codes';
const dwPocket='https://www.pocketgamer.com/dark-war-survival/codes/';
const dwClash='https://clashiverse.com/dark-war-survival-codes/';
const dwDownload='https://download.com.vn/code-game-dark-war-survival-208044';

const dwMap=new Map();
const addDW=(code,patch,source)=>{
  const prev=dwMap.get(code);
  if(prev){prev.sources.push(source);prev.evidenceHTML+=patch.evidenceHTML||'';if(patch.latest===true){prev.latest=true;prev.latestEvidence=[prev.latestEvidence,patch.latestEvidence].filter(Boolean).join(' / ');}if(patch.statusLabel)prev.statusLabel=patch.statusLabel;return;}
  dwMap.set(code,{code,sourcePublishedAt:patch.sourcePublishedAt??null,expiry:patch.expiry||'미확인',statusLabel:patch.statusLabel||'제3자 후보·현재 공식 확인 없음',latest:patch.latest===true,...(patch.latest===true?{latestEvidence:patch.latestEvidence}:{}),evidenceHTML:patch.evidenceHTML||'',sources:[source]});
};
for(const code of ['WEBCHOICE','HAUNT7','NEWGIFTCENTER','WELCOMEDWFB','WELCOMEDWX','WELCOMEDWDC']){
  addDW(code,{latest:true,latestEvidence:'DarkWarRewards가 2026-10-12 확인 시 LIVE로 표시했으나 공식 사이트 자체의 공개 코드 목록은 아니므로 계정별 입력 결과는 미확인',statusLabel:(code==='WELCOMEDWFB'||code==='WELCOMEDWDC')?'최신 자료 상충·입력 시도 후보':'제3자 실시간 목록 후보',evidenceHTML:p('독립 Dark War 코드 추적 페이지가 공식 Gift Center를 기준으로 LIVE라고 표시합니다. 공식 발급 원문은 별도 확인되지 않아 입력 시도 후보로 유지합니다.')},tp('DarkWarRewards 실시간 코드 목록',dwRewards));
}
for(const code of ['GAME12','LEAF7','BEARD9']){
  addDW(code,{latest:true,latestEvidence:'Vantera가 2026-10-11~12 확인 화면에서 작동 코드로 표시했으나 독립 팬 도구이므로 공식 발급 원문은 미확인',statusLabel:'제3자 입력 확인 주장·공식 발급 미확인',evidenceHTML:p('Vantera가 공식 Gift Center 기반 확인을 주장하는 현재 목록에 포함하지만 게임사 공식 코드 공지 원문은 찾지 못했습니다.')},tp('Vantera Dark War 코드 확인 목록',dwVantera));
}
for(const code of ['5MILY','DWFBXNYAN','DWDC3GT8']){
  addDW(code,{sourcePublishedAt:'2026-10-11',latest:true,latestEvidence:'Pocket Gamer가 2026-10-11 활성 목록으로 제시했으나 다른 최신 추적 자료와 일부 상태가 충돌',statusLabel:code==='5MILY'||code==='DWDC3GT8'?'최신 자료 상충·입력 시도 후보':'10월 11일 제3자 활성 후보',evidenceHTML:p('Pocket Gamer의 10월 11일 갱신 목록에 활성로 수록됐습니다. 독립 추적 자료의 만료 판정과 일부 충돌하므로 공식 활성으로 승격하지 않습니다.')},tp('Pocket Gamer · Dark War Survival codes','https://www.pocketgamer.com/dark-war-survival/codes/','2026-10-11'));
}
for(const code of ['DWDC12LS','DWDCXAUG','DWDCEN82','DWFBXSNAP','DWDC6R4M','DWFBXNYAN','DWDC7NA2','DWDC150K','DWDC82ML','DWFBX3N5V','DWDCST15','DWDC3S9B','DWFBX4M2Q']){
  addDW(code,{sourcePublishedAt:'2026-10-01',latest:true,latestEvidence:'Clashiverse가 2026-10-01 작동 목록으로 게시했으며 공개 만료일은 확인되지 않음',statusLabel:'10월 1일 제3자 후보·현재 성공 미확인',evidenceHTML:p('10월 1일 공개 목록에서 작동 코드로 소개됐습니다. 10월 12일 현재 공식 발급 원문이나 계정 입력 성공은 확인하지 못했습니다.')},tp('Clashiverse · October 2026 code list',dwClash,'2026-10-01'));
}
for(const code of ['WEBSTORE210','DARK2026','DWAPRIL26','DWDCH6C9','DWDC100KK','DWDC2G5T','DWDC7K9S','DWDCSSL2','DWFB185KHIT']){
  addDW(code,{sourcePublishedAt:'2026-10-11',latest:false,expiry:code==='WEBSTORE210'?'2026-10-10':'종료 보고',statusLabel:'제3자 종료 기록',evidenceHTML:p('Pocket Gamer 10월 11일 갱신 자료에서 만료 목록으로 분류됐습니다.')},tp('Pocket Gamer · expired list',dwPocket,'2026-10-11'));
}
const dwRecords=[...dwMap.values()];
export const darkWarSurvivalArticle=make({
  articleKey:'dark-war-survival-codes-202610',title:'Dark War Survival',english:'Dark War Survival',storeUrl:dwStore,iconUrl:dwIcon,sourceUrl:dwOfficial,
  references:[dwStore,dwOfficial,dwGift,dwRewards,dwVantera,dwPocket,dwClash,dwDownload],records:dwRecords,type:'DARK_WAR_MULTI_SOURCE_CANDIDATES',
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="Dark War Survival 쿠폰 요약"><div class="ncp-feed-stat"><span>수집 기록</span><strong>${dwRecords.length}개</strong></div><div class="ncp-feed-stat"><span>공식 입력</span><strong>운영</strong></div><div class="ncp-feed-stat"><span>최신 판정</span><strong>자료 상충</strong></div></div>`,
  noticeHTML:'<p>공식 Gift Center는 운영 중이지만 공개 코드 목록은 제공하지 않습니다. 10월 최신 자료끼리 활성·만료 판정이 충돌하므로 문자열을 삭제하지 않고 입력 시도 후보와 종료 기록으로 분리했습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>게임에서 왼쪽 위 프로필 → Settings → Copy ID로 UID를 복사한 뒤 공식 Gift Center에 UID와 코드를 입력합니다.</p><div><a href="${dwGift}" rel="noopener noreferrer">공식 Gift Center <span>열기 →</span></a></div></section><section><h3>주의</h3><p>복사 가능 표시는 코드 문자열을 보존했다는 뜻이며 사용 성공을 보장하지 않습니다. 공식 Gift Center가 반환하는 결과를 계정별 최종 판정으로 봅니다.</p></section>`,
  archiveHTML:`<p><a href="${dwOfficial}" rel="noopener noreferrer">공식 사이트</a> · <a href="${dwGift}" rel="noopener noreferrer">공식 Gift Center</a> · <a href="${dwPocket}" rel="noopener noreferrer">Pocket Gamer</a> · <a href="${dwRewards}" rel="noopener noreferrer">DarkWarRewards</a> · <a href="${dwVantera}" rel="noopener noreferrer">Vantera</a> · <a href="${dwClash}" rel="noopener noreferrer">Clashiverse</a></p>`,
  searchDescription:'Dark War Survival 쿠폰 후보와 최신 자료 상충, 공식 Gift Center 입력 방법 및 종료 기록을 정리했습니다.',
  keywords:['Dark War Survival codes','Dark War Survival 쿠폰','다크 워 서바이벌 코드','Dark War gift code'],hashtags:['#DarkWarSurvival','#다크워서바이벌','#게임쿠폰'],
  benefits:[{type:'REDEEM_PORTAL',authority:'OFFICIAL',status:'ACTIVE',benefit:'공식 Gift Center 운영',method:'UID + Gift Code',sourceUrl:dwGift,sourcePublishedAt:null,expiry:null}]
});

// Last Z: Survival Shooter
const lzStore='https://play.google.com/store/apps/details?hl=en_US&id=com.readygo.barrel.gp';
const lzIcon='https://play-lh.googleusercontent.com/q6Mjymkm2z_8p3BVZq4jKpZbZIEVxVaCAZsaaBXSMjf9kexdpkYktJl46JBFfQp1RWh2n10BCbaP42CZWNwgmA%3Dw240-h480';
const lzOfficial='https://last-z.com/';
const lzGams='https://www.gamsgo.com/blog/last-z-survival-shooter-codes';
const lzPocket='https://www.pocketgamer.com/last-z-survival-shooter/codes/';
const lzPro='https://progamepilot.com/last-z-survival-shooter-codes/';
const lzMap=new Map();
const addLZ=(code,patch,source)=>{
  const prev=lzMap.get(code);
  if(prev){prev.sources.push(source);prev.evidenceHTML+=patch.evidenceHTML||'';if(patch.latest===true){prev.latest=true;prev.latestEvidence=[prev.latestEvidence,patch.latestEvidence].filter(Boolean).join(' / ');}if(patch.statusLabel)prev.statusLabel=patch.statusLabel;return;}
  lzMap.set(code,{code,sourcePublishedAt:patch.sourcePublishedAt??null,expiry:patch.expiry||'미확인',statusLabel:patch.statusLabel||'제3자 후보',latest:patch.latest===true,...(patch.latest===true?{latestEvidence:patch.latestEvidence}:{}),evidenceHTML:patch.evidenceHTML||'',sources:[source]});
};
const gamsCurrent=[
  ['LABWORK','2026-10-13','250 배지, 연구 가속, 전기·Zent 상자'],
  ['TANKLZ','2026-10-14','보상 세부 미확인'],
  ['WELCOMELZNV','미확인','커뮤니티 웰컴 보상'],
  ['WELCOMELZNF','미확인','커뮤니티 웰컴 보상'],
  ['THANKU250KCOM','미확인','Golden Wrench·Blueprint·가속·다이아'],
  ['WELCOMELZX','미확인','커뮤니티 웰컴 보상'],
  ['WELCOMELZFB','미확인','커뮤니티 웰컴 보상'],
  ['WELCOMELZDC','미확인','커뮤니티 웰컴 보상']
];
for(const [code,expiry,reward] of gamsCurrent){
  addLZ(code,{sourcePublishedAt:'2026-10-10',expiry,latest:true,latestEvidence:'GamsGo가 2026-10-10 확인한 최신 후보이며 다른 추적 자료와 상태가 다를 수 있다고 명시',statusLabel:'10월 10일 제3자 후보·공식 성공 미확인',evidenceHTML:p(`보고 보상: ${reward}. GamsGo가 최신 후보로 수록했지만 공식 Gift Center의 계정별 결과를 우선합니다.`)},tp('GamsGo · Last Z October codes',lzGams,'2026-10-10'));
}
for(const [code,reward] of [
  ['ZOMBIESIEGETIME','보상 세부 미확인'],
  ['THANU250KCOM','Golden Wrench·Blueprint·가속·다이아'],
  ['LASTZXMAS2425','Badge·연구 가속·Zent/전기 상자·다이아'],
  ['VICTORY280K4UT','모집권·가속·전기·식량·목재']
]){
  addLZ(code,{sourcePublishedAt:'2026-10-11',latest:true,latestEvidence:'Pocket Gamer가 2026-10-11 활성 목록에 수록했으나 같은 자료 또는 다른 10월 자료와 일부 만료 판정이 충돌',statusLabel:(code==='ZOMBIESIEGETIME'||code==='VICTORY280K4UT'||code==='THANU250KCOM')?'최신 자료 상충·정확 문자열 그대로 보존':'10월 11일 제3자 활성 후보',evidenceHTML:p(`보고 보상: ${reward}. 최신 자료의 활성·만료 판정 또는 문자열 철자가 상충해 공식 활성로 단정하지 않습니다.`)},tp('Pocket Gamer · Last Z codes',lzPocket,'2026-10-11'));
}
for(const [code,expiry] of [['TRUCK99','2026-10-06'],['TROOPZ','2026-10-06'],['TRAIN123','2026-09-29'],['GASRUN','2026-09-27'],['GOLOOT','2026-09-22'],['LZCORES','2026-09-15'],['RISINGUP','2026-09-15'],['HEROSTARS','2026-09-08'],['STARTOFSEPT','2026-09-08']]){
  addLZ(code,{sourcePublishedAt:'2026-10-10',expiry,latest:false,statusLabel:'종료 기록',evidenceHTML:p('10월 10일 정리 자료에서 보고된 종료일이 지난 코드로 분리했습니다.')},tp('GamsGo · expired archive',lzGams,'2026-10-10'));
}
const lzRecords=[...lzMap.values()];
export const lastZSurvivalShooterArticle=make({
  articleKey:'last-z-survival-shooter-codes-202610',title:'Last Z: Survival Shooter',english:'Last Z Survival Shooter',storeUrl:lzStore,iconUrl:lzIcon,sourceUrl:lzOfficial,
  references:[lzStore,lzOfficial,lzGams,lzPocket,lzPro],records:lzRecords,type:'LAST_Z_MULTI_SOURCE_CONFLICT',
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="Last Z 쿠폰 요약"><div class="ncp-feed-stat"><span>수집 기록</span><strong>${lzRecords.length}개</strong></div><div class="ncp-feed-stat"><span>공식 공지</span><strong>Special Code</strong></div><div class="ncp-feed-stat"><span>최신 판정</span><strong>자료 상충</strong></div></div>`,
  noticeHTML:'<p>공식 사이트에는 2026년 10월 6일·9월 29일·9월 22일 ‘Special Website Code’ 공지가 확인되지만 공개 검색 결과에서는 해당 동적 공지의 문자열을 직접 읽을 수 없었습니다. 제3자 최신 목록은 서로 충돌하므로 정확한 문자열을 그대로 보존하고 공식 활성로 단정하지 않습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>게임의 프로필 → Settings → Copy ID로 UID를 확인한 뒤 공식 웹사이트의 Gift Code 경로에서 입력합니다. 성공 시 게임 우편함에서 보상을 확인합니다.</p><div><a href="${lzOfficial}" rel="noopener noreferrer">Last Z 공식 사이트 <span>확인 →</span></a></div></section><section><h3>철자 주의</h3><p>THANKU250KCOM과 THANU250KCOM처럼 최신 출처끼리 철자가 다른 경우 임의 수정하지 않고 각각의 출처 문자열을 그대로 남겼습니다.</p></section>`,
  archiveHTML:`<p><a href="${lzOfficial}" rel="noopener noreferrer">공식 사이트·Special Website Code 공지</a> · <a href="${lzGams}" rel="noopener noreferrer">GamsGo 10월 10일 자료</a> · <a href="${lzPocket}" rel="noopener noreferrer">Pocket Gamer 10월 11일 자료</a> · <a href="${lzPro}" rel="noopener noreferrer">ProGamePilot 상태 비교</a></p>`,
  searchDescription:'라스트 Z Last Z Survival Shooter 쿠폰 후보, 최신 코드 자료 상충, 종료 기록과 공식 Special Website Code 공지를 정리했습니다.',
  keywords:['라스트 Z 쿠폰','Last Z codes','Last Z Survival Shooter 쿠폰','LABWORK','TANKLZ'],hashtags:['#라스트Z','#LastZ','#LastZSurvivalShooter','#게임쿠폰'],
  benefits:[{type:'OFFICIAL_CODE_EVENT',authority:'OFFICIAL',status:'OBSERVED',benefit:'Special Website Code 공지',method:'공식 사이트 공지 및 Gift Code 입력',sourceUrl:lzOfficial,sourcePublishedAt:'2026-10-06',expiry:null}]
});

// 다크슬레이어 : 방치형 RPG 키우기
const dsStore='https://play.google.com/store/apps/details?hl=ko&id=com.gamepub.zhteam.g';
const dsIcon='https://play-lh.googleusercontent.com/c3sM4fUBgY-dcn-RFA4VDtyWwf87xRFLxemfYD1q8daNUXihkzWwLvt_k8YivmyztSNV0aboKTJ3_pI6GcDK9A%3Dw240-h480';
const dsLounge='https://game.naver.com/lounge/Ghost_Hunter/home';
const dsHistory='https://coingos.tistory.com/690';
const dsCodes=['welcomeds','gogods','loveslyer','sorrydss','1130gift','godgame','betterds','f1weekend','goodsund','slyergift','godslyer','sgiftsya'];
const dsRecords=dsCodes.map(code=>({
  code,sourcePublishedAt:'2023-12-15',latest:false,expiry:'현재 미확인',statusLabel:'2023 공개 기록·2026 현재 미확인',
  evidenceHTML:p('2023년 12월 다크슬레이어 전용 공략에서 쿠폰 문자열과 게임 내 설정 → 쿠폰입력 경로가 기록됐습니다. 2026년 10월 현재 공식 라운지의 동일 발급 원문이나 계정 사용 성공은 확인하지 못해 과거 기록으로 분리합니다.'),
  sources:[tp('다크슬레이어 방치형 RPG 쿠폰 공략',dsHistory,'2023-12-15')]
}));
export const darkSlayerIdleArticle=make({
  articleKey:'dark-slayer-idle-codes-202610',title:'다크슬레이어 : 방치형 RPG 키우기',english:'Dark Slayer AFK RPG',storeUrl:dsStore,iconUrl:dsIcon,sourceUrl:dsLounge,
  references:[dsStore,dsLounge,dsHistory],records:dsRecords,type:'DARK_SLAYER_OFFICIAL_LOUNGE_HISTORICAL_CODES',
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="다크슬레이어 쿠폰 요약"><div class="ncp-feed-stat"><span>과거 기록</span><strong>${dsRecords.length}개</strong></div><div class="ncp-feed-stat"><span>현재 공식</span><strong>문자열 미확인</strong></div><div class="ncp-feed-stat"><span>쿠폰 기능</span><strong>공식 안내</strong></div></div>`,
  noticeHTML:'<p>Google Play 공식 소개는 공식 게임라운지에서 쿠폰 보상을 공개한다고 안내합니다. 이번 10월 조사에서 현재 발급 중인 코드 문자열을 공식 원문으로 확인하지 못했으므로 2023년 공개 기록 12개를 과거 이력으로만 보존합니다. 후속작 다크슬레이어2 자료는 섞지 않았습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>기존 전용 공략 기준 게임 우측 메뉴 → 설정 → 쿠폰입력에서 문자열을 등록합니다. 오래된 기록은 만료됐을 수 있습니다.</p><div><a href="${dsLounge}" rel="noopener noreferrer">공식 게임라운지 <span>확인 →</span></a></div></section><section><h3>게임 식별</h3><p>대상은 패키지 com.gamepub.zhteam.g의 ‘다크슬레이어 : 방치형 RPG 키우기’입니다. 2026년 후속작 다크슬레이어2와 분리했습니다.</p></section>`,
  archiveHTML:`<p><a href="${dsStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${dsLounge}" rel="noopener noreferrer">공식 게임라운지</a> · <a href="${dsHistory}" rel="noopener noreferrer">2023 쿠폰 기록</a></p>`,
  searchDescription:'다크슬레이어 방치형 RPG 쿠폰 2023 공개 기록 12개와 2026년 현재 공식 라운지·쿠폰 기능 확인 상태를 정리했습니다.',
  keywords:['다크슬레이어 쿠폰','다크슬레이어 방치형 RPG 쿠폰','Dark Slayer AFK code','welcomeds','gogods'],hashtags:['#다크슬레이어','#다크슬레이어쿠폰','#방치형RPG','#게임쿠폰']
});

// Zombie Tower
const ztStore='https://play.google.com/store/apps/details?hl=ko&id=com.pi.zombie.tower';
const ztIcon='https://play-lh.googleusercontent.com/Q3ZcQA5m7pA2QjE5iY5x3dEMMp73wGFHOfs3YxA5134p8eXdczpxo80HplO0gWdLoDBu6vGA_2_mniWc6oaHqA%3Dw240-h480';
const ztSite='https://www.pigame-mobile.com/';
const ztCheckedAt='2026-10-13';
export const zombieTowerArticle=make({
  articleKey:'zombie-tower-codes-202610',title:'Zombie Tower',english:'Zombie Tower',storeUrl:ztStore,iconUrl:ztIcon,sourceUrl:ztStore,sourceCheckedAt:ztCheckedAt,
  references:[ztStore,ztSite],records:[],type:'ZOMBIE_TOWER_NO_PUBLIC_REDEEM_CODE_FOUND',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="Zombie Tower 쿠폰 요약"><div class="ncp-feed-stat"><span>공개 코드</span><strong>0개 확인</strong></div><div class="ncp-feed-stat"><span>공식 앱</span><strong>Pi Game</strong></div><div class="ncp-feed-stat"><span>최근 앱 업데이트</span><strong>2026.05.11</strong></div></div>',
  noticeHTML:'<p data-refresh-evidence="zombie-tower-20261013">2026년 10월 13일 국내외 공개 자료를 다시 확인했지만 Pi Game의 Zombie Tower(com.pi.zombie.tower) 전용 공개 리딤코드나 공식 쿠폰 입력 체계는 찾지 못했습니다. 검색되는 Roblox Zombie Tower Defense·Zombie Tower의 코드는 다른 게임이므로 이 글의 쿠폰으로 등록하지 않습니다.</p>',
  guideHTML:'<section><h3>현재 확인</h3><p>Google Play 공식 앱은 Pi Game의 com.pi.zombie.tower이며 2026년 5월 11일 업데이트가 확인됩니다. 공식 스토어와 Pi Game 개발사 사이트에서는 이 모바일 게임 전용 공개 쿠폰 번호나 리딤 메뉴 안내가 확인되지 않았습니다. 향후 공식 앱·개발사 채널에서 입력형 혜택이 공개되면 이 기록에 추가합니다.</p></section>',
  archiveHTML:`<p><a href="${ztStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${ztSite}" rel="noopener noreferrer">Pi Game 개발사 사이트</a></p>`,
  searchDescription:'Pi Game Zombie Tower 쿠폰을 2026년 10월 13일 다시 조사했습니다. 현재 공개 리딤코드는 확인되지 않았으며 Roblox 동명 게임 코드는 분리했습니다.',
  keywords:['Zombie Tower coupon','Zombie Tower codes','좀비 타워 쿠폰','좀비 타워 코드','Pi Game Zombie Tower'],hashtags:['#ZombieTower','#좀비타워','#PiGame','#게임쿠폰']
});
