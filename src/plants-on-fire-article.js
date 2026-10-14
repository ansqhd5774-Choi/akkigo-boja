import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='plants-on-fire-codes-202610';
const officialSite='https://www.plantsonfire.com/';
const officialSiteUs='https://www.plantsonfire-us.com/';
const storeUrl='https://play.google.com/store/apps/details?id=com.plantsonfire.merge&hl=ko&gl=KR';
const legacyStoreUrl='https://play.google.com/store/apps/details?id=com.nvsgames.pt&hl=en-US';
const iconUrl='https://play-lh.googleusercontent.com/V5uc1nE0q0DzBgg-zMh17SlCaiief69MAWLleJqZy5_wOXnzZLu_qLLWeH-Z627P5fDEdTIJe3JppNirOxIsng=w240-h480-rw';
const redeem='https://pay.nvsgames.com/Topup/803374#tab=cdk';
const wiki='https://plantsonfire.online/codes';
const officialSocial='https://www.sotwe.com/playp0f?lang=en';
const bahamut='https://forum.gamer.com.tw/Co.php?bsn=85671&sn=211';
const youtube='https://salda.ws/video.php?id=xIIKPdCla_0';
const minute='https://www.minutetactics.com/codes/plants-on-fire-promo-codes';
const wantplay='https://en.wtpgame.com/game_news/plants-on-fire-gift-codes/';
const roonby='https://roonby.com/2026/08/28/plants-on-fire-gift-codes-2026/';
const mrguider='https://www.mrguider.org/codes/plants-on-fire-codes/';

const third=(name,url,sourcePublishedAt=null,updatedAt=null)=>({
  name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,
  ...(updatedAt?{updatedAt}:{}),checkedAt
});
const official=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'OFFICIAL_CODE_CONTEXT',sourcePublishedAt,checkedAt});
const p=t=>`<p>${t}</p>`;
const wikiSrc=third('Plants on Fire Wiki · 게임 내 입력 확인 목록',wiki,null,'2026-10-01');
const communitySep10=third('巴哈姆特 · 2026-09-10 코드 공유 글',bahamut,'2026-09-10');
const mrGuiderSrc=third('MrGuider · Plants on Fire Codes',mrguider,'2026-09-26','2026-10-08');
const officialSocialSrc=official('Plants on Fire 공식 @PlayP0F 코드 공지',officialSocial,null);

