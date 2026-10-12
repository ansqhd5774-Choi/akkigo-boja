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

// 추노 키우기
const chunoStore='https://play.google.com/store/apps/details?hl=ko&id=com.dwgames.chunorpg';
const chunoIcon='https://play-lh.googleusercontent.com/c3WjmnuDTr4QPi8670NyhRKMRlDU-3mt8X9Ztfu20gI-MBbOkjLuTE1UHCBN-8ZgcnM73yJ-5MfPjv8C9P346A%3Dw240-h480';
const chunoCafe='https://cafe.naver.com/chunorpg';
const chunoGuide='https://data100.dasfl.com/%EC%B6%94%EB%85%B8%ED%82%A4%EC%9A%B0%EA%B8%B0-%EA%B0%80%EC%9D%B4%EB%93%9C/';
const chunoCodes=['OPENCHUNO','FIRSTWIN','CHUNO1ST','IOSOPEN','APPLE1ST','CAFE1000','CAFE2000','CAFE3000'];
const chunoRows=chunoCodes.map(code=>({
  code,sourcePublishedAt:'2026-07-09',latest:true,latestEvidence:'2026-07-09 제3자 가이드가 공식 네이버 카페 쿠폰 이력과 함께 기록했으나 현재 공식 발급 원문·계정 입력 성공은 미확인',expiry:'미확인',statusLabel:'제3자 후보·현재 공식 확인 없음',
  evidenceHTML:p('제3자 가이드가 공식 네이버 카페에서 배포된 코드로 기록했지만 이번 조사에서는 동일한 공식 발급 원문과 10월 현재 계정 입력 성공을 확인하지 못했습니다. 입력 시도 후보로만 표시합니다.'),
  sources:[third('추노키우기 가이드 · 쿠폰 목록',chunoGuide,'2026-07-09')]
}));
export const chunoIdleArticle=make({
  articleKey:'chuno-idle-codes-202610',title:'추노 키우기',english:'Chuno Idle',storeUrl:chunoStore,iconUrl:chunoIcon,sourceUrl:chunoCafe,references:[chunoStore,chunoCafe,chunoGuide],records:chunoRows,type:'CHUNO_IDLE_THIRD_PARTY_CANDIDATES',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="추노 키우기 쿠폰 요약"><div class="ncp-feed-stat"><span>입력 후보</span><strong>8개</strong></div><div class="ncp-feed-stat"><span>공식 현재</span><strong>미확인</strong></div><div class="ncp-feed-stat"><span>공식 카페</span><strong>확인</strong></div></div>',
  noticeHTML:'<p>공개 가이드에서 추적되는 8개 문자열을 보존했습니다. 공식 네이버 카페의 동일 발급 원문과 현재 계정 입력 성공은 확인하지 못했으므로 공식 활성 쿠폰으로 단정하지 않습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>게임 내 쿠폰 입력 메뉴에서 코드를 정확히 붙여넣고 결과를 확인하세요. 새 코드·종료 공지는 공식 네이버 카페를 우선 확인합니다.</p><div><a href="${chunoCafe}" rel="noopener noreferrer">공식 카페 <span>확인 →</span></a></div></section><section><h3>확인</h3><p>제3자 자료의 '무기한' 표기는 공식 종료일 확인 근거로 사용하지 않았습니다. 기간은 미확인으로 유지합니다.</p></section>`,
  archiveHTML:`<p><a href="${chunoStore}" rel="noopener noreferrer">Google Play</a> · <a href="${chunoCafe}" rel="noopener noreferrer">공식 카페</a> · <a href="${chunoGuide}" rel="noopener noreferrer">쿠폰 교차 자료</a></p>`,
  searchDescription:'추노 키우기 쿠폰 후보 8개와 현재 공식 확인 상태, 네이버 공식 카페와 입력 확인 방법을 정리했습니다.',
  keywords:['추노 키우기 쿠폰','추노키우기 쿠폰','추노 키우기 코드','OPENCHUNO','CAFE3000'],hashtags:['#추노키우기','#추노키우기쿠폰','#게임쿠폰'],
  benefits:[]
});

