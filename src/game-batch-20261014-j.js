import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='the-rookie-high-school-baseball-codes-202610';
const GAME='더 루키: 고교야구선수 키우기';
const officialSite='https://play.therookielab.app/';
const officialEvent='https://play.therookielab.app/news/n-20261011-1';
const officialEvents='https://play.therookielab.app/events';
const couponSite='https://coupon.therookielab.app/';
const googlePlay='https://play.google.com/store/apps/details?id=com.therookie.game&hl=ko';
const appStore='https://apps.apple.com/kr/app/%EB%8D%94-%EB%A3%A8%ED%82%A4-%EA%B3%A0%EA%B5%90%EC%95%BC%EA%B5%AC%EC%84%A0%EC%88%98-%ED%82%A4%EC%9A%B0%EA%B8%B0/id6800343219';
const digwow='https://www.digwow.net/%EB%8D%94-%EB%A3%A8%ED%82%A4-%EA%B3%A0%EA%B5%90%EC%95%BC%EA%B5%AC%EC%84%A0%EC%88%98-%ED%82%A4%EC%9A%B0%EA%B8%B0/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const lineGames='https://www.linegames.org/ko/%EB%8D%94-%EB%A3%A8%ED%82%A4%3A-%EA%B3%A0%EA%B5%90%EC%95%BC%EA%B5%AC%EC%84%A0%EC%88%98-%ED%82%A4%EC%9A%B0%EA%B8%B0-%EC%BF%A0%ED%8F%B0/';
const gameEdu='https://game.edu.kg/ko/%EB%8D%94-%EB%A3%A8%ED%82%A4%3A-%EA%B3%A0%EA%B5%90%EC%95%BC%EA%B5%AC%EC%84%A0%EC%88%98-%ED%82%A4%EC%9A%B0%EA%B8%B0/%EC%BF%A0%ED%8F%B0/';
const iconUrl='https://play-lh.googleusercontent.com/wCpjEOHSzLfDaeItYWni4xPtmvMIJs-SeXvAAVwVcXDzbHmzURcYiy0kRZe-7zcSFfhq9lrcyWDF0ndJTCtHUw=w240-h480-rw';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const officialPost=(name,url,sourcePublishedAt)=>({name,url,referenceType:'OFFICIAL_POST',sourcePublishedAt,checkedAt});
const thirdParty=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});

const srcOfficial=officialPost('더 루키 공식 홈페이지 · 오픈 기념 쿠폰',officialEvent,'2026-10-11');
const srcDigwow=thirdParty('DIGWOW · 더 루키 쿠폰 모음',digwow,'2026-10-14');
const srcLine=thirdParty('LINEGames · 더 루키 쿠폰 목록',lineGames,null);
const srcEdu=thirdParty('GameEDU · 더 루키 쿠폰 목록',gameEdu,null);

const officialRecord={
  code:'NEWSOPEN',
  sourcePublishedAt:'2026-10-11',
  latest:true,
  latestEvidence:'2026-10-11 더 루키 공식 홈페이지 이벤트 원문에서 쿠폰 번호 NEWSOPEN, 다이아 300개 보상, 2026-10-25 23:59까지의 입력 기간을 직접 확인했다.',
  expiry:'2026-10-25 23:59 KST',
  status:'ACTIVE',
  statusLabel:'공식 현재·10월 25일 23:59까지',
  sources:[srcOfficial],
  evidenceHTML:'<p>더 루키 공식 이벤트 글이 NEWSOPEN을 직접 공개했습니다. 보상은 다이아 300개이며 2026년 10월 25일 23:59까지 입력할 수 있습니다. 입력한 보상 우편은 입력일로부터 14일 안에 받아야 합니다.</p>'
};

