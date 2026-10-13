import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='super-evolution-story-2-codes-202610';
const GAME='슈퍼진화스토리2';

const officialSite='https://beastsevolved2-sea.ntfusion.com/';
const appStore='https://apps.apple.com/kr/app/%EC%8A%88%ED%8D%BC%EC%A7%84%ED%99%94%EC%8A%A4%ED%86%A0%EB%A6%AC2/id6742139163';
const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.ntfusion.beastsevolved2';
const facebook='https://www.facebook.com/profile.php?id=61578517237833';
const taptapBoard='https://www.taptap.cn/app/305418/topic?type=official';
const taptapPage2='https://www.taptap.cn/app/305418/topic?page=2&type=official';
const taptap35='https://www.taptap.cn/moment/851169356548149056?group_id=495206';
const digwow='https://www.digwow.net/%EC%8A%88%ED%8D%BC%EC%A7%84%ED%99%94%EC%8A%A4%ED%86%A0%EB%A6%AC2/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const gameEduKr='https://game.edu.kg/ko/%EC%8A%88%ED%8D%BC%EC%A7%84%ED%99%94%EC%8A%A4%ED%86%A0%EB%A6%AC2/%EC%BF%A0%ED%8F%B0/';
const lineGames='https://www.linegames.org/ko/%EC%8A%88%ED%8D%BC%EC%A7%84%ED%99%94%EC%8A%A4%ED%86%A0%EB%A6%AC2-%EC%BF%A0%ED%8F%B0/';
const gameEduCn='https://game.edu.kg/ch/%E8%B6%85%E8%BF%9B%E5%8C%96%E7%89%A9%E8%AF%AD2/%E6%9C%80%E6%96%B0%E5%85%8D%E8%B4%B9%E7%A4%BC%E5%8C%85%E7%A0%81%E5%A4%A7%E5%85%A8/';
const ali213='https://m.ali213.net/news/gl2606/1782349.html';
const appIcon='https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/aa/81/c7/aa81c7eb-cbb8-f54b-3edf-18e33504d51e/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${appStore}" style="margin:0 0 24px"><a href="${appStore}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const third=(name,url,extra={})=>({
  name,
  url,
  sourcePublishedAt:null,
  checkedAt,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  ...extra
});
const official=(name,url,sourcePublishedAt)=>({
  name,
  url,
  sourcePublishedAt,
  checkedAt,
  referenceType:'OFFICIAL_CODE_CONTEXT'
});

const src={
  dig:()=>third('DIGWOW 슈퍼진화스토리2 쿠폰 모음',digwow,{updatedAt:'2026-10-12T21:00:00+09:00'}),
  gameEduKr:()=>third('GameEDU 한국어 슈퍼진화스토리2 쿠폰 목록',gameEduKr,{updatedAt:'2026-10-10'}),
  line:()=>third('LINEGames.org 슈퍼진화스토리2 쿠폰 목록',lineGames),
  gameEduCn:()=>third('GameEDU 중국어 超进化物语2 코드 목록',gameEduCn),
  ali:()=>third('游侠手游 超进化物语2 2026 코드 목록',ali213,{updatedAt:'2026-06-15'}),
  tap35:()=>official('TapTap 공식 3.5版本兑换码 안내',taptap35,'2026-09-21'),
  tapBoard:(date)=>official('TapTap 超进化物语2 공식 게시판',taptapBoard,date),
  tapPage2:(date)=>official('TapTap 超进化物语2 공식 게시판 2페이지',taptapPage2,date)
};

