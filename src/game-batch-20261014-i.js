import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='prince-go-codes-202610';
const GAME='프린스 GO';
const googlePlay='https://play.google.com/store/apps/details?id=com.arkgamelimited.idle.JP.Android&hl=ko';
const appStore='https://apps.apple.com/kr/app/%ED%94%84%EB%A6%B0%EC%8A%A4-go/id6505052161';
const officialSite='https://www.arksgame.com/';
const officialX='https://x.com/DotabataOji';
const gameedu='https://game.edu.kg/ko/prince-go/%EC%BF%A0%ED%8F%B0/';
const neko='https://nekonokyositu.com/dotabata-2/';
const gameUx='https://gameuxnews.com/dotabata_ouji_giftcode/';
const xAtom='https://x.com/DotabataOji/status/1907364884804935738';
const xUran='https://x.com/DotabataOji/status/1917874133133566353';
const appIcon='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/af/37/ac/af37ac24-041f-6784-c1d4-a59ae2d44b8a/Placeholder.mill/512x512bb.jpg';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${appStore}" style="margin:0 0 24px"><a href="${appStore}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const thirdParty=(name,url,sourcePublishedAt,updatedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,updatedAt,checkedAt});
const officialPost=(name,url,sourcePublishedAt)=>({name,url,referenceType:'OFFICIAL_POST',sourcePublishedAt,checkedAt});
const srcGameedu=thirdParty(`GameEDU · ${GAME} 쿠폰 목록`,gameedu,'2026-05-12','2026-10-14');
const srcNeko=thirdParty('猫のゲーム教室 · ドタバタ王子くん ギフトコード',neko,'2026-08-23','2026-10-14');
const srcGameUx=thirdParty('Game UX News · ドタバタ王子くん ギフトコード',gameUx,'2025-10-16','2026-01-19');

const candidateDefs=[
  ['WELCOME','2026-05-12',[srcGameedu]],
  ['VIP222','2026-05-12',[srcGameedu]],
  ['VIP333','2026-05-12',[srcGameedu]],
  ['VIP555','2026-05-12',[srcGameedu]],
  ['VIP666','2026-05-12',[srcGameedu,srcNeko],'미확인','한·일 제3자 교차 후보·공식 발급/실사용 미확인'],
  ['VIP888','2026-05-12',[srcGameedu,srcNeko],'미확인','한·일 제3자 교차 후보·공식 발급/실사용 미확인'],
  ['GO2024','2026-05-12',[srcGameedu]],
  ['DCGIFT','2026-05-12',[srcGameedu]],
  ['VIP777','2026-08-23',[srcNeko],'미확인','일본판 제3자 후보·한국판 적용 미확인'],
  ['DOTAPURI03','2026-08-23',[srcNeko],'미확인','일본판 제3자 후보·한국판 적용 미확인'],
  ['DOTAPURI01','2026-08-23',[srcNeko],'미확인','일본판 제3자 후보·한국판 적용 미확인'],
  ['DOTAOJI100D','2026-08-23',[srcNeko],'4월 4일·연도 미확인','일본판 제3자 상충 후보·기한 연도 미확인']
];
const candidateRecords=candidateDefs.map(([code,sourcePublishedAt,sources,expiry='미확인',statusLabel='제3자 입력 후보·공식 발급/실사용 미확인'])=>({
  code,sourcePublishedAt,latest:true,expiry,status:'UNVERIFIED',statusLabel,sources,
  latestEvidence:code==='DOTAOJI100D'
    ?'2026-08-23 게시된 동일 앱 일본판 제3자 목록은 DOTAOJI100D를 NEW와 4월 4일까지라는 문구와 함께 노출한다. 게시일과 기한 표기가 서로 맞지 않아 연도를 확정할 수 없고, 2026-10-14 현재 공식 발급·실사용도 확인되지 않았다.'
    :`2026-10-14 공개 자료에서 ${code}를 ${sources.length>1?'한국어 프린스 GO와 동일 앱 일본판 목록에서 교차 ':sources[0]===srcNeko?'동일 앱 일본판 목록에서 ':'한국어 프린스 GO 전용 목록에서 '}확인했다. 운영사 공식 발급 원문·정확한 만료·한국 계정 실사용 성공은 확인되지 않았다.`,
  evidenceHTML:code==='DOTAOJI100D'
    ?'<p>제3자 원문에서 NEW와 4월 4일까지라는 표기가 동시에 확인되어 날짜가 상충합니다. 문자열은 삭제하지 않되 현재 사용 가능으로 단정하지 않습니다.</p>'
    :sources.includes(srcNeko)?'<p>프린스 GO와 동일 스토어 앱의 일본어 서비스명 ドタバタ王子くん 자료를 포함해 확인했습니다. 지역·서버·계정 조건과 공식 발급 여부는 미확인이므로 UNVERIFIED로 유지합니다.</p>':'<p>GameEDU의 프린스 GO 전용 페이지에서 확인했습니다. 해당 사이트는 게임사와 무관하다고 안내하므로 공식 쿠폰으로 승격하지 않고 UNVERIFIED 후보로 보존합니다.</p>'
}));

