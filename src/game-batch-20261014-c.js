import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='sabuk-ice-kingdom-codes-202610';
const GAME='사북: 아이스 킹덤';
const officialLounge='https://game.naver.com/lounge/icekingdom/home';
const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.lzcsice.kr.gp';
const appStore='https://apps.apple.com/kr/app/%EC%82%AC%EB%B6%81-%EC%95%84%EC%9D%B4%EC%8A%A4-%ED%82%B9%EB%8D%A4/id6758198841';
const appIcon='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/66/8e/8e/668e8ed3-ee7f-e891-58c1-ae0a9c28e681/Placeholder.mill/512x512bb.jpg';
const ldPlayer='https://ldplayer.tistory.com/entry/sabuk-ice-kingdom-guide-coupon-ldplayer';
const play100='https://play100.dasfl.com/%EC%82%AC%EB%B6%81-%EC%95%84%EC%9D%B4%EC%8A%A4-%ED%82%B9%EB%8D%A4-%EA%B0%80%EC%9D%B4%EB%93%9C';
const honeybee='https://honeybeejoa.co.kr/bbs/board.php?bo_table=icekingdom&wr_id=1';
const digwow='https://www.digwow.net/%EC%82%AC%EB%B6%81-%EC%95%84%EC%9D%B4%EC%8A%A4-%ED%82%B9%EB%8D%A4/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const gameedu='https://www.gameedu.co.kr/';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${appStore}" style="margin:0 0 24px"><a href="${appStore}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const source=(name,url,sourcePublishedAt=null,extra={})=>({
  name,
  url,
  sourcePublishedAt,
  checkedAt,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  ...extra
});
const src={
  ld:()=>source('LDPlayer 사북: 아이스 킹덤 가이드·쿠폰',ldPlayer,'2026-09-16'),
  play:()=>source('play100 사북: 아이스 킹덤 가이드',play100,'2026-09-21'),
  honey:(date='2026-09-16')=>source('Couponmong 사북: 아이스 킹덤 쿠폰',honeybee,date),
  dig:()=>source('DIGWOW 사북: 아이스 킹덤 쿠폰 모음',digwow),
  gameedu:()=>source('GameEDU 사북: 아이스 킹덤 코드 목록',gameedu)
};