const digwowCodes=['SES2OPEN','SES2GIFT','SES2WELCOME','SES2777','SES2888'];
const gameEduKrCodes=['VIP111','VIP222','VIP333','VIP555','VIP666','VIP777','VIP888','VIP999'];
const lineGamesCodes=['LINEGAMES','VIP111','VIP333','VIP666','VIP888','VIP2024','GO2024','DCGIFT'];
const koreanCodes=[
  'SES2OPEN','SES2GIFT','SES2WELCOME','SES2777','SES2888',
  'VIP111','VIP222','VIP333','VIP555','VIP666','VIP777','VIP888','VIP999',
  'LINEGAMES','VIP2024','GO2024','DCGIFT'
];
const gameEduCnExtra=['GAMEEDU','WELCOME','FBGIFT'];
const aliCodes=[
  '超进化222','超进化666','超进化物语2','超2来了','超进化2',
  '进化222','进化666','进化777','进化888','进化999','两种扣减',
  'CJH666','CJH888','CJH999','SVIP666','SVIP888',
  'jinhua666','jinhua777','jinhua999','BZBZ7PDSGK','wtjiw47n8u3nb'
];

const koreanSources=(code)=>[
  ...(digwowCodes.includes(code)?[src.dig()]:[]),
  ...(gameEduKrCodes.includes(code)?[src.gameEduKr()]:[]),
  ...(lineGamesCodes.includes(code)?[src.line()]:[])
];

const candidate=(code,{sources=[],statusLabel='제3자 입력 후보·현재 사용 여부 미확인',expiry='미확인',latestEvidence='',evidenceHTML=''}={})=>({
  code,
  sourcePublishedAt:null,
  latest:true,
  latestEvidence:latestEvidence || `2026-10-14 공개 자료에서 ${code}가 ${GAME} 입력 후보로 노출됐다. 운영사 직접 발급 원문과 현재 실제 계정 입력 성공은 확인되지 않았다.`,
  expiry,
  status:'UNVERIFIED',
  statusLabel,
  sources,
  evidenceHTML:evidenceHTML || `<p>공개 제3자 자료에서 ${GAME} 코드 후보로 확인했습니다. 운영사 직접 발급 원문·한국 서버 적용·현재 실제 계정 입력 성공이 확인되지 않아 미확인 후보로 보존합니다.</p>`
});

const koreanRecords=koreanCodes.map(code=>candidate(code,{
  sources:koreanSources(code),
  statusLabel:'한국 공개 제3자 후보·공식 발급/실사용 미확인',
  evidenceHTML:'<p>한국어 공개 쿠폰 목록에서 확인한 문자열입니다. 원문 최초 게시일은 확인되지 않았고, 페이지 갱신일을 발급일로 대체하지 않았습니다. 운영사 직접 발급 원문과 실제 계정 입력 성공이 없어 UNVERIFIED로 유지합니다.</p>'
}));

const gameEduCnRecords=gameEduCnExtra.map(code=>candidate(code,{
  sources:[src.gameEduCn()],
  statusLabel:'중국어 제3자 후보·한국판 적용 미확인',
  evidenceHTML:'<p>중국어 제3자 목록에 노출된 문자열입니다. 중국권 또는 범용 문자열일 수 있으며 한국판 적용과 운영사 직접 발급 원문은 확인되지 않았습니다.</p>'
}));

const aliRecords=aliCodes.map(code=>candidate(code,{
  sources:[src.ali()],
  statusLabel:code==='两种扣减'?'중국 제3자 후보·2026-12-31 표기·한국판 미확인':'중국 제3자 후보·한국판 적용 미확인',
  expiry:code==='两种扣减'?'2026-12-31':'미확인',
  latestEvidence:code==='两种扣减'
    ?'游侠手游의 2026 코드 목록이 两种扣减에 2026-12-31까지라는 기한을 표시한다. 운영사 원문·한국 서버 적용·실사용은 확인되지 않았다.'
    :`游侠手游의 2026 코드 목록에서 ${code}를 확인했다. 페이지의 2026-06-15 갱신 표시는 원문 최초 게시일로 사용하지 않았으며 운영사 원문·한국 서버 적용은 미확인이다.`,
  evidenceHTML:code==='两种扣减'
    ?'<p>제3자 2026 목록이 2026-12-31 기한을 표시하지만 운영사 원문에서 같은 종료일을 확인하지 못했습니다. 기한은 제3자 주장으로만 보존하며 한국판 적용도 미확인입니다.</p>'
    :'<p>중국권 제3자 2026 목록에서 확인했습니다. 페이지 갱신일은 원문 최초 게시일로 간주하지 않았고, 한국판 적용과 실제 계정 성공을 확인하지 못했습니다.</p>'
}));

