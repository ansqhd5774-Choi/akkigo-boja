import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-12';
const p=t=>`<p>${t}</p>`;
const official=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'OFFICIAL_CODE_CONTEXT',sourcePublishedAt,checkedAt});
const third=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt});
const featured=(key,title,storeUrl,iconUrl)=>`<figure data-ncp-featured-image="${key}" data-ncp-app-icon="true" data-ncp-app-icon-source="${storeUrl}" style="margin:0 0 24px"><a href="${storeUrl}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="${title} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;
const make=({articleKey,title,english,storeUrl,iconUrl,sourceUrl,references,records,previewHTML,noticeHTML,guideHTML,archiveHTML,searchDescription,keywords,hashtags,benefits,type})=>{
  const model={articleKey,title,previewHTML,featuredHTML:featured(articleKey,title,storeUrl,iconUrl),noticeHTML,guideHTML,archiveHTML,records};
  return {
    articleKey,
    approvedForPublish:true,
    post:{title,content:renderGamePeriodArticle(model),labels:['게임',title,english]},
    source:{type,url:sourceUrl,checkedAt,references,presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,searchDescription,keywords,hashtags,searchMeasurement:{status:'NOT_MEASURED'},benefits}
  };
};

// Dark Tower
const darkKey='dark-tower-codes-202610';
const darkStore='https://play.google.com/store/apps/details?id=com.rawhand.darktower&hl=en_US';
const darkIcon='https://play-lh.googleusercontent.com/plIxlj95CTTydB12SkUK_ZheRgXWTy9uWuBXLEY2IWKnHmMOiznDQaAV0Cb2KPdPJnYURmCqEDooB_XA5UQrFw%3Dw240-h480';
const darkEvent='https://play.google.com/store/apps/eventdetails/4831298201622680510';
const darkThird='https://www.digwow.net/dark-tower/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const darkThirdSrc=third('DigWow · 2026년 5월 쿠폰 목록',darkThird,null);
const darkCandidateCodes=['RuJmBrC92k','EkeU3d97V5','o82gGMvjL5','QSYaDGBWLt','o7jDmLahZk','mT6DjwEvd9','nxdA23y7Lg','GsZL72oYMp','s3vGDQn2wH','dvUAGwn67Y','aFD8Sb3L0O','wsjgVAR0ML','PQyzqRauV3','HwLdyK4f0I','6nMaOmg1ew','6Jv0MGzfg2','6vhjZXVeNC','gwiXPdroY6','9qson3bGZ2','lKtrDWnpQ3','kSUir8xN9b','jvCYdxDrQ8','QcVRnp75uj','yfJ5rTOsj7'];
const darkRecords=[
  {code:'globalsupport',sourcePublishedAt:null,latest:true,latestEvidence:'Google Play 공식 Dark Tower Coupon Event가 2026-10-16까지 globalsupport를 직접 안내',expiry:'2026-10-16',statusLabel:'공식 쿠폰',evidenceHTML:p('Google Play 공식 이벤트가 모든 Dark Tower 플레이어 대상 쿠폰으로 안내합니다. Settings → Coupon에서 입력하고 우편함에서 보상을 받는 방식입니다.'),sources:[official('Google Play · Dark Tower Coupon Event',darkEvent,null)]},
  ...darkCandidateCodes.map(code=>({code,sourcePublishedAt:null,expiry:'미확인',statusLabel:'제3자 후보·실사용 미확인',evidenceHTML:p('제3자 쿠폰 목록에 현재 후보로 노출된 문자열입니다. 공식 발급 원문·정확한 게시일·계정 입력 성공을 이번 조사에서 확인하지 못해 현재 공식 쿠폰으로 승격하지 않았습니다.'),sources:[darkThirdSrc]}))
];
export const darkTowerArticle=make({
  articleKey:darkKey,title:'다크타워',english:'Dark Tower',storeUrl:darkStore,iconUrl:darkIcon,sourceUrl:darkEvent,references:[darkStore,darkEvent,darkThird],records:darkRecords,type:'DARK_TOWER_GLOBAL_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="다크타워 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 쿠폰</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>마감</span><strong>10월 16일</strong></div><div class="ncp-feed-stat"><span>후보</span><strong>24개</strong></div></div>',
  noticeHTML:'<p>Google Play 공식 행사 코드와 제3자 후보를 분리했습니다. 제3자 후보는 문자열을 보존하되 공식 발급·실사용 확인 전에는 사용 가능으로 단정하지 않습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력</h3><p>공식 Google Play 안내 기준 게임의 Settings → Coupon → Enter Coupon Code에서 입력한 뒤 우편함에서 보상을 받습니다.</p><div><a href="${darkEvent}" rel="noopener noreferrer">공식 쿠폰 행사 <span>확인 →</span></a></div></section><section><h3>코드 외 혜택</h3><p>Google Play에는 신규 플레이어 전용 7일 성장 지원 이벤트도 별도로 노출됩니다. 쿠폰 문자열과 다른 인게임 이벤트이므로 별도 혜택으로 구분했습니다.</p></section>`,
  archiveHTML:`<p><a href="${darkStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${darkEvent}" rel="noopener noreferrer">공식 쿠폰 이벤트</a> · <a href="${darkThird}" rel="noopener noreferrer">제3자 후보 목록</a></p><p>공식 앱 페이지는 2026년 9월 업데이트 상태이며, 쿠폰 이벤트는 10월 16일 종료로 표시됩니다. 제3자 후보의 최초 게시일은 확인하지 못해 수집일로 대체하지 않았습니다.</p>`,
  searchDescription:'다크타워 쿠폰 globalsupport와 2026년 10월 공식 Google Play 쿠폰 행사, 제3자 후보 코드와 입력 방법을 출처 상태별로 정리했습니다.',
  keywords:['다크타워 쿠폰','Dark Tower coupon','Dark Tower codes','globalsupport','다크타워 쿠폰 입력','Dark Tower Mercenary RPG'],hashtags:['#다크타워','#DarkTower','#게임쿠폰','#쿠폰코드','#globalsupport'],
  benefits:[{type:'GAME_REDEEM',authority:'OFFICIAL',status:'ACTIVE',benefit:'globalsupport 공식 쿠폰',method:'Settings → Coupon',sourceUrl:darkEvent,sourcePublishedAt:null,expiry:'2026-10-16'},{type:'IN_GAME_EVENT',authority:'OFFICIAL',status:'ACTIVE',benefit:'신규 플레이어 7일 성장 지원 이벤트',method:'Google Play/게임 이벤트',sourceUrl:darkStore,sourcePublishedAt:null,expiry:null}]
});