const candidate=(code,{
  sourcePublishedAt=null,
  statusLabel='제3자 입력 후보·현재 사용 여부 미확인',
  sources=[],
  latestEvidence='',
  evidenceHTML=''
}={})=>({
  code,
  sourcePublishedAt,
  latest:true,
  latestEvidence:latestEvidence || `2026-10-14 공개 자료에서 ${code}가 ${GAME} 입력 후보로 노출됐다. 운영사 직접 발급 원문과 실제 계정 입력 성공은 확인되지 않았다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel,
  sources,
  evidenceHTML:evidenceHTML || `<p>공개 제3자 자료에서 ${GAME} 코드로 확인했습니다. 운영사 직접 발급 원문·정확한 만료·실제 계정 입력 성공은 확인되지 않아 미확인 후보로 보존합니다.</p>`
});

const launchEvidence='<p>출시 시기 사북: 아이스 킹덤 전용 가이드에서 반복 확인된 문자열입니다. 다만 운영사 직접 발급 공지와 현재 실제 계정 성공을 확인하지 못했으므로 ACTIVE로 승격하지 않습니다.</p>';
const honeyEvidence='<p>Couponmong의 사북: 아이스 킹덤 목록에서 확인했습니다. 해당 페이지가 표시하는 2026-12-31 기한은 운영사 원문으로 확인되지 않아 이 글에서는 만료 미확인으로 유지합니다.</p>';
const weekendConflict='<p>Couponmong은 사북: 아이스 킹덤 주말 코드로 싣고 있지만 동일 문자열이 다른 게임 코드 목록에도 나타납니다. 공식 네이버 게임 라운지에는 10월 주말 코드 게시물 제목이 확인되지만 동적 본문에서 정확한 문자열을 추출하지 못했으므로 제3자 후보로만 보존합니다.</p>';

const records=[
  candidate('GRANDOPEN',{sourcePublishedAt:'2026-09-16',sources:[src.ld(),src.play(),src.honey()],statusLabel:'출시 입력 후보·복수 자료 교차',latestEvidence:'2026-09-16 LDPlayer 가이드가 정식 오픈 쿠폰으로 기재하고 2026-09-21 play100 및 Couponmong 목록에서도 교차 확인됐다. 운영사 직접 발급 원문·현재 실사용 성공은 미확인이다.',evidenceHTML:launchEvidence}),
  candidate('500BOX',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey()],statusLabel:'출시 입력 후보·복수 자료 교차',evidenceHTML:launchEvidence}),
  candidate('VIP666',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey(),src.gameedu()],statusLabel:'복수 제3자 후보·범용형 문자열',evidenceHTML:launchEvidence}),
  candidate('VIP777',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey()],statusLabel:'출시 입력 후보·범용형 문자열',evidenceHTML:launchEvidence}),
  candidate('VIP888',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey(),src.gameedu()],statusLabel:'복수 제3자 후보·범용형 문자열',evidenceHTML:launchEvidence}),
  candidate('VIP999',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey(),src.gameedu()],statusLabel:'복수 제3자 후보·범용형 문자열',evidenceHTML:launchEvidence}),
  candidate('ICE666',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey()],statusLabel:'출시 입력 후보·복수 자료 교차',evidenceHTML:launchEvidence}),
  candidate('ICE777',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey()],statusLabel:'출시 입력 후보·복수 자료 교차',evidenceHTML:launchEvidence}),
  candidate('ICE888',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey()],statusLabel:'출시 입력 후보·복수 자료 교차',evidenceHTML:launchEvidence}),
  candidate('ICE999',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey()],statusLabel:'출시 입력 후보·복수 자료 교차',evidenceHTML:launchEvidence}),
  candidate('ICE000',{sourcePublishedAt:'2026-09-21',sources:[src.play(),src.honey()],statusLabel:'출시 입력 후보·복수 자료 교차',evidenceHTML:launchEvidence}),
  candidate('SVIP555',{sourcePublishedAt:'2026-09-16',sources:[src.honey()],statusLabel:'제3자 입력 후보·공식 발급 미확인',evidenceHTML:honeyEvidence}),
  candidate('SVIP666',{sourcePublishedAt:'2026-09-16',sources:[src.honey()],statusLabel:'제3자 입력 후보·공식 발급 미확인',evidenceHTML:honeyEvidence}),
  candidate('SVIP888',{sourcePublishedAt:'2026-09-16',sources:[src.honey()],statusLabel:'제3자 입력 후보·공식 발급 미확인',evidenceHTML:honeyEvidence}),
  candidate('SVIP999',{sourcePublishedAt:'2026-09-16',sources:[src.honey()],statusLabel:'제3자 입력 후보·공식 발급 미확인',evidenceHTML:honeyEvidence}),
  candidate('MOON111',{sourcePublishedAt:'2026-09-24',sources:[src.honey('2026-09-24')],statusLabel:'제3자 한가위 후보·공식 발급 미확인',evidenceHTML:honeyEvidence}),
  candidate('WEEKXB1',{sourcePublishedAt:'2026-09-19',sources:[src.honey('2026-09-19')],statusLabel:'제3자 주말 후보·타 게임 동일 문자열',evidenceHTML:weekendConflict}),
  candidate('WEEKMA2',{sourcePublishedAt:'2026-09-26',sources:[src.honey('2026-09-26')],statusLabel:'제3자 주말 후보·타 게임 동일 문자열',evidenceHTML:weekendConflict}),
  candidate('WEEKMW3',{sourcePublishedAt:'2026-10-03',sources:[src.honey('2026-10-03')],statusLabel:'제3자 주말 후보·타 게임 동일 문자열',evidenceHTML:weekendConflict}),
  candidate('WEEK4LD',{sourcePublishedAt:'2026-10-10',sources:[src.honey('2026-10-10')],statusLabel:'제3자 주말 후보·타 게임 동일 문자열',evidenceHTML:weekendConflict}),
  candidate('SABUK100',{sources:[src.dig()],statusLabel:'제3자 입력 후보·공식 발급 미확인'}),
  candidate('ICEKINGDOM',{sources:[src.dig()],statusLabel:'제3자 입력 후보·공식 발급 미확인'}),
  candidate('WELCOME',{sources:[src.dig()],statusLabel:'제3자 입력 후보·범용형 문자열'}),
  candidate('SABUK777',{sources:[src.dig()],statusLabel:'제3자 입력 후보·공식 발급 미확인'}),
  candidate('GAMEEDU',{sources:[src.gameedu()],statusLabel:'저신뢰 제3자 후보·범용형 문자열'}),
  candidate('VIP111',{sources:[src.gameedu()],statusLabel:'저신뢰 제3자 후보·범용형 문자열'}),
  candidate('VIP222',{sources:[src.gameedu()],statusLabel:'저신뢰 제3자 후보·범용형 문자열'}),
  candidate('FBGIFT',{sources:[src.gameedu()],statusLabel:'저신뢰 제3자 후보·범용형 문자열'}),
  candidate('DCGIFT',{sources:[src.gameedu()],statusLabel:'저신뢰 제3자 후보·범용형 문자열'})
];

const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>최근 입력 후보</span><strong>29개</strong></div><div class="ncp-feed-stat"><span>공식 발급 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>전체 보존 기록</span><strong>29개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 App Store·Google Play의 게임 신원과 공식 네이버 게임 라운지는 확인했습니다. 공식 라운지에는 <strong>10월 주말 코드 2</strong> 게시물 제목이 노출되지만 동적 본문에서 정확한 코드 문자열을 확인하지 못했습니다. 따라서 운영사가 직접 발급한 현재 코드로 확정한 항목은 0개입니다.</p><p><strong>GRANDOPEN</strong>은 출시일 LDPlayer 가이드와 다른 전용 가이드에서 교차 확인됐고, 총 29개 문자열을 입력 후보로 보존했습니다. 특히 WEEK4LD·WEEKMW3·WEEKMA2·WEEKXB1은 다른 게임에서도 동일 문자열이 발견되어 Couponmong의 12월 31일 표기를 공식 만료로 채택하지 않았습니다. 모든 후보는 실제 계정 입력 성공이 확인되지 않아 UNVERIFIED입니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>LDPlayer의 출시 가이드는 게임 안에서 <strong>설정 → 설정 → 패키지 코드 교환</strong> 순서로 입력한다고 안내합니다. 코드가 거절되면 철자·대소문자·계정/서버 조건·기간 종료 가능성을 확인하세요.</p><div><a href="${officialLounge}" rel="noopener noreferrer">사북: 아이스 킹덤 공식 네이버 게임 라운지 <span>열기 →</span></a></div></section>`,
  archiveHTML:`<p><a href="${officialLounge}" rel="noopener noreferrer">공식 네이버 게임 라운지</a> · <a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${appStore}" rel="noopener noreferrer">App Store 공식 앱</a> · <a href="${ldPlayer}" rel="noopener noreferrer">LDPlayer 출시 가이드</a> · <a href="${play100}" rel="noopener noreferrer">play100 가이드</a> · <a href="${honeybee}" rel="noopener noreferrer">Couponmong 목록</a> · <a href="${digwow}" rel="noopener noreferrer">DIGWOW 목록</a></p>`,
  records
};

const currentCandidates=records.filter(x=>x.latest===true);
const historicalRecords=records.filter(x=>x.latest!==true);

export const sabukIceKingdomArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'사북 아이스 킹덤']
  },
  source:{
    type:'SABUK_ICE_KINGDOM_GLOBAL_CODE_RESEARCH',
    url:officialLounge,
    checkedAt,
    references:[officialLounge,googlePlay,appStore,ldPlayer,play100,honeybee,digwow,gameedu],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'사북: 아이스 킹덤 쿠폰을 2026년 10월 14일 기준 재조사했습니다. 공식 앱·네이버 게임 라운지와 국내 공개 자료를 교차 확인해 입력 후보 29개를 정리하며, 공식 발급·실사용이 확인되지 않은 코드는 미확인 후보로 표시합니다.',
    keywords:['사북 아이스 킹덤 쿠폰','사북: 아이스 킹덤 쿠폰','사북 아이스킹덤 쿠폰','Ice Kingdom coupon','사북 아이스 킹덤 코드','패키지 코드 교환'],
    hashtags:['#사북아이스킹덤','#아이스킹덤','#게임쿠폰','#쿠폰코드','#사북쿠폰'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:currentCandidates.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:historicalRecords.map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    benefits:[]
  }
};
