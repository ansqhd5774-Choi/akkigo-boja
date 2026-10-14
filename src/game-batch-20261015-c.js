import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-15';
const articleKey='sword-frontier-codes-202610';
const GAME='소드 앤 프론티아';
const googlePlay='https://play.google.com/store/apps/details?id=com.vfive.gpkr&hl=ko';
const officialCommunity='https://game.naver.com/lounge/Sword_Frontier/home';
const vgame='https://vgamelifev.com/%EC%86%8C%EB%93%9C-%EC%95%A4-%ED%94%84%EB%A1%A0%ED%8B%B0%EC%95%84-%EC%BF%A0%ED%8F%B0-%EC%BD%94%EB%93%9C-%EC%A0%95%EB%A6%AC/';
const atothez='https://atothez1992.tistory.com/entry/%EC%86%8C%EB%93%9C-%EC%95%A4-%ED%94%84%EB%A1%A0%ED%8B%B0%EC%95%84-%EC%BF%A0%ED%8F%B0-%EC%95%88-%EB%90%A0-%EB%95%8C-%ED%95%B4%EA%B2%B0%EB%B2%95%EA%B9%8C%EC%A7%80-%EC%BF%A0%ED%8F%B0-%EC%BD%94%EB%93%9C-%EC%A0%84%EC%B2%B4-%EB%AA%A8%EC%9D%8C?category=814163';
const ldplayer='https://ldplayer.tistory.com/entry/sword-and-frontier-beginners-guide-coupons';
const appIcon='https://play-lh.googleusercontent.com/93IHlcVuR7KH5dk8_CZLX6oPeNX5vGiMofxBdkSrQPEVTYhb5tMDROvFh8v8xXL_wRn2Dxb44ELOv1mv3NlF=s0-br30';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const official=(name,url,sourcePublishedAt)=>({name,url,referenceType:'OFFICIAL_POST',sourcePublishedAt,checkedAt});
const third=(name,url,sourcePublishedAt)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});

const officialStoreSource=official('Google Play · 소드 앤 프론티아 공식 앱',googlePlay,null);
const officialCommunitySource=official('네이버 게임 · 소드 앤 프론티아 공식 라운지',officialCommunity,null);
const vgameSource=third('겜생 · 소드 앤 프론티아 쿠폰 코드 정리',vgame,'2026-09-07');
const atothezSource=third('오늘도 즐겁군 · 소드 앤 프론티아 쿠폰 전체 모음',atothez,'2026-09-08');
const ldplayerSource=third('LDPlayer · 소드 앤 프론티아 초보자 공략·쿠폰',ldplayer,'2026-09-03');

