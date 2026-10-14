import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-15';
const articleKey='bossrun-idle-knight-codes-202610';
const GAME='보스런 : 기사키우기';
const googlePlay='https://play.google.com/store/apps/details?id=com.madplay.bossrun&hl=ko';
const developer='https://madsoft0.github.io/';
const appbrain='https://www.appbrain.com/app/%EB%B3%B4%EC%8A%A4%EB%9F%B0-%EA%B8%B0%EC%82%AC%ED%82%A4%EC%9A%B0%EA%B8%B0/com.madplay.bossrun';
const chromeStats='https://chrome-stats.com/d/com.madplay.bossrun';
const ldplayer='https://kr.ldplayer.net/games/com-madplay-bossrun-on-pc.html';
const gameplay='https://www.youtube.com/watch?v=Fg0ocX7K2cc';
const appIcon='https://play-lh.googleusercontent.com/78m81983JqJc73SBfFXlEPndNgRoESl0nUKhcN88Jox9VgRd3Hla2XIYowumA4v9S3yV4FOULnklcQZkFCw3=s0-br30';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const official=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'OFFICIAL_POST',sourcePublishedAt,checkedAt});
const third=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});

const model={
  articleKey,title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 현재</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>입력 후보</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>공식 입력 경로</span><strong>미확인</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:`<p>2026년 10월 15일 기준 공식 Google Play, 개발사 공개 웹사이트와 국내외 공개 검색 자료를 확인했습니다. 공식 Google Play에서 <strong>${GAME}</strong>과 개발사 <strong>MADPLAY</strong>, 패키지 <strong>com.madplay.bossrun</strong>을 확인했지만 현재 공개된 공식 페이지에는 쿠폰·리딤·기프트 코드 안내가 없습니다.</p><p>게임명이 막 출시된 상태라 동명이인·유사 기사키우기 게임의 코드를 섞지 않았습니다. 공개 검색에서도 이 게임 전용 코드 문자열이나 공식 입력 메뉴를 확인하지 못했으므로 <strong>현재 등록 가능한 쿠폰은 0개</strong>로 유지합니다.</p>`,
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>현재 공식 Google Play 설명과 개발사 공개 페이지에서 쿠폰 입력 메뉴 또는 외부 교환 페이지를 확인하지 못했습니다. 게임 안에 추후 쿠폰 메뉴가 추가될 수 있으므로 설정·우편·이벤트 메뉴를 임의로 공식 경로라고 단정하지 않습니다.</p><div><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱 <span>열기 →</span></a></div></section><section><h3>현재 확인 범위</h3><p>Google Play 최신 공개 정보, 개발사 MADPLAY 사이트, AppBrain·Chrome-Stats·LDPlayer의 앱 식별 자료와 공개 웹 검색을 대조했습니다. 다른 게임에서 반복되는 VIP·WELCOME 같은 범용 문자열도 이 게임 전용 근거가 없어 후보 목록에 넣지 않았습니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${developer}" rel="noopener noreferrer">MADPLAY 개발사 사이트</a> · <a href="${appbrain}" rel="noopener noreferrer">AppBrain 앱 정보</a> · <a href="${chromeStats}" rel="noopener noreferrer">Chrome-Stats 앱 정보</a> · <a href="${ldplayer}" rel="noopener noreferrer">LDPlayer 앱 정보</a> · <a href="${gameplay}" rel="noopener noreferrer">공개 게임플레이 영상</a></p>`,
  records:[]
};

export const bossrunIdleKnightArticle={
  articleKey,approvedForPublish:true,
  post:{title:GAME,content:renderGamePeriodArticle(model),labels:['게임',GAME,'Boss Run']},
  source:{
    type:'BOSSRUN_IDLE_KNIGHT_CODE_RESEARCH',url:googlePlay,checkedAt,
    references:[googlePlay,developer,appbrain,chromeStats,ldplayer,gameplay],
    presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,
    searchDescription:'보스런 기사키우기 쿠폰을 2026년 10월 15일 기준 조사했습니다. 공식 현재 코드, 입력 후보, 쿠폰 입력 경로 확인 여부를 구분해 정리합니다.',
    keywords:['보스런 기사키우기 쿠폰','보스런 쿠폰','보스런 기사키우기 코드','Boss Run coupon','보스런 쿠폰 입력'],
    hashtags:['#보스런','#보스런기사키우기','#보스런쿠폰','#게임쿠폰'],searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],unverifiedCandidates:[],historicalRecords:[],
    officialContext:{store:official('Google Play · 보스런 기사키우기 공식 앱',googlePlay),developer:official('MADPLAY 개발사 사이트',developer)},
    researchContext:{appbrain:third('AppBrain · 보스런 기사키우기 앱 정보',appbrain),chromeStats:third('Chrome-Stats · 보스런 기사키우기 앱 정보',chromeStats),ldplayer:third('LDPlayer · 보스런 기사키우기 앱 정보',ldplayer)}
  }
};
