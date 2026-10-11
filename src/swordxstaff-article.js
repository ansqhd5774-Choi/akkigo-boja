import {renderGamePeriodArticle} from './game-period-article.js';

const articleKey='swordxstaff-codes-202610';
const storeUrl='https://play.google.com/store/apps/details?id=com.zjcs.android.us&hl=en_US';
const iconUrl='https://play-lh.googleusercontent.com/JgtDyOR0A5zYyMlpXN8VKJeDu1T1C5uuLKJOtgP8ZaoqSY2BV2KPNAJ4az_WfcpZ9rHyy2Rca_UNEFeO69u49g%3Dw240-h480';
const pocket='https://www.pocketgamer.com/sword-x-staff/codes/';
const mrguider='https://www.mrguider.org/codes/sword-x-staff-codes/';
const gamesradar='https://www.gamesradar.com/games/rpg/sword-x-staff-codes/';
const officialFaq='https://www.reddit.com/r/SwordxStaff_Official/comments/1tmwi23/frequently_asked_questions/';
const officialActive='https://www.reddit.com/r/SwordxStaff_Official/comments/1tou09h/all_active_codes_for_sword_x_staff/';
const iosThread='https://www.reddit.com/r/SwordxStaff_Official/comments/1vfftfh/cant_redeem_gift_codes_anymore/';
const officialRedeem='https://webcp01.boltray.com/zjcs/act/202607/exch/';
const topup='https://gamepay.boltray.com/addCredit?cur_game=8039&media=A803904';
const officialLaunch='https://swordxstaff.boltray.com/news/200';

const src=(name,url,sourcePublishedAt=null)=>({name,url,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt,checkedAt:'2026-10-12'});
const officialCommunity=(name,url,sourcePublishedAt)=>({name,url,referenceType:'OFFICIAL_CODE_CONTEXT',sourcePublishedAt,checkedAt:'2026-10-12'});
const evidence=message=>`<p>${message}</p>`;

const stableSources=[
  src('Pocket Gamer · 2026-10-11 최신 목록',pocket,null),
  src('MrGuider · 2026-10-06 최신 목록',mrguider,'2026-10-06'),
  officialCommunity('Sword x Staff 공식 서브레딧 · 커뮤니티 활성 코드 모음',officialActive,'2026-05-27')
];
const conflictSources=[
  src('Pocket Gamer · 2026-10-11 활성 목록',pocket,null),
  src('GamesRadar · 2026-10-06 활성 목록',gamesradar,null),
  src('MrGuider · 2026-10-06 만료 목록',mrguider,'2026-10-06')
];
const expiredSources=[src('MrGuider · 2026-10-06 종료 목록',mrguider,'2026-10-06'),src('Pocket Gamer · 2026-10-11 종료 목록',pocket,null)];

