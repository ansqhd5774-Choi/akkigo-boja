import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-15';
const articleKey='archer-castle-idle-codes-202610';
const GAME='아처캐슬 키우기';
const googlePlay='https://play.google.com/store/apps/details?id=com.springgames.archercastle&hl=ko&gl=KR';
const appStore='https://apps.apple.com/kr/app/%EC%95%84%EC%B2%98%EC%BA%90%EC%8A%AC-%ED%82%A4%EC%9A%B0%EA%B8%B0-%EB%B0%A9%EC%B9%98%ED%98%95-rpg/id6788215554';
const officialCafe='https://cafe.naver.com/archercastle';
const officialDiscord='https://discord.gg/vKqA4vcJyu';
const memu='https://www.memuplay.com/blog/archer-castle-afk-idle-rpg-codes.html';
const proGameWire='https://progamewire.com/archer-castle-codes/';
const mrGuider='https://www.mrguider.org/codes/archer-castle-codes/';
const play100='https://play100.dasfl.com/%EC%95%84%EC%B2%98%EC%BA%90%EC%8A%AC-%ED%82%A4%EC%9A%B0%EA%B8%B0-%EA%B0%80%EC%9D%B4%EB%93%9C';
const gameEdu='https://game.edu.kg/ko/archer-castle-%3A-afk-idle-rpg/%EC%BF%A0%ED%8F%B0/';
const appIcon='https://play-lh.googleusercontent.com/usvCI1Lo7H4Zxg_DB9uo_2cMcbL-ov3k0CRjcDo2olQ9jMgHsduMf0VdU5jC4Bm9vjxOM9o2tpjhT2mO6Eil=s0-br30';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const thirdParty=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});

const srcMemu=thirdParty('MEmu · Archer Castle 코드 목록',memu,'2026-10-10');
const srcPro=thirdParty('ProGameWire · Archer Castle 코드 목록',proGameWire,'2026-10-01');
const srcMr=thirdParty('MrGuider · Archer Castle 코드 목록',mrGuider,'2026-09-30');
const srcPlay100=thirdParty('Play100 · 아처캐슬 키우기 가이드',play100,'2026-09-03');
const srcEdu=thirdParty('GameEDU · Archer Castle 쿠폰 목록',gameEdu,null);

const candidate=(code,{sources,sourcePublishedAt=null,expiry='미확인',reward='보상 미확인',statusLabel='제3자 현재 후보·공식 발급/실사용 미확인'})=>({
  code,
  sourcePublishedAt,
  latest:true,
  latestEvidence:`2026-10-15 확인 시 공개 제3자 자료에서 ${code}를 Archer Castle 코드로 확인했다. 제3자 자료가 안내한 보상은 ${reward}, 만료 표기는 ${expiry}이며 SPRING Games 직접 발급 원문과 실제 계정 입력 성공은 확인되지 않았다.`,
  expiry,
  status:'UNVERIFIED',
  statusLabel,
  sources,
  evidenceHTML:`<p>제3자 Archer Castle 코드 자료에서 <strong>${code}</strong>를 확인했습니다. 안내 보상은 ${reward}입니다. 공식 네이버 카페의 개별 발급 원문을 직접 확인하지 못했으므로 공식 현재 쿠폰으로 승격하지 않고 입력 후보로 보존합니다.</p>`
});

const expired=(code,{sources,sourcePublishedAt,expiry,reward='보상 미확인',note=''})=>({
  code,
  sourcePublishedAt,
  latest:false,
  latestEvidence:null,
  expiry,
  status:'EXPIRED',
  statusLabel:'종료 기록·현재 목록과 분리',
  sources,
  evidenceHTML:`<p>${reward}. ${expiry} 종료 근거가 확인되어 현재 입력 후보에서 제외하고 과거 기록으로 보존합니다.${note?` ${note}`:''}</p>`
});

