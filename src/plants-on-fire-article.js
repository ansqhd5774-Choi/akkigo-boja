import {renderGamePeriodArticle} from './game-period-article.js';

const articleKey='plants-on-fire-codes-202610';
const officialSite='https://www.plantsonfire.com/';
const storeUrl='https://play.google.com/store/apps/details?id=com.nvsgames.pt&hl=en-US';
const iconUrl='https://play-lh.googleusercontent.com/gH5Gthsejk7l-7CvcqyU5jhAOSMuWANN-o49MFIwzvKDPKhxPKrxvtDdyHNHmTpJktcS80TqezPwHczv-bcSRQ%3Dw240-h480';
const redeem='https://pay.nvsgames.com/Topup/803374#tab=cdk';
const wiki='https://plantsonfire.online/codes';
const officialSocial='https://www.sotwe.com/PlayP0F?lang=en';
const bahamut='https://forum.gamer.com.tw/Co.php?bsn=85671&sn=211';
const youtube='https://salda.ws/video.php?id=xIIKPdCla_0';
const minute='https://www.minutetactics.com/codes/plants-on-fire-promo-codes';
const wantplay='https://en.wtpgame.com/game_news/plants-on-fire-gift-codes/';
const roonby='https://roonby.com/2026/08/28/plants-on-fire-gift-codes-2026/';

const third=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt:'2026-10-12'});
const official=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'OFFICIAL_CODE_CONTEXT',sourcePublishedAt,checkedAt:'2026-10-12'});
const p=t=>`<p>${t}</p>`;
const wikiSrc=third('Plants on Fire Wiki · 게임 내 입력 확인 목록',wiki,null);
const communitySep10=third('巴哈姆特 · 2026-09-10 코드 공유 글',bahamut,'2026-09-10');

const active=[
  {code:'PIRATEBACK',sourcePublishedAt:null,latest:true,latestEvidence:'Plants on Fire Wiki가 2026-10-01 게임 내 입력 확인 후 ACTIVE로 유지',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 5개 + Gold 500. 공식 원문 게시일은 확인하지 못했으며, 팬 위키가 2026-10-01 게임 내 입력 확인을 기록했습니다.'),sources:[wikiSrc]},
  {code:'CRAZYRECAP',sourcePublishedAt:null,latest:true,latestEvidence:'Plants on Fire Wiki가 2026-10-01 게임 내 입력 확인 후 ACTIVE로 유지',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Gold 500. 공식 원문 게시일은 확인하지 못했으며, 팬 위키가 2026-10-01 게임 내 입력 확인을 기록했습니다.'),sources:[wikiSrc]},
  {code:'CRAZYMOON',sourcePublishedAt:null,latest:true,latestEvidence:'공식 @PlayP0F 배포 문구 + 팬 위키 2026-09-25 게임 내 확인',expiry:'미표시',statusLabel:'공식 배포·실사용 보고',evidenceHTML:p('보상: Recruit Token 5개. 공식 @PlayP0F 계정이 “special gift”와 함께 CRAZYMOON을 공개했고, 팬 위키는 2026-09-25 게임 내 확인을 기록했습니다. 원문 정확한 게시일은 별도로 확정하지 못했습니다.'),sources:[official('Plants on Fire 공식 @PlayP0F 코드 공지',officialSocial,null),wikiSrc]},
  {code:'POF5MILLION',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-01 팬 위키 게임 내 확인 목록 + 2026-09-10 커뮤니티 원문 교차 확인',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 10개. 2026-09-10 커뮤니티 글에도 동일 문자열이 기록되어 있고 팬 위키 현재 목록에서 게임 내 확인 코드로 유지됩니다.'),sources:[communitySep10,wikiSrc]},
  {code:'POF2MILLION',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-01 팬 위키 게임 내 확인 목록 + 2026-09-10 커뮤니티 원문 교차 확인',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 8개.'),sources:[communitySep10,wikiSrc]},
  {code:'POF1MILLION',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-01 팬 위키 게임 내 확인 목록 + 2026-09-10 커뮤니티 원문 교차 확인',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 5개.'),sources:[communitySep10,wikiSrc]},
  {code:'POF500K',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-01 팬 위키 게임 내 확인 목록 + 2026-09-10 커뮤니티 원문 교차 확인',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Recruit Token 3개.'),sources:[communitySep10,wikiSrc]},
  {code:'CRAZYFRIDAY',sourcePublishedAt:'2026-08-29',latest:true,latestEvidence:'2026-10-01 팬 위키 게임 내 확인 목록 + 2026-08-29 스폰서 영상 코드 노출',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Gold 1,000. 2026-08-29 Plants on Fire 스폰서 영상 설명에도 무료 보상 코드로 노출됐고 팬 위키의 현재 게임 내 확인 목록에 남아 있습니다.'),sources:[third('Ethan Reid 스폰서 영상 · 2026-08-29',youtube,'2026-08-29'),communitySep10,wikiSrc]},
  {code:'PLANTSONLY',sourcePublishedAt:'2026-09-10',latest:true,latestEvidence:'2026-10-01 팬 위키 게임 내 확인 목록 + 2026-09-10 커뮤니티 원문 교차 확인',expiry:'미표시',statusLabel:'제3자 실사용 확인',evidenceHTML:p('보상: Lucky Token 5개.'),sources:[communitySep10,wikiSrc]}
];

