import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='blade-war-three-kingdoms-codes-202610';
const officialSite='https://www.evistagame.com/';
const officialRedeem='https://bladewar.evistagame.com/giftcode';
const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.starutopia.global';
const appStore='https://apps.apple.com/kr/app/%EB%B8%94%EB%A0%88%EC%9D%B4%EB%93%9C-%EC%9B%8C-%EC%82%BC%EA%B5%AD/id6769617371';
const appIcon='https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/49/c6/17/49c6179f-cc24-a1e0-604c-38a777fcd8cc/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg';
const mrGuider='https://www.mrguider.org/codes/blade-war-three-kingdoms-codes/';
const digwow='https://www.digwow.net/%EB%B8%94%EB%A0%88%EC%9D%B4%EB%93%9C-%EC%9B%8C-%EC%82%BC%EA%B5%AD/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const aayyy='https://www.aayyy.net/%E5%88%83%E8%88%87%E4%B8%89%E5%9C%8B-%E7%83%BD%E7%81%AB%E7%88%AD%E9%9C%B8/%E7%A6%AE%E5%8C%85%E7%A2%BC/';
const ppGame='https://ppgame.tw/%E5%88%83%E8%88%87%E4%B8%89%E5%9C%8B%EF%BC%9A%E7%83%BD%E7%81%AB%E7%88%AD%E9%9C%B8%E7%A6%AE%E5%8C%85%E7%A2%BC/';
const pixnetPaopao='https://paopaogame.pixnet.net/blog/posts/940176237454831917';
const mobile01='https://www.mobile01.com/topicdetail.php?f=675&t=7277612';
const youtube='https://www.youtube.com/watch?v=41y5KA9rylQ';
const ssbuy='https://www.ssbuy.tw/detail_giftcode/dist/giftcodes/%E5%88%83%E8%88%87%E4%B8%89%E5%9C%8B%EF%BC%9A%E7%83%BD%E7%81%AB%E7%88%AD%E9%9C%B8.html';
const lineGames='https://www.linegames.org/ka/blade-war%3Athree-kingdoms-%E1%83%99%E1%83%9D%E1%83%93%E1%83%94%E1%83%91%E1%83%98/';
const historicalPixnet='https://su9977.pixnet.net/blog/posts/915762156618792473';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${appStore}" style="margin:0 0 24px"><a href="${appStore}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="블레이드 워: 삼국 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const source=(name,url,sourcePublishedAt=null,extra={})=>({
  name,
  url,
  sourcePublishedAt,
  checkedAt,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  ...extra
});
const src={
  mr:()=>source('MrGuider Blade War Three Kingdoms Codes',mrGuider),
  dig:()=>source('DIGWOW 블레이드 워: 삼국 쿠폰 모음',digwow),
  aayyy:()=>source('AAYYY 刃與三國：烽火爭霸 禮包碼',aayyy),
  pp:()=>source('泡泡手遊 刃與三國：烽火爭霸 禮包碼',ppGame),
  pix:()=>source('泡泡 PIXNET 刃與三國：烽火爭霸 禮包碼',pixnetPaopao,'2026-09-14'),
  mobile:()=>source('Mobile01 Blade War:Three Kingdoms 禮包碼',mobile01,'2026-07-09'),
  youtube:()=>source('ちべくま Blade War Three Kingdoms Gift Codes',youtube,'2026-09-12'),
  ssbuy:()=>source('SSbuy 刃與三國：烽火爭霸 禮包碼',ssbuy),
  line:()=>source('LINEGames Blade War:Three Kingdoms codes',lineGames,'2026-05-04',{sourceUpdatedAt:'2026-10-13'}),
  oldPix:()=>source('二次元遊戲動漫資訊站 刃與三國 禮包碼整理',historicalPixnet,'2026-07-09')
};

