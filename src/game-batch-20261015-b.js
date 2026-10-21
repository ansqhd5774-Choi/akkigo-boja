import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-21';
const articleKey='eclipse-the-awakening-codes-202610';
const GAME='이클립스: 더 어웨이크닝';
const googlePlay='https://play.google.com/store/apps/details?id=com.smilegate.eclipse.stove.google&hl=ko';
const officialSite='https://eclipse.onstove.com/';
const officialCommunity='https://page.onstove.com/eclipse/kr';
const officialCoupon='https://eclipse.onstove.com/ko/coupon';
const officialPreview='https://page.onstove.com/eclipse/kr/view/14493631';
const officialBenefits='https://page.onstove.com/eclipse/kr/view/14573370';
const digwow='https://www.digwow.net/%EC%9D%B4%ED%81%B4%EB%A6%BD%EC%8A%A4-%EB%8D%94-%EC%96%B4%EC%9B%A8%EC%9D%B4%ED%81%AC%EB%8B%9D/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C';
const thirdBlog='https://computerhanashi.tistory.com/864';
const appIcon='https://play-lh.googleusercontent.com/JhepoyYDmabwj5ffSFC3cyfAdllyeIdHzSW5a3i_nlzsahXojL7S57JR1_RlYYkRh02OXzZM6K1s9KWnd-1Mpw=s0-br30';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const official=(name,url,sourcePublishedAt)=>({name,url,referenceType:'OFFICIAL_POST',sourcePublishedAt,checkedAt});
const third=(name,url,sourcePublishedAt)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});

const officialPreviewSource=official('STOVE · 9/5 론칭 프리뷰 방송 쿠폰',officialPreview,'2026-09-05');
const officialBenefitSource=official('STOVE · 신규 서버 오픈 혜택 모아보기',officialBenefits,'2026-10-08');
const digwowSource=third('DIGWOW · 2026년 10월 쿠폰 모음',digwow,'2026-10-14');
const blogSource=third('computerhanashi · 10월 쿠폰 정리',thirdBlog,'2026-10-11');
const communityCoupon='https://gall.dcinside.com/mgallery/board/view/?id=cthea&no=48484&page=1';
const communityExpiry='https://gall.dcinside.com/mgallery/board/view/?id=cthea&no=3798';
const communityNew=third('10/13 이용자 공유 게시물',communityCoupon,'2026-10-13');
const communityExpirySource=third('이용자 쿠폰 정리 · 최초 게시 9/9·10/13 수정',communityExpiry,'2026-09-09');
const screenshotSource={name:'사용자 제공 게임 커뮤니티 댓글 · 원문 URL·게시일 미확인',url:null,referenceType:'USER_SCREENSHOT',sourcePublishedAt:null,checkedAt};