const history=[
  {code:'CRAZYGIFT',sourcePublishedAt:null,expiry:'출처 상충',statusLabel:'만료 우세·출처 상충',evidenceHTML:p('MinuteTactics는 2026-09-09 편집 기록에서 활성으로 뒀지만, 2026-10-01 게임 내 확인을 기록한 팬 위키는 만료 목록으로 분류합니다. 현재 사용 가능으로 표시하지 않습니다.'),sources:[third('MinuteTactics · 2026-09-09 편집 기록',minute,null),wikiSrc]},
  {code:'PLANTSONFIREGIFT',sourcePublishedAt:'2026-08-28',expiry:'지역·플랫폼 조건 미확인',statusLabel:'지역 제한 후보',evidenceHTML:p('일부 8월 자료는 iOS 특정 지역 프로모션으로 Gold Frame 1개, Lucky Token 1,500개, On Fire 아이템 3개를 보고합니다. 최신 게임 내 활성 확인 목록에는 없어 현재 코드로 승격하지 않았습니다.'),sources:[third('Roonby · 2026-08-28',roonby,'2026-08-28'),third('Wantplay · 2026-08-31',wantplay,'2026-08-31')]},
  ...['PLAYFEB26','LOVE2026','APRIL12026','PLAYMAR2026','CLUBONTHEWAY','POFCREATOR','PIRATESPOTTED','WORLDFINAL2026','HALFTIME720','GOAL720','LIFTTHECUP'].map(code=>({code,sourcePublishedAt:null,expiry:'종료 보고',statusLabel:'종료',evidenceHTML:p('팬 위키의 게임 내 확인 기록에서 종료 코드로 분류됩니다. 원문 최초 게시일과 정확한 종료일은 확인하지 못했습니다.'),sources:[wikiSrc]}))
];

