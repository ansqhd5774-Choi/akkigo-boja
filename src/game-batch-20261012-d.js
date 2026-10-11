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

// 갓 슬레이어
const godStore='https://play.google.com/store/apps/details?hl=ko&id=com.growking.godslayer';
const godIcon='https://play-lh.googleusercontent.com/Szp9k2LlL3EWK6p2HTXPWI8r_dNWayjlqL1v4D-pRsGAcpW5eTITTnRF0I7FdmqRBRb6nV3GjkQF007d4D5K%3Dw240-h480';
const godLounge='https://game.naver.com/lounge/God_Slayer';
const godHistory='https://data100.dasfl.com/%EA%B0%93-%EC%8A%AC%EB%A0%88%EC%9D%B4%EC%96%B4-%EB%AA%A8%EB%B0%94%EC%9D%BC-pc-%EB%B2%84%EC%A0%84/';
const godRows=[
  {code:'goddice00',sourcePublishedAt:'2025-07-30',latest:false,latestEvidence:'제3자 가이드가 공식 네이버 라운지 발급 이력과 2025-08-01 종료일을 기록',expiry:'2025-08-01',statusLabel:'공식 발급 교차 이력·종료',evidenceHTML:p('갓 슬레이어 공식 네이버 라운지 쿠폰 메뉴에 게시됐던 코드로 제3자 가이드가 종료일을 함께 기록했습니다. 현재 사용 가능한 코드가 아니므로 종료 이력으로 분리합니다.'),sources:[third('데이타로 본 라이프 스타일 · 공식 라운지 쿠폰 이력',godHistory,'2025-07-30'),official('갓 슬레이어 공식 네이버 라운지',godLounge,null)]},
  {code:'godgold05',sourcePublishedAt:'2025-07-30',latest:false,latestEvidence:'제3자 가이드가 공식 네이버 라운지 발급 이력과 2025-08-04 종료일을 기록',expiry:'2025-08-04',statusLabel:'공식 발급 교차 이력·종료',evidenceHTML:p('갓 슬레이어 공식 네이버 라운지 쿠폰 메뉴에 게시됐던 코드로 제3자 가이드가 종료일을 함께 기록했습니다. 현재 사용 가능한 코드가 아니므로 종료 이력으로 분리합니다.'),sources:[third('데이타로 본 라이프 스타일 · 공식 라운지 쿠폰 이력',godHistory,'2025-07-30'),official('갓 슬레이어 공식 네이버 라운지',godLounge,null)]}
];
export const godSlayerArticle=make({
  articleKey:'god-slayer-codes-202610',title:'갓 슬레이어',english:'God Slayer',storeUrl:godStore,iconUrl:godIcon,sourceUrl:godLounge,references:[godStore,godLounge,godHistory],records:godRows,type:'GOD_SLAYER_OFFICIAL_HISTORY',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="갓 슬레이어 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 공식</span><strong>미확인</strong></div><div class="ncp-feed-stat"><span>종료 이력</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>공식 라운지</span><strong>확인</strong></div></div>',
  noticeHTML:'<p>현재 공식 채널에서 사용 가능한 고정 쿠폰을 새로 확인하지 못했습니다. 확인 가능한 공식 발급 교차 이력 2개는 종료 기록으로 보존합니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>쿠폰은 게임 실행 후 화면 왼쪽 위 쿠폰 메뉴에서 입력하는 방식으로 안내돼 있습니다. 새 코드는 공식 네이버 게임 라운지의 쿠폰 메뉴를 우선 확인하세요.</p><div><a href="${godLounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>공식 혜택</h3><p>Google Play 공식 설명은 접속만 해도 보석과 장비가 지급되는 성장 보상을 안내합니다. 복사형 쿠폰과는 별도 혜택입니다.</p></section>`,
  archiveHTML:`<p><a href="${godStore}" rel="noopener noreferrer">Google Play</a> · <a href="${godLounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${godHistory}" rel="noopener noreferrer">쿠폰 이력 교차 자료</a></p>`,
  searchDescription:'갓 슬레이어 쿠폰의 현재 공식 확인 상태와 과거 종료 코드, 공식 네이버 라운지 확인 경로를 정리했습니다.',
  keywords:['갓 슬레이어 쿠폰','갓슬레이어 쿠폰','갓 슬레이어 코드','God Slayer coupon','갓 슬레이어 쿠폰 입력'],hashtags:['#갓슬레이어','#갓슬레이어쿠폰','#GodSlayer','#게임쿠폰'],
  benefits:[{type:'LOGIN_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'접속 보석·장비 성장 보상',method:'게임 접속',sourceUrl:godStore,sourcePublishedAt:null,expiry:null}]
});

// 낭만강호
const romanticStore='https://play.google.com/store/apps/details?hl=ko&id=com.morefunkr.yyjh';
const romanticIcon='https://play-lh.googleusercontent.com/gZCGqktUTtowWm14l1ASp_dk-VwOYHJkfZgP1jH1q3C_DV4uY7qTl7EWWEtPSKTPIoU4Hhj_WHSIJ9ggdZRkQn4%3Dw240-h480';
const romanticLounge='https://game.naver.com/lounge/RomanticGangho/home';
const romanticThird='https://www.lv1arcade.com/coupons/romanticKangho/%EB%82%AD%EB%A7%8C%EA%B0%95%ED%98%B8';
const romanticCandidates=['강호초입','패치성공','2ae3wd16','2dyxx58d','천하제일','2a3ajv4m','2bdrima6','낭만보상','2b4egt55'];
const romanticRows=romanticCandidates.map(code=>({
  code,sourcePublishedAt:null,latest:true,
  latestEvidence:(code==='낭만보상'||code==='2b4egt55')?'최근 제3자 목록에 있으나 만료 의심 신고 1건과 공식 발급 원문 미확인':'최근 제3자 목록에 있으나 공식 발급 원문·현재 계정 입력 성공 미확인',
  expiry:'미확인',
  statusLabel:(code==='낭만보상'||code==='2b4egt55')?'제3자 후보·만료 의심·실사용 미확인':'제3자 후보·실사용 미확인',
  evidenceHTML:p((code==='낭만보상'||code==='2b4egt55')?'최근 제3자 쿠폰 목록에 노출돼 있지만 만료 의심 신고가 있으며 공식 라운지의 동일 발급 공지를 확인하지 못했습니다. 입력 시도 후보로만 표시합니다.':'최근 제3자 쿠폰 목록에 노출돼 있지만 공식 라운지의 동일 발급 공지와 현재 계정 입력 성공을 확인하지 못했습니다. 활성 공식 쿠폰으로 단정하지 않습니다.'),
  sources:[third('Lv.1 Arcade · 낭만강호 후보 목록',romanticThird,null)]
}));
export const romanticGanghoArticle=make({
  articleKey:'romantic-gangho-codes-202610',title:'낭만강호',english:'Romantic Gangho',storeUrl:romanticStore,iconUrl:romanticIcon,sourceUrl:romanticLounge,references:[romanticStore,romanticLounge,romanticThird],records:romanticRows,type:'ROMANTIC_GANGHO_THIRD_PARTY_CANDIDATES',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="낭만강호 쿠폰 요약"><div class="ncp-feed-stat"><span>최근 후보</span><strong>9개</strong></div><div class="ncp-feed-stat"><span>만료 의심</span><strong>2개</strong></div><div class="ncp-feed-stat"><span>공식 확인</span><strong>미확인</strong></div></div>',
  noticeHTML:'<p>최근 공개 목록에서 9개 문자열을 수집했습니다. 공식 라운지 발급 원문과 계정 입력 성공은 확인하지 못했으며, 이 중 2개는 만료 의심 신고가 있어 별도로 표시합니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>제3자 안내 기준 게임 내 설정의 코드 입력 메뉴에서 등록합니다. 새 공지와 이벤트는 Google Play에 연결된 공식 네이버 게임 라운지를 우선 확인하세요.</p><div><a href="${romanticLounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>확인</h3><p>공식 Google Play 페이지가 해당 네이버 게임 라운지를 최신 소식·이벤트 공식 채널로 직접 안내합니다.</p></section>`,
  archiveHTML:`<p><a href="${romanticStore}" rel="noopener noreferrer">Google Play</a> · <a href="${romanticLounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${romanticThird}" rel="noopener noreferrer">제3자 후보 목록</a></p>`,
  searchDescription:'낭만강호 쿠폰 후보 9개와 만료 의심 신고, 공식 라운지 확인 경로를 분리해 정리했습니다.',
  keywords:['낭만강호 쿠폰','낭만강호 코드','낭만강호 쿠폰 입력','Romantic Gangho coupon','낭만강호 공식 라운지'],hashtags:['#낭만강호','#낭만강호쿠폰','#무협게임','#게임쿠폰'],
  benefits:[]
});

// 용사님 돌았어요?
const herollStore='https://play.google.com/store/apps/details?hl=ko&id=com.percent.aos.rollinghero';
const herollIcon='https://play-lh.googleusercontent.com/gEE3N8y4W2Fh_d0F2r0VUEestoISt8gAB01U5pDpcO71tiQ6_-QCb035I4ozXX50hxtahXweAjk2bVblEulxDg%3Dw240-h480';
const herollHistory='https://apkpure.net/kr/heroll-dice-roguelike/com.percent.aos.rollinghero/versions';
const herollRows=[
  {code:'UPDATE200',sourcePublishedAt:'2026-08-21',latest:false,latestEvidence:'공식 Google Play 최신 기능에 8월 31일까지로 명시되고 버전 이력에서도 동일 문구 확인',expiry:'2026-08-31 KST',statusLabel:'공식 앱 변경이력·종료',evidenceHTML:p('Google Play 공식 최신 기능에 UPDATE200의 종료일이 8월 31일까지로 명시됐고 버전 이력에서도 같은 내용을 확인했습니다. 현재 날짜 기준 종료 코드입니다.'),sources:[official('Google Play · 공식 최신 기능',herollStore,null),third('APKPure · 2.0.2 버전 이력',herollHistory,'2026-08-21')]},
  {code:'HELLOHEROLL',sourcePublishedAt:'2026-07-13',latest:false,latestEvidence:'2026-07-13~08-03 앱 버전 이력에서 사용 가능 쿠폰으로 반복 노출됐으나 이후 최신 기능에서 사라짐',expiry:'현재 공식 상태 미확인',statusLabel:'공식 앱 변경이력·현재 미확인',evidenceHTML:p('7월과 8월 초 앱 변경 이력에서 사용 가능 쿠폰으로 안내됐지만 이후 최신 공식 변경 내용에는 표시되지 않습니다. 현재 사용 가능으로 단정하지 않고 이력으로 보존합니다.'),sources:[third('APKPure · 공식 앱 버전 이력 교차',herollHistory,'2026-07-13')]},
  {code:'WELCOME',sourcePublishedAt:'2026-07-13',latest:false,latestEvidence:'2026-07-13~08-03 앱 버전 이력에서 사용 가능 쿠폰으로 반복 노출됐으나 이후 최신 기능에서 사라짐',expiry:'현재 공식 상태 미확인',statusLabel:'공식 앱 변경이력·현재 미확인',evidenceHTML:p('7월과 8월 초 앱 변경 이력에서 사용 가능 쿠폰으로 안내됐지만 이후 최신 공식 변경 내용에는 표시되지 않습니다. 현재 사용 가능으로 단정하지 않고 이력으로 보존합니다.'),sources:[third('APKPure · 공식 앱 버전 이력 교차',herollHistory,'2026-07-13')]}
];
export const herollArticle=make({
  articleKey:'heroll-codes-202610',title:'용사님 돌았어요?',english:'Heroll',storeUrl:herollStore,iconUrl:herollIcon,sourceUrl:herollStore,references:[herollStore,herollHistory],records:herollRows,type:'HEROLL_OFFICIAL_CHANGELOG_HISTORY',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="용사님 돌았어요 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 공식</span><strong>미확인</strong></div><div class="ncp-feed-stat"><span>종료 확정</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>발급 이력</span><strong>2개</strong></div></div>',
  noticeHTML:'<p>공식 Google Play 최신 기능에서 확인되는 UPDATE200은 2026년 8월 31일 종료됐습니다. HELLOHEROLL과 WELCOME은 과거 앱 변경 이력에 있으나 현재 공식 상태를 확인하지 못했습니다.</p>',
  guideHTML:`<section><h3>확인</h3><p>새 쿠폰은 Google Play의 공식 업데이트 설명과 게임 내 공지를 우선 확인하세요. 종료일이 확인된 코드를 현재 사용 가능 목록으로 올리지 않습니다.</p><div><a href="${herollStore}" rel="noopener noreferrer">Google Play <span>확인 →</span></a></div></section><section><h3>상태</h3><p>현재 공개 공식 설명에서 새 사용 가능 쿠폰은 확인되지 않았습니다.</p></section>`,
  archiveHTML:`<p><a href="${herollStore}" rel="noopener noreferrer">Google Play</a> · <a href="${herollHistory}" rel="noopener noreferrer">버전 이력 교차 자료</a></p>`,
  searchDescription:'용사님 돌았어요? 쿠폰의 공식 앱 변경 이력을 기준으로 UPDATE200 종료와 HELLOHEROLL·WELCOME 현재 미확인 상태를 정리했습니다.',
  keywords:['용사님 돌았어요 쿠폰','용사님 돌았어요 코드','UPDATE200','HELLOHEROLL','WELCOME','Heroll coupon'],hashtags:['#용사님돌았어요','#Heroll','#게임쿠폰','#쿠폰코드'],
  benefits:[]
});

// 소드 오브 콘발라리아
const socStore='https://play.google.com/store/apps/details?hl=ko&id=com.xd.ssrpgkr';
const socIcon='https://play-lh.googleusercontent.com/1ulxCVrsHfg6VgW__2bRz2qELP3c5mCp0J91dUnjU_d3EBcq2zb8tz-3w06qJ3hzQs4kS3LBrtbqD_uLn7YzVQ%3Dw240-h480';
const socOfficial='https://soc.xd.com/kr';
const socCafe='https://cafe.naver.com/swordofconvallaria';
const socKrList='https://www.honeybeejoa.co.kr/bbs/board.php?bo_table=swordofconvallaria&wr_id=1';
const socGlobalTweet='https://x.com/SwordofConva/status/2097610976086659291';
const socGlobalMirror='https://www6.twstalker.com/SwordofConva';
const socGlobalGuide='https://gamewith.net/sword-of-convallaria/68972';
const socKrCodes=[
  ['MOONCAKE2026KR','2026-09-25','추석 코드로 최근 한국 제3자 목록에 노출되나 공식 한국 원문·기한 미확인'],
  ['2YEARSWITHKR','2026-07-31','2주년 코드로 한국 제3자 목록에 유지되나 현재 공식 기한 미확인'],
  ['KR2NDANNIV','2026-07-31','2주년 코드로 한국 제3자 목록에 유지되나 현재 공식 기한 미확인'],
  ['THANKYOU2KR','2026-07-31','2주년 코드로 한국 제3자 목록에 유지되나 현재 공식 기한 미확인'],
  ['elamanKR2026','2026-03-18','한국 제3자 목록에 유지되나 현재 공식 기한·실사용 미확인']
];
const socRows=[
  ...socKrCodes.map(([code,date,evidence])=>({code,sourcePublishedAt:date,latest:true,latestEvidence:evidence,expiry:'미확인',statusLabel:'한국 제3자 후보·현재 실사용 미확인',evidenceHTML:p('한국 쿠폰 추적 페이지에 최근 목록으로 남아 있지만 공식 한국 채널의 동일한 현재 발급 원문과 현재 계정 입력 성공을 확인하지 못했습니다. 후보로만 표시합니다.'),sources:[third('쿠폰몽 · 소드 오브 콘발라리아 한국 코드 목록',socKrList,date)]})),
  {code:'ckwy32t1eeevs',sourcePublishedAt:'2026-09-09',latest:true,latestEvidence:'글로벌 공식 X 계정에서 Hope Luxite 300과 2026-10-14 11:59 UTC-4 종료 시각 공개',expiry:'2026-10-14 11:59 UTC-4',statusLabel:'글로벌 공식·지역 주의',evidenceHTML:p('글로벌 공식 X 계정에서 Hope Luxite 300 보상과 종료 시각을 공개했습니다. 한국 전용 코드라고 확인된 것은 아니므로 글로벌 코드로 분리해 표시합니다.'),sources:[official('Sword of Convallaria 글로벌 공식 X',socGlobalTweet,'2026-09-09'),third('공식 X 미러 교차 확인',socGlobalMirror,'2026-09-09')]}
];
export const swordOfConvallariaArticle=make({
  articleKey:'sword-of-convallaria-codes-202610',title:'소드 오브 콘발라리아',english:'Sword of Convallaria',storeUrl:socStore,iconUrl:socIcon,sourceUrl:socOfficial,references:[socStore,socOfficial,socCafe,socKrList,socGlobalTweet,socGlobalMirror,socGlobalGuide],records:socRows,type:'SWORD_OF_CONVALLARIA_KR_GLOBAL_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="소드 오브 콘발라리아 쿠폰 요약"><div class="ncp-feed-stat"><span>한국 후보</span><strong>5개</strong></div><div class="ncp-feed-stat"><span>글로벌 공식</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>최근 종료</span><strong>10/14</strong></div></div>',
  noticeHTML:'<p>한국 코드 5개는 최근 제3자 목록에서 확인되지만 공식 한국 원문과 현재 실사용이 미확인입니다. 글로벌 공식 코드 ckwy32t1eeevs는 2026년 10월 14일 11:59(UTC-4)까지로 별도 구분합니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>메인 화면 왼쪽 위 메뉴 → 설정 → 계정 → 시리얼 코드 교환에서 입력하고 게임 내 우편함에서 보상을 확인하는 방식입니다.</p><div><a href="${socOfficial}" rel="noopener noreferrer">공식 홈페이지 <span>확인 →</span></a></div></section><section><h3>지역</h3><p>한국 전용 후보와 글로벌 공식 코드를 같은 서버용으로 단정하지 않습니다. 코드별 지역·계정 적용 여부를 확인한 뒤 시도하세요.</p></section>`,
  archiveHTML:`<p><a href="${socStore}" rel="noopener noreferrer">Google Play</a> · <a href="${socOfficial}" rel="noopener noreferrer">공식 홈페이지</a> · <a href="${socCafe}" rel="noopener noreferrer">공식 카페</a> · <a href="${socGlobalGuide}" rel="noopener noreferrer">글로벌 입력 방법 교차 자료</a></p>`,
  searchDescription:'소드 오브 콘발라리아 한국 쿠폰 후보와 글로벌 공식 코드의 지역·기한을 분리해 정리했습니다.',
  keywords:['소드 오브 콘발라리아 쿠폰','소드 오브 콘발라리아 코드','Sword of Convallaria code','MOONCAKE2026KR','ckwy32t1eeevs','콘발라리아 쿠폰'],hashtags:['#소드오브콘발라리아','#콘발라리아쿠폰','#SwordOfConvallaria','#게임쿠폰'],
  benefits:[{type:'EVENT_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'2주년 버전 기간 한정 보상 이벤트',method:'게임 내 2주년 이벤트 참여',sourceUrl:socStore,sourcePublishedAt:null,expiry:null}]
});

// 트리 오브 세이비어M
const tosmStore='https://play.google.com/store/apps/details?hl=ko&id=com.imc.mtos';
const tosmIcon='https://play-lh.googleusercontent.com/G5SRVw9P7OplrV80yeSDXlsQy38Zz6em1rAXMfX2s-x0mXQ52mtY-psABzLj9yj_tND2LB99FNdnwUlnB3Wbpdo%3Dw240-h480';
const tosmLounge='https://game.naver.com/lounge/tosm/home';
const tosmAutumn='https://www.inven.co.kr/webzine/news/?iskin=paintheroes&news=320985&searchwhere=writer';
const tosmSummer='https://www.inven.co.kr/webzine/news/?hashtag=%ED%8A%B8%EB%A6%AC%EC%98%A4%EB%B8%8C%EC%84%B8%EC%9D%B4%EB%B9%84%EC%96%B4m&iskin=tera&news=318009';
const tosmRows=[
  {code:'GOLDENSEASON',sourcePublishedAt:'2026-09-16',latest:true,latestEvidence:'IMC게임즈 발표를 인벤이 보도하며 모든 이용자에게 제공된다고 확인, 공식 종료일·현재 계정 실사용은 미확인',expiry:'공식 기한 미표기',statusLabel:'IMC게임즈 발표·현재 실사용 미확인',evidenceHTML:p('IMC게임즈가 가을 시즌 서버 오픈과 함께 모든 이용자에게 제공한다고 밝힌 쿠폰입니다. 보도 원문에는 정확한 종료일이 없어 수집일을 만료일로 대체하지 않았습니다.'),sources:[third('인벤 · IMC게임즈 가을 시즌 발표',tosmAutumn,'2026-09-16')]},
  {code:'SUMMER2026',sourcePublishedAt:'2026-07-01',latest:false,latestEvidence:'IMC게임즈 여름 시즌 서버 발표 당시 지급된 이전 시즌 코드',expiry:'이전 여름 시즌·정확한 코드 기한 미확인',statusLabel:'이전 시즌 발급 이력·현재 미확인',evidenceHTML:p('2026년 7월 여름 시즌 서버 오픈 때 공개된 코드입니다. 이후 가을 시즌 코드가 별도로 발급됐으므로 최신 목록과 분리하되 정확한 종료 시각을 임의로 만들지 않습니다.'),sources:[third('인벤 · IMC게임즈 여름 시즌 발표',tosmSummer,'2026-07-01')]}
];
export const treeOfSaviorMArticle=make({
  articleKey:'tree-of-savior-m-codes-202610',title:'트리 오브 세이비어M',english:'Tree of Savior M',storeUrl:tosmStore,iconUrl:tosmIcon,sourceUrl:tosmAutumn,references:[tosmStore,tosmLounge,tosmAutumn,tosmSummer],records:tosmRows,type:'TREE_OF_SAVIOR_M_OFFICIAL_PRESS_CODES',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="트리 오브 세이비어M 쿠폰 요약"><div class="ncp-feed-stat"><span>가을 코드</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>이전 시즌</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>공식 기한</span><strong>미표기</strong></div></div>',
  noticeHTML:'<p>가을 시즌 서버 오픈과 함께 IMC게임즈가 모든 이용자에게 GOLDENSEASON을 제공한다고 밝혔습니다. 정확한 종료일과 현재 계정 입력 성공은 공개 근거에서 확인하지 못해 별도로 표시합니다.</p>',
  guideHTML:`<section><h3>입력</h3><p>게임 내 옵션/설정의 계정 메뉴에서 쿠폰 입력 항목을 이용하는 방식입니다. 최신 공지와 시즌 이벤트는 공식 라운지와 IMC게임즈 발표를 함께 확인하세요.</p><div><a href="${tosmLounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>가을 혜택</h3><p>가을 시즌 서버는 최대 330회 무료 영입, 경험치 2배, 강화 비용 50% 할인, 던전 무료 입장 횟수 추가를 제공합니다. 복사형 쿠폰과 별개인 시즌 혜택입니다.</p></section>`,
  archiveHTML:`<p><a href="${tosmStore}" rel="noopener noreferrer">Google Play</a> · <a href="${tosmLounge}" rel="noopener noreferrer">공식 라운지</a> · <a href="${tosmAutumn}" rel="noopener noreferrer">가을 시즌 발표</a> · <a href="${tosmSummer}" rel="noopener noreferrer">여름 시즌 이력</a></p>`,
  searchDescription:'트리 오브 세이비어M 가을 쿠폰 GOLDENSEASON과 이전 SUMMER2026, 시즌 서버 혜택을 구분해 정리했습니다.',
  keywords:['트리 오브 세이비어M 쿠폰','트오세M 쿠폰','GOLDENSEASON','SUMMER2026','Tree of Savior M coupon','트리오브세이비어M 코드'],hashtags:['#트리오브세이비어M','#트오세M','#GOLDENSEASON','#게임쿠폰'],
  benefits:[{type:'EVENT_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'최대 330회 무료 영입·경험치 2배·강화 비용 50% 할인·던전 무료 입장 추가',method:'가을 시즌 서버 및 이벤트 참여',sourceUrl:tosmAutumn,sourcePublishedAt:'2026-09-16',expiry:null}]
});