// 쿠키런 키우기 - 쿠키런: 크럼블
const crumbleStore='https://play.google.com/store/apps/details?hl=ko&id=com.devsisters.cc';
const crumbleIcon='https://play-lh.googleusercontent.com/nH4gayvv0-dHdjwjxUIKY9QWr_6dYnNeqFNHPwckQ3dgvJgrsJPdkIEyevgE09j0IGUiAIwpniaoAZ7Xn0PH%3Dw240-h480';
const crumbleSite='https://cookieruncrumble.com/ko';
const crumbleHelp='https://cs-cookieruncrumble.devsisters.com/hc/ko/articles/59145001308185-%EC%BF%A0%ED%82%A4%EB%9F%B0-%ED%81%AC%EB%9F%BC%EB%B8%94-%EC%BF%A0%ED%8F%B0-%EC%9E%85%EB%A0%A5-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0';
const crumbleStatus='https://cookieruncrumble.net/ko/blog/cookierun-crumble-codes';
const crumbleRows=[
  {code:'COOKIERUNCRUMBLE1ST',sourcePublishedAt:null,latest:false,latestEvidence:'출시 시기 배포 기록은 여러 자료에서 일치하지만 9월 가이드가 현재 유효 코드 없음으로 갱신',expiry:'2026-08 종료',statusLabel:'출시 쿠폰·종료',evidenceHTML:p('출시 시기 사용된 쿠폰으로 여러 자료에 기록됐으나 9월 갱신 자료는 현재 유효 코드가 없다고 안내합니다. 현재 사용 가능한 코드로 표시하지 않습니다.'),sources:[third('쿠키런: 크럼블 코드 현황 가이드',crumbleStatus,'2026-09-10')]},
  {code:'COOKIERUNCRUMBLENO1',sourcePublishedAt:null,latest:false,latestEvidence:'출시 시기 배포 기록은 확인되나 자료별 세부 종료일이 상충하고 9월 현재 유효 코드 없음으로 갱신',expiry:'2026-08 종료·세부일 상충',statusLabel:'출시 쿠폰·종료',evidenceHTML:p('출시 시기 배포 기록은 확인되지만 자료마다 8월 세부 종료일이 다릅니다. 9월 갱신 자료의 현재 유효 코드 없음 상태를 우선해 종료 이력으로 분리합니다.'),sources:[third('쿠키런: 크럼블 코드 현황 가이드',crumbleStatus,'2026-09-10')]}
];
export const cookieRunCrumbleArticle=make({
  articleKey:'cookierun-crumble-codes-202610',title:'쿠키런 키우기 - 쿠키런: 크럼블',english:'CookieRun Crumble',storeUrl:crumbleStore,iconUrl:crumbleIcon,sourceUrl:crumbleSite,references:[crumbleStore,crumbleSite,crumbleHelp,crumbleStatus],records:crumbleRows,type:'COOKIERUN_CRUMBLE_OFFICIAL_PORTAL_HISTORY',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="쿠키런 크럼블 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 공식</span><strong>0개 확인</strong></div><div class="ncp-feed-stat"><span>출시 이력</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>공식 입력</span><strong>운영</strong></div></div>',
  noticeHTML:'<p>공식 쿠폰 입력 페이지는 운영 중이지만 10월 현재 공식적으로 사용 가능하다고 확인된 공개 코드는 찾지 못했습니다. 출시 쿠폰 2개는 종료 이력으로 분리합니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>게임 설정·계정에서 MID를 확인한 뒤 공식 쿠폰 입력 페이지에 MID와 코드를 등록하고, 게임 우편함에서 보상을 확인합니다.</p><div><a href="${crumbleHelp}" rel="noopener noreferrer">공식 쿠폰 안내 <span>확인 →</span></a></div></section><section><h3>주의</h3><p>공개 집계 사이트에 남아 있는 출시 코드를 현재 활성 코드로 재분류하지 않았습니다.</p></section>`,
  archiveHTML:`<p><a href="${crumbleStore}" rel="noopener noreferrer">Google Play</a> · <a href="${crumbleSite}" rel="noopener noreferrer">공식 사이트</a> · <a href="${crumbleHelp}" rel="noopener noreferrer">공식 쿠폰 안내</a></p>`,
  searchDescription:'쿠키런 키우기 쿠키런 크럼블의 공식 쿠폰 입력 페이지와 출시 쿠폰 2개 종료 이력, 현재 공식 코드 확인 상태를 정리했습니다.',
  keywords:['쿠키런 키우기 쿠폰','쿠키런 크럼블 쿠폰','COOKIERUNCRUMBLE1ST','쿠키런 크럼블 쿠폰 입력'],hashtags:['#쿠키런크럼블','#쿠키런키우기','#쿠키런쿠폰','#게임쿠폰'],
  benefits:[{type:'REDEEM_PORTAL',authority:'OFFICIAL',status:'ACTIVE',benefit:'공식 쿠폰 입력 페이지 운영',method:'MID + 코드 등록',sourceUrl:crumbleHelp,sourcePublishedAt:null,expiry:null}]
});