const current=(code,{sourcePublishedAt=null,expiry='미확인',statusLabel='제3자 현재 후보·사용 여부 미확인',sources=[],latestEvidence='',evidenceHTML=''})=>({
  code,
  sourcePublishedAt,
  latest:true,
  latestEvidence:latestEvidence || `2026-10-14 공개 자료에서 ${code}가 블레이드 워: 삼국 현재 또는 시도 가능 코드로 노출됐다. 공식 발급 원문과 이 대화에서의 실제 계정 입력 성공은 확인되지 않았다.`,
  expiry,
  status:'UNVERIFIED',
  statusLabel,
  sources,
  evidenceHTML:evidenceHTML || '<p>공개 제3자 코드 목록에서 블레이드 워: 삼국 코드로 확인했습니다. 공식 발급 원문과 실제 계정 입력 성공은 별도로 확인되지 않아 현재 후보로 보존합니다.</p>'
});

const ended=(code,{sourcePublishedAt,expiry,statusLabel='과거 종료 보고',sources=[],evidenceHTML})=>({
  code,
  sourcePublishedAt,
  latest:false,
  expiry,
  status:'EXPIRED',
  statusLabel,
  sources,
  evidenceHTML:evidenceHTML || '<p>공개 자료에서 종료 또는 과거 코드로 확인되어 현재 후보와 분리했습니다.</p>'
});