const corroborated=new Set(['GWANGBOK26','SwordFront1er','Swo2dFrontier','3wordFrontier','Sword4rontier','SwordFronti5r','COUNTDOWN03','COUNTDOWN02','COUNTDOWN01']);
const candidates=['SwordFrontier','OPENDAY','SwordFronti5r','COUNTDOWN01','COUNTDOWN02','COUNTDOWN03','Sword4rontier','3wordFrontier','Swo2dFrontier','SwordFront1er','GWANGBOK26','VIP777','VIP888','VIP999'];
const records=candidates.map(code=>({
  code,
  sourcePublishedAt:'2026-09-07',
  latest:true,
  latestEvidence:`2026-10-15 재조사에서 ${code}는 2026-09-07~09-08 제3자 쿠폰 목록에 노출되며${corroborated.has(code)?' LDPlayer 2026-09-03 글에서도 같은 문자열이 확인된다.':' 다른 제3자 목록에서도 같은 문자열이 확인된다.'} 다만 공식 네이버 게임 라운지의 접근 가능한 최신 공개 화면에서 해당 코드 문자열·공식 만료일·현재 사용 성공을 직접 재확인하지 못했다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:corroborated.has(code)?'복수 제3자 입력 후보·공식 현재 확인 필요':'제3자 입력 후보·공식 현재 확인 필요',
  sources:corroborated.has(code)?[vgameSource,atothezSource,ldplayerSource]:[vgameSource,atothezSource],
  evidenceHTML:`<p>${code}는 공개 쿠폰 정리 자료에서 확인된 입력 후보입니다. 2026년 10월 15일 현재 공식 라운지에서 동일 문자열의 발급 공지와 유효기간을 직접 확인하지 못했으므로 ACTIVE로 승격하지 않았습니다.</p>`
}));

const model={
  articleKey,title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 현재</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>입력 후보</span><strong>${records.length}개</strong></div><div class="ncp-feed-stat"><span>공식 만료 확인</span><strong>0개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:`<p>2026년 10월 15일 기준 공식 Google Play과 네이버 게임 공식 라운지, 국내 공개 쿠폰 자료를 다시 확인했습니다. 공식 스토어에서 게임과 공식 라운지 연결은 확인되지만 현재 접근 가능한 공식 화면에서 공용 쿠폰 문자열을 직접 확인하지 못했습니다. 따라서 아래 <strong>${records.length}개 코드는 모두 UNVERIFIED 입력 후보</strong>로 유지합니다.</p><p>COUNTDOWN·사전예약·광복절 명칭이 붙은 코드는 과거 행사 성격이 강하지만 공식 종료일을 찾지 못했으므로 임의로 EXPIRED 처리하지 않았습니다. 실제 계정 입력 성공이 확인되기 전까지 사용 가능으로 단정하지 않습니다.</p>`,
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>복수의 공개 가이드에서는 캐릭터 50레벨 달성 후 <strong>혜택로비 → 교환</strong>에서 코드를 입력하고 보상은 지급 화면 또는 우편함에서 확인하는 경로를 안내합니다. 공식 라운지에서 메뉴 경로를 직접 재확인하지 못했으므로 업데이트로 위치가 바뀌었을 가능성도 함께 확인하세요.</p><div><a href="${officialCommunity}" rel="noopener noreferrer">소드 앤 프론티아 공식 라운지 <span>열기 →</span></a></div></section><section><h3>현재 판정 기준</h3><p>복수 제3자 자료에서 같은 문자열이 보이더라도 공식 발급 원문·유효기간·실사용 성공이 없으면 ACTIVE로 표시하지 않습니다. 입력 성공 제보가 확인되면 검증 시각과 계정·서버 조건을 별도로 기록합니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${officialCommunity}" rel="noopener noreferrer">네이버 게임 공식 라운지</a> · <a href="${vgame}" rel="noopener noreferrer">겜생 9/7 쿠폰 목록</a> · <a href="${atothez}" rel="noopener noreferrer">오늘도 즐겁군 9/8 쿠폰 목록</a> · <a href="${ldplayer}" rel="noopener noreferrer">LDPlayer 9/3 쿠폰 목록</a></p>`,
  records
};

export const swordFrontierArticle={
  articleKey,approvedForPublish:true,
  post:{title:GAME,content:renderGamePeriodArticle(model),labels:['게임',GAME,'Sword & Frontier']},
  source:{
    type:'SWORD_FRONTIER_GLOBAL_CODE_RESEARCH',url:officialCommunity,checkedAt,
    references:[googlePlay,officialCommunity,vgame,atothez,ldplayer],
    presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,
    searchDescription:'소드 앤 프론티아 쿠폰을 2026년 10월 15일 기준 재조사했습니다. 공식 현재 코드 확인 여부와 SwordFrontier, OPENDAY, COUNTDOWN 계열 등 입력 후보 14개를 근거 수준별로 구분합니다.',
    keywords:['소드 앤 프론티아 쿠폰','소드앤프론티아 쿠폰','Sword Frontier coupon','소드 앤 프론티아 교환 코드','소드 앤 프론티아 쿠폰 입력'],
    hashtags:['#소드앤프론티아','#소드앤프론티아쿠폰','#SwordFrontier','#게임쿠폰'],searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:records.map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    historicalRecords:[],
    officialContext:{store:officialStoreSource,community:officialCommunitySource}
  }
};