const records=[
  {code:'ISLA',sourcePublishedAt:'2026-10-06',latest:true,latestEvidence:'2026-10-11 Pocket Gamer와 2026-10-06 MrGuider·GamesRadar에서 현재 코드로 교차 확인',expiry:'2026-10-13 00:00 UTC-5',statusLabel:'10/13까지·실사용 미확인',evidenceHTML:evidence('보상: 희귀 오로라 배지 10개 + Dawnium 80개. 최신 목록들은 2026년 10월 13일 00:00(UTC-5) 만료로 안내합니다.'),sources:[src('MrGuider · ISLA 추가/만료 표기',mrguider,'2026-10-06'),src('Pocket Gamer · ISLA 보상/만료 표기',pocket,null),src('GamesRadar · ISLA 현재 코드 표기',gamesradar,null)]},
  {code:'SS000',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 및 2026-10-06 MrGuider 현재 목록',expiry:'미표시',statusLabel:'최근 목록 확인',evidenceHTML:evidence('보상: Stone 100, Raw Ore 300, Chrono Sand 300, Battle Essence 1,000.'),sources:stableSources},
  {code:'SS777',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 및 2026-10-06 MrGuider 현재 목록',expiry:'미표시',statusLabel:'최근 목록 확인',evidenceHTML:evidence('보상: Golden Leaf 3, Iris 5, Sunflower 5.'),sources:stableSources},
  {code:'SS888',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 및 2026-10-06 MrGuider 현재 목록',expiry:'미표시',statusLabel:'최근 목록 확인',evidenceHTML:evidence('보상: Abundance Leaf 100, Destiny Fruit 1, Stamina 25.'),sources:stableSources},
  {code:'SS999',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 및 2026-10-06 MrGuider 현재 목록',expiry:'미표시',statusLabel:'최근 목록 확인',evidenceHTML:evidence('보상: Brown Egg 3, Basic Treat 5, Bond Trinket 2.'),sources:stableSources},
  {code:'ZJ777',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 및 2026-10-06 MrGuider 현재 목록',expiry:'미표시',statusLabel:'최근 목록 확인',evidenceHTML:evidence('보상: Dawnium 200 + Stellatie 2.'),sources:stableSources},
  {code:'ZJ888',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 및 2026-10-06 MrGuider 현재 목록',expiry:'미표시',statusLabel:'최근 목록 확인',evidenceHTML:evidence('보상: Legendary Auroral Badge 2, Epic Auroral Badge 10, Rare Auroral Badge 20.'),sources:stableSources},
  {code:'ZJ999',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 및 2026-10-06 MrGuider 현재 목록',expiry:'미표시',statusLabel:'최근 목록 확인',evidenceHTML:evidence('보상: Jelly Bean Pal 2, Honeyed Roast 3, Green Riceball 50.'),sources:stableSources},
  {code:'SXSDCTHANKS',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 현재 목록 + 2026-07-19 커뮤니티 사용 성공 댓글',expiry:'미표시',statusLabel:'최근 목록·사용 성공 보고',evidenceHTML:evidence('보상: Rare Auroral Badge 40, Destiny Fruit 3, Dawnium 180. 7월 19일 커뮤니티에서 실제 사용 성공 보고가 있었지만 전체 계정 적용을 보장하지 않습니다.'),sources:stableSources},
  {code:'SXSFBTHANKS',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 현재 목록 + 2026-07-19 커뮤니티 사용 성공 댓글',expiry:'미표시',statusLabel:'최근 목록·사용 성공 보고',evidenceHTML:evidence('보상: Rare Auroral Badge 40, Destiny Fruit 3, Dawnium 180. 7월 19일 커뮤니티에서 실제 사용 성공 보고가 있었습니다.'),sources:stableSources},
  {code:'SXSREDDIT',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer 현재 목록 + 2026-09-03 커뮤니티 작동 보고',expiry:'미표시',statusLabel:'최근 목록·사용 성공 보고',evidenceHTML:evidence('보상: Dawnium 180. 8월 28일과 9월 3일 커뮤니티에서 작동 보고가 이어졌습니다.'),sources:stableSources},
  {code:'THEGAMETHEORIST',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer·10월 GamesRadar 활성 vs 2026-10-06 MrGuider 만료로 출처 상충',expiry:'출처 상충',statusLabel:'출처 상충·시도 후보',evidenceHTML:evidence('보상 보고: Destiny Fruit 1, Rare Auroral Badge 20, Stellatie 1. 최신 매체 간 활성/만료 판정이 충돌하므로 현재 사용 가능으로 단정하지 않습니다.'),sources:conflictSources},
  {code:'SXSCREATOR',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer·10월 GamesRadar 활성 vs 2026-10-06 MrGuider 만료로 출처 상충',expiry:'출처 상충',statusLabel:'출처 상충·시도 후보',evidenceHTML:evidence('보상 보고: Destiny Fruit 1, Rare Auroral Badge 20, Stellatie 1. 최신 매체 간 판정이 상충합니다.'),sources:conflictSources},
  {code:'SXSAMBASSADOR',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer·10월 GamesRadar 활성 vs 2026-10-06 MrGuider 만료로 출처 상충',expiry:'출처 상충',statusLabel:'출처 상충·시도 후보',evidenceHTML:evidence('보상 보고: Destiny Fruit 1, Rare Auroral Badge 20, Stellatie 1. 최신 매체 간 판정이 상충합니다.'),sources:conflictSources},
  {code:'SXSPARTNER',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer·10월 GamesRadar 활성 vs 2026-10-06 MrGuider 만료로 출처 상충',expiry:'출처 상충',statusLabel:'출처 상충·시도 후보',evidenceHTML:evidence('보상 보고: Destiny Fruit 1, Rare Auroral Badge 20, Stellatie 1. 최신 매체 간 판정이 상충합니다.'),sources:conflictSources},
  {code:'VANOSSTEAM',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer·10월 GamesRadar 활성 vs 2026-10-06 MrGuider 만료로 출처 상충',expiry:'출처 상충',statusLabel:'출처 상충·시도 후보',evidenceHTML:evidence('보상 보고: Destiny Fruit 1, Rare Auroral Badge 20, Stellatie 1. 최신 매체 간 판정이 상충합니다.'),sources:conflictSources},
  {code:'CARBOTANIMATIONS',sourcePublishedAt:'2026-05-27',latest:true,latestEvidence:'2026-10-11 Pocket Gamer·10월 GamesRadar 활성 vs 2026-10-06 MrGuider 만료로 출처 상충',expiry:'출처 상충',statusLabel:'출처 상충·시도 후보',evidenceHTML:evidence('보상 보고: Destiny Fruit 1, Rare Auroral Badge 20, Stellatie 1. 최신 매체 간 판정이 상충합니다.'),sources:conflictSources},
  {code:'VIGARD',sourcePublishedAt:'2026-10-06',expiry:'2026-10-06 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Dawnium 160. 10월 6일 종료로 기록됩니다.'),sources:expiredSources},
  {code:'SYLVIA',sourcePublishedAt:'2026-10-06',expiry:'2026-09-29 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Rolla 2,000 + Dawnium 120.'),sources:expiredSources},
  {code:'AETHYRIS',sourcePublishedAt:'2026-10-06',expiry:'2026-09-22 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Chrono Sand 250 + Bond Trinket 1.'),sources:expiredSources},
  {code:'CRYSTAL',sourcePublishedAt:'2026-10-06',expiry:'2026-09-15 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Raw Ore 300 + Stellatie 1.'),sources:expiredSources},
  {code:'VEGGIE',sourcePublishedAt:'2026-10-06',expiry:'2026-09-08 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('9월 8일 종료로 기록되며 정확한 보상 구성은 이번 조사에서 확정하지 않았습니다.'),sources:expiredSources},
  {code:'Summer',sourcePublishedAt:'2026-10-06',expiry:'2026-09-01',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Dawnium 160.'),sources:expiredSources},
  {code:'4P7Y2R9M',sourcePublishedAt:'2026-10-06',expiry:'2026-08-25',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Rolla 2,000 + Dawnium 120.'),sources:expiredSources},
  {code:'X8C3J61N',sourcePublishedAt:'2026-10-06',expiry:'2026-08-18',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Chrono Sand 250 + Bond Trinket 1.'),sources:expiredSources},
  {code:'G25W0D4S',sourcePublishedAt:'2026-10-06',expiry:'2026-08-11',statusLabel:'종료 보고',evidenceHTML:evidence('8월 11일 종료 보고. 정확한 보상 구성은 이번 조사에서 확정하지 않았습니다.'),sources:expiredSources},
  {code:'9B1L3T7H',sourcePublishedAt:'2026-10-06',expiry:'2026-08-04',statusLabel:'종료 보고',evidenceHTML:evidence('8월 4일 종료 보고. 정확한 보상 구성은 이번 조사에서 확정하지 않았습니다.'),sources:expiredSources},
  {code:'R62V8F0J',sourcePublishedAt:'2026-10-06',expiry:'2026-07-28 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Dawnium 160. 7월 21일 공식 Discord 문구가 커뮤니티에 인용됐고 7월 28일 종료로 안내됐습니다.'),sources:expiredSources},
  {code:'5MZ41Q9C',sourcePublishedAt:'2026-10-11',expiry:'2026-07-21',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Rolla 2,000 + Dawnium 120.'),sources:[src('Pocket Gamer 종료 목록',pocket,null)]},
  {code:'D38N7P2X',sourcePublishedAt:'2026-10-06',expiry:'2026-07-14 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Chrono Sand 250 + Bond Trinket 1.'),sources:expiredSources},
  {code:'7U9S2K5G',sourcePublishedAt:'2026-10-06',expiry:'2026-07-08 00:00 UTC-5',statusLabel:'종료 보고',evidenceHTML:evidence('보상 보고: Ore 300 + Stellatie 1.'),sources:expiredSources},
  {code:'Chomusuke',sourcePublishedAt:'2026-06-12',expiry:'2026-06-30 23:59 UTC-5',statusLabel:'공식 종료',evidenceHTML:evidence('공식 서브레딧 게시물에서 Chomusuke Shard 30개와 종료 시각을 직접 안내했습니다.'),sources:[officialCommunity('Sword x Staff 공식 서브레딧 · Gift Code Rewards', 'https://www.reddit.com/r/SwordxStaff_Official/comments/1u3qenm/gift_code_rewards_30x_chomusuke_shards/','2026-06-12')]}
];

const model={
  articleKey,
  title:'소드X스태프',
  featuredHTML:`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${storeUrl}" style="margin:0 0 24px"><a href="${storeUrl}" rel="noopener noreferrer"><img src="${iconUrl}" alt="소드X스태프 공식 앱 아이콘" width="512" height="512" loading="eager" decoding="async" style="display:block;width:180px;height:180px;object-fit:contain;margin:auto;border-radius:14px"></a></figure>`,
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview aria-label="소드X스태프 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 입력 후보</span><strong>17개</strong></div><div class="ncp-feed-stat"><span>출처 일치</span><strong>11개</strong></div><div class="ncp-feed-stat"><span>신규 ISLA</span><strong>10월 13일까지</strong></div></div>',
  noticeHTML:'<p>2026년 10월 12일 기준 최신 공개 목록을 교차 확인했습니다. ISLA와 장기 코드 10개는 최신 출처가 대체로 일치하지만, THEGAMETHEORIST·SXSCREATOR·SXSAMBASSADOR·SXSPARTNER·VANOSSTEAM·CARBOTANIMATIONS 6개는 10월 매체 간 활성/만료 판정이 충돌합니다. 따라서 출처 상충 후보로 남기며 실제 계정 성공으로 일반화하지 않습니다.</p>',
  guideHTML:`<section><h2>쿠폰 입력 방법</h2><p><strong>Android</strong>는 Home → 우측 하단 Main Menu → User Center → Gift Code에서 입력하는 경로가 공식 커뮤니티 FAQ와 최신 가이드에 공통으로 안내됩니다. 보상은 게임 내 Mailbox에서 수령합니다.</p><p><strong>iOS</strong>는 2026년 8~10월 공식 서브레딧의 사용자 보고와 Discord 공지 인용에 따르면 인게임 Gift Code 기능이 제거되어 공식 교환 웹페이지를 사용합니다. 계정 연동 상태에 따라 로그인 오류가 보고됐으므로 계정 정보를 임의 사이트에 입력하지 말고 Boltray 도메인만 이용하세요.</p><div><a href="${officialFaq}" rel="noopener noreferrer">공식 커뮤니티 FAQ</a> · <a href="${officialRedeem}" rel="noopener noreferrer">Boltray 코드 교환 페이지</a> · <a href="${iosThread}" rel="noopener noreferrer">iOS 변경 보고</a></div></section><section><h2>코드 외 현재 혜택</h2><p>Boltray 공식 충전 페이지에는 구매 등급별 <strong>Bonus Vouchers</strong>가 포함된 묶음과 <strong>Daily Top-up Sign-in</strong> 이벤트가 노출됩니다. 예를 들어 299 Vouchers에 Bonus Vouchers 15가 붙는 묶음이 표시됩니다. 공개 입력형 할인코드가 아니라 공식 결제 페이지에서 자동 구성되는 구매 보너스입니다.</p><div><a href="${topup}" rel="noopener noreferrer">Sword x Staff 공식 충전</a></div><p>5월 19일 공식 런칭 공지의 사전예약 보상·서버 오픈 보너스·커뮤니티 경품은 런칭 시점 혜택으로 별도 이력 처리하며 현재 상시 혜택으로 표시하지 않습니다.</p><div><a href="${officialLaunch}" rel="noopener noreferrer">공식 런칭 공지</a></div></section>`,
  archiveHTML:`<p>게임 공식 운영사 Boltray Games의 글로벌 출시 공지, Google Play 등록, 공식 서브레딧 FAQ를 게임 정체성과 입력 경로 근거로 사용했습니다. 현재 코드 판정은 2026-10-11 Pocket Gamer, 2026-10-06 MrGuider, 10월 GamesRadar 및 공식 서브레딧 커뮤니티 보고를 서로 대조했습니다.</p><p>출처 게시일은 각 페이지의 최초 게시일로 기록합니다. 업데이트 날짜나 이번 확인일을 원문 최초 게시일로 대신하지 않습니다. Pocket Gamer처럼 최초 게시일과 최신 업데이트일을 분리하기 어려운 페이지는 코드 행의 최초 게시일 근거로 사용하지 않았습니다.</p>`,
  records
};

export const swordxstaffArticle={
  articleKey,
  approvedForPublish:true,
  post:{title:'소드X스태프',content:renderGamePeriodArticle(model),labels:['게임','소드X스태프']},
  source:{
    type:'GLOBAL_SWORDXSTAFF_CODES_CROSSCHECK',
    url:'https://swordxstaff.boltray.com/?lang=en',
    checkedAt:'2026-10-12',
    references:[
      'https://swordxstaff.boltray.com/?lang=en',
      officialLaunch,
      storeUrl,
      officialFaq,
      officialActive,
      iosThread,
      officialRedeem,
      pocket,
      mrguider,
      gamesradar,
      topup
    ],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'소드X스태프 쿠폰 2026년 10월 최신 ISLA와 SS000·SS777·ZJ777 등 입력 후보 17개, 종료 코드, 보상, Android·iOS 입력 방법과 출처 날짜를 정리했습니다.',
    keywords:['소드X스태프 쿠폰','소드 X 스태프 쿠폰','Sword x Staff codes','Sword x Staff coupon','소드X스태프 코드','소드X스태프 기프트코드','ISLA','SS000','SXSREDDIT'],
    hashtags:['#소드X스태프','#SwordxStaff','#소드X스태프쿠폰','#게임쿠폰','#기프트코드','#쿠폰코드'],
    searchMeasurement:{status:'NOT_MEASURED'},
    benefits:[
      {type:'GAME_REDEEM',authority:'THIRD_PARTY_CROSSCHECK',status:'UNVERIFIED',benefit:'현재 입력 후보 17개',method:'Android 인게임 / iOS 공식 웹 교환',sourceUrl:pocket,sourcePublishedAt:null,expiry:'코드별 상이'},
      {type:'PURCHASE_BONUS',authority:'OFFICIAL',status:'ACTIVE',benefit:'충전 등급별 Bonus Vouchers',method:'Boltray 공식 충전 페이지',sourceUrl:topup,sourcePublishedAt:null,expiry:null},
      {type:'DAILY_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'Daily Top-up Sign-in',method:'공식 충전 페이지 Events',sourceUrl:topup,sourcePublishedAt:null,expiry:null},
      {type:'LAUNCH_REWARD',authority:'OFFICIAL',status:'HISTORICAL',benefit:'사전예약·서버 오픈·커뮤니티 경품',method:'2026-05-19 런칭 공지',sourceUrl:officialLaunch,sourcePublishedAt:'2026-05-19',expiry:null}
    ]
  }
};
