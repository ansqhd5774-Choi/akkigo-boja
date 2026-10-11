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

// 드래곤빌리지3
const dv3Store='https://play.google.com/store/apps/details?hl=ko&id=com.highbrow.games.dvo';
const dv3Icon='https://play-lh.googleusercontent.com/Ub7Hbq1LusnGf9lR0Spth7mxCzByqE22z9MEBwK--PP1fuh96JazHOboiMADc7Yl1drd8axAa0kOoUyTDy0v%3Dw240-h480';
const dv3Lounge='https://game.naver.com/lounge/Dragon_Village3/home';
const dv3Roadmap='https://game.naver.com/lounge/Dragon_Village3/board/detail/7845479';
const dv3Kakao='https://pf.kakao.com/_xoxbZsd/posts';
const dv3Bus='https://game.naver.com/lounge/dragon_village3/board/detail/8219569';
const dv3Third='https://www.lv1arcade.com/coupons/dragonVillage/%EB%93%9C%EB%9E%98%EA%B3%A4%EB%B9%8C%EB%A6%AC%EC%A7%803';
const dv3Candidates=['TELLUSPU','DEVAPICK','DRGNEGG1','DRAGONUP','SAILINGD3NIAH','DRAGON77','K7DRGNV3','D3PARUX2','THXCHR08'];
const dv3Rows=[
  ...dv3Candidates.map(code=>({code,sourcePublishedAt:null,latest:true,latestEvidence:'최근 제3자 목록에 노출됐지만 공식 발급 원문과 현재 계정 입력 성공을 확인하지 못함',expiry:'미확인',statusLabel:'제3자 후보·실사용 미확인',evidenceHTML:p('최근 제3자 목록에 노출된 문자열입니다. 공식 라운지·공식 카카오 채널에서 동일한 현재 발급 공지를 확인하지 못했으므로 활성 공식 쿠폰으로 단정하지 않습니다.'),sources:[third('Lv.1 Arcade · 드래곤빌리지3 후보 목록',dv3Third,null)]})),
  {code:'7ROADMAP',sourcePublishedAt:'2026-06-25',latest:false,latestEvidence:'공식 개발자 노트에서 발급 및 종료 시각 확인',expiry:'2026-07-09 08:59 KST',statusLabel:'공식·종료',evidenceHTML:p('공식 개발자 노트에서 픽업 뽑기 티켓 5개·피로회복제(7일) 10개·골드 5,000,000·먹이 1,000,000 보상과 종료 시각을 함께 안내했습니다.'),sources:[official('드래곤빌리지3 공식 개발자 노트',dv3Roadmap,'2026-06-25')]},
  {code:'DV3START',sourcePublishedAt:'2026-06-03',latest:false,latestEvidence:'공식 카카오 채널 출시 공지에서 발급 확인, 현재는 최신 공식 쿠폰으로 확인되지 않음',expiry:'종료 여부 공식 재확인 필요',statusLabel:'공식 발급 이력·현재 미확인',evidenceHTML:p('공식 카카오 채널에서 글로벌 오픈 기념 코드로 다이아 300개와 픽업 뽑기 티켓 3개를 안내했습니다. 현재 공식 채널에서 유효 기간을 다시 확인하지 못해 최신 목록과 분리했습니다.'),sources:[official('드래곤빌리지 공식 카카오 채널',dv3Kakao,'2026-06-03')]}
];
export const dragonVillage3Article=make({
  articleKey:'dragon-village3-codes-202610',title:'드래곤빌리지3',english:'Dragon Village 3',storeUrl:dv3Store,iconUrl:dv3Icon,sourceUrl:dv3Lounge,references:[dv3Store,dv3Lounge,dv3Roadmap,dv3Kakao,dv3Bus,dv3Third],records:dv3Rows,type:'DRAGON_VILLAGE3_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="드래곤빌리지3 쿠폰 요약"><div class="ncp-feed-stat"><span>최근 후보</span><strong>9개</strong></div><div class="ncp-feed-stat"><span>공식 이력</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>현재 공식</span><strong>미확인</strong></div></div>',
  noticeHTML:'<p>현재 공식 채널에서 유효한 고정 쿠폰을 새로 확인하지 못했습니다. 최근 제3자 문자열 9개는 후보로 보존하고, 공식 발급 이력은 별도로 분리했습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>공식 쿠폰은 게임 내 설정의 쿠폰/코드 메뉴에서 등록하고 우편함에서 보상을 확인합니다.</p><div><a href="${dv3Lounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>공식 혜택</h3><p>공식 라운지의 대만 버스 QR 수집 이벤트는 2026년 11월 5일 07:59:59까지 안내돼 있으며 복사 코드가 아닌 참여형 보상입니다.</p></section>`,
  archiveHTML:`<p><a href="${dv3Store}" rel="noopener noreferrer">Google Play</a> · <a href="${dv3Lounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${dv3Roadmap}" rel="noopener noreferrer">공식 개발자 노트</a> · <a href="${dv3Third}" rel="noopener noreferrer">제3자 후보 목록</a></p>`,
  searchDescription:'드래곤빌리지3 쿠폰 후보와 공식 발급 이력을 정리했습니다. 최근 제3자 코드와 종료된 공식 코드, 현재 공식 이벤트를 구분해 확인할 수 있습니다.',
  keywords:['드래곤빌리지3 쿠폰','드래곤빌리지3 코드','드빌3 쿠폰','Dragon Village 3 coupon','드래곤빌리지3 쿠폰 입력'],hashtags:['#드래곤빌리지3','#드빌3','#드래곤빌리지3쿠폰','#게임쿠폰'],
  benefits:[{type:'EVENT_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'대만 버스 QR 수집 이벤트 보상',method:'공식 이벤트 참여 및 QR 수집',sourceUrl:dv3Bus,sourcePublishedAt:'2026-09-21',expiry:'2026-11-05 07:59:59'}]
});

// 에버나이트: 리버스
const evernightStore='https://play.google.com/store/apps/details?hl=ko&id=com.yyjlkr.az';
const evernightIcon='https://play-lh.googleusercontent.com/XJBbIgPZfySq7txP8LzUVESgiieGgnRElQYwp89y3YyVuji7AWOpoG-oGARUYIyhAZILmS98BrrhBp-Wxo_n%3Dw240-h480';
const evernightLounge='https://game.naver.com/lounge/Evernight/home';
const evernightAudit='https://gcouponplay.com/evernight-reverse-coupon/';
const evernightRows=[
  ['evernightopen','2026-09-16','정식 출시 쿠폰'],
  ['evernightday2','2026-09-17','출시 2일차 쿠폰'],
  ['evernight333','2026-09-18','출시 3일차 쿠폰']
].map(([code,date,label])=>({code,sourcePublishedAt:date,latest:true,latestEvidence:`공식 라운지 ${label} 게시 이력이 교차 확인됐으나 공식 사용 기한 미표기·현재 계정 입력 결과 미확인`,expiry:'공식 기한 미표기',statusLabel:'공식 발급·현재 사용 미확인',evidenceHTML:p('공식 라운지 쿠폰 공개 게시판에 운영팀 명의로 게시된 코드입니다. 공지에 종료일이 적혀 있지 않아 수집일을 임의 만료일로 사용하지 않았고 현재 계정 입력 성공도 확인하지 않았습니다.'),sources:[official(`에버나이트 공식 라운지 · ${label}`,evernightLounge,date),third('지쿠폰 플레이 · 공식 게시판 교차 확인',evernightAudit,'2026-09-18')]}));
export const evernightReverseArticle=make({
  articleKey:'evernight-reverse-codes-202610',title:'에버나이트: 리버스',english:'Evernight Reverse',storeUrl:evernightStore,iconUrl:evernightIcon,sourceUrl:evernightLounge,references:[evernightStore,evernightLounge,evernightAudit],records:evernightRows,type:'EVERNIGHT_REVERSE_OFFICIAL_CODE_HISTORY',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="에버나이트 리버스 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 발급</span><strong>3개</strong></div><div class="ncp-feed-stat"><span>사용 기한</span><strong>미표기</strong></div><div class="ncp-feed-stat"><span>실사용</span><strong>미확인</strong></div></div>',
  noticeHTML:'<p>공식 쿠폰 공개 게시판에서 발급 이력이 확인되는 코드는 3개입니다. 공식 종료일이 적혀 있지 않아 현재 사용 가능하다고 단정하지 않고 입력 시도 대상으로 표시합니다.</p>',
  guideHTML:`<section><h3>확인</h3><p>새 쿠폰은 공식 네이버 게임 라운지의 쿠폰 공개 게시판을 우선 확인하세요. 검색에 도는 범용 문자열은 공식 게시판 발급 근거가 확인되지 않았습니다.</p><div><a href="${evernightLounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>공식 혜택</h3><p>Google Play 공식 설명은 현재 접속 시 100회 뽑기 혜택을 안내합니다. 쿠폰 문자열과 별개의 게임 내 혜택입니다.</p></section>`,
  archiveHTML:`<p><a href="${evernightStore}" rel="noopener noreferrer">Google Play</a> · <a href="${evernightLounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${evernightAudit}" rel="noopener noreferrer">공식 게시판 교차 확인 자료</a></p>`,
  searchDescription:'에버나이트 리버스 공식 쿠폰 3개와 사용 기한 미표기 상태, 현재 100회 뽑기 혜택을 구분해 정리했습니다.',
  keywords:['에버나이트 리버스 쿠폰','에버나이트 쿠폰','evernightopen','evernightday2','evernight333','Evernight Reverse code'],hashtags:['#에버나이트리버스','#에버나이트쿠폰','#EvernightReverse','#게임쿠폰'],
  benefits:[{type:'LOGIN_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'접속 시 100회 뽑기 혜택',method:'게임 접속',sourceUrl:evernightStore,sourcePublishedAt:null,expiry:null}]
});

// XP Hero
const xpStore='https://play.google.com/store/apps/details?hl=ko&id=io.supercent.weaponrpg';
const xpIcon='https://play-lh.googleusercontent.com/ar-oRoBtoJXIBCzL_QV4w5r7RJhCrRSHl1Hggi_hsy16yL55kCJyG96TqJF-kAQNwk7FfZG0BoBMK57Pe9t-Bg%3Dw240-h480';
const xpCreator='https://creator.supercent.io/?locale=en&track=creator-code&view=guide';
const xpThird='https://mturbogamer.com/2026/09/xp-hero-support-a-creator/';
const xpRows=[{code:'lxy9950',sourcePublishedAt:'2026-09-21',latest:true,latestEvidence:'제3자 운영자가 공개한 Creator Code이며 무료 아이템 쿠폰이 아님',expiry:'입력 후 구매 귀속 7일',statusLabel:'크리에이터 코드·플레이어 보상 없음',evidenceHTML:p('Supercent 공식 Creator Code 제도는 입력 후 7일 동안 구매를 크리에이터에게 귀속하는 방식입니다. 코드 입력 자체로 플레이어에게 무료 보상이나 할인이 생기지 않으므로 일반 쿠폰과 분리합니다.'),sources:[official('Supercent · Super Creator Partners',xpCreator,null),third('mTurboGamer · XP Hero Creator Code',xpThird,'2026-09-21')]}];
export const xpHeroArticle=make({
  articleKey:'xp-hero-codes-202610',title:'XP Hero',english:'XP Hero',storeUrl:xpStore,iconUrl:xpIcon,sourceUrl:xpStore,references:[xpStore,xpCreator,xpThird],records:xpRows,type:'XP_HERO_CREATOR_CODE_ONLY',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="XP Hero 코드 요약"><div class="ncp-feed-stat"><span>보상 쿠폰</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>Creator Code</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>직접 보상</span><strong>없음</strong></div></div>',
  noticeHTML:'<p>현재 공식 공개형 무료 보상 쿠폰은 확인되지 않았습니다. 공개된 `lxy9950`은 크리에이터 지원 코드로, 입력 자체가 플레이어 보상이나 할인으로 이어지는 쿠폰이 아닙니다.</p>',
  guideHTML:`<section><h3>Creator Code</h3><p>Supercent 공식 제도에서 코드를 입력하면 이후 7일간 일부 구매가 해당 크리에이터에게 귀속됩니다. 구매가 없으면 크리에이터 보상도 발생하지 않습니다.</p><div><a href="${xpCreator}" rel="noopener noreferrer">공식 제도 <span>확인 →</span></a></div></section><section><h3>쿠폰 구분</h3><p>무료 재화·아이템 지급 코드가 확인되기 전까지 Creator Code를 쿠폰 보상으로 표시하지 않습니다.</p></section>`,
  archiveHTML:`<p><a href="${xpStore}" rel="noopener noreferrer">Google Play</a> · <a href="${xpCreator}" rel="noopener noreferrer">Super Creator Partners</a> · <a href="${xpThird}" rel="noopener noreferrer">Creator Code 공개 자료</a></p>`,
  searchDescription:'XP Hero 쿠폰과 Creator Code 차이를 정리했습니다. 현재 공식 무료 보상 쿠폰은 확인되지 않았고 Creator Code는 플레이어 직접 보상이 없습니다.',
  keywords:['XP Hero 쿠폰','XP Hero code','XP 히어로 쿠폰','XP Hero creator code','XP Hero lxy9950'],hashtags:['#XPHero','#XP히어로','#XPHero쿠폰','#CreatorCode'],
  benefits:[{type:'CREATOR_CODE',authority:'OFFICIAL_PROGRAM',status:'ACTIVE',benefit:'크리에이터 구매 귀속 프로그램',method:'게임 상점에서 Creator Code 입력',sourceUrl:xpCreator,sourcePublishedAt:null,expiry:'입력 후 7일 귀속'}]
});

// 열혈강호: 넥스트
const yulgangStore='https://play.google.com/store/apps/details?hl=ko&id=com.rxjhglkr.gp';
const yulgangIcon='https://play-lh.googleusercontent.com/ct9hCP6C7NRwwTT3p-eIRLAJHMYuK2k2kO0tC6nc8YUCwgRos5tOuzfKmflfPOwQdfJiuNHkmifu0lhVcEmY%3Dw240-h480';
const yulgangLounge='https://game.naver.com/lounge/yulgang_next/home';
const yulgangPlaydez='https://playdez.com/';
const yulgangDigwow='https://www.digwow.net/%EC%97%B4%ED%98%88%EA%B0%95%ED%98%B8-%EB%84%A5%EC%8A%A4%ED%8A%B8/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const yulgangBroadcast='https://inbangmo.com/rankings/soop/ecalove';
const yulgangCodes=['HAPPY1003','YULGANG2026','YULGANG777','YULGANGNEXT','YULGANGNEXTOPEN','YULGANGNEXTGO','SVIP555','SVIP666','SVIP777','SVIP888','vip555','vip666'];
const yulgangRows=yulgangCodes.map(code=>({code,sourcePublishedAt:code==='HAPPY1003'?'2026-10-03':null,latest:true,latestEvidence:code==='HAPPY1003'?'10월 3일 제3자 최신 목록과 실제 방송 제목에서 입력 시도가 교차 관측됨':'제3자 최신 목록에 사용 가능 코드로 노출되지만 공식 발급 원문과 현재 계정 입력 성공 미확인',expiry:'미확인',statusLabel:code==='HAPPY1003'?'최근 교차 후보·실사용 미확인':'제3자 후보·실사용 미확인',evidenceHTML:p(code==='HAPPY1003'?'PlayDez에서 개천절 기념 보상으로 노출되고 10월 3일 게임 방송 제목에서도 쿠폰 등록이 관측됐습니다. 다만 공식 라운지 발급 본문을 직접 확인하지 못해 공식·현재로 승격하지 않습니다.':'제3자 쿠폰 목록에 노출된 문자열입니다. 공식 라운지 선물 코드 게시판의 개별 발급 원문과 현재 계정 입력 성공을 확인하지 못해 후보로 유지합니다.'),sources:code==='HAPPY1003'?[third('PlayDez · 최신 쿠폰',yulgangPlaydez,null),third('SOOP 방송 공개 기록',yulgangBroadcast,'2026-10-03')]:[third('DIGWOW · 열혈강호 넥스트 코드 목록',yulgangDigwow,'2026-10-11')]}));
export const yulgangNextArticle=make({
  articleKey:'yulgang-next-codes-202610',title:'열혈강호: 넥스트',english:'Yulgang Next',storeUrl:yulgangStore,iconUrl:yulgangIcon,sourceUrl:yulgangLounge,references:[yulgangStore,yulgangLounge,yulgangPlaydez,yulgangDigwow,yulgangBroadcast],records:yulgangRows,type:'YULGANG_NEXT_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="열혈강호 넥스트 쿠폰 요약"><div class="ncp-feed-stat"><span>최근 교차</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>후보</span><strong>12개</strong></div><div class="ncp-feed-stat"><span>공식 확정</span><strong>미확인</strong></div></div>',
  noticeHTML:'<p>`HAPPY1003`은 10월 3일 제3자 최신 목록과 게임 방송 기록에서 함께 관측됐습니다. 나머지 문자열도 삭제하지 않고 후보로 보존하지만 공식 발급 원문·현재 실사용이 확인되기 전에는 활성 공식 쿠폰으로 표시하지 않습니다.</p>',
  guideHTML:`<section><h3>선물 코드</h3><p>공식 네이버 게임 라운지에는 선물 코드 게시판이 있으므로 신규 코드는 해당 원문을 우선 확인하세요.</p><div><a href="${yulgangLounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>현재 이벤트</h3><p>한글날 강호 이행시 이벤트는 10월 15일까지 안내된 참여형 이벤트로 쿠폰 문자열과 분리했습니다.</p></section>`,
  archiveHTML:`<p><a href="${yulgangStore}" rel="noopener noreferrer">Google Play</a> · <a href="${yulgangLounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${yulgangPlaydez}" rel="noopener noreferrer">최근 후보</a> · <a href="${yulgangDigwow}" rel="noopener noreferrer">제3자 목록</a></p>`,
  searchDescription:'열혈강호 넥스트 쿠폰 후보를 정리했습니다. HAPPY1003 최근 교차 관측과 기존 코드 후보를 공식 발급·실사용 확인 여부에 따라 구분합니다.',
  keywords:['열혈강호 넥스트 쿠폰','열혈강호 넥스트 코드','HAPPY1003','YULGANG2026','YULGANGNEXT','열혈강호 넥스트 선물 코드'],hashtags:['#열혈강호넥스트','#열혈강호쿠폰','#HAPPY1003','#게임쿠폰'],
  benefits:[{type:'SOCIAL_EVENT',authority:'OFFICIAL',status:'ACTIVE',benefit:'한글날 강호 이행시 이벤트',method:'공식 라운지 이벤트 참여',sourceUrl:yulgangLounge,sourcePublishedAt:'2026-10-09',expiry:'2026-10-15'}]
});

// 냥찍 히어로즈
const nyangStore='https://play.google.com/store/apps/details?hl=ko&id=com.blackdust.redblue';
const nyangIcon='https://play-lh.googleusercontent.com/eodS4XyT3MbI9sKB1NKVB7m0zV9m91ftNnQ4dwUdWfGdxNqjc8wtXqIMKDQn32QigEtZCrtRyS2aTxbuQ5Tu-g%3Dw240-h480';
const nyangLounge='https://game.naver.com/lounge/Furry_Fighters_Idle_RPG/home';
const nyangThird='https://www.honeybeejoa.co.kr/bbs/board.php?bo_table=Furry_Fighters&sfl=wr_name&sop=and&stx=%EC%BF%A0%ED%8F%B0%EB%AA%BD&wr_id=1';
const nyangCurrent=[['HANGEUL1009','2026-12-09','한글날 기념'],['HAPPYAUTUMN','2026-11-22','가을 시즌'],['BETTERPLAY','2026-11-09','편의성 강화 업데이트'],['SOULDUO','2026-10-30','소울 웨폰 업데이트']];
const nyangExpired=[['GRANDOPEN','2026-09-21'],['GWANGBOK815','2026-10-06'],['JOINGUILD','2026-10-06'],['THANKYOUALL','2026-09-29'],['GIANTBOSS','2026-09-14'],['RANK111','2026-08-15'],['GROWTHDUO','2026-09-03'],['GOWITHDUO','2026-08-21'],['CRAFTCARD','2026-08-15']];
const nyangRows=[
  ...nyangCurrent.map(([code,expiry,label])=>({code,sourcePublishedAt:'2026-08-07',latest:true,latestEvidence:`제3자 운영 목록에서 ${label} 코드와 종료일을 현재 항목으로 표시`,expiry,statusLabel:'제3자 기간표기 후보·실사용 미확인',evidenceHTML:p('쿠폰몽 운영 페이지에 코드와 종료일이 표시돼 있습니다. 공식 라운지의 개별 발급 원문과 계정 입력 성공을 직접 확인하지 못해 공식·현재로 승격하지 않습니다.'),sources:[third('쿠폰몽 · 냥찍 히어로즈 코드 목록',nyangThird,'2026-08-07')]})),
  ...nyangExpired.map(([code,expiry])=>({code,sourcePublishedAt:'2026-08-07',latest:false,latestEvidence:'제3자 목록에 표시된 종료일이 현재 날짜보다 이전',expiry,statusLabel:'제3자 기록·기간 종료',evidenceHTML:p('제3자 목록에 명시된 종료일이 지났으므로 현재 시도 목록과 분리했습니다.'),sources:[third('쿠폰몽 · 냥찍 히어로즈 코드 목록',nyangThird,'2026-08-07')]}))
];
export const nyangjjikHeroesArticle=make({
  articleKey:'nyangjjik-heroes-codes-202610',title:'냥찍 히어로즈',english:'Furry Fighters Idle RPG',storeUrl:nyangStore,iconUrl:nyangIcon,sourceUrl:nyangLounge,references:[nyangStore,nyangLounge,nyangThird],records:nyangRows,type:'NYANGJJIK_HEROES_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="냥찍 히어로즈 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 후보</span><strong>4개</strong></div><div class="ncp-feed-stat"><span>종료 기록</span><strong>9개</strong></div><div class="ncp-feed-stat"><span>공식 혜택</span><strong>777회</strong></div></div>',
  noticeHTML:'<p>10월 12일 기준 제3자 목록에서 종료일이 남은 4개를 시도 후보로 유지하고, 종료일이 지난 9개는 이력으로 분리했습니다. 공식 발급·실사용 확인 전에는 현재 공식 쿠폰으로 단정하지 않습니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>공식 라운지에서 최신 이벤트를 먼저 확인하고, 후보 코드는 게임 내 쿠폰 입력 메뉴에서 계정별로 확인하세요.</p><div><a href="${nyangLounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>공식 혜택</h3><p>Google Play 공식 설명은 현재 접속만 해도 777회 무료 뽑기를 제공한다고 안내합니다. 복사형 쿠폰과 별개의 접속 혜택입니다.</p></section>`,
  archiveHTML:`<p><a href="${nyangStore}" rel="noopener noreferrer">Google Play</a> · <a href="${nyangLounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${nyangThird}" rel="noopener noreferrer">제3자 코드 목록</a></p>`,
  searchDescription:'냥찍 히어로즈 쿠폰 후보 4개와 종료 기록 9개, 공식 777회 무료 뽑기 혜택을 구분해 정리했습니다.',
  keywords:['냥찍 히어로즈 쿠폰','냥찍 히어로즈 코드','HANGEUL1009','HAPPYAUTUMN','BETTERPLAY','SOULDUO'],hashtags:['#냥찍히어로즈','#냥찍히어로즈쿠폰','#방치형RPG','#게임쿠폰'],
  benefits:[{type:'LOGIN_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'777회 무료 뽑기',method:'게임 접속',sourceUrl:nyangStore,sourcePublishedAt:null,expiry:null}]
});