// Honkai Impact 3rd
const hi3Key='honkai-impact-3rd-codes-202610';
const hi3Store='https://play.google.com/store/apps/details?id=com.miHoYo.bh3global&hl=en_US';
const hi3Icon='https://play-lh.googleusercontent.com/hTMlfgsf_lKP7URBWrrdpoqL_AhXwuvIbeU-5Gn2R-8RE58z4Y28mfduo6MkfEBpP7Mtef7bnrXo5R9g1puG%3Dw240-h480';
const timeAlbum='https://www.hoyolab.com/article/45490502';
const officialJp='https://instalker.org/houkai3rd';
const yahooOfficial='https://search.yahoo.co.jp/realtime/search?fr=rts_mod&p=%23%E5%B4%A9%E5%A3%8A3rd&rkf=1';
const pocketGamer='https://www.pocketgamer.com/honkai-impact-3rd/codes/';
const p29='https://www.hoyolab.com/article/45604888';
const hi3Topic='https://www.hoyolab.com/topicDetail/332';
const hi3Records=[
  {code:'BV8FVTZX6K',sourcePublishedAt:'2026-09-23',latest:true,latestEvidence:'붕괴3rd 일본 공식 계정이 2026-09-23 생일 선물 코드와 10월 24일 00:59 교환 마감을 직접 공지',expiry:'2026-10-24 00:59 JST',statusLabel:'공식·현재',evidenceHTML:p('보상: Asterite 500, Stamina Potion 1, HOHO Vacation Tickets 4로 안내됩니다.'),sources:[official('붕괴3rd 일본 공식 · 캐롤 생일 선물',officialJp,'2026-09-23')]},
  {code:'ToSenadina',sourcePublishedAt:'2026-08-21',latest:true,latestEvidence:'붕괴3rd 일본 공식 계정이 참여 달성 보상으로 공개하고 2026-10-22 00:59까지로 명시',expiry:'2026-10-22 00:59 JST',statusLabel:'공식·현재',evidenceHTML:p('보상: 수정 100개. 공식 이벤트 참여 인원 달성으로 공개된 시리얼 코드입니다.'),sources:[official('붕괴3rd 일본 공식 · 세나디아 이벤트',officialJp,'2026-08-21')]},
  {code:'TimeAlbum',sourcePublishedAt:'2026-06-17',latest:true,latestEvidence:'HoYoLAB 붕괴3rd 공식 게시물이 수정 100개와 2026-10-31 23:59 교환 마감을 명시',expiry:'2026-10-31 23:59',statusLabel:'공식·현재',evidenceHTML:p('보상: 수정 100개. Time Album 이벤트 참여 기간 자체는 10월 16일 00:59까지이며 코드 교환 마감과 구분됩니다.'),sources:[official('HoYoLAB 붕괴3rd 공식 · Time Album',timeAlbum,'2026-06-17')]},
  {code:'P29F2TGIIB',sourcePublishedAt:'2026-06-26',expiry:'현재 만료 미확인',statusLabel:'제3자 후보·현재 미확인',evidenceHTML:p('보상 보고: 수정 30, HOHO Vacation Tickets 8, Phase Shifter 1. 공식 만료일과 10월 현재 실사용을 확인하지 못해 후보로만 보존합니다.'),sources:[third('HoYoLAB 커뮤니티 · P29F2TGIIB',p29,'2026-06-26')]},
  {code:'76QNRP542E',sourcePublishedAt:'2026-08-20',expiry:'현재 만료 미확인',statusLabel:'제3자 후보·현재 미확인',evidenceHTML:p('보상 보고: 수정 30, HOHO Vacation Tickets 8, Phase Shifter 1. HoYoLAB 커뮤니티에는 8월 신규 코드로 기록됐으나 공식 만료일을 확인하지 못했습니다.'),sources:[third('HoYoLAB 커뮤니티 토픽 · 76QNRP542E',hi3Topic,'2026-08-20')]},
  {code:'QUBP3NCYI3',sourcePublishedAt:'2026-09-08',expiry:'2026-10-09 00:59 JST',statusLabel:'종료 확정·제3자 목록 상충',evidenceHTML:p('붕괴3rd 일본 공식 계정은 10월 9일 00:59까지라고 명시했습니다. 10월 11일 제3자 목록이 여전히 활성으로 표기하지만 공식 기한을 우선해 종료로 분류합니다.'),sources:[official('붕괴3rd 일본 공식 · 시구레 키라 생일 선물',yahooOfficial,'2026-09-08'),third('Pocket Gamer · 2026-10-11 활성 표기',pocketGamer,null)]},
  {code:'5T8NUPYUC2',sourcePublishedAt:'2026-05-25',expiry:'2026-06-25 00:59 UTC+9',statusLabel:'종료 확정·제3자 목록 상충',evidenceHTML:p('아포니아 생일 선물 코드로 공식 한국 계정은 6월 25일 00:59까지라고 안내했습니다. 10월 제3자 목록의 활성 표기와 상충하므로 공식 기한을 우선합니다.'),sources:[official('붕괴3rd 한국 공식 · 아포니아 생일 선물', 'https://ww.twstalker.com/HonkaiImpact3kr','2026-05-25'),third('Pocket Gamer · 2026-10-11 활성 표기',pocketGamer,null)]}
];
export const honkaiImpact3rdArticle=make({
  articleKey:hi3Key,title:'붕괴3rd',english:'Honkai Impact 3rd',storeUrl:hi3Store,iconUrl:hi3Icon,sourceUrl:timeAlbum,references:[hi3Store,timeAlbum,officialJp,yahooOfficial,pocketGamer,p29,hi3Topic],records:hi3Records,type:'HONKAI_IMPACT_3RD_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="붕괴3rd 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 현재</span><strong>3개</strong></div><div class="ncp-feed-stat"><span>후보</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>상충 종료</span><strong>2개</strong></div></div>',
  noticeHTML:'<p>공식 HoYoLAB·공식 SNS의 만료일을 제3자 최신 목록보다 우선했습니다. 제3자 페이지가 활성으로 남겨둔 코드라도 공식 종료 시각이 지난 경우 종료로 분리했습니다.</p>',
  guideHTML:'<section><h3>교환 코드 입력</h3><p>게임 메인 화면에서 좌측 상단 플레이어 ID → Account → Exchange Rewards 입력란에 코드를 넣고 교환합니다. 서버·계정에 따라 보상 적용 조건이 다를 수 있습니다.</p></section><section><h3>코드 외 혜택</h3><p>Time Album 커뮤니티 이벤트는 10월 16일 00:59까지 참여할 수 있고 별도 추첨 보상이 있습니다. 이벤트 참여 마감과 TimeAlbum 코드 교환 마감 10월 31일은 서로 다른 날짜입니다.</p></section>',
  archiveHTML:`<p><a href="${timeAlbum}" rel="noopener noreferrer">HoYoLAB 공식 Time Album</a> · <a href="${officialJp}" rel="noopener noreferrer">붕괴3rd 일본 공식 계정 미러</a> · <a href="${pocketGamer}" rel="noopener noreferrer">제3자 최신 목록</a></p><p>붕괴: 스타레일과 다른 게임입니다. 기존 스타레일 글은 변경하지 않고 붕괴3rd를 별도 게시물로 관리합니다.</p>`,
  searchDescription:'붕괴3rd 교환 코드 BV8FVTZX6K, ToSenadina, TimeAlbum의 공식 만료일과 제3자 후보·종료 상충 코드를 구분해 정리했습니다.',
  keywords:['붕괴3rd 쿠폰','붕괴3rd 교환 코드','Honkai Impact 3rd codes','BV8FVTZX6K','ToSenadina','TimeAlbum','붕괴3rd 리딤코드'],hashtags:['#붕괴3rd','#HonkaiImpact3rd','#교환코드','#게임쿠폰','#HoYoLAB'],
  benefits:[{type:'GAME_REDEEM',authority:'OFFICIAL',status:'ACTIVE',benefit:'공식 현재 교환 코드 3개',method:'게임 Account → Exchange Rewards',sourceUrl:timeAlbum,sourcePublishedAt:'2026-06-17',expiry:'각 코드별 상이'},{type:'COMMUNITY_EVENT',authority:'OFFICIAL',status:'ACTIVE',benefit:'Time Album 참여·추첨 보상',method:'HoYoLAB 공식 게시물 참여',sourceUrl:timeAlbum,sourcePublishedAt:'2026-06-17',expiry:'2026-10-16 00:59'}]
});