// 스위칭 히어로즈
const switchingStore='https://play.google.com/store/apps/details?hl=ko&id=com.zilliongames.collectionidle';
const switchingIcon='https://play-lh.googleusercontent.com/2R_eF1rVJ0NTDrRIV7QV3agWFebXFrdQeEP7fcH0x24fvvVa3LqiDAwQBCX65ysIgeIUI1XerMYwDLahJQk%3Dw240-h480';
const switchingCafe='https://cafe.naver.com/switchingheroes';
const switchingPartner='https://kupon.kr/community/switching-heroes-partner';
const switchingAnniv='https://nyangcorp.com/games/games-coupon/switching-heroes';
const switchingRows=[
  {code:'kupondotcom1',sourcePublishedAt:'2026-09-30',latest:true,latestEvidence:'쿠폰닷컴이 ZillionGames와 제휴하고 게임사 제공 코드로 직접 공개',expiry:'2027-09-30 00:00',statusLabel:'게임사 제공 제휴 코드·수량 한정',evidenceHTML:p('보상: 다이아 300,000. 제휴 안내는 게임사에서 직접 제공받은 코드라고 밝히며 선착순 300,000명 한정으로 안내합니다.'),sources:[third('쿠폰닷컴 · ZillionGames 제휴 쿠폰',switchingPartner,'2026-09-30')]},
  {code:'kupondotcom2',sourcePublishedAt:'2026-09-30',latest:true,latestEvidence:'쿠폰닷컴이 ZillionGames와 제휴하고 게임사 제공 코드로 직접 공개',expiry:'2027-09-30 00:00',statusLabel:'게임사 제공 제휴 코드·수량 한정',evidenceHTML:p('보상: 보물·각성·무기·유물 던전 입장열쇠 각 30. 선착순 300,000명 조건이 있습니다.'),sources:[third('쿠폰닷컴 · ZillionGames 제휴 쿠폰',switchingPartner,'2026-09-30')]},
  {code:'kupondotcom3',sourcePublishedAt:'2026-09-30',latest:true,latestEvidence:'쿠폰닷컴이 ZillionGames와 제휴하고 게임사 제공 코드로 직접 공개',expiry:'2027-09-30 00:00',statusLabel:'게임사 제공 제휴 코드·수량 한정',evidenceHTML:p('보상: 히어로·장비·스킬 소환권 각 300. 선착순 300,000명 조건이 있습니다.'),sources:[third('쿠폰닷컴 · ZillionGames 제휴 쿠폰',switchingPartner,'2026-09-30')]},
  {code:'1STANNIV1',sourcePublishedAt:'2026-03-07',latest:true,latestEvidence:'제3자 쿠폰 원문과 최근 목록에서 교차 노출되나 공식 발급 원문은 이번 조사에서 미확인',expiry:'2027-03-04',statusLabel:'제3자 교차 후보·공식 원문 미확인',evidenceHTML:p('보상 보고: 히어로 소환 500, 무기 소환 2,500, 스킬 소환 600. 공식 발급 게시물은 확인하지 못해 제3자 후보로 유지합니다.'),sources:[third('냥코퍼레이션 · 1주년 쿠폰',switchingAnniv,'2026-03-07')]},
  {code:'1STANNIV2',sourcePublishedAt:'2026-03-07',latest:true,latestEvidence:'제3자 쿠폰 원문과 최근 목록에서 교차 노출되나 공식 발급 원문은 이번 조사에서 미확인',expiry:'2027-03-05',statusLabel:'제3자 교차 후보·공식 원문 미확인',evidenceHTML:p('보상 보고: 보물·무기·각성·유물 던전 열쇠 각 60. 공식 발급 게시물은 확인하지 못해 후보로 유지합니다.'),sources:[third('냥코퍼레이션 · 1주년 쿠폰',switchingAnniv,'2026-03-07')]},
  {code:'1STANNIV3',sourcePublishedAt:'2026-03-07',latest:true,latestEvidence:'제3자 쿠폰 원문과 최근 목록에서 교차 노출되고 사용 보고가 있으나 공식 발급 원문은 미확인',expiry:'2027-03-06',statusLabel:'제3자 교차 후보·공식 원문 미확인',evidenceHTML:p('보상 보고: 다이아 1,000,000. 최근 제3자 목록의 사용 보고가 있으나 공식 발급 게시물은 확인하지 못해 후보 상태를 유지합니다.'),sources:[third('냥코퍼레이션 · 1주년 쿠폰',switchingAnniv,'2026-03-07')]}
];
export const switchingHeroesArticle=make({
  articleKey:'switching-heroes-codes-202610',title:'스위칭 히어로즈: 키우기 RPG',english:'Switching Heroes',storeUrl:switchingStore,iconUrl:switchingIcon,sourceUrl:switchingPartner,references:[switchingStore,switchingCafe,switchingPartner,switchingAnniv],records:switchingRows,type:'SWITCHING_HEROES_PARTNER_AND_CANDIDATES',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="스위칭 히어로즈 쿠폰 요약"><div class="ncp-feed-stat"><span>게임사 제공 제휴</span><strong>3개</strong></div><div class="ncp-feed-stat"><span>1주년 후보</span><strong>3개</strong></div><div class="ncp-feed-stat"><span>최장 기한</span><strong>2027년</strong></div></div>',
  noticeHTML:'<p>게임사가 제휴처에 직접 제공한 것으로 확인되는 3개와, 제3자 교차 확인만 된 1주년 코드 3개를 구분했습니다. 제휴 3개는 각 선착순 300,000명 조건이 있습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>로비 설정 팝업 → 계정 → 쿠폰 입력에서 등록하는 방식으로 제휴 안내가 설명합니다. 코드별 보상 수령 여부는 계정에서 확인하세요.</p><div><a href="${switchingPartner}" rel="noopener noreferrer">제휴 쿠폰 안내 <span>확인 →</span></a></div></section><section><h3>공식 채널</h3><p>신규 이벤트와 추가 코드 변경은 공식 네이버 카페에서 다시 확인합니다.</p></section>`,
  archiveHTML:`<p><a href="${switchingStore}" rel="noopener noreferrer">Google Play</a> · <a href="${switchingCafe}" rel="noopener noreferrer">공식 카페</a> · <a href="${switchingPartner}" rel="noopener noreferrer">게임사 제공 제휴 코드</a> · <a href="${switchingAnniv}" rel="noopener noreferrer">1주년 후보</a></p>`,
  searchDescription:'스위칭 히어로즈 쿠폰 중 게임사 제공 제휴 코드 3개와 1주년 후보 3개, 보상·기한·입력 방법을 출처 상태별로 정리했습니다.',
  keywords:['스위칭 히어로즈 쿠폰','스위칭 히어로즈 코드','kupondotcom1','1STANNIV3'],hashtags:['#스위칭히어로즈','#스위칭히어로즈쿠폰','#게임쿠폰'],
  benefits:[{type:'PARTNER_CODE',authority:'PARTNER_GAME_COMPANY_PROVIDED',status:'ACTIVE',benefit:'제휴 코드 3종',method:'게임 내 쿠폰 입력',sourceUrl:switchingPartner,sourcePublishedAt:'2026-09-30',expiry:'2027-09-30 00:00'}]
});