const records=[
  {
    code:'0910ECLIPSE',sourcePublishedAt:'2026-09-05',latest:true,
    latestEvidence:'STOVE 공식 10/8 혜택 모아보기에서 0910ECLIPSE를 2026-11-10 23:59까지 사용 가능한 론칭 프리뷰 방송 쿠폰으로 재확인했다.',
    expiry:'2026-11-10 23:59 KST',status:'ACTIVE',statusLabel:'공식 현재·계정당 1회',sources:[officialPreviewSource,officialBenefitSource],
    evidenceHTML:'<p>STOVE 공식 공지에서 직접 확인한 공용 쿠폰입니다. 정식 론칭 이후부터 2026년 11월 10일 23:59까지 사용할 수 있으며 계정당 1회 제한이 안내되어 있습니다.</p>'
  },
  ...['ECLIPSE777','ECLIPSE2024','WELCOME','VIP777','GIFT888'].map(code=>({
    code,sourcePublishedAt:'2026-10-14',latest:true,
    latestEvidence:`2026-10-15 확인 시 DIGWOW의 이클립스: 더 어웨이크닝 10월 코드 목록에 ${code}가 노출됐다. STOVE 공식 발급 원문·만료일·실제 계정 사용 성공은 확인되지 않았다.`,
    expiry:'미확인',status:'UNVERIFIED',statusLabel:'제3자 현재 후보·공식 발급 미확인',sources:[digwowSource],
    evidenceHTML:`<p>DIGWOW 10월 목록에 노출된 문자열입니다. STOVE 공식 공지에서 동일 코드 발급 근거를 확인하지 못했으므로 입력 후보로만 보존합니다.</p>`
  })),
  {
    code:'leedo1009',sourcePublishedAt:'2026-10-11',latest:true,
    latestEvidence:'제3자 정리글에서 한글날 공식 히든 쿠폰 힌트의 추정 정답으로 공유됐다. 공식 공지는 히든 쿠폰 존재만 안내하고 이 문자열 자체를 공개하지 않았다.',
    expiry:'미확인',status:'UNVERIFIED',statusLabel:'커뮤니티 추정 히든 코드·공식 문자열 미공개',sources:[blogSource,officialBenefitSource],
    evidenceHTML:'<p>공식 한글날 안내에는 히든 쿠폰이 존재한다는 힌트만 있으며 코드 문자열은 공개하지 않았습니다. leedo1009는 제3자 추정값이므로 공식 코드로 승격하지 않습니다.</p>'
  },
  {
    code:'G4MOCBVONE3OPLUA',sourcePublishedAt:null,latest:true,
    latestEvidence:'2026-10-21 사용자 제공 게임 커뮤니티 화면에 0910ECLIPSE와 함께 16자 문자열이 게시됐다. 원문 URL과 최초 게시일, O/0 판독, 공용 발급, 실제 등록 성공, 만료일은 미확인.',
    expiry:'미확인',status:'UNVERIFIED',statusLabel:'제보 댓글 후보 · O/0·공용 여부 미확인',sources:[screenshotSource],
    evidenceHTML:'<p>2026년 10월 21일 제공된 게임 커뮤니티 화면의 문자 판독 후보입니다. 영문 O와 숫자 0은 혼동될 수 있으며, 개별 발급 1회용 코드일 가능성도 있습니다. 댓글 원문 URL, 최초 게시일, 실제 사용 성공은 확인되지 않았습니다.</p>'
  },
  ...[
    ['0914ECLIPSE1ST','2026-09-14','2026-09-28'],
    ['0914ECLIPSE2ND','2026-09-14','2026-09-28'],
    ['HAPPYCHUSEOK',null,'2026-10-05'],
    ['BOREUMDALDAL',null,'2026-10-05']
  ].map(([code,published,expiry])=>({
    code,sourcePublishedAt:published,latest:false,expiry,status:'EXPIRED',statusLabel:'공식 종료 기록',sources:[officialBenefitSource],
    evidenceHTML:`<p>STOVE 공식 혜택·쿠폰 이력에서 확인되는 과거 코드이며 ${expiry} 이전에 사용 기간이 끝난 기록으로 현재 목록과 분리합니다.</p>`
  })),
  ...['1014UPDATEREADY','1013LIVETICKET5','1013LIVEWELCOME'].map(code=>({
    code,sourcePublishedAt:'2026-10-13',latest:false,expiry:'2026-10-20 23:59 KST',
    status:'EXPIRED',statusLabel:'10/20 종료 보고·공식 원문 미확인',sources:[communityNew,communityExpirySource],
    evidenceHTML:'<p>2026년 10월 13일 커뮤니티 공유 글에 코드가 게시됐고, 10월 20일 23:59 종료라는 복수 자료가 확인됩니다. 공식 발급 원문과 계정별 등록 결과는 별도 미확인입니다.</p>'
  }))
];