const regionalOfficial=[
  {
    code:'3.5丰野间',
    sourcePublishedAt:'2026-09-21',
    latest:true,
    latestEvidence:'2026-09-21 TapTap 공식 3.5 버전 안내에서 교환 코드와 보상 20만 골드·진화 포자 10·원석 10을 직접 확인했다. 한국판 동일 코드 적용 여부는 미확인이다.',
    expiry:'미확인',
    status:'UNVERIFIED',
    statusLabel:'중국판 공식 발급·한국판 적용 미확인',
    sources:[src.tap35()],
    evidenceHTML:'<p>중국판 TapTap 운영사 공식 공지에서 직접 발급 문자열과 보상을 확인했습니다. 다만 한국판과 중국판의 서버·계정 체계가 동일하다는 근거가 없어 한국판 현재 쿠폰으로 승격하지 않습니다.</p>'
  },
  {
    code:'月缘形态',
    sourcePublishedAt:'2026-09-22',
    latest:true,
    latestEvidence:'2026-09-22 TapTap 공식 게시판에서 교환 코드와 20만 골드·원석 20 보상을 확인했다. 한국판 동일 코드 적용 여부와 별도 만료일은 미확인이다.',
    expiry:'미확인',
    status:'UNVERIFIED',
    statusLabel:'중국판 공식 발급·한국판 적용 미확인',
    sources:[src.tapBoard('2026-09-22')],
    evidenceHTML:'<p>중국판 TapTap 공식 게시판에서 발급 근거를 확인했습니다. 한국판 사용 가능 여부는 별도 확인되지 않아 지역 제한 공식 기록으로만 표시합니다.</p>'
  }
];

const officialHistory=[
  {
    code:'子弹时间',
    sourcePublishedAt:'2026-07-08',
    latest:false,
    latestEvidence:'2026-07-08 TapTap 공식 게시판에서 60만 골드 보상 교환 코드 발급 이력을 확인했다. 현재 재사용 가능 여부와 한국판 적용은 확인되지 않았다.',
    expiry:'현재 공식 상태 미확인',
    status:'UNVERIFIED',
    statusLabel:'중국판 공식 과거 발급·현재/한국판 상태 미확인',
    sources:[src.tapBoard('2026-07-08')],
    evidenceHTML:'<p>중국판 TapTap 공식 발급 이력입니다. 현재 날짜에 다시 사용할 수 있다는 근거가 없어 2026년 과거 기록으로 보존하며 한국판 적용을 주장하지 않습니다.</p>'
  },
  {
    code:'造唤许可',
    sourcePublishedAt:'2026-06-02',
    latest:false,
    latestEvidence:'2026-06-02 TapTap 공식 게시판에서 조환 허가 1개 보상 교환 코드 발급 이력을 확인했다. 현재 재사용 가능 여부와 한국판 적용은 확인되지 않았다.',
    expiry:'현재 공식 상태 미확인',
    status:'UNVERIFIED',
    statusLabel:'중국판 공식 과거 발급·현재/한국판 상태 미확인',
    sources:[src.tapPage2('2026-06-02')],
    evidenceHTML:'<p>중국판 TapTap 공식 발급 이력입니다. 현재 사용 가능으로 재확인되지 않아 과거 기록으로 분리하며 한국판 적용 여부도 미확인입니다.</p>'
  }
];

const records=[...koreanRecords,...gameEduCnRecords,...aliRecords,...regionalOfficial,...officialHistory];