// Neo Monsters
const neoKey='neo-monsters-benefits-202610';
const neoStore='https://play.google.com/store/apps/details?id=com.pockettrend.neomonsters&hl=en_US';
const neoIcon='https://play-lh.googleusercontent.com/0OCFLFdVsPkyfSEpDfDWaY1ILn7geyRtgMhkLosTt84FKadJGtDgEGiXXN1a4GEY9DEJCnjGQ3IaCcMbWeI4wQ%3Dw240-h480';
const neoFaq='https://www.neomonstersforum.com/t/faq-and-our-new-support-system/5322';
const neoRecent='https://www.neomonstersforum.com/t/redeeming-code/47038';
export const neoMonstersArticle=make({
  articleKey:neoKey,title:'네오몬스터',english:'Neo Monsters',storeUrl:neoStore,iconUrl:neoIcon,sourceUrl:neoStore,references:[neoStore,neoFaq,neoRecent],records:[],type:'NEO_MONSTERS_OFFICIAL_BENEFITS',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="네오몬스터 혜택 요약"><div class="ncp-feed-stat"><span>공용 쿠폰</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>Google Play</span><strong>100% 할인</strong></div><div class="ncp-feed-stat"><span>마감</span><strong>10월 14일</strong></div></div>',
  noticeHTML:'<p>공식 포럼 FAQ는 Neo Monsters가 리딤코드를 발급하지 않는다고 명시합니다. Restore Code·Friend Code는 계정 복구·친구 기능용 문자열이므로 쿠폰으로 수집하지 않았습니다.</p>',
  guideHTML:`<section><h3>현재 무료 혜택</h3><p>Google Play 공식 상품 페이지에서 앱 가격 100% 할인 행사가 표시됩니다. 표시 마감은 2026년 10월 14일이며 정확한 종료 시각은 Google Play 지역·계정 표시를 확인해야 합니다.</p><div><a href="${neoStore}" rel="noopener noreferrer">Google Play 할인 확인 <span>확인 →</span></a></div></section><section><h3>게임 내 보상</h3><p>공식 FAQ는 Daily Login Bonus와 Cumulative Login Bonus를 별도 보상으로 설명합니다. 이는 입력형 쿠폰이 아니라 로그인 조건형 혜택입니다.</p></section>`,
  archiveHTML:`<p><a href="${neoStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${neoFaq}" rel="noopener noreferrer">ZigZaGame 공식 포럼 FAQ</a> · <a href="${neoRecent}" rel="noopener noreferrer">리딤코드 질의 기록</a></p><p>공식 FAQ의 원문 게시일은 2016-09-30이며, 2023년 포럼에서도 리딤코드가 없다는 답변이 이어졌습니다. 현재 할인 확인일을 과거 FAQ 게시일로 바꾸지 않았습니다.</p>`,
  searchDescription:'네오몬스터는 현재 공식 리딤코드 발급 근거가 없으며, Google Play 100% 앱 할인과 로그인 보상을 쿠폰과 구분해 정리했습니다.',
  keywords:['네오몬스터 쿠폰','Neo Monsters codes','Neo Monsters redeem code','네오몬스터 무료','Neo Monsters 100% off','네오몬스터 할인'],hashtags:['#네오몬스터','#NeoMonsters','#게임할인','#GooglePlay','#게임쿠폰'],
  benefits:[{type:'AUTO_DISCOUNT',authority:'OFFICIAL',status:'ACTIVE',benefit:'Google Play 앱 가격 100% 할인',method:'Google Play 상품 페이지 자동 적용',sourceUrl:neoStore,sourcePublishedAt:null,expiry:'2026-10-14'},{type:'LOGIN_REWARD',authority:'OFFICIAL',status:'ONGOING',benefit:'Daily Login / Cumulative Login Bonus',method:'게임 로그인',sourceUrl:neoFaq,sourcePublishedAt:'2016-09-30',expiry:null}]
});

