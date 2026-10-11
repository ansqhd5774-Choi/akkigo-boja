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

// 집행검 클래식
const executionerStore='https://play.google.com/store/apps/details?hl=ko&id=playuc.net.executioner';
const executionerIcon='https://play-lh.googleusercontent.com/lwgt5Pm-q-4OI0d09v6AVTNXvKkoVGPiivrEUBgq5cr6fwaVWNbAhvrObQsyAOaWr7RKLK-p3bPzTE-92_7u%3Dw240-h480';
const executionerLounge='https://game.naver.com/lounge/executionsword/home';
const executionerThird='https://www.linegames.org/en/%EC%A7%91%ED%96%89%EA%B2%80-%ED%81%B4%EB%9E%98%EC%8B%9D-codes/';
const executionerPre='https://mobiletoday.tistory.com/11?category=1359533';
const executionerCodes=['x5Htj5ySQikO','hP2zAc6olDoY','eWW56TeudeJL','bGzW0VKeIEtR','zzL5GWz1Lovk','shsMqsFpWq1T','usezBT02iKgM','5YLRZIylVzq6','QDvuc5tAOJdB','b1QjW0cDHGeI'];
export const executionerSwordClassicArticle=make({
  articleKey:'executioner-sword-classic-codes-202610',title:'집행검 클래식',english:'Executioner Sword Classic',storeUrl:executionerStore,iconUrl:executionerIcon,sourceUrl:executionerLounge,references:[executionerStore,executionerLounge,executionerThird,executionerPre],type:'EXECUTIONER_SWORD_CLASSIC_CROSSCHECK',
  records:executionerCodes.map(code=>({code,sourcePublishedAt:null,latest:true,latestEvidence:'제3자 목록에서 최근 후보로 노출되지만 공식 발급 원문과 계정 입력 성공을 확인하지 못함',expiry:'미확인',statusLabel:'제3자 후보·실사용 미확인',evidenceHTML:p('일회성·선착순 성격으로 소개된 문자열입니다. 공식 네이버 게임 라운지와 Google Play에서 동일한 공개 코드를 확인하지 못해 활성 쿠폰으로 단정하지 않습니다.'),sources:[third('LINEGames · 집행검 클래식 후보 목록',executionerThird,null)]})),
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="집행검 클래식 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>후보</span><strong>10개</strong></div><div class="ncp-feed-stat"><span>상태</span><strong>미확인</strong></div></div>',
  noticeHTML:'<p>공식 고정 쿠폰 문자열은 확인되지 않았습니다. 제3자에서 수집된 10개 문자열은 삭제하지 않고 후보로 보존하되, 공식 발급·실사용 확인 전에는 사용 가능으로 표시하지 않습니다.</p>',
  guideHTML:`<section><h3>쿠폰 확인</h3><p>공식 공지와 이벤트는 네이버 게임 라운지에서 우선 확인할 수 있습니다. 후보 문자열은 계정·서버·선착순 조건에 따라 이미 사용됐을 수 있습니다.</p><div><a href="${executionerLounge}" rel="noopener noreferrer">공식 라운지 <span>확인 →</span></a></div></section><section><h3>과거 혜택</h3><p>출시 전 사전예약 감사쿠폰 지급 안내가 있었지만 공개 고정 문자열은 확인되지 않았고 현재 획득 단계는 종료된 기록으로 분리했습니다.</p></section>`,
  archiveHTML:`<p><a href="${executionerStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${executionerLounge}" rel="noopener noreferrer">공식 네이버 게임 라운지</a> · <a href="${executionerThird}" rel="noopener noreferrer">제3자 후보 목록</a></p>`,
  searchDescription:'집행검 클래식 쿠폰 후보와 공식 공지 경로를 정리했습니다. 제3자 일회성 후보는 공식 발급·실사용 확인 여부를 구분해 표시합니다.',
  keywords:['집행검 클래식 쿠폰','집행검 클래식 코드','집행검 클래식 쿠폰 입력','Executioner Sword Classic code','집행검 클래식 이벤트'],hashtags:['#집행검클래식','#집행검클래식쿠폰','#게임쿠폰','#쿠폰코드'],
  benefits:[{type:'PRE_REGISTRATION',authority:'THIRD_PARTY_REPORT',status:'EXPIRED',benefit:'사전예약 감사쿠폰 지급 안내',method:'사전예약 참여자 대상 지급',sourceUrl:executionerPre,sourcePublishedAt:'2026-08-19',expiry:null}]
});