// 레알팜
const realfarmStore='https://play.google.com/store/apps/details?hl=ko&id=kr.neogames.realfarm';
const realfarmIcon='https://play-lh.googleusercontent.com/Qg3wLp9LscJKzIVISOuhzRVS80w1dzmFsHO0GNq4rwxho_8kK8ypT2Ud3sKNebt_-9fx1Fr35idp5T1kDO7i%3Dw240-h480';
const realfarmLounge='https://game.naver.com/lounge/REAL_FARM';
const realfarmBoard='https://game.naver.com/lounge/REAL_FARM/board/13';
const realfarmMarket='https://www.realfarmmarket.co.kr/';
const realfarm14='https://game.naver.com/lounge/REAL_FARM/board/detail/7933613';
export const realfarmArticle=make({
  articleKey:'realfarm-benefits-202610',title:'레알팜',english:'Real Farm',storeUrl:realfarmStore,iconUrl:realfarmIcon,sourceUrl:realfarmLounge,references:[realfarmStore,realfarmLounge,realfarmBoard,realfarmMarket,realfarm14],records:[],type:'REALFARM_REALCOUPON_BENEFITS',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="레알팜 혜택 요약"><div class="ncp-feed-stat"><span>문자열 쿠폰</span><strong>0개 확인</strong></div><div class="ncp-feed-stat"><span>레알쿠폰</span><strong>교환 혜택</strong></div><div class="ncp-feed-stat"><span>공식 마켓</span><strong>확인</strong></div></div>',
  noticeHTML:'<p>레알팜의 핵심 쿠폰 혜택은 복사하는 문자열 코드가 아니라 게임에서 획득한 레알쿠폰을 실제 농산물로 교환하는 방식입니다. 현재 공개 문자열 프로모션 코드는 확인하지 못했습니다.</p>',
  guideHTML:`<section><h3>받기</h3><p>게임 이벤트·콘텐츠에서 레알쿠폰을 획득한 뒤 공식 레알팜마켓의 교환 상품과 필요 수량을 확인합니다. 재고와 행사 기간에 따라 상품은 바뀔 수 있습니다.</p><div><a href="${realfarmMarket}" rel="noopener noreferrer">레알팜마켓 <span>확인 →</span></a></div></section><section><h3>현재 확인</h3><p>공식 마켓에는 14주년 기념 레알쿠폰 11장 교환 농산물 상품이 노출돼 있습니다. 개발자 노트도 새로운 레알쿠폰 이벤트 준비를 안내했습니다.</p></section>`,
  archiveHTML:`<p><a href="${realfarmStore}" rel="noopener noreferrer">Google Play</a> · <a href="${realfarmLounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${realfarmMarket}" rel="noopener noreferrer">레알팜마켓</a> · <a href="${realfarm14}" rel="noopener noreferrer">14주년 행사 이력</a></p>`,
  searchDescription:'레알팜 쿠폰은 문자열 코드가 아닌 레알쿠폰 교환 혜택 중심입니다. 공식 레알팜마켓의 현재 교환 방식과 14주년 관련 혜택을 정리했습니다.',
  keywords:['레알팜 쿠폰','레알팜 레알쿠폰','레알팜 14주년','레알팜마켓'],hashtags:['#레알팜','#레알쿠폰','#레알팜마켓','#게임혜택'],
  benefits:[
    {type:'IN_GAME_REDEMPTION',authority:'OFFICIAL',status:'ACTIVE_OBSERVED',benefit:'레알쿠폰 11장으로 14주년 기념 농산물 교환 상품',method:'게임에서 레알쿠폰 획득 → 공식 마켓 교환',sourceUrl:realfarmMarket,sourcePublishedAt:null,expiry:null},
    {type:'EVENT_NOTICE',authority:'OFFICIAL',status:'ANNOUNCED',benefit:'새로운 레알쿠폰 이벤트·콘텐츠 준비 안내',method:'공식 개발자 노트 확인',sourceUrl:realfarmBoard,sourcePublishedAt:'2026-10-02',expiry:null}
  ]
});

