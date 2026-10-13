import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='ttukka-pet-survival-codes-202610';
const GAME='뚜까펫: 서바이벌';

const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.farlightgames.pgame.gp';
const appStore='https://apps.apple.com/kr/app/%EB%9A%9C%EA%B9%8C%ED%8E%AB-%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C/id6741567125';
const officialSite='https://cckr.farlightgames.com/';
const pacpik='https://pacpik.com/packs/ttukka-pet-survival/official/';
const noona='https://noona.help/game/%EB%9A%9C%EA%B9%8C%ED%8E%AB-%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C';
const pocketTactics='https://www.pockettactics.com/clash-of-critters/codes';
const pocketGamer='https://www.pocketgamer.com/clash-of-critters/codes/';
const beebom='https://beebom.com/clash-of-critters-codes/';
const gameGuide='https://www.game.guide/clash-of-critters-codes';
const softit='https://softit.tistory.com/367';
const clashCritters='https://www.clashcritters.com/';
const ucn='https://ucngame.com/codes/clash-of-critters-codes/';
const gameedu='https://game.edu.kg/ko/%EB%9A%9C%EA%B9%8C%ED%8E%AB%3A-%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C/%EC%BF%A0%ED%8F%B0/';
const linegames='https://www.linegames.org/ko/%EB%9A%9C%EA%B9%8C%ED%8E%AB%3A-%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C-%EC%BF%A0%ED%8F%B0/';
const digwow='https://www.digwow.net/%EB%9A%9C%EA%B9%8C%ED%8E%AB-%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C';
const aayyy='https://www.aayyy.com/clash-of-critters/codes';
const appIcon='https://play-lh.googleusercontent.com/nIjO9pFz1R7G_wct00QMBKVqAmLHs2TqiaCmSUJfnKPw7yG_VzSmp26TRGCmm98v-Mye0MtsW_xz8CHNdIFD1A=s512-rw';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const third=(name,url,{sourcePublishedAt=null,updatedAt=null}={})=>({
  name,
  url,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  sourcePublishedAt,
  ...(updatedAt?{updatedAt}:{}),
  checkedAt
});

const src={
  pacpik:()=>third('PacPik · 뚜까펫 공식정보/쿠폰 집계',pacpik,{updatedAt:'2026-10-14'}),
  noona:()=>third('CouponNoona · 뚜까펫 서바이벌 리딤코드 14개',noona,{updatedAt:'2026-10-12'}),
  pocketTactics:()=>third('Pocket Tactics · Clash of Critters codes',pocketTactics,{updatedAt:'2026-10-09'}),
  pocketGamer:()=>third('Pocket Gamer · Clash of Critters codes',pocketGamer,{updatedAt:'2026-10-04'}),
  beebom:()=>third('Beebom · Clash of Critters Codes',beebom,{updatedAt:'2026-10-01'}),
  gameGuide:()=>third('Game.Guide · Clash of Critters Codes',gameGuide,{updatedAt:'2026-10-13'}),
  softit:()=>third('신삭플래시 · 뚜까펫 쿠폰 및 티어표',softit,{sourcePublishedAt:'2026-10-02',updatedAt:'2026-10-03'}),
  clashCritters:()=>third('ClashCritters.com · Active Codes',clashCritters,{updatedAt:'2026-09-26'}),
  ucn:()=>third('UCNGame · Clash of Critters Codes',ucn,{updatedAt:'2026-10-07'}),
  gameedu:()=>third('GameEDU · 뚜까펫: 서바이벌 쿠폰 목록',gameedu,{updatedAt:'2026-09-14'}),
  line:()=>third('LINEGames · 뚜까펫: 서바이벌 쿠폰 목록',linegames,{updatedAt:'2026-10-06'}),
  digwow:()=>third('DIGWOW · 뚜까펫: 서바이벌 쿠폰 모음',digwow,{updatedAt:'2026-10-13'}),
  aayyy:()=>third('AAYYY · Clash of Critters Codes',aayyy,{updatedAt:'2026-10-12'})
};

const coreCodes=[
  'tatatata','tatamoon','ttukkapet26','steeamertata','dcardtatago','bulipaohuata',
  'Welcome2026','openfesta26','openfestb26','openfestc26',
  'hellotatari','goonbug','weeklygift','welcomegift'
];