// MAJO
const majoStore='https://play.google.com/store/apps/details?hl=ko&id=com.darkwind.majo';
const majoIcon='https://play-lh.googleusercontent.com/eMf9zaHmPPz-7fQ-7Vd2ZJ_w7URtPPGQ0ZW_GdBAVPRGLPI7CmdUzPUDv-K6A2QIh60sro60wrWSahWhxphXsg%3Dw240-h480';
const majoFacebook='https://www.facebook.com/majorstudio';
const majoDc='https://gall.dcinside.com/mgallery/board/view/?id=majo&no=243';
const majoEdu='https://game.edu.kg/ko/majo---%EC%95%84%ED%8F%AC%EC%B9%BC%EB%A6%BD%EC%8A%A4-%EB%A7%88%EB%85%80-%ED%83%9D%ED%8B%B1%EC%8A%A4-rpg/%EC%BF%A0%ED%8F%B0/';
const majoTikTok='https://insight97804.tistory.com/20';
const majoRows=[
  {code:'MAJO6SRJH',sourcePublishedAt:'2026-09-11',latest:true,latestEvidence:'MAJO 커뮤니티에서 100만 다운로드 기념 쿠폰으로 보고',expiry:'미확인',statusLabel:'커뮤니티 후보·실사용 미확인',evidenceHTML:p('커뮤니티 게시물에서 100만 다운로드 기념 쿠폰으로 공유됐지만 공식 Facebook·Google Play에서 동일 코드의 발급 공지를 확인하지 못했습니다.'),sources:[third('DCInside MAJO 갤러리 · 100만 다운기념 쿠폰',majoDc,'2026-09-11')]},
  ...['GAMEEDU','WELCOME','VIP111','VIP333','VIP555','VIP666','VIP2024','DCGIFT'].map(code=>({code,sourcePublishedAt:null,latest:true,latestEvidence:'제3자 쿠폰 페이지 후보',expiry:'미확인',statusLabel:'제3자 후보·실사용 미확인',evidenceHTML:p('제3자 페이지에 노출된 문자열입니다. 범용 문자열이라는 이유만으로 제거하지 않았지만 MAJO 공식 발급 근거와 현재 실사용 성공은 확인되지 않았습니다.'),sources:[third('GameEDU · MAJO 후보 목록',majoEdu,null)]}))
];
export const majoArticle=make({
  articleKey:'majo-codes-202610',title:'MAJO',english:'MAJO Apocalypse Tactics RPG',storeUrl:majoStore,iconUrl:majoIcon,sourceUrl:majoStore,references:[majoStore,majoFacebook,majoDc,majoEdu,majoTikTok],records:majoRows,type:'MAJO_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="MAJO 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 코드</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>후보</span><strong>9개</strong></div><div class="ncp-feed-stat"><span>공식 혜택</span><strong>접속 보상</strong></div></div>',
  noticeHTML:'<p>현재 공식 고정 코드 발급 원문은 찾지 못했습니다. 커뮤니티 1개와 제3자 범용 문자열 8개를 모두 미확인 후보로 분리했습니다.</p>',
  guideHTML:`<section><h3>공식 무료 혜택</h3><p>Google Play 공식 설명은 접속 시 연속 뽑기 보상과 공식 팬페이지 이벤트 보상을 안내합니다. 복사 코드가 아닌 게임 내 혜택으로 분리했습니다.</p><div><a href="${majoStore}" rel="noopener noreferrer">공식 앱 <span>확인 →</span></a></div></section><section><h3>종료 기록</h3><p>MAJO × TikTok Lite 1+1 쿠폰 이벤트는 제3자 안내 기준 2026년 9월 30일 종료된 기록으로 현재 혜택에서 제외했습니다.</p></section>`,
  archiveHTML:`<p><a href="${majoStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${majoFacebook}" rel="noopener noreferrer">공식 팬페이지</a> · <a href="${majoDc}" rel="noopener noreferrer">커뮤니티 후보</a> · <a href="${majoEdu}" rel="noopener noreferrer">제3자 후보 목록</a></p>`,
  searchDescription:'MAJO 쿠폰 후보와 공식 무료 보상을 정리했습니다. 100만 다운로드 기념 커뮤니티 코드와 범용 후보는 실사용 미확인 상태로 구분합니다.',
  keywords:['MAJO 쿠폰','MAJO 코드','MAJO 아포칼립스 쿠폰','MAJO6SRJH','MAJO gift code','MAJO 쿠폰 입력'],hashtags:['#MAJO','#MAJO쿠폰','#아포칼립스택틱스RPG','#게임쿠폰'],
  benefits:[{type:'IN_GAME_EVENT',authority:'OFFICIAL',status:'ACTIVE',benefit:'접속 시 연속 뽑기 보상',method:'게임 접속',sourceUrl:majoStore,sourcePublishedAt:null,expiry:null},{type:'SOCIAL_EVENT',authority:'OFFICIAL',status:'ACTIVE',benefit:'공식 팬페이지 이벤트 게임 아이템 보상',method:'공식 팬페이지 이벤트 참여',sourceUrl:majoStore,sourcePublishedAt:null,expiry:null},{type:'PARTNER_EVENT',authority:'THIRD_PARTY_REPORT',status:'EXPIRED',benefit:'MAJO × TikTok Lite 1+1 쿠폰 이벤트',method:'TikTok Lite 제휴 이벤트',sourceUrl:majoTikTok,sourcePublishedAt:'2026-08-26',expiry:'2026-09-30'}]
});