const model={
  articleKey,
  title:'플랜츠 온 파이어',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="플랜츠 온 파이어 쿠폰 요약"><div class="ncp-feed-stat"><span>최근 입력 확인</span><strong>9개</strong></div><div class="ncp-feed-stat"><span>최신 확인</span><strong>10월 1일</strong></div><div class="ncp-feed-stat"><span>입력</span><strong>Gift Code</strong></div></div>',
  featuredHTML:`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${storeUrl}" style="margin:0 0 24px"><a href="${storeUrl}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="플랜츠 온 파이어 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`,
  noticeHTML:'<p>현재 목록은 공식 배포 문구, 커뮤니티 원문, 제3자 게임 내 입력 확인을 구분했습니다. 팬 위키의 실사용 확인은 공식 발급 근거와 별개이며 모든 계정·지역 적용을 보장하지 않습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력</h3><p>Android는 게임의 Settings에서 Gift Code를 열어 입력할 수 있습니다. iOS를 포함한 웹 입력은 공식 Redeem Code 페이지에서 계정을 확인한 뒤 코드를 입력합니다. 보상은 게임 내 우편함으로 지급될 수 있습니다.</p><div><a href="${redeem}" rel="noopener noreferrer">공식 Redeem Code 페이지 <span>입력 →</span></a></div></section><section><h3>코드 외 혜택</h3><p>Google Play 최신 버전 안내에는 Ace Plan 이벤트의 전용 프로필 배경·Legendary Minion Cards·추가 보상이 표시됩니다. Friend Invitation System도 운영 중이지만 초대 코드는 개인별 문자열이므로 공용 쿠폰 목록에 섞지 않았습니다.</p></section>`,
  archiveHTML:`<p><a href="${officialSite}" rel="noopener noreferrer">Plants on Fire 공식 사이트</a> · <a href="${storeUrl}" rel="noopener noreferrer">Google Play</a> · <a href="${redeem}" rel="noopener noreferrer">공식 코드 입력 페이지</a></p><p>공식 Google Play는 2026-09-30 업데이트에서 Rebel of the Seas 시즌, Ace Plan 이벤트, 신규 미니언·보상을 안내합니다. 개인 초대코드는 추천 관계에 따라 발급되는 별도 혜택으로 공용 쿠폰과 구분합니다.</p>`,
  records:[...active,...history]
};

export const plantsOnFireArticle={
  articleKey,
  approvedForPublish:true,
  post:{title:'플랜츠 온 파이어',content:renderGamePeriodArticle(model),labels:['게임','플랜츠 온 파이어','Plants on Fire']},
  source:{
    type:'PLANTS_ON_FIRE_GLOBAL_CROSSCHECK',
    url:officialSite,
    checkedAt:'2026-10-12',
    references:[officialSite,storeUrl,redeem,wiki,officialSocial,bahamut,youtube,minute,wantplay,roonby],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'플랜츠 온 파이어 쿠폰 코드 PIRATEBACK, CRAZYRECAP, CRAZYMOON과 POF 다운로드 기념 코드, 종료·지역 제한 후보, 입력 방법을 출처별로 정리했습니다.',
    keywords:['플랜츠 온 파이어 쿠폰','플랜츠 온 파이어 코드','Plants on Fire codes','Plants on Fire redeem code','Plants on Fire gift code','PIRATEBACK','CRAZYRECAP','CRAZYMOON','POF5MILLION'],
    hashtags:['#플랜츠온파이어','#PlantsOnFire','#게임쿠폰','#쿠폰코드','#리딤코드','#기프트코드'],
    benefits:[
      {type:'GAME_REDEEM',authority:'OFFICIAL_AND_THIRD_PARTY',status:'UNVERIFIED',benefit:'공식 배포·제3자 게임 내 확인 코드 9개',method:'게임 Gift Code 또는 공식 웹 Redeem Code',sourceUrl:redeem,sourcePublishedAt:null,expiry:null},
      {type:'IN_GAME_EVENT',authority:'OFFICIAL',status:'ACTIVE',benefit:'Ace Plan 전용 프로필 배경·Legendary Minion Cards·이벤트 보상',method:'게임 내 Ace Plan 이벤트',sourceUrl:storeUrl,sourcePublishedAt:null,expiry:null},
      {type:'REFERRAL',authority:'OFFICIAL',status:'ACTIVE',benefit:'Friend Invitation System 초대 보상',method:'개인별 초대 코드',sourceUrl:storeUrl,sourcePublishedAt:null,expiry:null}
    ]
  }
};