const active=[
  {code:'PIRATEBACK',sourcePublishedAt:null,latest:true,latestEvidence:'2026-10-14 재확인 시 Plants on Fire Wiki의 ACTIVE 목록에 유지된다. 해당 위키는 2026-10-01 게임 내 입력 확인을 기록했고, 공식 발급 원문과 전체 계정 적용은 별도 확인되지 않았다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 5개 + Gold 500. 팬 위키는 2026-10-01 게임 내 입력 확인을 기록했고 2026-10-14 재조회에서도 ACTIVE로 노출합니다. 공식 발급 원문 게시일과 전체 계정 적용은 확인되지 않았습니다.'),sources:[wikiSrc]},
  {code:'CRAZYRECAP',sourcePublishedAt:null,latest:true,latestEvidence:'2026-10-14 재확인 시 Plants on Fire Wiki의 ACTIVE 목록에 유지된다. 해당 위키는 2026-10-01 게임 내 입력 확인을 기록했고, 공식 발급 원문과 전체 계정 적용은 별도 확인되지 않았다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Gold 500. 팬 위키는 2026-10-01 게임 내 입력 확인을 기록했고 2026-10-14 재조회에서도 ACTIVE로 노출합니다. 공식 발급 원문 게시일과 전체 계정 적용은 확인되지 않았습니다.'),sources:[wikiSrc]},
  {code:'CRAZYMOON',sourcePublishedAt:null,latest:true,latestEvidence:'2026-10-14 재확인에서 공식 @PlayP0F의 “Redeem Code: CRAZYMOON” 배포 게시물이 계속 확인된다. 팬 위키는 2026-09-25 게임 내 확인을 기록했고 MrGuider도 2026-10-08 갱신 목록에서 현재 코드로 유지한다.',expiry:'미표시',status:'ACTIVE',statusLabel:'공식 배포·제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 5개. 공식 @PlayP0F 계정이 “special gift”와 함께 CRAZYMOON을 직접 공개했습니다. 팬 위키는 2026-09-25 게임 내 확인을 기록했고 MrGuider의 2026-10-08 갱신 목록에도 현재 코드로 남아 있습니다. 공식 게시물의 정확한 원문 게시일과 만료일은 확정하지 못했습니다.'),sources:[officialSocialSrc,wikiSrc,mrGuiderSrc]},
  {code:'POF5MILLION',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-14 재확인 시 팬 위키 ACTIVE 목록과 MrGuider 2026-10-08 현재 코드 목록에 함께 유지된다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 10개. 2026-09-10 커뮤니티 글에도 동일 문자열이 기록되어 있고 팬 위키 현재 목록 및 MrGuider의 2026-10-08 갱신 목록에서 현재 코드로 유지됩니다.'),sources:[communitySep10,wikiSrc,mrGuiderSrc]},
  {code:'POF2MILLION',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-14 재확인 시 팬 위키 ACTIVE 목록과 MrGuider 2026-10-08 현재 코드 목록에 함께 유지된다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 8개. 2026-09-10 커뮤니티 기록과 팬 위키, MrGuider의 현재 목록에서 교차 확인됩니다.'),sources:[communitySep10,wikiSrc,mrGuiderSrc]},
  {code:'POF1MILLION',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-14 재확인 시 팬 위키 ACTIVE 목록과 MrGuider 2026-10-08 현재 코드 목록에 함께 유지된다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 5개. 2026-09-10 커뮤니티 기록과 팬 위키, MrGuider의 현재 목록에서 교차 확인됩니다.'),sources:[communitySep10,wikiSrc,mrGuiderSrc]},
  {code:'POF500K',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-14 재확인 시 팬 위키 ACTIVE 목록과 MrGuider 2026-10-08 현재 코드 목록에 함께 유지된다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 3개. 2026-09-10 커뮤니티 기록과 팬 위키, MrGuider의 현재 목록에서 교차 확인됩니다.'),sources:[communitySep10,wikiSrc,mrGuiderSrc]},
  {code:'CRAZYFRIDAY',sourcePublishedAt:'2026-08-29',latest:true,latestEvidence:'2026-10-14 재확인 시 팬 위키 ACTIVE 목록과 MrGuider 2026-10-08 현재 코드 목록에 유지된다. 2026-08-29 스폰서 영상에도 무료 보상 코드로 노출됐다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Gold 1,000. 2026-08-29 Plants on Fire 스폰서 영상 설명에도 무료 보상 코드로 노출됐고 팬 위키와 MrGuider의 현재 목록에 남아 있습니다.'),sources:[third('Ethan Reid 스폰서 영상 · 2026-08-29',youtube,'2026-08-29'),communitySep10,wikiSrc,mrGuiderSrc]},
  {code:'PLANTSONLY',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-14 재확인 시 팬 위키 ACTIVE 목록과 MrGuider 2026-10-08 현재 코드 목록에 함께 유지된다.',expiry:'미표시',status:'UNVERIFIED',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Lucky Token 5개. 2026-09-10 커뮤니티 기록과 팬 위키, MrGuider의 현재 목록에서 교차 확인됩니다.'),sources:[communitySep10,wikiSrc,mrGuiderSrc]}
];

const history=[
  {code:'CRAZYGIFT',sourcePublishedAt:null,expiry:'출처 상충',status:'EXPIRED',statusLabel:'만료 우세·출처 상충',evidenceHTML:p('MinuteTactics는 2026-09-09 편집 기록에서 활성으로 뒀지만, 2026-10-01 게임 내 확인을 기록한 팬 위키는 만료 목록으로 분류합니다. 2026-10-14 재확인에서도 팬 위키는 만료로 유지해 현재 사용 가능으로 표시하지 않습니다.'),sources:[third('MinuteTactics · 2026-09-09 편집 기록',minute,null),wikiSrc]},
  {code:'PLANTSONFIREGIFT',sourcePublishedAt:'2026-08-28',expiry:'지역·플랫폼 조건 미확인',status:'UNVERIFIED',statusLabel:'지역 제한 후보',evidenceHTML:p('일부 8월 자료는 iOS 특정 지역 프로모션으로 Gold Frame 1개, Lucky Token 1,500개, On Fire 아이템 3개를 보고합니다. 최신 게임 내 활성 확인 목록에는 없어 현재 코드로 승격하지 않았습니다.'),sources:[third('Roonby · 2026-08-28',roonby,'2026-08-28'),third('Wantplay · 2026-08-31',wantplay,'2026-08-31')]},
  ...['PLAYFEB26','LOVE2026','APRIL12026','PLAYMAR2026','CLUBONTHEWAY','POFCREATOR','PIRATESPOTTED','WORLDFINAL2026','HALFTIME720','GOAL720','LIFTTHECUP'].map(code=>({code,sourcePublishedAt:null,expiry:'종료 보고',status:'EXPIRED',statusLabel:'종료',evidenceHTML:p('팬 위키의 게임 내 확인 기록에서 종료 코드로 분류됩니다. 원문 최초 게시일과 정확한 종료일은 확인하지 못했습니다.'),sources:[wikiSrc]}))
];

const model={
  articleKey,
  title:'플랜츠 온 파이어',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="플랜츠 온 파이어 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 입력 후보</span><strong>9개</strong></div><div class="ncp-feed-stat"><span>공식 배포 확인</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>전체 보존 기록</span><strong>22개</strong></div></div>',
  featuredHTML:`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${storeUrl}" style="margin:0 0 24px"><a href="${storeUrl}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="플랜츠 온 파이어 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`,
  noticeHTML:'<p>2026년 10월 14일 다시 확인했습니다. 현재 공개 자료에서 입력 후보는 9개이며, 이 중 <strong>CRAZYMOON</strong>은 공식 @PlayP0F가 직접 배포한 원문을 확인했습니다. 나머지 8개는 팬 위키의 게임 내 입력 확인과 커뮤니티·공략 사이트 교차 자료를 근거로 유지하며, 공식 발급 원문이 확인되지 않은 코드는 제3자 실사용 확인으로 구분합니다.</p><p>한국 Google Play에서는 현재 <strong>Shimmer Dream</strong>의 패키지 <strong>com.plantsonfire.merge</strong>가 노출되고 2026-10-08 업데이트가 확인됩니다. 과거 Nuverse 패키지는 일부 해외 지역에서 계속 노출되어 지역별 스토어 구성이 다를 수 있습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력</h3><p>Android는 게임의 Settings에서 Gift Code 메뉴를 이용할 수 있습니다. 웹 입력은 기존 Nuverse Redeem Code 페이지가 2026-10-14 현재 HTTP 200으로 응답하며, Plants on Fire Wiki와 MrGuider가 iOS/웹 입력 경로로 안내하고 있습니다. 계정 확인 후 코드를 입력하면 보상은 게임 내 우편함으로 전달될 수 있습니다. 이번 조사에서는 실제 계정 입력까지 수행하지 않았습니다.</p><div><a href="${redeem}" rel="noopener noreferrer">Redeem Code 페이지 <span>입력 →</span></a></div></section><section><h3>코드 외 혜택</h3><p>한국 Google Play의 2026-10-08 현재 안내에는 Ace Plan 이벤트의 전용 프로필 배경·Legendary Minion Cards·추가 보상이 표시됩니다. Friend Invitation System도 게임 내 운영되지만 초대 코드는 개인별 문자열이므로 공용 쿠폰 목록에 섞지 않았습니다.</p></section>`,
  archiveHTML:`<p><a href="${officialSite}" rel="noopener noreferrer">Plants on Fire 공식 사이트</a> · <a href="${officialSiteUs}" rel="noopener noreferrer">한국 스토어 연결 공식 사이트</a> · <a href="${storeUrl}" rel="noopener noreferrer">한국 Google Play</a> · <a href="${legacyStoreUrl}" rel="noopener noreferrer">기존 글로벌 Google Play</a> · <a href="${redeem}" rel="noopener noreferrer">코드 입력 페이지</a> · <a href="${officialSocial}" rel="noopener noreferrer">공식 @PlayP0F 공개 기록</a> · <a href="${wiki}" rel="noopener noreferrer">게임 내 확인 코드 목록</a> · <a href="${mrguider}" rel="noopener noreferrer">MrGuider 10월 코드 목록</a></p><p>한국 Google Play는 2026-10-08 업데이트에서 Pirate Captain 복귀, Chuckleberry·Thornmelon, 신규 Variant, Ace Plan 이벤트와 안정성 개선을 안내합니다. 개인 초대코드는 추천 관계에 따라 발급되는 별도 혜택으로 공용 쿠폰과 구분합니다.</p>`,
  records:[...active,...history]
};

export const plantsOnFireArticle={
  articleKey,
  approvedForPublish:true,
  post:{title:'플랜츠 온 파이어',content:renderGamePeriodArticle(model),labels:['게임','플랜츠 온 파이어','Plants on Fire']},
  source:{
    type:'PLANTS_ON_FIRE_GLOBAL_CROSSCHECK_R3',
    url:officialSite,
    checkedAt,
    references:[officialSite,officialSiteUs,storeUrl,legacyStoreUrl,redeem,wiki,officialSocial,bahamut,youtube,minute,wantplay,roonby,mrguider],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'플랜츠 온 파이어 쿠폰을 2026년 10월 14일 기준 재조사했습니다. 공식 배포 CRAZYMOON과 현재 입력 후보 9개, 종료·지역 제한 기록, 한국 Google Play 최신 앱과 입력 방법을 출처별로 정리합니다.',
    keywords:['플랜츠 온 파이어 쿠폰','플랜츠 온 파이어 코드','Plants on Fire codes','Plants on Fire redeem code','Plants on Fire gift code','PIRATEBACK','CRAZYRECAP','CRAZYMOON','POF5MILLION'],
    hashtags:['#플랜츠온파이어','#PlantsOnFire','#게임쿠폰','#쿠폰코드','#리딤코드','#기프트코드'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[{code:'CRAZYMOON',status:'ACTIVE',sourceUrl:officialSocial,sourcePublishedAt:null,expiry:null,checkedAt}],
    unverifiedCandidates:active.filter(x=>x.code!=='CRAZYMOON').map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:history.map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    benefits:[
      {type:'GAME_REDEEM',authority:'OFFICIAL',status:'ACTIVE',benefit:'CRAZYMOON · Recruit Token 5개',method:'게임 Gift Code 또는 웹 Redeem Code',sourceUrl:officialSocial,sourcePublishedAt:null,expiry:null},
      {type:'GAME_REDEEM',authority:'THIRD_PARTY',status:'UNVERIFIED',benefit:'PIRATEBACK·CRAZYRECAP 포함 제3자 게임 내 확인 후보 8개',method:'게임 Gift Code 또는 웹 Redeem Code',sourceUrl:wiki,sourcePublishedAt:null,expiry:null},
      {type:'IN_GAME_EVENT',authority:'OFFICIAL',status:'ACTIVE',benefit:'Ace Plan 전용 프로필 배경·Legendary Minion Cards·이벤트 보상',method:'게임 내 Ace Plan 이벤트',sourceUrl:storeUrl,sourcePublishedAt:null,expiry:null},
      {type:'REFERRAL',authority:'OFFICIAL',status:'ACTIVE',benefit:'Friend Invitation System 초대 보상',method:'개인별 초대 코드',sourceUrl:storeUrl,sourcePublishedAt:null,expiry:null}
    ]
  }
};