// 검은사막 모바일
const bdmStore='https://play.google.com/store/apps/details?hl=ko&id=com.pearlabyss.blackdesertm';
const bdmIcon='https://play-lh.googleusercontent.com/AwhfItIkcKl_5-hR0W3NdE-J-uH8l2hi6eKiJznN2M6u0Wn6URDmtUJfJrZScZiwnqoAPK9LawVWlz7xO2G6%3Dw240-h480';
const heidel='https://forum.blackdesertm.com/Board/Detail?boardNo=6&contentNo=659173';
const devCommentary='https://forum.blackdesertm.com/Board/Detail?boardNo=6&contentNo=659188&pageNo=1';
const crimson='https://forum.blackdesertm.com/Board/Detail?boardNo=6&contentNo=640911';
const bdmExpiry='2026-10-27 업데이트 점검 전';
const bdmRows=[
  ['PRESENTFROMGM','아침의 나라 하사품 500·검은 태양의 성배 500·빛의 성수 20,000',heidel,'2026-07-11',bdmExpiry],
  ['THANKS4FEEDBACK','클래스 변경 선택 상자 2·정제수/유자차/시계태엽 선택 상자 3 등',heidel,'2026-07-11',bdmExpiry],
  ['FORYOURGROWTH','태양의 결정 50,000·공허의 숨결 1,000·협동 토벌대 입장권 10 등',heidel,'2026-07-11',bdmExpiry],
  ['PLAYEASIER','질서 두루마리 상자·여신의 눈물·검은사당 입장권 등',heidel,'2026-07-11',bdmExpiry],
  ['HEIDEL2026','W의 가호 3·블랙펄 5,000·돌파 복구권 400,000·행운상점 10회권 30',heidel,'2026-07-11',bdmExpiry],
  ['DEVCOMMENTARY26','돌파 복구권 100,000·오기에르의 가호 2·기술 비전 파편 2,000 등',devCommentary,'2026-07-11',bdmExpiry],
  ['CRIMSONXBDM','환상마 선택 상자 1·돌파 복구권 200,000·가호빛/안개결정 선택 상자 1',crimson,null,'2026-10-15 23:59']
].map(([code,reward,url,date,expiry])=>({code,sourcePublishedAt:date,latest:true,latestEvidence:'검은사막 모바일 공식 포럼에서 코드·보상·사용기한을 직접 안내',expiry,statusLabel:'공식·현재',evidenceHTML:p(`보상: ${reward}. 공식 안내 기준 가문당 1회 사용하며 우편함 수령 보상은 수령 기한을 별도로 확인해야 합니다.`),sources:[official('검은사막 모바일 공식 포럼',url,date)]}));
export const blackDesertMobileArticle=make({
  articleKey:'black-desert-mobile-codes-202610',title:'검은사막 모바일',english:'Black Desert Mobile',storeUrl:bdmStore,iconUrl:bdmIcon,sourceUrl:heidel,references:[bdmStore,heidel,devCommentary,crimson],records:bdmRows,type:'BLACK_DESERT_MOBILE_OFFICIAL',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="검은사막 모바일 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 현재</span><strong>7개</strong></div><div class="ncp-feed-stat"><span>가장 빠른 마감</span><strong>10월 15일</strong></div><div class="ncp-feed-stat"><span>주요 마감</span><strong>10월 27일</strong></div></div>',
  noticeHTML:'<p>PC 검은사막 쿠폰과 혼합하지 않고 검은사막 모바일 공식 포럼에서 확인한 코드만 현재 공식 목록에 넣었습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력</h3><p>Android·PC는 게임 설정의 쿠폰 사용 경로를 이용할 수 있고, 공식 쿠폰 페이지에서도 가문 계정에 등록할 수 있습니다. 각 쿠폰은 가문당 1회 기준입니다.</p><div><a href="${heidel}" rel="noopener noreferrer">공식 쿠폰 안내 <span>확인 →</span></a></div></section><section><h3>기한 주의</h3><p>CRIMSONXBDM은 10월 15일 23:59가 먼저 마감되고, 하이델 연회·개발자 코멘터리 쿠폰은 10월 27일 업데이트 점검 전까지입니다.</p></section>`,
  archiveHTML:`<p><a href="${bdmStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${heidel}" rel="noopener noreferrer">2026 하이델 연회 총정리</a> · <a href="${devCommentary}" rel="noopener noreferrer">리마스터 개발자 코멘터리</a> · <a href="${crimson}" rel="noopener noreferrer">CRIMSONXBDM 공식 기록</a></p>`,
  searchDescription:'검은사막 모바일 2026년 10월 공식 쿠폰 7개와 보상·만료일·입력 방법을 공식 포럼 기준으로 정리했습니다.',
  keywords:['검은사막 모바일 쿠폰','검은사막M 쿠폰','검은사막 모바일 쿠폰 입력','HEIDEL2026','DEVCOMMENTARY26','CRIMSONXBDM'],hashtags:['#검은사막모바일','#검은사막M','#검은사막모바일쿠폰','#게임쿠폰'],
  benefits:bdmRows.map(row=>({type:'GAME_REDEEM',authority:'OFFICIAL',status:'ACTIVE',benefit:`${row.code} 공식 쿠폰`,method:'게임 내 설정 또는 공식 쿠폰 페이지',sourceUrl:row.sources[0].url,sourcePublishedAt:row.sourcePublishedAt,expiry:row.expiry}))
});

