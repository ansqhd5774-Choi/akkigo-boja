import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='nightdiff-codes-202610';
const GAME='나이트디프';
const googlePlay='https://play.google.com/store/apps/details?id=com.nicegirl.gp.find.nightdiff&hl=ko';
const developerSite='https://cikimi777.xyz/';
const gameedu='https://game.edu.kg/ko/nightdiff/%EC%BF%A0%ED%8F%B0/';
const linegames='https://www.linegames.org/hy/nightdiff-codes/';
const appIcon='https://play-lh.googleusercontent.com/rv3RDxcpjn1ywdJUgTbDlVDkUZAHMfgB6qCL_ri6IwfbtsLXc4l7tzqOyD1Y18AzyWtvK6p1lDo4DRgU_fiZ=s0-br30';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const third=(name,url,sourcePublishedAt,updatedAt)=>({
  name,
  url,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  sourcePublishedAt,
  updatedAt,
  checkedAt
});

const gameeduCodes=['WELCOME','VIP333','VIP555','VIP666','VIP888','VIP999','VIP2024','FBGIFT','D8PsQ1s59S3O'];
const linegamesCodes=['Dq08BQXBOdaH','RXgHO8owATFB','QEN8ss0GZMkZ','bHXXYnUBYuZn','M55eegsFBCWQ','6cHe5LVREVuB','PVymOswxiJm9','lZQqTObztWgT','XKhQHXRVnjgj','nQ9KOSolUf9h','j0bIKYOGuBZX','wyxw4ki7smIt','c7MUdomwtwhI'];

const candidate=(code,{origin,sourcePublishedAt,updatedAt,url,statusLabel})=>({
  code,
  sourcePublishedAt,
  latest:true,
  latestEvidence:`2026-10-14 확인 시 ${origin}의 NightDiff 코드 목록에 ${code}가 노출됐다. 해당 페이지의 최근 상태 표기는 2026-10-13이며 운영사 직접 발급 원문·정확한 만료·실제 계정 입력 성공은 확인되지 않았다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel,
  sources:[third(`${origin} · NightDiff 코드 목록`,url,sourcePublishedAt,updatedAt)],
  evidenceHTML:`<p>${origin}의 NightDiff 전용 코드 목록에서 확인했습니다. 이 출처는 NightDiff 운영사와 무관하다고 명시하고 있어 공식 쿠폰으로 승격하지 않습니다. 실제 게임에 코드 입력 메뉴가 존재하는지와 계정 입력 성공도 공식 자료에서 확인되지 않아 미확인 후보로 보존합니다.</p>`
});

const records=[
  ...gameeduCodes.map(code=>candidate(code,{origin:'GameEDU',sourcePublishedAt:'2026-03-29',updatedAt:'2026-10-13',url:gameedu,statusLabel:/^VIP|WELCOME|FBGIFT/.test(code)?'제3자 현재 후보·범용형 문자열·공식 발급 미확인':'제3자 현재 후보·공식 발급 미확인'})),
  ...linegamesCodes.map(code=>candidate(code,{origin:'LINEGames',sourcePublishedAt:'2026-04-08',updatedAt:'2026-10-13',url:linegames,statusLabel:'제3자 현재 후보·무작위형 문자열·공식 발급 미확인'}))
];

const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>최근 입력 후보</span><strong>22개</strong></div><div class="ncp-feed-stat"><span>공식 발급 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>전체 보존 기록</span><strong>22개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 Google Play의 공식 나이트디프 앱과 Google Play에 연결된 CiKiMi Game Studio 웹사이트를 확인했습니다. 공식 앱 설명과 개발사 사이트에서는 쿠폰·기프트코드·리딤 코드 또는 코드 입력 경로를 확인하지 못해 운영사 공식 현재 쿠폰은 0개로 분류합니다.</p><p>반면 GameEDU는 2026-10-13 작동 표기와 함께 9개, LINEGames는 2026-10-13 작동 표기와 함께 13개의 문자열을 노출하고 있습니다. 두 페이지 모두 NightDiff 운영사와 무관하다고 직접 명시하므로 총 22개를 삭제하지 않고 <strong>제3자 미확인 입력 후보</strong>로 보존합니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>공식 Google Play 페이지와 개발사 사이트에서는 코드 입력 메뉴를 안내하지 않습니다. 제3자 페이지들은 아바타·프로필·설정에서 Redeem Code 메뉴를 찾으라고 안내하지만 공식 확인이 아니므로, 실제 게임에 해당 메뉴가 있을 때만 후보 코드를 시도하세요. 메뉴 자체가 없다면 사용 가능한 공식 쿠폰 체계가 없는 가능성이 있습니다.</p><div><a href="${googlePlay}" rel="noopener noreferrer">나이트디프 Google Play 공식 앱 <span>열기 →</span></a></div></section><section><h3>확인 기준</h3><p>코드 문자열이 공개 페이지에 있다는 사실과 실제 게임에서 사용할 수 있다는 사실은 구분합니다. 현재 목록은 입력 시도 후보이며 성공 코드로 단정하지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${developerSite}" rel="noopener noreferrer">CiKiMi Game Studio</a> · <a href="${gameedu}" rel="noopener noreferrer">GameEDU 후보 목록</a> · <a href="${linegames}" rel="noopener noreferrer">LINEGames 후보 목록</a></p>`,
  records
};

export const nightDiffArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'NightDiff']
  },
  source:{
    type:'NIGHTDIFF_GLOBAL_CODE_RESEARCH',
    url:googlePlay,
    checkedAt,
    references:[googlePlay,developerSite,gameedu,linegames],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'나이트디프 쿠폰을 2026년 10월 14일 기준 재조사했습니다. 공식 발급 확인 코드는 0개이며, GameEDU·LINEGames에서 현재 노출 중인 입력 후보 22개를 공식 여부와 분리해 정리합니다.',
    keywords:['나이트디프 쿠폰','나이트디프 코드','NightDiff coupon','NightDiff code','나이트디프 쿠폰 입력','NightDiff redeem code'],
    hashtags:['#나이트디프','#NightDiff','#게임쿠폰','#쿠폰코드'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:records.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:[],
    benefits:[]
  }
};