const candidate=(code,sources,sourcePublishedAt=null)=>({
  code,
  sourcePublishedAt,
  latest:true,
  latestEvidence:`2026-10-14 공개 제3자 쿠폰 목록에서 ${code} 문자열을 더 루키 코드로 확인했다. 더 루키 공식 소식·이벤트 페이지에서 같은 문자열의 발급 원문, 보상, 만료일 또는 실제 계정 입력 성공은 확인되지 않았다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:'제3자 입력 후보·공식 발급/실사용 미확인',
  sources,
  evidenceHTML:'<p>제3자 쿠폰 페이지에 더 루키 코드로 게시된 문자열입니다. 공식 발급 원문·정확한 유효기간·실제 계정 입력 성공이 확인되지 않아 UNVERIFIED 후보로 유지합니다. 범용형 문자열도 삭제하지 않고 출처와 함께 보존합니다.</p>'
});

const candidateRecords=[
  candidate('ROOKIE777',[srcDigwow],'2026-10-14'),
  candidate('WELCOME',[srcDigwow,srcLine],'2026-10-14'),
  candidate('BASEBALL',[srcDigwow],'2026-10-14'),
  candidate('UPDATE1',[srcDigwow],'2026-10-14'),
  candidate('GAMEEDU',[srcEdu]),
  candidate('VIP111',[srcEdu]),
  candidate('VIP333',[srcEdu]),
  candidate('VIP555',[srcEdu,srcLine]),
  candidate('VIP888',[srcEdu]),
  candidate('VIP999',[srcEdu]),
  candidate('VIP2024',[srcEdu,srcLine]),
  candidate('DCGIFT',[srcEdu]),
  candidate('LINEGAMES',[srcLine]),
  candidate('VIP222',[srcLine]),
  candidate('VIP666',[srcLine]),
  candidate('VIP777',[srcLine]),
  candidate('FBGIFT',[srcLine])
];

const records=[officialRecord,...candidateRecords];
const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 현재</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>입력 후보</span><strong>${candidateRecords.length}개</strong></div><div class="ncp-feed-stat"><span>공식 만료</span><strong>10.25 23:59</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:`<p>2026년 10월 14일 기준 The Rookie Lab 공식 홈페이지에서 <strong>NEWSOPEN</strong> 쿠폰을 직접 확인했습니다. 2026년 10월 11일 게시됐고 보상은 다이아 300개, 입력 마감은 10월 25일 23:59입니다.</p><p>DIGWOW·LINEGames·GameEDU에서 추가 문자열을 조사해 중복 제거 후 <strong>${candidateRecords.length}개</strong>를 제3자 입력 후보로 보존했습니다. 공식 홈페이지의 소식·이벤트에서 같은 발급 원문이 확인되지 않은 문자열은 공식 현재 쿠폰으로 승격하지 않았습니다. LINEGames·GameEDU의 정확한 원문 최초 게시일은 확인되지 않아 수집일로 대체하지 않았습니다.</p>`,
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>공식 안내에 따르면 먼저 게임 설정 › 계정에서 Apple 또는 Google 계정을 연동하고 내 계정 ID를 복사합니다. <a href="${couponSite}" rel="noopener noreferrer">공식 쿠폰 입력 사이트</a>에 계정 ID와 쿠폰 번호를 입력한 뒤 게임 로비의 우편함에서 받기를 누릅니다. 게스트 계정은 쿠폰을 사용할 수 없고 같은 쿠폰은 계정당 1회만 사용할 수 있습니다.</p><div><a href="${couponSite}" rel="noopener noreferrer">더 루키 공식 쿠폰 입력 <span>열기 →</span></a></div></section><section><h3>NEWSOPEN 보상 수령 기한</h3><p>공식 원문은 NEWSOPEN 입력 마감을 10월 25일 23:59로 안내하고, 쿠폰 입력 후 우편 보상은 입력한 날부터 14일 안에 받아야 한다고 명시합니다.</p></section>`,
  archiveHTML:`<p><a href="${officialEvent}" rel="noopener noreferrer">공식 NEWSOPEN 이벤트</a> · <a href="${officialEvents}" rel="noopener noreferrer">공식 이벤트·쿠폰</a> · <a href="${couponSite}" rel="noopener noreferrer">공식 쿠폰 입력 사이트</a> · <a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${appStore}" rel="noopener noreferrer">App Store 공식 앱</a> · <a href="${digwow}" rel="noopener noreferrer">DIGWOW 제3자 목록</a> · <a href="${lineGames}" rel="noopener noreferrer">LINEGames 제3자 목록</a> · <a href="${gameEdu}" rel="noopener noreferrer">GameEDU 제3자 목록</a></p>`,
  records
};

export const theRookieArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'더 루키']
  },
  source:{
    type:'THE_ROOKIE_OFFICIAL_AND_THIRD_PARTY_CODE_RESEARCH',
    url:officialEvent,
    checkedAt,
    references:[officialSite,officialEvent,officialEvents,couponSite,googlePlay,appStore,digwow,lineGames,gameEdu],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:`더 루키 고교야구선수 키우기 쿠폰을 2026년 10월 14일 기준 정리했습니다. 공식 NEWSOPEN 1개와 제3자 입력 후보 ${candidateRecords.length}개, 공식 입력 방법과 만료 조건을 구분해 확인할 수 있습니다.`,
    keywords:['더 루키 쿠폰','더 루키 고교야구선수 키우기 쿠폰','더 루키 쿠폰 코드','더 루키 NEWSOPEN','고교야구선수 키우기 쿠폰','더 루키 쿠폰 입력'],
    hashtags:['#더루키','#더루키쿠폰','#고교야구선수키우기','#게임쿠폰'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[{
      code:'NEWSOPEN',
      status:'ACTIVE',
      source:officialEvent,
      sourcePublishedAt:'2026-10-11',
      conditions:'Apple 또는 Google 계정 연동 필요·계정당 1회',
      workingVerifiedAt:null,
      result:'공식 발급 원문 확인·개별 계정 입력 성공은 미확인',
      expiry:'2026-10-25 23:59 KST',
      reward:'다이아 300개'
    }],
    unverifiedCandidates:candidateRecords.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    benefits:[{
      type:'GAME_REDEEM',
      authority:'OFFICIAL',
      status:'ACTIVE',
      benefit:'다이아 300개',
      method:'공식 쿠폰 입력 사이트에서 NEWSOPEN 등록',
      sourceUrl:officialEvent,
      sourcePublishedAt:'2026-10-11',
      expiry:'2026-10-25 23:59 KST',
      conditions:'Apple 또는 Google 계정 연동·계정당 1회·입력 후 우편 수령 14일'
    }]
  }
};