// 몬길: STAR DIVE
const mongilStore='https://play.google.com/store/apps/details?hl=ko&id=com.netmarble.monster2';
const mongilIcon='https://play-lh.googleusercontent.com/HgMF0Fq3vKNgPlwm4GzidIh5W7hAY50kmAD1uNLcMywIFNqCnJ5aa88jN3x8mPBhtL8sSoLZlwl8IdMzeH0P7Y4%3Dw240-h480';
const mongilForum='https://forum.netmarble.com/stardive_ko';
const mongilBenefit='https://forum.netmarble.com/stardive_ko/view/4/5733';
const mongilCurrent='https://kupon.kr/community/mongil-star-dive-beginner-guide-439';
const mongilBunny='https://forum.netmarble.com/stardive_ja/view/11/192';
const mongilCreator='https://forum.netmarble.com/stardivecr/view/5/88';
const mongilRows=[
  {code:'BUNNYSHOW',sourcePublishedAt:'2026-09-02',latest:false,latestEvidence:'넷마블 일본 공식 포럼이 보상과 2026-09-09 입력 마감을 직접 안내',expiry:'2026-09-09 08:30 JST',statusLabel:'공식·종료',evidenceHTML:p('보상: 키 150, 약속의 나침반 3, 프리미엄 연어 퓌레 10. 현재 날짜 기준 종료된 공식 코드입니다.'),sources:[official('몬길: STAR DIVE 일본 공식 포럼',mongilBunny,'2026-09-02')]},
  ...['MONGILDISCORD','LOVEMONGIL','devlive0410','DINDINISDINDIN','MONGILPRESENT'].map(code=>({code,sourcePublishedAt:'2026-04-16',latest:false,latestEvidence:'출시 직후 공식 크리에이터 포럼에 공식 공개 리딤코드 목록으로 게시됐으나 10월 현행 가이드는 활성 공식 코드 0개로 확인',expiry:'현재 종료·상태 미확인',statusLabel:'공식 크리에이터 공개 이력·현재 비활성',evidenceHTML:p('출시 시기 공식 크리에이터 포럼이 공개 코드 목록으로 안내한 문자열입니다. 10월 현행 확인에서는 활성 공식 코드가 없으므로 현재 코드로 노출하지 않습니다.'),sources:[official('몬길: STAR DIVE 공식 크리에이터 포럼',mongilCreator,'2026-04-16')]}))
];
export const mongilStarDiveArticle=make({
  articleKey:'mongil-star-dive-codes-202610',title:'몬길: STAR DIVE',english:'MONGIL STAR DIVE',storeUrl:mongilStore,iconUrl:mongilIcon,sourceUrl:mongilForum,references:[mongilStore,mongilForum,mongilBenefit,mongilCurrent,mongilBunny,mongilCreator],records:mongilRows,type:'MONGIL_STAR_DIVE_OFFICIAL_HISTORY',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="몬길 스타 다이브 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 공식</span><strong>0개 확인</strong></div><div class="ncp-feed-stat"><span>공식 이력</span><strong>6개</strong></div><div class="ncp-feed-stat"><span>현재 혜택</span><strong>★5 지급</strong></div></div>',
  noticeHTML:'<p>10월 10일 기준 현재 사용 가능하다고 공식 확인되는 고정 리딤코드는 찾지 못했습니다. 과거 공식 공개 코드 6개는 이력으로 보존하고, 현재 진행 중인 ★5 캐릭터 지급 혜택은 코드와 분리합니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>PC·Android는 게임 메뉴 → 설정 → 고객지원의 쿠폰 입력 경로를 사용합니다. iOS는 넷마블 쿠폰 페이지를 이용하는 방식으로 안내됩니다.</p><div><a href="${mongilForum}" rel="noopener noreferrer">공식 포럼 <span>확인 →</span></a></div></section><section><h3>현재 혜택</h3><p>2026년 9월 30일 점검 후부터 11월 11일 08:59 KST까지 첫 소환을 완료한 모든 이용자에게 무작위 ★5 일반 캐릭터 '초행길의 동반자'를 지급하는 공식 혜택이 안내돼 있습니다.</p></section>`,
  archiveHTML:`<p><a href="${mongilStore}" rel="noopener noreferrer">Google Play</a> · <a href="${mongilForum}" rel="noopener noreferrer">공식 포럼</a> · <a href="${mongilBenefit}" rel="noopener noreferrer">개발자 노트 #10</a> · <a href="${mongilBunny}" rel="noopener noreferrer">BUNNYSHOW 공식 이력</a></p>`,
  searchDescription:'몬길 STAR DIVE 쿠폰의 10월 현재 공식 코드 상태, BUNNYSHOW와 출시 코드 이력, 11월 11일까지의 공식 ★5 캐릭터 지급 혜택을 정리했습니다.',
  keywords:['몬길 쿠폰','몬길 STAR DIVE 쿠폰','몬길 스타다이브 리딤코드','BUNNYSHOW'],hashtags:['#몬길','#몬길STARDIVE','#몬길쿠폰','#게임쿠폰'],
  benefits:[{type:'ACCOUNT_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'초행길의 동반자 · 무작위 ★5 일반 캐릭터',method:'기간 내 첫 소환 완료',sourceUrl:mongilBenefit,sourcePublishedAt:'2026-09-29',expiry:'2026-11-11 08:59 KST'}]
});