// 좀비 웨이브스
const zwStore='https://play.google.com/store/apps/details?hl=en&id=com.ddup.zombiewaves.zw';
const zwIcon='https://play-lh.googleusercontent.com/Vwe73CgnLodZByqlsifIdun2GtUQ5VicwCmsw1PCe-IGEueAMmm9YIo8Z8omKilIzKoV6agZjEMijNonPH-t%3Dw240-h480';
const zwOfficial='https://game-zw.funformulagames.com';
const zwFacebook='https://www.facebook.com/ZombieWavesGame';
const zwCodex='https://zwcodex.com/en/codes';
const zwAxee='https://axeetech.com/zombie-waves-bundle-codes/';
const zwVoyant='https://gamevoyant.com/codes/zombie-waves-codes';
const zwCandidateCodes=['zwdarktide','SUPER2026BUNDLE','Rusawake','jingle25bellzw','zw25candy','ZWgood','ZWfun','SJFKTBXD','DYZBZS','DYZB666','DYZB888','VIP666','VIP777','VIP888','VIP999'];
const zwRows=zwCandidateCodes.map(code=>({code,sourcePublishedAt:code==='SUPER2026BUNDLE'||code==='Rusawake'?'2026-10-06':null,latest:true,latestEvidence:'복수 제3자 코드 목록에서 현재 후보로 보고되지만 공식 개발사 발급 원문을 확인하지 못함',expiry:code==='zwdarktide'?'2026-11-30':'미확인',statusLabel:'제3자 후보·실사용 미확인',evidenceHTML:p(code==='SUPER2026BUNDLE'?'제3자 자료 사이에 대소문자 표기가 엇갈려 AxeeTech의 원문 표기 SUPER2026BUNDLE을 보존했습니다. 공식 발급·실사용은 미확인입니다.':'현재 후보로 보고된 문자열입니다. 공식 Facebook·게임 홈페이지에서 동일 코드 발급 원문을 확인하지 못해 활성 공식 코드로 승격하지 않았습니다.'),sources:[code==='zwdarktide'?third('ZW Codex · Zombie Waves codes',zwCodex,null):third('AxeeTech · Zombie Waves Bundle Codes',zwAxee,code==='SUPER2026BUNDLE'||code==='Rusawake'?'2026-10-06':null),third('GameVoyant · Zombie Waves codes',zwVoyant,'2026-10-02')]}));
for(const code of ['ZWPLAY26','GOLDEN26ZW','ZWGO26','ZWFUN26','ZWHAPPY26','MIDAUT26ZW'])zwRows.push({code,sourcePublishedAt:null,expiry:'2026-10-04 전후 종료 보고',statusLabel:'종료 보고·제3자',evidenceHTML:p('9월 프로모션 계열 코드로 제3자 추적 자료에서 10월 초 종료로 보고돼 현재 후보와 분리했습니다.'),sources:[third('ZW Codex · 종료 이력',zwCodex,null)]});
export const zombieWavesArticle=make({
  articleKey:'zombie-waves-codes-202610',title:'좀비 웨이브스',english:'Zombie Waves',storeUrl:zwStore,iconUrl:zwIcon,sourceUrl:zwStore,references:[zwStore,zwOfficial,zwFacebook,zwCodex,zwAxee,zwVoyant],records:zwRows,type:'ZOMBIE_WAVES_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="좀비 웨이브스 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>현재 후보</span><strong>15개</strong></div><div class="ncp-feed-stat"><span>종료 기록</span><strong>6개</strong></div></div>',
  noticeHTML:'<p>개발사 공식 홈페이지·Facebook과 제3자 코드 목록을 대조했습니다. 현재 공개 문자열은 공식 발급 원문을 확보하지 못해 모두 미확인 후보로 유지합니다.</p>',
  guideHTML:`<section><h3>입력 경로</h3><p>제3자 가이드는 Profile → Bundle Code에서 코드를 입력하고 Exchange로 교환하는 경로를 공통으로 안내합니다. 메뉴 명칭은 버전에 따라 달라질 수 있습니다.</p><div><a href="${zwOfficial}" rel="noopener noreferrer">공식 홈페이지 <span>확인 →</span></a></div></section><section><h3>후보 상태</h3><p>zwdarktide는 제3자 추적 기준 11월 30일까지로 표시되지만 공식 발급 원문이 없어 공식 현재 코드로 표시하지 않았습니다.</p></section>`,
  archiveHTML:`<p><a href="${zwStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${zwOfficial}" rel="noopener noreferrer">공식 홈페이지</a> · <a href="${zwFacebook}" rel="noopener noreferrer">공식 Facebook</a> · <a href="${zwCodex}" rel="noopener noreferrer">제3자 코드 추적</a></p>`,
  searchDescription:'좀비 웨이브스 Zombie Waves 쿠폰 후보와 종료 코드를 공식 채널·제3자 목록을 대조해 정리했습니다. 공식 발급 미확인 코드는 후보로 표시합니다.',
  keywords:['좀비 웨이브스 쿠폰','Zombie Waves codes','Zombie Waves bundle code','좀비 웨이브스 코드','zwdarktide','SUPER2026BUNDLE'],hashtags:['#좀비웨이브스','#ZombieWaves','#게임쿠폰','#BundleCode'],
  benefits:[]
});