const currentCount=records.filter(x=>x.latest===true).length;
const expiredCount=records.filter(x=>x.status==='EXPIRED').length;
const model={
  articleKey,title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 현재</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>입력 후보</span><strong>${currentCount-1}개</strong></div><div class="ncp-feed-stat"><span>종료 기록</span><strong>${expiredCount}개</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:`<p>2026년 10월 21일 기준 공식 Google Play과 STOVE 공지 및 10월 13~14일 커뮤니티 기록을 대조했습니다. 공식 공용 현재 코드는 <strong>0910ECLIPSE 1개</strong>이며 2026년 11월 10일 23:59까지 등록 기한이 안내됩니다. 제공된 댓글 화면의 16자 코드는 공용·유효 여부를 확인하지 못해 별도 후보로 분류했습니다. 10월 20일 종료된 라이브 코드 3종은 과거 기록으로 옮겼습니다. 실제 등록 성공은 별도이며 복사 완료를 성공으로 보지 않습니다.</p><p>카카오톡 공식 채널을 통해 발급되던 론칭·웰컴·스페셜 쿠폰은 발급 기간이 10월 10일 23:00에 종료됐지만 이미 발급받은 개별 코드는 11월 10일 23:59까지 사용할 수 있습니다. 공개 공용 문자열이 아니므로 아래 복사 목록에 임의 코드를 만들지 않고 별도 혜택으로 기록합니다.</p>`,
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>공식 홈페이지의 고객 지원 → 쿠폰 등록 페이지에서 STOVE 계정으로 로그인하고 쿠폰 번호와 보상을 받을 캐릭터를 선택해 등록합니다. 계정당 같은 쿠폰은 1회만 사용할 수 있습니다.</p><div><a href="${officialCoupon}" rel="noopener noreferrer">이클립스 공식 쿠폰 등록 <span>열기 →</span></a></div></section><section><h3>발급형 쿠폰 안내</h3><p>카카오톡 친구추가형 쿠폰 6종은 공용 문자열이 아니라 이용자에게 발급되는 방식입니다. 발급 마감과 등록 마감을 구분해 기록했으며 발급되지 않은 새 코드를 임의 생성하지 않습니다. 이용자 댓글 속 16자 문자열도 1회용 발급 코드일 수 있어 공용으로 추천하지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${officialSite}" rel="noopener noreferrer">공식 사이트</a> · <a href="${officialCommunity}" rel="noopener noreferrer">STOVE 공식 커뮤니티</a> · <a href="${officialPreview}" rel="noopener noreferrer">0910ECLIPSE 공식 원문</a> · <a href="${officialBenefits}" rel="noopener noreferrer">공식 혜택 모아보기</a> · <a href="${digwow}" rel="noopener noreferrer">DIGWOW 후보 목록</a> · <a href="${communityCoupon}" rel="noopener noreferrer">10/13 라이브 쿠폰 공유</a> · <a href="${communityExpiry}" rel="noopener noreferrer">10/20 마감 기록</a></p>`,
  records
};

export const eclipseAwakeningArticle={
  articleKey,approvedForPublish:true,
  post:{title:GAME,content:renderGamePeriodArticle(model),labels:['게임',GAME,'Eclipse: The Awakening']},
  source:{
    type:'ECLIPSE_AWAKENING_GLOBAL_CODE_RESEARCH',url:officialBenefits,checkedAt,
    references:[googlePlay,officialSite,officialCommunity,officialCoupon,officialPreview,officialBenefits,digwow,thirdBlog,communityCoupon,communityExpiry],
    presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,
    searchDescription:'이클립스: 더 어웨이크닝 쿠폰을 2026년 10월 21일 기준 재조사했습니다. STOVE 공용 코드 0910ECLIPSE, 이용자 제공 미검증 코드, 10월 20일 종료 이력, 카카오톡 개별 발급형 쿠폰을 구분해 정리합니다.',
    keywords:['이클립스 더 어웨이크닝 쿠폰','이클립스 쿠폰','0910ECLIPSE','이클립스 10월 21일 쿠폰','Eclipse The Awakening coupon','이클립스 쿠폰 입력'],
    hashtags:['#이클립스더어웨이크닝','#이클립스쿠폰','#EclipseTheAwakening','#게임쿠폰'],searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:records.filter(x=>x.status==='ACTIVE').map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    unverifiedCandidates:records.filter(x=>x.status==='UNVERIFIED').map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    historicalRecords:records.filter(x=>x.status==='EXPIRED').map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    benefits:[
      {id:'KAKAO_LAUNCH_SPECIAL',type:'ISSUED_CODE',status:'ENDED_ISSUANCE',method:'카카오톡 공식 채널 친구 추가 후 개별 쿠폰 발급',issueDeadline:'2026-10-10 23:00 KST',useDeadline:'2026-11-10 23:59 KST',source:officialBenefits},
      {id:'KAKAO_WELCOME_AND_SPECIAL_5',type:'ISSUED_CODE',status:'ENDED_ISSUANCE',method:'카카오톡 공식 채널 홈에서 개별 쿠폰 발급',issueDeadline:'2026-10-10 23:00 KST',useDeadline:'2026-11-10 23:59 KST',source:officialBenefits}
    ]
  }
};