const historyRecords=[
  {code:'DOTAURAN',sourcePublishedAt:'2025-05-01',periodYear:'2025',expiry:'2025-05-31',sources:[officialPost('ドタバタ王子くん 공식 X · 콜라보 기념 코드 3탄',xUran,'2025-05-01')],evidenceHTML:'<p>동일 앱 일본판 공식 X가 2025-05-01 DOTAURAN과 기념권 5장 보상을 직접 공개했고 유효기간을 5월 31일 23:59까지로 명시했습니다.</p>'},
  {code:'DOTAATOMU',sourcePublishedAt:'2025-04-02',periodYear:'2025',expiry:'2025-04-30',sources:[officialPost('ドタバタ王子くん 공식 X · 콜라보 기념 코드 2탄',xAtom,'2025-04-02')],evidenceHTML:'<p>동일 앱 일본판 공식 X가 2025-04-02 DOTAATOMU와 기념권 5장 보상을 직접 공개했고 유효기간을 4월 30일 23:59까지로 명시했습니다.</p>'},
  {code:'DOTAX1WGET',sourcePublishedAt:'2025-10-16',periodYear:'2025',expiry:'2025-12-27',sources:[srcGameUx],evidenceHTML:'<p>일본 게임 정보 사이트의 동일 앱 과거 코드 정리에서 2025-12-27 23:59 종료 기록으로 확인했습니다.</p>'},
  {code:'SDxH6v',sourcePublishedAt:'2025-10-16',periodYear:'2025',expiry:'2025-11-06',sources:[srcGameUx],evidenceHTML:'<p>일본 게임 정보 사이트의 동일 앱 과거 코드 정리에서 2025-11-06 23:59 종료 기록으로 확인했습니다.</p>'},
  {code:'DOTADYR9',sourcePublishedAt:'2025-10-16',periodYear:'2024',expiry:'2024-12-26',sources:[srcGameUx],evidenceHTML:'<p>일본 게임 정보 사이트의 과거 코드 정리에서 2024-12-26 종료 기록으로 확인했습니다.</p>'},
  {code:'DOTAOJIPUMPKIN',sourcePublishedAt:'2025-10-16',periodYear:'2024',expiry:'2024-11-06',sources:[srcGameUx],evidenceHTML:'<p>일본 게임 정보 사이트의 과거 코드 정리에서 2024-11-06 종료와 티켓 1개·보석 1031 보상 표기를 확인했습니다.</p>'}
].map(x=>({...x,latest:false,status:'EXPIRED',statusLabel:x.sources[0].referenceType==='OFFICIAL_POST'?'일본판 공식 과거 코드·종료':'일본판 과거 종료 기록'}));