// 로그 레전드
const rogueStore='https://play.google.com/store/apps/details?hl=ko&id=com.pockethaven.roguelegend';
const rogueIcon='https://play-lh.googleusercontent.com/TJ2J_Xl-hXJ-067S_bG981LQgc1DbRAR3dCLATZ_ovXtB_Pj3yhxB2peGFMj2oD-iay-RxH0JKoT2ILjcPtT3aU%3Dw240-h480';
const rogueOfficial='https://roguelegend.io/';
const rogueMr='https://www.mrguider.org/roblox/rogue-legend-codes/';
const rogueGuide='https://www.aayyy.com/rogue-legend/how-to-redeem-codes/';
const rogueRewards={GET888:'보상 상세 미확인',Rogue2026:'젬 1,000 보고',EMBERIN:'유닛 1개 보고',Gem100:'젬 1,000 보고',HAMMER:'Crystal Hammer Lv.1 보고'};
const rogueRows=Object.entries(rogueRewards).map(([code,reward])=>({code,sourcePublishedAt:'2026-09-16',latest:true,latestEvidence:'제3자 코드 가이드가 2026-10-01 업데이트에서 working으로 보고',expiry:'미확인',statusLabel:'제3자 후보·실사용 미확인',evidenceHTML:p(`${reward}. 공식 Rogue Legend 사이트에서 동일 코드의 발급 공지를 확인하지 못해 현재 공식 코드로 단정하지 않습니다.`),sources:[third('MrGuider · Rogue Legend Codes',rogueMr,'2026-09-16')]}));
export const rogueLegendArticle=make({
  articleKey:'rogue-legend-codes-202610',title:'로그 레전드',english:'Rogue Legend',storeUrl:rogueStore,iconUrl:rogueIcon,sourceUrl:rogueOfficial,references:[rogueStore,rogueOfficial,rogueMr,rogueGuide],records:rogueRows,type:'ROGUE_LEGEND_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="로그 레전드 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 코드</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>후보</span><strong>5개</strong></div><div class="ncp-feed-stat"><span>공식 혜택</span><strong>일일 보상</strong></div></div>',
  noticeHTML:'<p>제3자에서 현재로 보고한 5개 고정 문자열을 보존했습니다. 공식 사이트에는 동일 코드 발급 공지가 확인되지 않아 모두 미확인 후보입니다.</p>',
  guideHTML:`<section><h3>코드 입력</h3><p>제3자 가이드는 Settings의 Gift Code 또는 Redeem 메뉴를 안내합니다. 게임 버전에 따라 메뉴 표기가 달라질 수 있습니다.</p><div><a href="${rogueOfficial}" rel="noopener noreferrer">공식 사이트 <span>확인 →</span></a></div></section><section><h3>코드 외 혜택</h3><p>공식 사이트에는 계정 연동형 Daily Reward Claim이 별도로 제공됩니다. 복사형 쿠폰과 다른 공식 무료 혜택으로 분리했습니다.</p></section>`,
  archiveHTML:`<p><a href="${rogueStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${rogueOfficial}" rel="noopener noreferrer">Rogue Legend 공식 사이트</a> · <a href="${rogueMr}" rel="noopener noreferrer">제3자 코드 목록</a></p>`,
  searchDescription:'로그 레전드 Rogue Legend 쿠폰 후보 5개와 공식 일일 보상을 정리했습니다. 공식 발급이 확인되지 않은 문자열은 미확인 후보로 구분합니다.',
  keywords:['로그 레전드 쿠폰','Rogue Legend codes','Rogue2026','GET888','Gem100','Rogue Legend redeem code'],hashtags:['#로그레전드','#RogueLegend','#게임쿠폰','#RedeemCode'],
  benefits:[{type:'DAILY_REWARD',authority:'OFFICIAL',status:'ACTIVE',benefit:'Daily Reward',method:'공식 사이트에서 게임 계정 로그인 후 Claim',sourceUrl:rogueOfficial,sourcePublishedAt:null,expiry:null}]
});

