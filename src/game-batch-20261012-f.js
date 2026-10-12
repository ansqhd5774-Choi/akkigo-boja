import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-12';
const tp=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});
const featured=(key,title,storeUrl,iconUrl)=>`<figure data-ncp-featured-image="${key}" data-ncp-app-icon="true" data-ncp-app-icon-source="${storeUrl}" style="margin:0 0 24px"><a href="${storeUrl}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="${title} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const make=({articleKey,title,english,storeUrl,iconUrl,sourceUrl,references,records,previewHTML,noticeHTML,guideHTML,archiveHTML,searchDescription,keywords,hashtags,benefits=[],type})=>{
  const model={articleKey,title,previewHTML,featuredHTML:featured(articleKey,title,storeUrl,iconUrl),noticeHTML,guideHTML,archiveHTML,records};
  return {articleKey,approvedForPublish:true,post:{title,content:renderGamePeriodArticle(model),labels:['게임',title,english]},source:{type,url:sourceUrl,checkedAt,references,presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,searchDescription,keywords,hashtags,searchMeasurement:{status:'NOT_MEASURED'},benefits}};
};

// 흑마법사: 무한 디펜스 — 범용 문자열도 사용자 운영 기준에 따라 삭제하지 않는다.
const blackStore='https://play.google.com/store/apps/details?hl=ko&id=com.arumgames.darkwizard';
const blackIcon='https://play-lh.googleusercontent.com/V-N9P4SlyN37LU31cy7_Mtk0TgZqWE-fGpjkc321huMMEJAJjvc0xgKsMgnVWvooVopKzkU1dxgzkdg7xLRW%3Dw240-h480';
const blackOfficial='https://www.arumgames.com/';
const blackSource='https://game.edu.kg/ko/%ED%9D%91%EB%A7%88%EB%B2%95%EC%82%AC%3A-%EB%AC%B4%ED%95%9C-%EB%94%94%ED%8E%9C%EC%8A%A4/%EC%BF%A0%ED%8F%B0/';
const blackRecords=['WELCOME','VIP111','VIP222','VIP555','VIP888','VIP999','FBGIFT','DCGIFT'].map(code=>({
  code,sourcePublishedAt:null,latest:true,
  latestEvidence:'제3자 GameEDU 페이지가 2026-09-16 작동 중 목록으로 표시했다. 공식 발급 원문·만료일·현재 계정 입력 성공은 확인되지 않아 입력 시도 후보로만 유지한다.',
  expiry:'미확인',statusLabel:'범용 문자열 후보·공식 발급 근거 미확인',
  evidenceHTML:'<p>GameEDU가 이 게임의 코드 목록으로 게시했지만 WELCOME/VIP/FBGIFT/DCGIFT 계열은 다른 게임에서도 반복되는 문자열입니다. 후보로 보존하되 공식 발급이나 현재 작동을 뜻하지 않습니다.</p>',
  sources:[tp('GameEDU · 흑마법사: 무한 디펜스 코드 목록',blackSource)]
}));
export const blackWizardInfiniteDefenseArticle=make({
  articleKey:'dark-wizard-infinite-defense-codes-202610',title:'흑마법사: 무한 디펜스',english:'Dark Wizard Infinite Defense',storeUrl:blackStore,iconUrl:blackIcon,sourceUrl:blackOfficial,
  references:[blackStore,blackOfficial,blackSource],records:blackRecords,type:'DARK_WIZARD_THIRD_PARTY_CANDIDATES',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="흑마법사 무한 디펜스 쿠폰 요약"><div class="ncp-feed-stat"><span>입력 후보</span><strong>8개</strong></div><div class="ncp-feed-stat"><span>공식 발급</span><strong>미확인</strong></div><div class="ncp-feed-stat"><span>게임 식별</span><strong>공식 확인</strong></div></div>',
  noticeHTML:'<p>공식 Google Play에서 Arumgames의 흑마법사: 무한 디펜스를 확인했습니다. 공개 코드 검색에서는 GameEDU가 WELCOME·VIP·FBGIFT 계열 8개를 이 게임의 코드로 제시하지만, 게임사 발급 원문과 현재 계정 사용 성공은 확인되지 않았습니다. 운영 기준에 따라 범용 문자열도 삭제하지 않고 입력 후보로 보존합니다.</p>',
  guideHTML:'<section><h3>입력</h3><p>제3자 안내에서는 게임 내 메뉴·설정의 쿠폰 입력 기능을 안내합니다. 코드가 거절되면 만료·계정 제한·미발급 후보 가능성이 있으므로 공식 발급으로 오인하지 마세요.</p></section><section><h3>확인 기준</h3><p>Google Play의 게임·개발사 식별은 공식 확인했지만, 코드 문자열 자체는 제3자 출처입니다. 사용 성공·보상·만료는 별도 확인 전 미확인으로 유지합니다.</p></section>',
  archiveHTML:`<p><a href="${blackStore}" rel="noopener noreferrer">Google Play</a> · <a href="${blackOfficial}" rel="noopener noreferrer">Arumgames</a> · <a href="${blackSource}" rel="noopener noreferrer">제3자 코드 목록</a></p>`,
  searchDescription:'흑마법사 무한 디펜스 쿠폰 후보 8개와 공식 발급 확인 상태, 입력 시 주의사항을 정리했습니다.',
  keywords:['흑마법사 무한 디펜스 쿠폰','흑마법사 쿠폰','무한 디펜스 코드','WELCOME','VIP111'],hashtags:['#흑마법사무한디펜스','#흑마법사쿠폰','#게임쿠폰']
});

// 픽셀 디펜더스
const pixelStore='https://play.google.com/store/apps/details?hl=ko&id=com.ondi.fortias.defense';
const pixelIcon='https://play-lh.googleusercontent.com/icWo5PcneLK3ttCyUqDf55nLriIK4NZytDppG0ZbB30W7cRiUwVeS6gybOXU8WbQnALzplIt1PZad_JnAlS0%3Dw240-h480';
const pixelOfficial='https://www.ondigames.com/';
const pixelMr='https://www.mrguider.org/roblox/pixel-defenders-codes/';
const pixelPg='https://progamegeek.com/pixel-defenders-codes/';
const pixelGv='https://gamevoyant.com/codes/pixel-defenders-codes';
const pixelRows=[
['OCTCODE','빵 30, 영웅 뽑기 티켓 3, 장비 강화 스크롤 30','2026-11-01','전체 계정 후보',1,'제3자 최신 후보·공식 발급 원문 미확인'],
['MIDAUTUMN','영웅 뽑기 티켓 10, 루비 300, 골드 30,000','2026-10-09','',0,'제3자 기록·기간 종료'],
['SERVERGIFT','루비 300','2026-10-09','',0,'제3자 기록·기간 종료'],
['SERVER25','루비 2,000, 빵 60, 골드 100,000','2026-10-24','Global 25 서버',1,'제3자 서버 한정 후보'],
['SERVER24','루비 2,000, 빵 60, 골드 100,000','2026-10-22','Global 24 서버',1,'제3자 서버 한정 후보'],
['SERVER23','루비 2,000, 빵 60, 골드 100,000','2026-10-21','Global 23 서버',1,'제3자 서버 한정 후보'],
['SERVER22','루비 2,000, 빵 60, 골드 100,000','2026-10-19','Global 22 서버',1,'제3자 서버 한정 후보'],
['SERVER21','루비 2,000, 빵 60, 골드 100,000','2026-10-18','Global 21 서버',1,'제3자 서버 한정 후보'],
['SERVER20','루비 2,000, 빵 60, 골드 100,000','2026-10-18','Global 20 서버',1,'제3자 서버 한정 후보'],
['SERVER19','루비 2,000, 빵 60, 골드 100,000','2026-10-16','Global 19 서버',1,'제3자 서버 한정 후보'],
['SERVER18','루비 2,000, 빵 60, 골드 100,000','2026-10-14','Global 18 서버',1,'제3자 서버 한정 후보'],
['SERVER17','루비 2,000, 빵 60, 골드 100,000','2026-10-13','Global 17 서버',1,'제3자 서버 한정 후보'],
['SERVER16','루비 2,000, 빵 60, 골드 100,000','2026-10-12','Global 16 서버',1,'제3자 후보·10월12일 종료일 표기'],
['SERVER15','보상 세부 미확인','2026-10-11','Global 15 서버',0,'제3자 기록·기간 종료'],
['SERVERALL3','루비 200, 골드 20,000','2026-10-10','전체 서버',0,'제3자 기록·기간 종료'],
['SERVER14','루비 2,000, 빵 60, 골드 100,000','2026-10-10','Global 14 서버',0,'제3자 기록·기간 종료'],
['SERVERALL2','루비 200, 골드 20,000','2026-10-07','전체 서버',0,'제3자 기록·기간 종료'],
['SERVER13','루비 2,000, 빵 60, 골드 100,000','2026-10-07','Global 13 서버',0,'제3자 기록·기간 종료'],
['ALLSERVER2','루비 200, 골드 20,000','2026-10-06','전체 서버',0,'제3자 기록·기간 종료'],
['SERVER12','루비 2,000, 빵 60, 골드 100,000','2026-10-06','Global 12 서버',0,'제3자 기록·기간 종료'],
['ALLSERVER1','루비 200, 골드 20,000','2026-10-03','전체 서버',0,'제3자 기록·기간 종료'],
['SERVER11','루비 2,000, 빵 60, 골드 110,000','2026-10-03','Global 11 서버',0,'제3자 기록·기간 종료'],
['SERVERALL','루비 200, 골드 20,000','2026-09-30','전체 서버',0,'제3자 기록·기간 종료'],
['SERVER10','루비 2,000, 빵 60, 골드 100,000','2026-09-30','Global 10 서버',0,'제3자 기록·기간 종료'],
['SEPCODE','빵 30, 영웅 뽑기 티켓 3, 골드 20,000','2026-10-01','',0,'제3자 기록·기간 종료'],
['SERVERCODE','루비 1,000','미확인','',1,'제3자 후보·만료 미확인'],
['HOTFIXCODE','루비 300, 골드 30,000','2026-09-04','',0,'제3자 기록·기간 종료'],
['ALLSERVER','루비 1,000, 빵 30, 골드 50,000','2026-09-21','전체 서버',0,'제3자 기록·기간 종료'],
['PDNEWSERVER','루비 2,000, 빵 60, 골드 100,000','2026-09-21','Global 6~9 서버',0,'제3자 기록·기간 종료'],
['GACHAREWARD','루비 500','미확인','',0,'제3자 자료 상충·현재 적용 미확인'],
['PDWELCOME','골드 20,000, 영웅 뽑기 티켓 10, 루비 300, 빵 60','무기한 표기','',1,'제3자 후보·무기한 표기 공식 미확인'],
['ARENACODE','루비 3,000, 골드 100,000','2026-08-20','',0,'제3자 기록·기간 종료'],
['PDSERVER','빵 30, 영웅 뽑기 티켓 10, 골드 50,000','2026-08-20','',0,'제3자 기록·기간 종료'],
['FDSERVER2','루비 1,000','2026-08-20','',0,'제3자 기록·기간 종료'],
['GLOBAL01','루비 600, 골드 30,000','2026-09-07','',0,'제3자 기록·기간 종료']
];
const pixelRecords=pixelRows.map(([code,reward,expiry,condition,latest,statusLabel])=>({
  code,sourcePublishedAt:'2026-10-02',latest:latest===1,
  ...(latest?{latestEvidence:'2026-10-10 갱신 제3자 목록과 2026-10-05 상태 페이지에서 입력 후보로 남아 있으며, 표시된 종료일이 2026-10-12 이후이거나 만료일이 미확인이다. 공식 발급 원문·계정 성공은 미확인이다.'}:{}),
  expiry,statusLabel,
  evidenceHTML:`<p>보상: ${reward}.${condition?` 조건: ${condition}.`:''} 공개 코드 목록 3곳을 교차 확인했습니다. 공식 발급 원문과 개별 계정 입력 성공은 별도 미확인입니다.</p>`,
  sources:[tp('MrGuider · Pixel Defenders Codes',pixelMr,'2026-10-02'),tp('ProGameGeek · Pixel Defenders Codes',pixelPg,'2026-10-04'),tp('GameVoyant · Pixel Defenders Codes',pixelGv,'2026-10-05')]
}));
export const pixelDefendersArticle=make({
  articleKey:'pixel-defenders-codes-202610',title:'픽셀 디펜더스',english:'Pixel Defenders',storeUrl:pixelStore,iconUrl:pixelIcon,sourceUrl:pixelOfficial,
  references:[pixelStore,pixelOfficial,pixelMr,pixelPg,pixelGv],records:pixelRecords,type:'PIXEL_DEFENDERS_MULTI_SOURCE_CANDIDATES',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="픽셀 디펜더스 쿠폰 요약"><div class="ncp-feed-stat"><span>수집 기록</span><strong>35개</strong></div><div class="ncp-feed-stat"><span>10/12 입력 후보</span><strong>13개</strong></div><div class="ncp-feed-stat"><span>서버 조건</span><strong>다수</strong></div></div>',
  noticeHTML:'<p>10월 2~5일 공개된 코드 자료 3곳을 교차해 35개 문자열을 보존했습니다. 10월 12일 기준 종료일이 지난 항목은 기록으로 분리하고, 종료일이 남았거나 미확인인 13개는 입력 후보로 표시합니다. 모두 제3자 자료이므로 공식 발급·현재 계정 성공과는 구분합니다.</p>',
  guideHTML:'<section><h3>입력</h3><p>제3자 가이드 기준으로 프로필 또는 아바타에서 Gift Code 메뉴를 열어 코드를 입력한 뒤 우편함에서 보상을 확인합니다.</p></section><section><h3>서버 한정</h3><p>SERVER25~SERVER16 등은 특정 Global 서버 전용으로 안내됩니다. 서버가 다르면 기간 내라도 적용되지 않을 수 있습니다.</p></section>',
  archiveHTML:`<p><a href="${pixelStore}" rel="noopener noreferrer">Google Play</a> · <a href="${pixelOfficial}" rel="noopener noreferrer">ONDI 공식 사이트</a> · <a href="${pixelMr}" rel="noopener noreferrer">MrGuider</a> · <a href="${pixelPg}" rel="noopener noreferrer">ProGameGeek</a> · <a href="${pixelGv}" rel="noopener noreferrer">GameVoyant</a></p>`,
  searchDescription:'픽셀 디펜더스 쿠폰 35개 기록과 10월 12일 입력 후보 13개, 서버별 조건과 종료일을 정리했습니다.',
  keywords:['픽셀 디펜더스 쿠폰','Pixel Defenders codes','OCTCODE','SERVER25','PDWELCOME'],hashtags:['#픽셀디펜더스','#픽셀디펜더스쿠폰','#게임쿠폰']
});

// 냥코 대전쟁 — PONOS 공식 공지 기준 시리얼 코드 지원 종료.
const battleStore='https://play.google.com/store/apps/details?hl=ko&id=jp.co.ponos.battlecatskr';
const battleIcon='https://play-lh.googleusercontent.com/9fY1igv-MK4667G0NWBTVvtUCzQoY-j_9Q0ehaCsybocI-U2txomDZQ7MXexpgxgBxXNI_pSlhkhDwyzZBRYl5w%3Dw240-h480';
const battleOfficial='https://www.ponos.jp/ko/games/thebattlecats/';
const battleSerial='https://ponos.s3.amazonaws.com/information/appli/battlecats/serial/kr/index.html';
export const battleCatsArticle=make({
  articleKey:'battle-cats-codes-202610',title:'냥코 대전쟁',english:'The Battle Cats',storeUrl:battleStore,iconUrl:battleIcon,sourceUrl:battleSerial,
  references:[battleStore,battleOfficial,battleSerial],records:[],type:'BATTLE_CATS_SERIAL_SUPPORT_ENDED',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="냥코 대전쟁 쿠폰 요약"><div class="ncp-feed-stat"><span>공개 코드</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>시리얼 코드</span><strong>지원 종료</strong></div><div class="ncp-feed-stat"><span>근거</span><strong>PONOS 공식</strong></div></div>',
  noticeHTML:'<p>PONOS 공식 시리얼 코드 공지는 시리얼 코드 지원이 더 이상 불가능하다고 안내합니다. 따라서 과거 시리얼 문자열을 현재 입력 가능한 쿠폰으로 재활성화하지 않습니다.</p>',
  guideHTML:'<section><h3>현재 상태</h3><p>현재 공개 문자열 쿠폰을 입력하는 공식 시리얼 코드 경로는 지원 종료 상태입니다. 이벤트·로그인 보상은 공식 게임 공지에서 별도로 확인해야 합니다.</p></section><section><h3>주의</h3><p>과거 시리얼 코드나 다른 지역판 문자열을 현재 한국판 사용 가능 코드로 표시하지 않습니다.</p></section>',
  archiveHTML:`<p><a href="${battleStore}" rel="noopener noreferrer">Google Play</a> · <a href="${battleOfficial}" rel="noopener noreferrer">PONOS 공식 게임 페이지</a> · <a href="${battleSerial}" rel="noopener noreferrer">PONOS 시리얼 코드 공지</a></p>`,
  searchDescription:'냥코 대전쟁 쿠폰과 시리얼 코드 상태를 확인했습니다. PONOS 공식 공지 기준 시리얼 코드 지원은 종료됐습니다.',
  keywords:['냥코 대전쟁 쿠폰','냥코대전쟁 코드','The Battle Cats serial code'],hashtags:['#냥코대전쟁','#냥코대전쟁쿠폰','#게임쿠폰']
});

// 라스트 워: 서바이벌 — 10월 자료 충돌을 숨기지 않고 후보/종료로 분리.
const lastStore='https://play.google.com/store/apps/details?hl=ko&id=com.fun.lastwar.gp';
const lastIcon='https://play-lh.googleusercontent.com/pugw09Lkr4dsuVQWRFVp82xe9YXD1ST5wPJRS-aj2Msr5oq297sR0KESQUHLgwR-e5IyHwnqTe_f00FAokXlGMc%3Dw240-h480';
const lastOfficial='https://www.lastwar.com/ko/main.html';
const lastGift='https://lastwar-h5.lastwargame.com/platform/cdkey/index.html#/login';
const lastDig='https://www.digwow.net/%EB%9D%BC%EC%8A%A4%ED%8A%B8-%EC%9B%8C-%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const lastCq='https://couponquest.net/games/last-war-survival';
const lastTop='https://www.topuplive.com/ko/news/last-war-survival-game-codes-november-2025.html';
const lastRecords=[
  ...['lastwar111','lastwar666','lastwar888','lastwar999','LASTWAR','playlastwar'].map(code=>({code,sourcePublishedAt:null,latest:true,latestEvidence:'DIGWOW가 2026-10-11 갱신 목록에서 사용 가능 후보로 제시한다. 같은 시기 TopUpLive는 활성 코드가 없다고 안내해 자료가 상충하므로 공식 활성 코드로 단정하지 않는다.',expiry:'미확인',statusLabel:'제3자 후보·현재 자료 상충',evidenceHTML:'<p>DIGWOW의 10월 11일 갱신 목록에 수록됐지만 TopUpLive의 10월 1일 글은 현재 활성 코드가 없다고 안내합니다. 문자열은 입력 후보로 보존하며 작동 보장은 하지 않습니다.</p>',sources:[tp('DIGWOW · 라스트 워 쿠폰 모음',lastDig),tp('TopUpLive · Last War codes',lastTop,'2026-10-01')]})),
  ...[['LASTWARGIFT','골드 5,000,000 / 드론 경험치 부품 50'],['SURVIVAL300','건설 가속 60분 10 / 연구 가속 60분 10']].map(([code,reward])=>({code,sourcePublishedAt:'2026-09-12',latest:true,latestEvidence:'CouponQuest가 2026-09-12 게시 코드로 등록하고 9월 13일 기준 사용 가능 후보로 유지했다. 10월 다른 자료와 상충하므로 현재 계정 성공은 미확인이다.',expiry:'미확인',statusLabel:'제3자 후보·10월 현재 자료 상충',evidenceHTML:`<p>제3자 기록 보상: ${reward}. 공식 발급 원문·만료일·현재 계정 입력 성공은 확인되지 않았습니다.</p>`,sources:[tp('CouponQuest · 라스트 워 쿠폰',lastCq,'2026-09-12'),tp('TopUpLive · Last War codes',lastTop,'2026-10-01')]})),
  {code:'LWVDAY26',sourcePublishedAt:'2026-08-20',latest:false,expiry:'종료 보고',statusLabel:'제3자 기록·종료 보고',evidenceHTML:'<p>CouponQuest에는 2026-08-20 게시 기록으로 남아 있으나 TopUpLive는 만료 코드로 분류합니다. 공식 발급 원문과 정확한 만료 시각은 별도 미확인입니다.</p>',sources:[tp('CouponQuest · 라스트 워 쿠폰',lastCq,'2026-08-20'),tp('TopUpLive · Last War codes',lastTop,'2026-10-01')]},
  {code:'LWDC400K',sourcePublishedAt:'2026-10-01',latest:false,expiry:'만료 보고',statusLabel:'제3자 기록·만료',evidenceHTML:'<p>TopUpLive가 과거 보상 코드로 기록하고 현재 만료 목록으로 분류합니다. 현재 사용 가능한 코드로 표시하지 않습니다.</p>',sources:[tp('TopUpLive · Last War codes',lastTop,'2026-10-01')]}
];
export const lastWarSurvivalArticle=make({
  articleKey:'last-war-survival-codes-202610',title:'라스트 워: 서바이벌',english:'Last War Survival',storeUrl:lastStore,iconUrl:lastIcon,sourceUrl:lastOfficial,
  references:[lastStore,lastOfficial,lastGift,lastDig,lastCq,lastTop],records:lastRecords,type:'LAST_WAR_CONFLICTING_PUBLIC_CANDIDATES',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="라스트 워 서바이벌 쿠폰 요약"><div class="ncp-feed-stat"><span>입력 후보</span><strong>8개</strong></div><div class="ncp-feed-stat"><span>종료·충돌</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>공식 교환</span><strong>경로 확인</strong></div></div>',
  noticeHTML:'<p>10월 자료가 서로 충돌합니다. DIGWOW와 CouponQuest는 여러 입력 후보를 제시하지만 TopUpLive는 10월 활성 코드가 없다고 안내합니다. 후보 문자열을 삭제하지 않고 보존하되 공식 활성 코드로 단정하지 않습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>공식 라스트 워 웹사이트의 교환 코드 경로에서 UID와 코드를 확인해 입력합니다. 제3자 후보는 성공을 보장하지 않으므로 하나씩 결과를 확인하세요.</p><div><a href="${lastGift}" rel="noopener noreferrer">공식 교환 코드 페이지 <span>확인 →</span></a></div></section><section><h3>자료 충돌</h3><p>같은 10월에도 사이트별 판정이 다릅니다. 현재 후보·종료 이력을 분리하고 실제 계정 성공으로 확대하지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${lastStore}" rel="noopener noreferrer">Google Play</a> · <a href="${lastOfficial}" rel="noopener noreferrer">공식 사이트</a> · <a href="${lastGift}" rel="noopener noreferrer">공식 교환 코드</a> · <a href="${lastDig}" rel="noopener noreferrer">DIGWOW</a> · <a href="${lastCq}" rel="noopener noreferrer">CouponQuest</a> · <a href="${lastTop}" rel="noopener noreferrer">TopUpLive</a></p>`,
  searchDescription:'라스트 워 서바이벌 쿠폰 후보 8개와 종료·상충 기록 2개, 공식 교환 코드 경로를 함께 정리했습니다.',
  keywords:['라스트 워 서바이벌 쿠폰','Last War codes','LASTWARGIFT','SURVIVAL300','lastwar111'],hashtags:['#라스트워서바이벌','#라스트워쿠폰','#게임쿠폰'],
  benefits:[{type:'REDEEM_PORTAL',authority:'OFFICIAL',status:'ACTIVE_PATH',benefit:'공식 교환 코드 입력 페이지',method:'UID + 코드 입력',sourceUrl:lastGift,sourcePublishedAt:null,expiry:null}]
});