const records=[
  current('C6Q2B4',{
    sources:[src.mr()],
    latestEvidence:'MrGuider의 2026년 10월 working 목록에서 10월 1일 추가 코드로 표시됐다. 페이지의 정확한 최초 게시일은 확인되지 않았으며 공식 발급 원문·실사용 성공은 미확인이다.'
  }),
  current('L9X0S5',{
    sourcePublishedAt:'2026-09-14',
    sources:[src.mr(),src.pix()],
    latestEvidence:'MrGuider의 working 목록과 2026-09-14 泡泡 PIXNET 목록에서 함께 확인됐다. 공식 발급 원문·실사용 성공은 미확인이다.'
  }),
  current('NEWWEBSTORE',{
    sourcePublishedAt:'2026-09-12',
    expiry:'2026-12-31',
    statusLabel:'제3자 현재 후보·12월 31일 종료 보고',
    sources:[src.mr(),src.youtube(),src.pix()],
    latestEvidence:'2026-09-12 YouTube 코드 정리와 MrGuider·泡泡 목록에서 확인됐고 제3자 자료들은 2026-12-31까지로 기재한다. 공식 발급 원문·실사용 성공은 미확인이다.',
    evidenceHTML:'<p>여러 공개 자료에서 2026년 12월 31일까지라고 교차 기재됩니다. 다만 코드 발급 주체의 원문을 직접 확인하지 못했으므로 사용 가능 확정이 아니라 현재 후보입니다.</p>'
  }),
  current('Q3Y0T7',{
    sources:[src.mr()],
    latestEvidence:'MrGuider의 2026년 10월 working 목록에서 9월 10일 추가 코드로 표시됐다. 정확한 원문 게시일·공식 발급·실사용 성공은 미확인이다.'
  }),
  current('K7M4Q9',{
    sources:[src.mr()],
    latestEvidence:'MrGuider의 2026년 10월 working 목록에서 9월 9일 추가 코드로 표시됐다. 정확한 원문 게시일·공식 발급·실사용 성공은 미확인이다.'
  }),
  current('S1H0X6',{
    sourcePublishedAt:'2026-09-14',
    sources:[src.mr(),src.pp(),src.pix()],
    latestEvidence:'MrGuider working 목록과 2026-09-14 泡泡 계열 게시물에서 함께 확인됐다. 공식 발급 원문·실사용 성공은 미확인이다.'
  }),
  current('B6W8Q1',{
    sourcePublishedAt:'2026-09-14',
    sources:[src.pp(),src.pix()],
    latestEvidence:'2026-09-14 泡泡 계열 코드 목록에서 확인됐다. 공식 발급 원문·만료일·실사용 성공은 미확인이다.'
  }),
  current('BLADEWAR2026',{
    sourcePublishedAt:'2026-07-09',
    expiry:'2026-12-31',
    statusLabel:'복수 제3자 현재 후보·12월 31일 종료 보고',
    sources:[src.mobile(),src.youtube(),src.ssbuy()],
    latestEvidence:'2026-07-09 Mobile01, 2026-09-12 YouTube, SSbuy 등 서로 다른 공개 자료에서 반복 확인됐고 Mobile01은 2026-12-31까지로 기재한다. 공식 발급 원문·실사용 성공은 미확인이다.',
    evidenceHTML:'<p>서로 다른 제3자 자료에서 반복 확인되고 2026년 12월 31일 종료 정보도 교차됩니다. 공식 교환소는 존재하지만 교환소 자체가 이 코드의 발급 원문은 아니므로 공식 확정으로 승격하지 않았습니다.</p>'
  }),
  current('BLADEWAR',{sources:[src.dig()]}),
  current('SAMGUK777',{sources:[src.dig()]}),
  current('WELCOME',{
    sources:[src.dig()],
    statusLabel:'제3자 현재 후보·범용형 문자열',
    evidenceHTML:'<p>DIGWOW의 현재 목록에서 확인했습니다. 다른 게임에서도 자주 쓰이는 범용형 문자열이지만 삭제하지 않고 미확인 후보로 보존합니다.</p>'
  }),
  current('VIP666',{
    sources:[src.dig(),src.aayyy()],
    statusLabel:'한국·대만 제3자 후보·범용형 문자열',
    evidenceHTML:'<p>한국 DIGWOW와 대만 AAYYY 목록에서 함께 확인했습니다. 지역·서버·계정 조건과 공식 발급 여부는 미확인입니다.</p>'
  }),
  current('VIP888',{
    sources:[src.dig(),src.aayyy()],
    statusLabel:'한국·대만 제3자 후보·범용형 문자열',
    evidenceHTML:'<p>한국 DIGWOW와 대만 AAYYY 목록에서 함께 확인했습니다. 지역·서버·계정 조건과 공식 발급 여부는 미확인입니다.</p>'
  }),
  current('RY3K888',{
    sources:[src.aayyy()],
    statusLabel:'대만 제3자 현재 후보·지역 조건 미확인',
    evidenceHTML:'<p>대만권 AAYYY의 현재 목록에서 확인했습니다. 한국 계정·서버 적용 여부와 공식 발급 원문은 미확인입니다.</p>'
  }),
  current('RY3K666',{
    sources:[src.aayyy()],
    statusLabel:'대만 제3자 현재 후보·지역 조건 미확인',
    evidenceHTML:'<p>대만권 AAYYY의 현재 목록에서 확인했습니다. 한국 계정·서버 적용 여부와 공식 발급 원문은 미확인입니다.</p>'
  }),
  current('SG2024',{
    sources:[src.aayyy()],
    statusLabel:'대만 제3자 현재 후보·지역 조건 미확인',
    evidenceHTML:'<p>대만권 AAYYY의 현재 목록에서 확인했습니다. 한국 계정·서버 적용 여부와 공식 발급 원문은 미확인입니다.</p>'
  }),
  current('43sio4ibsHdA',{
    sourcePublishedAt:'2026-05-04',
    expiry:'2026-10-20',
    statusLabel:'LINEGames 제3자 후보·10월 20일 종료 표시',
    sources:[src.line()],
    latestEvidence:'LINEGames 페이지는 2026-05-04 최초 게시, 2026-10-13 수정으로 표시되며 2026-10-14 실시간 확인 시 이 문자열을 Active 및 2026-10-20 종료로 노출했다. 사이트는 게임사와 무관하다고 명시한다.',
    evidenceHTML:'<p>LINEGames 실시간 페이지에 노출된 문자열입니다. 페이지는 자체적으로 이 이벤트가 Blade War:Three Kingdoms와 제휴되지 않았다고 안내하므로 공식 쿠폰이 아니라 제3자 후보입니다.</p>'
  }),
  current('LVcOBSNVvQZZ',{sourcePublishedAt:'2026-05-04',sources:[src.line()],statusLabel:'LINEGames 제3자 현재 후보·사용 여부 미확인',latestEvidence:'2026-10-14 실시간 확인한 LINEGames 페이지에서 노출됐다. 페이지 최초 게시일은 2026-05-04, 수정일은 2026-10-13이며 게임사 비제휴 고지를 포함한다.'}),
  current('inwxnAUEpIcD',{sourcePublishedAt:'2026-05-04',sources:[src.line()],statusLabel:'LINEGames 제3자 현재 후보·사용 여부 미확인',latestEvidence:'2026-10-14 실시간 확인한 LINEGames 페이지에서 노출됐다. 페이지 최초 게시일은 2026-05-04, 수정일은 2026-10-13이며 게임사 비제휴 고지를 포함한다.'}),
  current('Wgezcg8E6EPN',{sourcePublishedAt:'2026-05-04',sources:[src.line()],statusLabel:'LINEGames 제3자 현재 후보·사용 여부 미확인',latestEvidence:'2026-10-14 실시간 확인한 LINEGames 페이지에서 노출됐다. 페이지 최초 게시일은 2026-05-04, 수정일은 2026-10-13이며 게임사 비제휴 고지를 포함한다.'}),
  current('JpNX0V2Anzax',{sourcePublishedAt:'2026-05-04',sources:[src.line()],statusLabel:'LINEGames 제3자 현재 후보·사용 여부 미확인',latestEvidence:'2026-10-14 실시간 확인한 LINEGames 페이지에서 노출됐다. 페이지 최초 게시일은 2026-05-04, 수정일은 2026-10-13이며 게임사 비제휴 고지를 포함한다.'}),
  current('mycrUCVG0lJP',{sourcePublishedAt:'2026-05-04',sources:[src.line()],statusLabel:'LINEGames 제3자 현재 후보·사용 여부 미확인',latestEvidence:'2026-10-14 실시간 확인한 LINEGames 페이지에서 노출됐다. 페이지 최초 게시일은 2026-05-04, 수정일은 2026-10-13이며 게임사 비제휴 고지를 포함한다.'}),
  current('1ShmDWQstx23',{sourcePublishedAt:'2026-05-04',sources:[src.line()],statusLabel:'LINEGames 제3자 현재 후보·사용 여부 미확인',latestEvidence:'2026-10-14 실시간 확인한 LINEGames 페이지에서 노출됐다. 페이지 최초 게시일은 2026-05-04, 수정일은 2026-10-13이며 게임사 비제휴 고지를 포함한다.'}),
  current('ny5xaFiosIdB',{sourcePublishedAt:'2026-05-04',sources:[src.line()],statusLabel:'LINEGames 제3자 현재 후보·사용 여부 미확인',latestEvidence:'2026-10-14 실시간 확인한 LINEGames 페이지에서 노출됐다. 페이지 최초 게시일은 2026-05-04, 수정일은 2026-10-13이며 게임사 비제휴 고지를 포함한다.'}),
  ended('B2X8LP',{
    sourcePublishedAt:'2026-09-14',
    expiry:'2026-09-15',
    sources:[src.mr(),src.pix()],
    evidenceHTML:'<p>泡泡 PIXNET와 MrGuider에서 2026년 9월 15일 종료로 확인됩니다. 현재 후보에서 제외하고 2026년 이력으로 보존합니다.</p>'
  }),
  ended('STORENEWEVENT',{
    sourcePublishedAt:'2026-09-12',
    expiry:'2026-09-30',
    sources:[src.mr(),src.youtube(),src.pix()],
    evidenceHTML:'<p>공개 자료에서 보상은 금화 1,200, 고급 장비 랜덤 보물상자 1개, 공용 가속 1시간 2개로 안내됐고 2026년 9월 30일 종료로 기재됩니다.</p>'
  }),
  ended('K7M9Q2',{
    sourcePublishedAt:'2026-07-09',
    expiry:'과거 코드 언급',
    sources:[src.oldPix()],
    evidenceHTML:'<p>2026-07-09 게시물에서 과거 팬페이지 활동 코드의 예시로 언급된 문자열입니다. 현재 사용 가능 근거가 없어 과거 기록으로만 보존합니다.</p>'
  })
];