const expiry={
  tatatata:'2026-10-31 (제3자 최신 표기)',
  tatamoon:'2026-10-24 (제3자 최신 표기)',
  ttukkapet26:'2026-11-27 (제3자 최신 표기)',
  steeamertata:'2026-11-27 (제3자 최신 표기)',
  dcardtatago:'2026-11-27 (제3자 최신 표기)',
  bulipaohuata:'2026-11-27 (제3자 최신 표기)',
  Welcome2026:'2026-10-30 (제3자 최신 표기)',
  openfesta26:'2026-11-27 (일부 자료 10-30 표기)',
  openfestb26:'2026-11-27 (일부 자료 10-30 표기)',
  openfestc26:'2026-11-27 (일부 자료 10-30 표기)',
  hellotatari:'현재 11-27 표기·과거 만료 보고 상충',
  goonbug:'현재 11-27 표기·과거 만료 보고 상충',
  weeklygift:'2026-11-27 (제3자 최신 표기)',
  welcomegift:'2026-11-27 (제3자 최신 표기)'
};

const reward={
  tatatata:'두리안 1개·구슬 200개·캡슐 10개로 안내되는 자료가 있습니다.',
  tatamoon:'구슬 20·캔디 1,800·은괴 15·금괴 3·타타 캡슐 1·도시락 1·비스킷 1로 반복 안내됩니다.',
  ttukkapet26:'캔디 1,500·은괴 5·타타 캡슐 1로 안내되는 자료가 있습니다.',
  steeamertata:'캔디 1,500·은괴 5·타타 캡슐 1로 안내되는 자료가 있습니다.',
  dcardtatago:'캔디 1,000·은괴 1·비스킷 1로 안내되는 자료가 있습니다.',
  bulipaohuata:'캔디 1,000·은괴 1·비스킷 1로 안내되는 자료가 있습니다.',
  Welcome2026:'캔디 2,000·도시락 1·구슬 60·은괴 100·타타 캡슐 1로 안내되는 자료가 있습니다.',
  openfesta26:'캔디 3,000·타타 캡슐 1·상점 티켓/은괴 5로 자료별 표현이 다릅니다.',
  openfestb26:'캔디 1,000~1,500·상점 티켓/은괴 1·비스킷 1로 자료별 표현이 다릅니다.',
  openfestc26:'캔디 1,000·상점 티켓/은괴 1·비스킷 1로 안내되는 자료가 있습니다.',
  hellotatari:'캔디 4,000·타타 캡슐 3·구슬/핀볼 100~1,000으로 자료가 상충합니다.',
  goonbug:'Goonbug/그린비틀 1·도시락 1·캔디 4,000으로 반복 안내됩니다.',
  weeklygift:'구슬/핀볼 50·타타 캡슐 5로 반복 안내됩니다.',
  welcomegift:'구슬/핀볼 100·타타 캡슐 5·희귀 캡슐 1로 반복 안내됩니다.'
};

function sourcesFor(code){
  const common=[src.noona(),src.pacpik(),src.softit()];
  if(['tatamoon','openfesta26','openfestb26','openfestc26','hellotatari','goonbug','weeklygift','welcomegift'].includes(code))common.push(src.beebom());
  if(['tatamoon','openfesta26','openfestb26','hellotatari','goonbug','weeklygift','welcomegift'].includes(code))common.push(src.pocketTactics());
  if(['tatamoon','openfesta26','openfestb26','weeklygift','welcomegift'].includes(code))common.push(src.gameGuide());
  if(['hellotatari','goonbug'].includes(code))common.push(src.pocketGamer());
  if(['ttukkapet26','steeamertata','openfesta26','openfestb26','openfestc26','hellotatari','goonbug'].includes(code))common.push(src.ucn());
  if(['tatamoon','Welcome2026','openfesta26','openfestb26','dcardtatago','steeamertata','weeklygift','welcomegift','hellotatari','goonbug'].includes(code))common.push(src.clashCritters());
  return common;
}