// Tokyo Debunker
const tokyoKey='tokyo-debunker-codes-202610';
const tokyoStore='https://play.google.com/store/apps/details?id=com.zigzagame.tokyodebunker&hl=en_US';
const tokyoIcon='https://play-lh.googleusercontent.com/crL0WdmTO1ukg9WcGW_UB-UJQ95YaZ99PcVXtJBEDb3Wnt6x2brcPrLdDtKjg884mlm-Rf8BumcMkVaEmQdF%3Dw240-h480';
const tokyoOfficial='https://tokyodebunker.com/';
const aayyy='https://www.aayyy.com/tokyo-debunker/codes/';
const gameedu='https://game.edu.kg/id/tokyo-debunker/codes/';
const linegames='https://www.linegames.org/ch/tokyo-debunker-codes/';
const aayyySrc=third('AAYYY · 2026-09-30 활성 주장',aayyy,'2026-09-30');
const gameeduSrc=third('GameEDU · 2026-10-10 작동 주장',gameedu,null);
const lineSrc=third('LINEGames · 2026-10-10 유효 주장',linegames,null);
const tokyoRecords=[
  ...['TOKYODEBUNKER','GHOUL','DEBUNKER2024'].map(code=>({code,sourcePublishedAt:'2026-09-30',latest:true,latestEvidence:'AAYYY가 2026-09-30 active 목록으로 게시했으나 공식 Tokyo Debunker 사이트·공식 SNS에서 동일 코드 발급 근거를 확인하지 못함',expiry:'미확인',statusLabel:'제3자 후보·공식/실사용 미확인',evidenceHTML:p('제3자 페이지가 active로 주장합니다. 공식 발급·보상·실제 입력 성공 근거를 확인하지 못해 시도 후보로만 보존합니다.'),sources:[aayyySrc]})),
  ...['uyNtpswbte3u','yjNZcg8sGxhI','0GNdWb7Qh3ok','BwfP1RdWLzZC','ItuOuyEbpvcS','MTAohX32iGXh'].map(code=>({code,sourcePublishedAt:null,latest:true,latestEvidence:'GameEDU가 2026-10-10 작동 목록으로 표시하지만 Tokyo Debunker 공식 원천·실사용 확인 없음',expiry:'미확인',statusLabel:'제3자 후보·공식/실사용 미확인',evidenceHTML:p('GameEDU의 동적 쿠폰 목록에 노출된 문자열입니다. 공식 발급사와의 제휴·발급 근거를 확인하지 못했습니다.'),sources:[gameeduSrc]})),
  ...['LINEGAMES','WELCOME','VIP111','VIP555','VIP666','VIP2024','GO2024','DCGIFT'].map(code=>({code,sourcePublishedAt:null,latest:true,latestEvidence:'LINEGames 페이지가 2026-10-10 유효 목록으로 표시하지만 게임 공식 발급 원문과 실사용 확인 없음',expiry:'미확인',statusLabel:'제3자 범용 후보·공식/실사용 미확인',evidenceHTML:p('여러 게임에 반복 노출되는 범용 형태 문자열입니다. 사용자 정책에 따라 제외하지 않고 후보로 보존하되 현재 사용 가능으로 단정하지 않습니다.'),sources:[lineSrc]}))
];
export const tokyoDebunkerArticle=make({
  articleKey:tokyoKey,title:'도쿄 디벙커',english:'Tokyo Debunker',storeUrl:tokyoStore,iconUrl:tokyoIcon,sourceUrl:tokyoOfficial,references:[tokyoOfficial,tokyoStore,aayyy,gameedu,linegames],records:tokyoRecords,type:'TOKYO_DEBUNKER_CANDIDATE_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="도쿄 디벙커 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>제3자 후보</span><strong>17개</strong></div><div class="ncp-feed-stat"><span>실사용 확인</span><strong>0개</strong></div></div>',
  noticeHTML:'<p>공식 사이트·공식 SNS에서 공개 쿠폰 발급 근거를 확인하지 못했습니다. 제3자 사이트의 문자열은 사용자 정책에 따라 삭제하지 않고 모두 미확인 후보로 보존합니다.</p>',
  guideHTML:'<section><h3>입력 방법 주의</h3><p>제3자 페이지들은 프로필·설정·이벤트 메뉴에서 코드 입력을 안내하지만 공식 사이트에서 동일한 교환 메뉴를 확인하지 못했습니다. 게임 안에 실제 코드 입력 항목이 보일 때만 후보를 직접 시도하세요.</p></section><section><h3>현재 공식 혜택</h3><p>이번 조사에서는 누구나 입력하는 공식 공용 코드나 공식 할인·무료 결제 혜택을 확인하지 못했습니다. 공식 X와 게임 내 이벤트 공지는 계속 운영 중입니다.</p></section>',
  archiveHTML:`<p><a href="${tokyoOfficial}" rel="noopener noreferrer">Tokyo Debunker 공식 사이트</a> · <a href="${tokyoStore}" rel="noopener noreferrer">Google Play</a> · <a href="${aayyy}" rel="noopener noreferrer">AAYYY 후보</a> · <a href="${gameedu}" rel="noopener noreferrer">GameEDU 후보</a> · <a href="${linegames}" rel="noopener noreferrer">LINEGames 후보</a></p><p>공식 원천과 제3자 주장 사이를 분리했습니다. 원문 게시일이 없는 동적 페이지는 확인일 2026-10-12를 게시일로 대체하지 않았습니다.</p>`,
  searchDescription:'도쿄 디벙커 쿠폰 후보를 공식 확인 0개와 제3자 미확인 코드 17개로 분리하고, 범용 문자열과 입력 방법의 확인 상태를 표시했습니다.',
  keywords:['도쿄 디벙커 쿠폰','Tokyo Debunker codes','Tokyo Debunker coupon','TOKYODEBUNKER','GHOUL','DEBUNKER2024','도쿄 디벙커 코드'],hashtags:['#도쿄디벙커','#TokyoDebunker','#게임쿠폰','#쿠폰후보','#리딤코드'],
  benefits:[{type:'GAME_REDEEM',authority:'THIRD_PARTY',status:'UNVERIFIED',benefit:'제3자 공개 후보 17개',method:'공식 입력 경로 미확인',sourceUrl:aayyy,sourcePublishedAt:'2026-09-30',expiry:null}]
});

