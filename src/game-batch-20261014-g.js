import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='forest-sigh-neverland-codes-202610';
const GAME='포레스트 사이: 네버랜드';

const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.fskr.google';
const naverLounge='https://game.naver.com/lounge/Forest_Sigh_Neverland';
const preregNotice='https://game.naver.com/lounge/Forest_Sigh_Neverland/board/detail/8130722';
const officialPrereg='https://presighsoftheforest.hifun123.com/';
const oneStore='https://m.onestore.co.kr/v2/ko-kr/app/0001007384/about';
const oneStorePrereg='https://m.onestore.co.kr/v2/ko-kr/event/preregistrations/0001007384';
const digwow='https://www.digwow.net/%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8-%EC%82%AC%EC%9D%B4-%EB%84%A4%EB%B2%84%EB%9E%9C%EB%93%9C/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C';
const appIcon='https://play-lh.googleusercontent.com/XPosAV5T4LoTV0iJQGx5xaNs1Ghu6Rs5j0WrLggKqs_kUcfIu8Q7Z00efNtnP9jvzBsct_4mbBtw7hwGaEch9A=s0-br30';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const thirdParty=(name,url,sourcePublishedAt,updatedAt)=>({
  name,
  url,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  sourcePublishedAt,
  updatedAt,
  checkedAt
});

const candidateCodes=['FOREST2024','NEVERLAND777','WELCOME2024','FORESTGIFT'];
const records=candidateCodes.map(code=>({
  code,
  sourcePublishedAt:'2026-09-07',
  latest:true,
  latestEvidence:`DIGWOW의 동일 게임 쿠폰 페이지에서 2026-09-07부터 확인되며 2026-10-01 갱신 목록에도 ${code}가 현재 코드로 남아 있다. 그러나 2026-10-14 확인한 Google Play, 공식 네이버 게임 라운지, 공식 사전예약 페이지와 ONE store에서는 같은 코드의 발급 공지나 만료 조건을 확인하지 못했다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:/2024$/.test(code)?'제3자 현재 후보·출시연도와 코드명 불일치·공식 발급 미확인':'제3자 현재 후보·공식 발급 미확인',
  sources:[thirdParty('DIGWOW · 포레스트 사이: 네버랜드 쿠폰 모음',digwow,'2026-09-07','2026-10-01')],
  evidenceHTML:`<p>DIGWOW의 포레스트 사이: 네버랜드 전용 목록에서 확인한 문자열입니다. 공식 Hifun/네이버 게임/스토어 원문에서 동일 코드의 발급 근거와 실제 계정 입력 성공을 확인하지 못해 <strong>미확인 입력 후보</strong>로만 표시합니다.${/2024$/.test(code)?' 게임은 2026년 국내 출시인데 코드명에 2024가 포함되어 있어 특히 주의가 필요합니다.':''}</p>`
}));

const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>최근 입력 후보</span><strong>4개</strong></div><div class="ncp-feed-stat"><span>공식 발급 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>공식 혜택 기록</span><strong>2종</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 Google Play의 Hifun Game 공식 앱, 공식 네이버 게임 라운지, 공식 사전예약 페이지와 ONE store를 확인했지만 운영사가 직접 공개한 현재 리딤코드·쿠폰번호는 확인하지 못했습니다. 따라서 <strong>공식 현재 쿠폰은 0개</strong>로 분류합니다.</p><p>DIGWOW에서는 FOREST2024, NEVERLAND777, WELCOME2024, FORESTGIFT 4개 문자열을 2026년 9월부터 게시하고 10월 1일에도 현재 코드로 갱신했습니다. 다만 공식 발급 원문·정확한 만료·실사용 근거가 없어 모두 <strong>UNVERIFIED 입력 후보</strong>로 보존합니다. 특히 2026년 출시 게임인데 2024가 들어간 문자열은 공식성 확인 전까지 주의가 필요합니다.</p><p>코드 외 공식 혜택으로는 Google Play 앱 설명의 로그인 보상 안내가 현재 남아 있으며, 출시 전 ONE store 사전예약에서는 블루 다이아 100·하급 강화석 10·초급 펫 사료 10·꿈먹이 바쿠 1 지급이 안내됐습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>공식 Google Play·네이버 게임 라운지·사전예약 페이지에서 쿠폰 입력 메뉴를 확인하지 못했습니다. 제3자 페이지는 프로필·설정·이벤트 또는 계정 메뉴에서 쿠폰/교환 코드 항목을 찾으라고 안내하지만 공식 입력 경로가 아니므로, 실제 게임에 해당 메뉴가 있을 때만 위 4개 후보를 시도하세요. 메뉴가 없거나 오류가 나오면 사용 가능한 공식 쿠폰으로 보지 않습니다.</p><div><a href="${googlePlay}" rel="noopener noreferrer">포레스트 사이: 네버랜드 Google Play 공식 앱 <span>열기 →</span></a></div></section><section><h3>공식 혜택 확인</h3><p>Google Play 공식 설명에는 로그인만으로 혜택을 지급한다는 안내가 있습니다. ONE store의 사전예약 아이템은 출시 전 혜택 기록으로 분리했으며 현재 신규 신청 혜택으로 표시하지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${naverLounge}" rel="noopener noreferrer">공식 네이버 게임 라운지</a> · <a href="${preregNotice}" rel="noopener noreferrer">공식 사전예약 공지</a> · <a href="${officialPrereg}" rel="noopener noreferrer">공식 사전예약 페이지</a> · <a href="${oneStore}" rel="noopener noreferrer">ONE store 앱 페이지</a> · <a href="${oneStorePrereg}" rel="noopener noreferrer">ONE store 사전예약 혜택</a> · <a href="${digwow}" rel="noopener noreferrer">DIGWOW 미확인 코드 목록</a></p>`,
  records
};

export const forestSighNeverlandArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'Forest Sigh Neverland']
  },
  source:{
    type:'FOREST_SIGH_NEVERLAND_GLOBAL_CODE_RESEARCH',
    url:googlePlay,
    checkedAt,
    references:[googlePlay,naverLounge,preregNotice,officialPrereg,oneStore,oneStorePrereg,digwow],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'포레스트 사이: 네버랜드 쿠폰을 2026년 10월 14일 기준 조사했습니다. 공식 발급 확인 코드는 0개이며, 제3자 현재 입력 후보 4개와 공식 로그인·과거 사전예약 혜택을 구분해 정리합니다.',
    keywords:['포레스트 사이 네버랜드 쿠폰','포레스트 사이: 네버랜드 쿠폰','포레스트 사이 네버랜드 코드','포레스트 사이 네버랜드 쿠폰 입력','Forest Sigh Neverland code','Forest Sigh Neverland coupon'],
    hashtags:['#포레스트사이네버랜드','#게임쿠폰','#쿠폰코드','#ForestSighNeverland'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:records.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:[],
    benefits:[
      {type:'LOGIN_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'로그인 시 게임 내 혜택 지급 안내(정확한 수량은 공식 앱 설명에서 미공개)',method:'게임 로그인',sourceUrl:googlePlay,sourcePublishedAt:null,expiry:null},
      {type:'PRE_REGISTRATION',authority:'OFFICIAL',status:'ENDED',benefit:'블루 다이아 100·하급 강화석 10·초급 펫 사료 10·꿈먹이 바쿠 1',method:'ONE store 사전예약 후 캐릭터 생성 시 우편 지급',sourceUrl:oneStorePrereg,sourcePublishedAt:null,expiry:'출시 전 사전예약 혜택'}
    ]
  }
};