const records=[...candidateRecords,...historyRecords];
const currentCount=candidateRecords.length;
const model={
  articleKey,title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>입력 후보</span><strong>${currentCount}개</strong></div><div class="ncp-feed-stat"><span>공식 현재 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>과거 기록</span><strong>${historyRecords.length}개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:`<p>2026년 10월 14일 기준 Google Play·App Store의 Ark Game Limited 공식 앱과 공식 사이트를 확인했습니다. 스토어 설명은 최신 정보와 쿠폰 코드를 확인하라고 안내하지만 현재 공개된 구체적인 쿠폰 문자열은 직접 제시하지 않아 <strong>한국판 공식 현재 코드는 0개</strong>로 분류합니다.</p><p>GameEDU의 한국어 프린스 GO 페이지에서 8개 문자열을 확인했고, 동일 앱 일본판 ドタバタ王子くん의 제3자 목록에서 VIP777·DOTAPURI03·DOTAPURI01·DOTAOJI100D를 추가로 확인했습니다. 중복 제거 후 현재 시도 후보는 <strong>${currentCount}개</strong>이며 전부 UNVERIFIED입니다.</p><p>동일 앱 일본판 공식 X의 DOTAATOMU·DOTAURAN과 종료 기록 4개는 과거 이력으로 분리했습니다. 일본판 과거 발급 이력을 한국판 현재 공식 쿠폰으로 일반화하지 않습니다.</p>`,
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>일본판 제3자 자료는 프로필 아이콘 → 설정 → 기프트코드 입력 경로를 안내합니다. 다만 2026-10-14 확인한 한국 Google Play·App Store·Ark Game 공식 페이지에서는 한국판 입력 메뉴 경로를 직접 확인하지 못했습니다. 실제 게임 안에 기프트코드 메뉴가 표시될 때만 위 후보를 시도하세요.</p><div><a href="${googlePlay}" rel="noopener noreferrer">프린스 GO Google Play 공식 앱 <span>열기 →</span></a></div></section><section><h3>일본판 기록 구분</h3><p>App Store의 동일 앱은 일본어 서비스명 ドタバタ王子くん과 같은 Ark Game Limited 배포 앱입니다. 일본판 코드의 존재는 확인하되 지역·서버 조건이 다를 수 있으므로 한국판 현재 사용 가능으로 단정하지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${appStore}" rel="noopener noreferrer">App Store 공식 앱</a> · <a href="${officialSite}" rel="noopener noreferrer">Ark Game 공식 사이트</a> · <a href="${officialX}" rel="noopener noreferrer">동일 앱 일본판 공식 X</a> · <a href="${gameedu}" rel="noopener noreferrer">GameEDU 한국어 후보 목록</a> · <a href="${neko}" rel="noopener noreferrer">일본판 제3자 후보 목록</a> · <a href="${gameUx}" rel="noopener noreferrer">일본판 과거 코드 정리</a></p>`,
  records
};

export const princeGoArticle={
  articleKey,approvedForPublish:true,
  post:{title:GAME,content:renderGamePeriodArticle(model),labels:['게임',GAME,'ドタバタ王子くん']},
  source:{
    type:'PRINCE_GO_GLOBAL_CODE_RESEARCH',url:googlePlay,checkedAt,
    references:[googlePlay,appStore,officialSite,officialX,gameedu,neko,gameUx,xAtom,xUran],
    presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,
    searchDescription:`프린스 GO 쿠폰을 2026년 10월 14일 기준 조사했습니다. 한국판 공식 현재 공개 코드는 0개이며, 제3자 입력 후보 ${currentCount}개와 동일 앱 일본판 과거 공식·종료 기록을 구분해 정리합니다.`,
    keywords:['프린스 GO 쿠폰','프린스GO 쿠폰','프린스 GO 쿠폰 코드','프린스 GO 기프트코드','프린스 GO 쿠폰 입력','Prince GO coupon code','ドタバタ王子くん ギフトコード'],
    hashtags:['#프린스GO','#프린스GO쿠폰','#게임쿠폰','#쿠폰코드'],searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:candidateRecords.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:historyRecords.map(({code,sourcePublishedAt,expiry,status,sources,periodYear})=>({code,sourcePublishedAt,expiry,status,sources,periodYear})),
    benefits:[]
  }
};