// 아이온2
const aionStore='https://play.google.com/store/apps/details?hl=ko&id=com.ncsoft.aion2';
const aionIcon='https://play-lh.googleusercontent.com/aqqsbPuYk-dU9f0qnyEkHje_IIchFrOhDQfDXozQbD5_n_Hxi18ja4GyEbNYuFD9inoFBUYfZFWK4zSOjsy8Aw%3Dw240-h480';
const aionOfficial='https://aion2.plaync.com';
const aionChuseok='https://lounge.plaync.com/feed/81860';
const aionCoupon='https://nshop.plaync.com/shop/aion2/coupon';
const aionOld='https://about.ncsoft.com/news/article/aion2_update_260223';
const aionChapter='https://aion2.plaync.com/ko-kr/conts/260614_update';
const aionRows=[
  {code:'HAPPYCHUSEOKAION2',sourcePublishedAt:'2026-09-22',latest:true,latestEvidence:'AION2 공식 PURPLE 라운지가 추석 감사 쿠폰과 사용 기간을 직접 공지',expiry:'2026-10-14 정기점검 전',statusLabel:'공식·현재',evidenceHTML:p('전 서버 계정당 1회. 전투 강화 주문서, 오드 에너지, 상급 영혼석, 성장 상자, 던전 입장권, 부활석, 외형 상자, 소울북·물약 등 20종 보상을 안내합니다.'),sources:[official('AION2 공식 PURPLE 라운지 · 추석 감사 쿠폰',aionChuseok,'2026-09-22')]},
  {code:'AION2DAYS100',sourcePublishedAt:'2026-02-23',expiry:'종료',statusLabel:'공식 과거·종료',evidenceHTML:p('서비스 100일 기념 공식 쿠폰 기록입니다. 현재 10월 쿠폰 목록에서는 종료 이력으로만 보존합니다.'),sources:[official('NCSOFT 공식 · AION2 100일 업데이트',aionOld,'2026-02-23')]},
  {code:'WELCOMEBACK',sourcePublishedAt:'2026-02-23',expiry:'종료',statusLabel:'공식 과거·종료',evidenceHTML:p('복귀 이용자 대상 공식 쿠폰 기록입니다. 현재 사용 가능 근거가 없어 종료 이력으로 분리합니다.'),sources:[official('NCSOFT 공식 · AION2 100일 업데이트',aionOld,'2026-02-23')]},
  {code:'AION2CHAPTERONE',sourcePublishedAt:null,expiry:'종료',statusLabel:'공식 과거·종료',evidenceHTML:p('Chapter 1 업데이트 시기 공식 프로모션 코드 기록으로 현재 사용 가능 근거가 없어 과거 이력으로 분리합니다.'),sources:[official('AION2 공식 · Chapter 1 업데이트',aionChapter,null)]}
];
export const aion2Article=make({
  articleKey:'aion2-codes-202610',title:'아이온2',english:'AION2',storeUrl:aionStore,iconUrl:aionIcon,sourceUrl:aionChuseok,references:[aionStore,aionOfficial,aionChuseok,aionCoupon,aionOld,aionChapter],records:aionRows,type:'AION2_OFFICIAL_CROSSCHECK',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="아이온2 쿠폰 요약"><div class="ncp-feed-stat"><span>공식 현재</span><strong>1개</strong></div><div class="ncp-feed-stat"><span>마감</span><strong>10월 14일</strong></div><div class="ncp-feed-stat"><span>과거 공식</span><strong>3개</strong></div></div>',
  noticeHTML:'<p>현재 공식 PURPLE 라운지에서 확인되는 추석 감사 쿠폰을 최우선으로 표시하고, 과거 공식 쿠폰은 현재 목록과 분리했습니다. 출처 불명의 가상 문자열은 넣지 않았습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력</h3><p>게임에서는 환경 설정 → 기타 → 계정 → 쿠폰 등록 경로를 이용하거나 공식 쿠폰 페이지에서 등록할 수 있습니다. HAPPYCHUSEOKAION2는 모든 서버에서 계정당 1회 사용할 수 있습니다.</p><div><a href="${aionCoupon}" rel="noopener noreferrer">공식 쿠폰 등록 <span>이동 →</span></a></div></section><section><h3>사용 기한</h3><p>추석 감사 쿠폰은 2026년 10월 14일 정기점검 전까지입니다. 점검 시작 시각은 운영 공지 기준으로 확인해야 합니다.</p></section>`,
  archiveHTML:`<p><a href="${aionStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${aionChuseok}" rel="noopener noreferrer">추석 감사 쿠폰 공식 공지</a> · <a href="${aionCoupon}" rel="noopener noreferrer">공식 쿠폰 등록</a> · <a href="${aionOld}" rel="noopener noreferrer">100일 공식 기록</a></p>`,
  searchDescription:'아이온2 2026년 10월 공식 쿠폰 HAPPYCHUSEOKAION2의 보상·사용기한·입력 방법과 과거 공식 쿠폰을 구분해 정리했습니다.',
  keywords:['아이온2 쿠폰','AION2 coupon','HAPPYCHUSEOKAION2','아이온2 쿠폰 입력','아이온2 추석 쿠폰'],hashtags:['#아이온2','#AION2','#아이온2쿠폰','#게임쿠폰'],
  benefits:[{type:'GAME_REDEEM',authority:'OFFICIAL',status:'ACTIVE',benefit:'HAPPYCHUSEOKAION2 추석 감사 쿠폰',method:'게임 내 쿠폰 등록 또는 공식 쿠폰 페이지',sourceUrl:aionChuseok,sourcePublishedAt:'2026-09-22',expiry:'2026-10-14 정기점검 전'}]
});