const model={
  articleKey,
  title:'블레이드 워: 삼국',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="블레이드 워: 삼국 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 입력 후보</span><strong>24개</strong></div><div class="ncp-feed-stat"><span>공식 발급 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>과거 종료 기록</span><strong>3개</strong></div></div>',
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 EVISTA의 공식 앱과 공식 Gift Pack Redeem 페이지는 확인했지만, 코드 문자열을 직접 발급한 운영사 원문은 찾지 못했습니다. 따라서 공개 자료에서 수집한 24개 문자열은 전부 제3자 현재 후보로 보존하고, 종료 근거가 있는 3개는 과거 이력으로 분리했습니다.</p><p><strong>BLADEWAR2026</strong>·<strong>NEWWEBSTORE</strong>는 여러 자료에서 반복 확인되고 2026년 12월 31일 종료 정보도 보이지만, 공식 발급 원문과 이 대화에서의 실제 계정 입력 성공은 확인되지 않았으므로 ACTIVE로 단정하지 않습니다. LINEGames의 8개 문자열은 10월 14일 실시간 페이지에 노출됐지만 해당 사이트가 게임사와 무관하다고 명시하므로 별도 저신뢰 후보로 표시했습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>EVISTA 공식 교환소에서 캐릭터 ID와 Gift Code를 입력합니다. 캐릭터 ID는 게임 왼쪽 위 프로필을 열고 프로필 화면 왼쪽 아래에서 복사할 수 있습니다. 교환 성공 시 보상은 게임 내 우편함으로 최대 10분 안에 전송된다고 공식 교환소가 안내합니다.</p><div><a href="${officialRedeem}" rel="noopener noreferrer">블레이드 워: 삼국 공식 Gift Pack Redeem <span>열기 →</span></a></div></section>`,
  archiveHTML:`<p><a href="${officialRedeem}" rel="noopener noreferrer">EVISTA 공식 교환소</a> · <a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${appStore}" rel="noopener noreferrer">App Store 공식 앱</a> · <a href="${mrGuider}" rel="noopener noreferrer">MrGuider</a> · <a href="${digwow}" rel="noopener noreferrer">DIGWOW</a> · <a href="${pixnetPaopao}" rel="noopener noreferrer">泡泡 PIXNET</a> · <a href="${mobile01}" rel="noopener noreferrer">Mobile01</a> · <a href="${youtube}" rel="noopener noreferrer">YouTube 코드 정리</a> · <a href="${lineGames}" rel="noopener noreferrer">LINEGames 제3자 목록</a></p>`,
  records
};