const coreRecord=code=>{
  const conflict=['hellotatari','goonbug'].includes(code);
  const casing=['tatamoon','Welcome2026'].includes(code);
  return {
    code,
    sourcePublishedAt:code==='hellotatari'||code==='goonbug'?null:'2026-10-02',
    latest:true,
    latestEvidence:conflict
      ?`2026-10-14 재조사에서 ${code}는 한국 최신 집계와 10월 공략 여러 곳에 현재 코드로 남아 있으나 Pocket Gamer는 과거 만료로 분류한다. 공식 FARLIGHT 발급 원문과 실제 계정 입력 성공은 확인되지 않았다.`
      :`2026-10-14 재조사에서 ${code}가 한국 최신 집계와 국내외 10월 공략에서 반복 확인됐다. 공식 FARLIGHT 발급 원문과 실제 계정 입력 성공은 확인되지 않았다.`,
    expiry:expiry[code]||'미확인',
    status:'UNVERIFIED',
    statusLabel:conflict
      ?'복수 출처 현재 후보·과거 만료 보고 상충'
      :casing?'복수 출처 현재 후보·대소문자 표기 주의':'복수 출처 현재 후보·공식 발급 원문 미확인',
    sources:sourcesFor(code),
    evidenceHTML:`<p>${reward[code]||'보상은 제3자 자료에서만 확인됐습니다.'} 공식 FARLIGHT 원문에서 같은 코드·보상·만료 조건을 직접 확인하지 못했으므로 현재 입력 후보로만 표시합니다.${conflict?' 최신 사용 가능 자료와 과거 만료 자료가 동시에 존재해 상충 상태로 보존합니다.':''}${casing?' 일부 해외 자료는 대문자 또는 소문자 형태로 표기하므로 화면에 표시된 문자열 그대로 입력하는 편이 안전합니다.':''}</p>`
  };
};

const variantRecords=[
  {
    code:'openfestc',
    sourcePublishedAt:null,
    latest:true,
    latestEvidence:'Pocket Tactics·Pocket Gamer·Game.Guide의 2026년 10월 현재 목록은 openfestc26이 아니라 openfestc로 표기한다. 한국 자료의 openfestc26과 문자열이 달라 별도 후보로 보존한다.',
    expiry:'미확인',
    status:'UNVERIFIED',
    statusLabel:'해외 현재 후보·openfestc26과 표기 상충',
    sources:[src.pocketTactics(),src.pocketGamer(),src.gameGuide()],
    evidenceHTML:'<p>한국 자료의 openfestc26과 달리 복수 해외 10월 자료가 openfestc를 현재 코드로 표시합니다. 코드가 대소문자뿐 아니라 문자열 자체가 달라 둘 다 입력 후보로 보존합니다.</p>'
  }
];

const gameEduCodes=['GAMEEDU','WELCOME','VIP222','VIP333','VIP555','VIP666','VIP999','VIP2024'];
const lineCodes=['LINEGAMES','WELCOME','VIP111','VIP333','VIP888','VIP999','VIP2024','DCGIFT'];
const genericCodes=[...new Set([...gameEduCodes,...lineCodes])];

const genericRecords=genericCodes.map(code=>({
  code,
  sourcePublishedAt:null,
  latest:true,
  latestEvidence:`2026-10-14 확인 시 ${code}가 GameEDU 또는 LINEGames의 뚜까펫 전용 페이지에 노출돼 있다. FARLIGHT 직접 발급 원문·정확한 만료·실제 계정 성공은 확인되지 않았다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:'제3자 현재 후보·범용/제휴 문자열·공식 발급 미확인',
  sources:[
    ...(gameEduCodes.includes(code)?[src.gameedu()]:[]),
    ...(lineCodes.includes(code)?[src.line()]:[])
  ],
  evidenceHTML:'<p>GameEDU·LINEGames 계열 페이지에서 확인한 문자열입니다. 운영사 직접 발급 자료가 아니므로 범용 또는 제휴형 문자열일 가능성을 배제하지 않고 UNVERIFIED 입력 후보로 보존합니다.</p>'
}));

const digwowRecords=['TUKKAPET777','SURVIVAL2024'].map(code=>({
  code,
  sourcePublishedAt:null,
  latest:true,
  latestEvidence:`2026-10-14 확인 시 DIGWOW 뚜까펫 쿠폰 모음에 ${code}가 현재 사용 가능 후보로 노출됐다. 다른 현재 목록과 공식 FARLIGHT 원문에서는 교차 확인되지 않았다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:'단일 제3자 현재 후보·교차 확인 부족',
  sources:[src.digwow()],
  evidenceHTML:'<p>DIGWOW의 2026-10-13 갱신 쿠폰 모음에서 확인했습니다. 다른 현재 자료와 운영사 원문에서 교차 확인되지 않아 단일 출처 후보로만 보존합니다.</p>'
}));