const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>한국 공개 후보</span><strong>17개</strong></div><div class="ncp-feed-stat"><span>중국 공식 근거</span><strong>4개</strong></div><div class="ncp-feed-stat"><span>전체 보존 기록</span><strong>45개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 한국 App Store·Google Play과 NTFusion 공식 사이트에서 게임 신원을 확인했습니다. 한국판 운영사가 직접 발급한 현재 공개 쿠폰 원문은 확인하지 못했습니다. 한국어 공개 자료의 입력 후보 17개는 모두 공식 발급·실사용 미확인으로 유지합니다.</p><p>중국판 TapTap 공식 게시판에서는 운영사 발급 근거가 있는 문자열 4개를 확인했습니다. 이 중 최근 2개는 최신 탭에 지역 한정 공식 근거로 보존하지만 <strong>한국판 사용 가능으로 승격하지 않습니다.</strong> 중국권 제3자 코드도 별도 후보로 수집해 전체 45개 기록을 보존했습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>중국판 공식 TapTap 공지 기준으로 게임 메인 화면 왼쪽 위 프로필 → 설정 → 교환 코드(兑换码) → 코드 입력 → 확인 순서입니다. 한국판 메뉴명과 적용 서버가 다를 수 있으므로 실제 게임 화면을 함께 확인하세요.</p><div><a href="${taptapBoard}" rel="noopener noreferrer">중국판 공식 TapTap 게시판 <span>열기 →</span></a></div></section><section><h3>한국판 확인</h3><p>한국판 공식 앱은 App Store와 Google Play에서 동일 패키지 <strong>com.ntfusion.beastsevolved2</strong>로 확인됩니다. 제3자 문자열이 거절되면 철자·계정·서버·지역·기간 조건을 확인하세요.</p><div><a href="${officialSite}" rel="noopener noreferrer">NTFusion 공식 사이트 <span>열기 →</span></a></div></section>`,
  archiveHTML:`<p><a href="${officialSite}" rel="noopener noreferrer">NTFusion 공식 사이트</a> · <a href="${appStore}" rel="noopener noreferrer">한국 App Store</a> · <a href="${googlePlay}" rel="noopener noreferrer">Google Play</a> · <a href="${facebook}" rel="noopener noreferrer">공식 Facebook</a> · <a href="${taptapBoard}" rel="noopener noreferrer">중국판 공식 TapTap</a> · <a href="${digwow}" rel="noopener noreferrer">DIGWOW</a> · <a href="${gameEduKr}" rel="noopener noreferrer">GameEDU 한국어</a> · <a href="${lineGames}" rel="noopener noreferrer">LINEGames.org 목록</a> · <a href="${gameEduCn}" rel="noopener noreferrer">GameEDU 중국어</a> · <a href="${ali213}" rel="noopener noreferrer">游侠手游 2026 목록</a></p>`,
  records
};

const currentCandidates=records.filter(x=>x.latest===true);
const historicalRecords=records.filter(x=>x.latest!==true);

export const superEvolutionStory2Article={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'Beasts Evolved 2']
  },
  source:{
    type:'SUPER_EVOLUTION_STORY_2_GLOBAL_CODE_RESEARCH',
    url:officialSite,
    checkedAt,
    references:[officialSite,appStore,googlePlay,facebook,taptapBoard,taptapPage2,taptap35,digwow,gameEduKr,lineGames,gameEduCn,ali213],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'슈퍼진화스토리2 쿠폰을 2026년 10월 14일 기준 전세계 공개 자료로 재조사했습니다. 한국 공개 입력 후보 17개, 중국판 공식 발급 코드와 해외 제3자 후보, 과거 공식 기록을 지역·근거별로 구분해 정리합니다.',
    keywords:['슈퍼진화스토리2 쿠폰','슈퍼진화스토리2 코드','슈퍼진화스토리2 쿠폰 입력','Beasts Evolved 2 codes','超进化物语2 兑换码','SES2OPEN'],
    hashtags:['#슈퍼진화스토리2','#BeastsEvolved2','#게임쿠폰','#쿠폰코드','#초진화물어2'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    officialRegionalCodes:[...regionalOfficial,...officialHistory].map(({code,sourcePublishedAt,latest,expiry,status,statusLabel,sources})=>({code,sourcePublishedAt,latest,expiry,status,statusLabel,sources})),
    unverifiedCandidates:currentCandidates.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:historicalRecords.map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    benefits:[]
  }
};