const currentCandidates=records.filter(x=>x.latest===true);
const historicalRecords=records.filter(x=>x.latest!==true);

export const bladeWarThreeKingdomsArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:'블레이드 워: 삼국',
    content:renderGamePeriodArticle(model),
    labels:['게임','블레이드 워: 삼국','Blade War:Three Kingdoms']
  },
  source:{
    type:'BLADE_WAR_THREE_KINGDOMS_GLOBAL_CODE_RESEARCH',
    url:officialRedeem,
    checkedAt,
    references:[officialSite,officialRedeem,googlePlay,appStore,mrGuider,digwow,aayyy,ppGame,pixnetPaopao,mobile01,youtube,ssbuy,lineGames,historicalPixnet],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'블레이드 워: 삼국 쿠폰은 EVISTA 공식 교환소와 국내외 공개 자료를 교차 확인해 현재 입력 후보 24개와 과거 종료 기록 3개를 구분합니다. 공식 발급 원문·실사용 성공이 없는 코드는 미확인 후보로 표시합니다.',
    keywords:['블레이드 워 삼국 쿠폰','블레이드 워: 삼국 쿠폰','Blade War Three Kingdoms codes','Blade War gift code','刃與三國 禮包碼','블레이드 워 쿠폰 입력'],
    hashtags:['#블레이드워삼국','#BladeWarThreeKingdoms','#게임쿠폰','#쿠폰코드','#삼국게임'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:currentCandidates.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:historicalRecords.map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    benefits:[]
  }
};