const aayyyRecords=['WELCOME2024','CRITTERS777','PLAYCOC2024','GIFT4U'].map(code=>({
  code,
  sourcePublishedAt:null,
  latest:true,
  latestEvidence:`2026-10-14 확인 시 AAYYY의 2026-10-12 갱신 Clash of Critters 코드 페이지에 ${code}가 현재 코드로 노출됐다. 다른 주요 10월 목록과 공식 FARLIGHT 원문에서는 교차 확인되지 않았다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:'단일 해외 제3자 현재 후보·교차 확인 부족',
  sources:[src.aayyy()],
  evidenceHTML:'<p>해외 단일 코드 집계에서 확인했지만 다른 주요 10월 자료와 교차되지 않았습니다. 삭제하지 않고 입력 시도 후보로 보존하되 사용 가능하다고 단정하지 않습니다.</p>'
}));

const records=[...coreCodes.map(coreRecord),...variantRecords,...genericRecords,...digwowRecords,...aayyyRecords];

const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 입력 후보</span><strong>${records.length}개</strong></div><div class="ncp-feed-stat"><span>복수 출처 핵심 코드군</span><strong>14개</strong></div><div class="ncp-feed-stat"><span>공식 발급 직접 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>전체 보존 기록</span><strong>${records.length}개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 Google Play·App Store에서 FARLIGHT가 서비스하는 뚜까펫: 서바이벌을 확인했습니다. 공식 앱 페이지에서는 쿠폰 문자열이나 발급 공지를 확인하지 못해 <strong>운영사 직접 발급 확인 코드는 0개</strong>로 분류합니다.</p><p>다만 CouponNoona·PacPik·국내 공략과 Beebom·Pocket Tactics·Game.Guide 등 10월 자료에서 14개 코드군이 반복 확인됩니다. 추가로 openfestc 표기 변형, GameEDU·LINEGames의 범용/제휴 후보, DIGWOW·AAYYY의 단일 출처 후보도 삭제하지 않고 UNVERIFIED로 보존했습니다. 특히 goonbug·hellotatari는 최신 사용 가능 자료와 과거 만료 자료가 충돌합니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>복수 10월 가이드가 같은 경로를 안내합니다. 튜토리얼을 마친 뒤 메인 화면의 친구/소셜 아이콘을 열고 톱니바퀴 설정으로 이동해 아래쪽의 교환 코드 또는 Redemption Code 메뉴에서 문자열을 정확히 입력합니다. 대소문자를 구분할 수 있으므로 표기 그대로 복사하는 편이 안전합니다.</p><div><a href="${googlePlay}" rel="noopener noreferrer">뚜까펫: 서바이벌 Google Play <span>열기 →</span></a></div></section><section><h3>확인 기준</h3><p>현재 페이지에 노출된 사실, 여러 자료에서 반복된 사실, FARLIGHT가 직접 발급한 사실, 실제 계정에서 입력 성공한 사실을 서로 구분합니다. 현재 목록은 모두 입력 시도 후보이며 복사 완료를 사용 성공으로 보지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${appStore}" rel="noopener noreferrer">App Store 공식 앱</a> · <a href="${officialSite}" rel="noopener noreferrer">FARLIGHT 공식 사이트</a> · <a href="${noona}" rel="noopener noreferrer">CouponNoona 14개 목록</a> · <a href="${pacpik}" rel="noopener noreferrer">PacPik 집계</a> · <a href="${pocketTactics}" rel="noopener noreferrer">Pocket Tactics</a> · <a href="${gameGuide}" rel="noopener noreferrer">Game.Guide</a> · <a href="${gameedu}" rel="noopener noreferrer">GameEDU 후보</a> · <a href="${linegames}" rel="noopener noreferrer">LINEGames 후보</a></p>`,
  records
};

export const ttukkaPetSurvivalArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'뚜까펫','Clash of Critters']
  },
  source:{
    type:'TTUKKA_PET_SURVIVAL_GLOBAL_CODE_RESEARCH',
    url:googlePlay,
    checkedAt,
    references:[googlePlay,appStore,officialSite,pacpik,noona,pocketTactics,pocketGamer,beebom,gameGuide,softit,clashCritters,ucn,gameedu,linegames,digwow,aayyy],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'뚜까펫: 서바이벌 쿠폰을 2026년 10월 14일 기준 재조사했습니다. FARLIGHT 직접 발급 원문 확인 코드는 0개이며, 국내외 10월 자료에서 반복 확인되는 핵심 14개 코드군과 추가 미확인 입력 후보를 구분해 정리합니다.',
    keywords:['뚜까펫 쿠폰','뚜까펫 서바이벌 쿠폰','뚜까펫 코드','뚜까펫 리딤코드','뚜까펫 교환코드','Clash of Critters codes','Clash of Critters redeem code'],
    hashtags:['#뚜까펫','#뚜까펫서바이벌','#ClashOfCritters','#게임쿠폰','#쿠폰코드'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:records.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:[],
    benefits:[]
  }
};