// KartRider Rush+
const kartKey='kartrider-rush-plus-codes-202610';
const kartStore='https://play.google.com/store/apps/details?id=com.nexon.kart&hl=en_US';
const kartIcon='https://play-lh.googleusercontent.com/RrpE9xexrHMDDOY6iel-UPFl-N8J-kL0wmbd1rYCP7Boq8_dPtnasme48dw7Ma1k2GYDsvmSuHqWeMCY_TqVCw%3Dw240-h480';
const kartOfficial='https://kartrush.nexon.com/';
const ald1='https://forum.nexon.com/kartrush/board_view?board=741&thread=3546860';
const ald1Page='https://kartrush.nexon.com/2026/event_260922-launching';
const hy='https://forum.nexon.com/kartrush/board_view?board=741&thread=3453422';
const levelgeeks='https://levelgeeks.net/kartrider-rush-plus-codes/';
const kartThird=third('LevelGeeks · 2026-10-05 working 목록',levelgeeks,'2026-10-05');
const kartRecords=[
  {code:'KRRPING',sourcePublishedAt:'2026-10-05',latest:true,latestEvidence:'LevelGeeks가 2026-10-05 WEST working code로 재확인',expiry:'미표시',statusLabel:'WEST·제3자 현재 보고',evidenceHTML:p('WEST 서버용으로 보고됩니다. 한국 서버 적용 근거와 공식 넥슨 발급 원문은 확인하지 못했습니다.'),sources:[kartThird]},
  {code:'RUSHPING',sourcePublishedAt:'2026-10-05',latest:true,latestEvidence:'LevelGeeks가 2026-10-05 WEST working code로 재확인',expiry:'미표시',statusLabel:'WEST·제3자 현재 보고',evidenceHTML:p('WEST 서버용으로 보고됩니다. 한국 서버 적용 근거와 공식 넥슨 발급 원문은 확인하지 못했습니다.'),sources:[kartThird]},
  ...[['URPRORACER','WEST'],['URPROR1DER','SEA'],['CHARMMMAY','WEST'],['SWEETMAY26','SEA'],['ANNIV6TH','WEST'],['6THCELEBR8','SEA'],['UROCK4SIX','WEST'],['THANK4SIX','SEA'],['ITSMAY26','WEST'],['MAYISHERE','SEA']].map(([code,server])=>({code,sourcePublishedAt:'2026-10-05',expiry:'종료 보고',statusLabel:`종료·${server}`,evidenceHTML:p(`제3자 최신 목록에서 ${server} 서버 종료 코드로 분류됩니다.`),sources:[kartThird]}))
];
export const kartRiderRushPlusArticle=make({
  articleKey:kartKey,title:'카트라이더 러쉬플러스',english:'KartRider Rush+',storeUrl:kartStore,iconUrl:kartIcon,sourceUrl:kartOfficial,references:[kartStore,kartOfficial,ald1,ald1Page,hy,levelgeeks],records:kartRecords,type:'KARTRIDER_RUSH_PLUS_KR_GLOBAL_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="카트라이더 러쉬플러스 쿠폰 요약"><div class="ncp-feed-stat"><span>WEST 후보</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>한국 이벤트</span><strong>진행 중</strong></div><div class="ncp-feed-stat"><span>서버</span><strong>구분 필수</strong></div></div>',
  noticeHTML:'<p>WEST/SEA 공용 문자열과 한국 서버 이벤트 발급형 쿠폰을 분리했습니다. KRRPING·RUSHPING은 제3자 WEST 작동 보고이며 한국 서버 공용 코드로 표시하지 않습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력</h3><p>한국 공식 공지 기준 게임 접속 → 설정 → 계정 관리에서 쿠폰을 등록하거나 공식 쿠폰등록 페이지를 이용합니다. 글로벌판은 Android의 Settings → Account → Voucher Code 또는 웹 쿠폰 페이지를 사용하며 서버(WEST/SEA)를 맞춰야 합니다.</p><div><a href="${ald1Page}" rel="noopener noreferrer">한국 공식 이벤트·쿠폰 등록 <span>확인 →</span></a></div></section><section><h3>한국 서버 현재 혜택</h3><p>ALD1 콜라보는 10월 20일까지 응모권 획득, 10월 25일까지 2차 응모가 가능하며 이벤트 페이지에서 받은 보상 쿠폰은 11월 11일 23:59까지 사용할 수 있습니다. 공개 공용 문자열이 아니라 참여자별 발급형 쿠폰입니다.</p><p>hy 콜라보 지류 쿠폰의 구매 증정 기간은 종료됐지만 이미 받은 서로 다른 쿠폰은 한국 서버에서 계정당 최대 3회, 2026년 12월 31일 23:59까지 사용할 수 있습니다.</p></section>`,
  archiveHTML:`<p><a href="${ald1}" rel="noopener noreferrer">NEXON ALD1 공식 공지</a> · <a href="${hy}" rel="noopener noreferrer">NEXON × hy 공식 공지</a> · <a href="${levelgeeks}" rel="noopener noreferrer">WEST/SEA 제3자 코드 목록</a></p><p>한국 이벤트 쿠폰은 획득 조건·사용 기한이 있는 개별 발급형이며, 글로벌 WEST/SEA 문자열과 같은 표에 현재 공용 한국 코드로 합치지 않았습니다.</p>`,
  searchDescription:'카트라이더 러쉬플러스 쿠폰을 한국 서버 이벤트 발급형과 WEST/SEA 공용 코드로 분리하고 KRRPING, RUSHPING, ALD1·hy 사용 조건을 정리했습니다.',
  keywords:['카트라이더 러쉬플러스 쿠폰','카러플 쿠폰','KartRider Rush+ codes','KRRPING','RUSHPING','카러플 ALD1 쿠폰','카러플 hy 쿠폰'],hashtags:['#카트라이더러쉬플러스','#카러플','#KartRiderRushPlus','#게임쿠폰','#ALD1'],
  benefits:[{type:'GAME_REDEEM',authority:'THIRD_PARTY',status:'UNVERIFIED',benefit:'WEST 공용 후보 2개',method:'WEST 서버 Voucher Code',sourceUrl:levelgeeks,sourcePublishedAt:'2026-10-05',expiry:null},{type:'EVENT_COUPON',authority:'OFFICIAL',status:'ACTIVE',benefit:'ALD1 참여자 발급형 보상 쿠폰',method:'한국 공식 이벤트 참여 후 이벤트 페이지 수령',sourceUrl:ald1,sourcePublishedAt:null,expiry:'2026-11-11 23:59'},{type:'EVENT_COUPON',authority:'OFFICIAL',status:'EXPIRED_ACQUISITION_USE_ACTIVE',benefit:'hy 구매 증정 지류 쿠폰',method:'구매 증정은 종료·보유자는 한국 서버 등록',sourceUrl:hy,sourcePublishedAt:null,expiry:'2026-12-31 23:59'}]
});