const currentRecords=[
  candidate('TESTRAID01',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'2026-10-15 23:59 KST',reward:'무기 450·코어 450·합동스킬 180·엘몬 40·부품 180·주사위 3000·수배서 1·정령코어 7'}),
  candidate('SIRYUN1004',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'2026-10-15 23:59 KST',reward:'합동스킬 소환권 30 외 추가 소환권·정령코어'}),
  candidate('REVIEW100',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'별도 공지 전까지·제3자 표기',reward:'다이아 10,000'}),
  candidate('REVIEW300',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'별도 공지 전까지·제3자 표기',reward:'무기 소환권 300'}),
  candidate('SIRYUN100',{sources:[srcMemu],sourcePublishedAt:'2026-10-10',reward:'엘몬 소환권 100'}),
  candidate('THANKS5000C',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'별도 공지 전까지·제3자 표기',reward:'엘몬 소환권 200'}),
  candidate('THANKS5000B',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'별도 공지 전까지·제3자 표기',reward:'무기 소환권 200'}),
  candidate('THANKS5000A',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'별도 공지 전까지·제3자 표기',reward:'다이아 30,000'}),
  candidate('CAFELOVE4T',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'2026-10-25 23:59 KST·제3자 표기',reward:'다이아 40,000'}),
  candidate('3SECONDS',{sources:[srcMr,srcMemu,srcPro],sourcePublishedAt:'2026-09-30',expiry:'2027-10-27 23:59 KST·제3자 표기',reward:'엘몬 소환권 30'}),
  candidate('SUPER10',{sources:[srcMr,srcMemu,srcPro],sourcePublishedAt:'2026-09-30',expiry:'2027-12-31 23:59 KST·제3자 표기',reward:'엘몬 소환권 100'}),
  candidate('NEWGAME',{sources:[srcMr,srcMemu,srcPro],sourcePublishedAt:'2026-09-30',expiry:'2032-07-31 23:59 KST·제3자 표기',reward:'다이아 1,000'}),
  candidate('2000CAFEJOIN',{sources:[srcMr,srcMemu,srcPro],sourcePublishedAt:'2026-09-30',expiry:'2040-09-07 23:59 KST·제3자 표기',reward:'다이아 20,000'}),
  candidate('CAFE1000JOIN',{sources:[srcMr,srcMemu,srcPro,srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2040-12-31 23:59 KST·제3자 표기',reward:'다이아 10,000'}),
  candidate('LAUNCHING0820',{sources:[srcMr,srcMemu,srcPro,srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2035-10-31 23:59 KST·제3자 표기',reward:'다이아 10,000'}),
  candidate('OPEN0820',{sources:[srcMr,srcMemu,srcPro,srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2036-10-31 23:59 KST·제3자 표기',reward:'엘몬 소환권 300'}),
  ...['GAMEEDU','WELCOME','VIP222','VIP333','VIP555','VIP666','VIP777','VIP999','GO2024','FBGIFT','DCGIFT'].map(code=>candidate(code,{sources:[srcEdu],sourcePublishedAt:null,reward:'GameEDU 목록상 보상 미확인',statusLabel:'제3자 현재 후보·범용형 문자열·공식 발급 미확인'}))
];

const expiredRecords=[
  expired('CLEANUSER3',{sources:[srcMemu,srcPro],sourcePublishedAt:'2026-10-01',expiry:'2026-10-12',reward:'합동스킬 소환권 300'}),
  expired('AFFLE2',{sources:[srcMemu],sourcePublishedAt:'2026-10-10',expiry:'2026-10-11',reward:'다이아 20,000'}),
  expired('CAFEJOIN3T',{sources:[srcMr,srcMemu,srcPro],sourcePublishedAt:'2026-09-30',expiry:'2026-09-22',reward:'다이아 30,000',note:'일부 최신 목록의 Working 표기보다 MEmu의 명시적 과거 만료일을 우선했습니다.'}),
  expired('0830UPDATEDAY',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-06'}),
  expired('0830LATEUPDATE',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-06'}),
  expired('0830NIGHTUPDATE',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-06'}),
  expired('DUNGEON100PLUS',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-06'}),
  expired('SEPTCOUPON',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-11'}),
  expired('0826SORRY',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-30'}),
  expired('0826APOLOGIZE',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-30'}),
  expired('0826BUGFIX',{sources:[srcPlay100],sourcePublishedAt:'2026-09-03',expiry:'2026-09-30'})
];

const records=[...currentRecords,...expiredRecords];
const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 입력 후보</span><strong>${currentRecords.length}개</strong></div><div class="ncp-feed-stat"><span>공식 직접확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>종료 기록</span><strong>${expiredRecords.length}개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:`<p>2026년 10월 15일 기준 Google Play·App Store에서 SPRING Games의 <strong>아처캐슬 키우기 : 방치형 RPG</strong>와 공식 네이버 카페 연결을 확인했습니다. 다만 현재 접근 가능한 공식 원천에서 개별 쿠폰 발급 원문을 직접 확인하지 못했으므로 <strong>공식 직접확인 현재 코드는 0개</strong>로 유지합니다.</p><p>MEmu·ProGameWire·MrGuider·Play100·GameEDU를 교차 조사해 현재 입력 후보 ${currentRecords.length}개와 종료 기록 ${expiredRecords.length}개를 분리했습니다. 특히 CAFEJOIN3T처럼 최신 Working 표기와 명시적 과거 만료일이 충돌하면 과거 만료일을 우선했습니다. 수년 뒤 만료로 적힌 항목도 공식 기한이 아니라 제3자 표기 그대로 보존한 것입니다.</p>`,
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>MEmu와 MrGuider 가이드는 게임 오른쪽 위 <strong>메뉴 → 설정 → Enter Coupon</strong>에서 코드를 입력한 뒤 우편함에서 보상을 받는 경로를 안내합니다. 공식 스토어 설명에서는 이 메뉴 경로 자체를 확인하지 못했으므로 실제 게임 화면에 해당 메뉴가 있을 때만 후보 코드를 시도하세요.</p><div><a href="${officialCafe}" rel="noopener noreferrer">아처캐슬 키우기 공식 네이버 카페 <span>열기 →</span></a></div></section><section><h3>10월 확인 기준</h3><p>TESTRAID01과 SIRYUN1004는 제3자 자료 기준 10월 15일 23:59 KST까지로 안내되어 있어 현재 후보에 포함했습니다. 복사 버튼은 문자열 복사만 수행하며 실제 계정 사용 성공을 의미하지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${appStore}" rel="noopener noreferrer">App Store 공식 앱</a> · <a href="${officialCafe}" rel="noopener noreferrer">공식 네이버 카페</a> · <a href="${officialDiscord}" rel="noopener noreferrer">공식 Discord</a> · <a href="${memu}" rel="noopener noreferrer">MEmu 코드 목록</a> · <a href="${proGameWire}" rel="noopener noreferrer">ProGameWire 코드 목록</a> · <a href="${mrGuider}" rel="noopener noreferrer">MrGuider 코드 목록</a> · <a href="${play100}" rel="noopener noreferrer">Play100 과거 기록</a> · <a href="${gameEdu}" rel="noopener noreferrer">GameEDU 후보 목록</a></p>`,
  records
};

export const archerCastleArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'Archer Castle']
  },
  source:{
    type:'ARCHER_CASTLE_GLOBAL_CODE_RESEARCH',
    url:googlePlay,
    checkedAt,
    references:[googlePlay,appStore,officialCafe,officialDiscord,memu,proGameWire,mrGuider,play100,gameEdu],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:`아처캐슬 키우기 쿠폰을 2026년 10월 15일 기준 조사했습니다. 공식 직접확인 현재 코드는 0개이며, 제3자 현재 입력 후보 ${currentRecords.length}개와 종료 기록 ${expiredRecords.length}개를 출처·만료 조건과 함께 구분합니다.`,
    keywords:['아처캐슬 키우기 쿠폰','아처캐슬 쿠폰','Archer Castle codes','아처캐슬 쿠폰 코드','아처캐슬 쿠폰 입력','Archer Castle redeem code'],
    hashtags:['#아처캐슬키우기','#아처캐슬쿠폰','#ArcherCastle','#게임쿠폰'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:currentRecords.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:expiredRecords.map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    benefits:[]
  }
};
