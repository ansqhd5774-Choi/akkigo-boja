import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const articleKey='dark-angel-angel-descent-codes-202610';
const GAME='다크엔젤: 천사 강림';

const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.ulugame.ylnskr.google';
const oneStore='https://m.onestore.co.kr/v2/ko-kr/app/0001008326';
const operatorPolicy='https://policy.ulugame.com/kr.html';
const gameedu='https://game.edu.kg/ko/%EB%8B%A4%ED%81%AC%EC%97%94%EC%A0%A4%3A-%EC%B2%9C%EC%82%AC-%EA%B0%95%EB%A6%BC/%EC%BF%A0%ED%8F%B0/';
const thirdPartyPromo1='https://gameover88.tistory.com/entry/%EB%8B%A4%ED%81%AC%EC%97%94%EC%A0%A4%EC%B2%9C%EC%82%AC-%EA%B0%95%EB%A6%BC-%EC%BF%A0%ED%8F%B0-%EC%A0%95%EC%8B%9D%EC%B6%9C%EC%8B%9C-%EC%BF%A0%ED%8F%B0%EA%B3%B5%EB%9E%B5-%EC%98%A4%ED%94%88%EA%B8%B0%EB%85%90-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EC%A0%95%EB%B3%B4';
const thirdPartyPromo2='https://info60512.tistory.com/461';
const appIcon='https://play-lh.googleusercontent.com/DVryEpSc8yilLqBZhJPA7IviVPoMC3m5x6xlU71tumKmKO9ga0xZsY10OkZXV-hZO3gLP4PWXhP-BhG40yVGyvk=s0-br30';

const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${googlePlay}" style="margin:0 0 24px"><a href="${googlePlay}" rel="noopener noreferrer"><img src="${appIcon}" width="512" height="512" alt="${GAME} 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const thirdParty=(name,url,sourcePublishedAt,updatedAt)=>({
  name,
  url,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  sourcePublishedAt,
  updatedAt,
  checkedAt
});

const candidateCodes=['WELCOME','VIP222','VIP333','VIP555','VIP666','VIP888','GO2024','DCGIFT'];
const records=candidateCodes.map(code=>({
  code,
  sourcePublishedAt:'2026-06-01',
  latest:true,
  latestEvidence:`2026-10-14 확인 시 GameEDU의 ${GAME} 전용 페이지에 ${code}가 노출되어 있다. 페이지 메타데이터 수정일은 2026-10-14이지만 본문의 작동 표기는 2026-09-14이며, 게임 운영사 직접 발급 원문·정확한 만료·실제 계정 입력 성공은 확인되지 않았다.`,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:'제3자 입력 후보·공식 발급/실사용 미확인',
  sources:[thirdParty(`GameEDU · ${GAME} 쿠폰 목록`,gameedu,'2026-06-01','2026-10-14')],
  evidenceHTML:`<p>GameEDU의 ${GAME} 전용 페이지에서 확인한 문자열입니다. 해당 페이지는 본 이벤트가 ${GAME} 운영사와 무관하다고 안내하므로 공식 쿠폰으로 승격하지 않습니다. 페이지의 작동 표기는 2026-09-14이며, 2026-10-14 현재 운영사 원문·만료 조건·실제 계정 입력 성공은 별도로 확인되지 않아 <strong>UNVERIFIED 입력 후보</strong>로 보존합니다.</p>`
}));

const model={
  articleKey,
  title:GAME,
  previewHTML:`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${GAME} 쿠폰 요약"><div class="ncp-feed-stat"><span>입력 후보</span><strong>8개</strong></div><div class="ncp-feed-stat"><span>공식 발급 확인</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>제3자 혜택 후보</span><strong>1종</strong></div></div>`,
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 Google Play의 공식 앱과 ONE store 배포 페이지, Google Play에서 연결된 U.LU Games 운영 정책 페이지를 확인했습니다. 공식 스토어 설명과 연결된 운영사 자료에서는 현재 공개 리딤코드·쿠폰 문자열이나 공식 코드 입력 경로를 확인하지 못해 <strong>공식 현재 쿠폰은 0개</strong>로 분류합니다.</p><p>GameEDU의 다크엔젤: 천사 강림 전용 페이지에는 WELCOME, VIP222, VIP333, VIP555, VIP666, VIP888, GO2024, DCGIFT 8개가 노출됩니다. 다만 GameEDU 스스로 게임 운영사와 무관한 이벤트라고 밝히며, 본문 작동 표기도 2026-09-14이므로 8개 모두 삭제하지 않고 <strong>UNVERIFIED 입력 후보</strong>로 분리합니다.</p><p>9월 12~13일 제3자 블로그 2곳은 TikTok Lite 설치와 연계한 인게임 쿠폰·포인트 프로모션을 소개하고 10월 18일까지라고 안내했습니다. 운영사 공식 제휴 공지, 실제 쿠폰 문자열, 계정 수령 성공을 확인하지 못해 공용 코드 행에는 넣지 않고 제3자 혜택 후보로만 기록합니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>GameEDU와 제3자 블로그는 게임 내 메뉴 → 설정 → 쿠폰 입력 경로를 안내하지만, 2026-10-14 확인한 Google Play·ONE store·운영사 연결 페이지에서는 이 입력 경로를 공식적으로 확인하지 못했습니다. 실제 게임 설정에 쿠폰 입력 메뉴가 보일 때만 위 8개 후보를 시도하세요. 메뉴가 없거나 오류가 나오면 사용 가능한 공식 쿠폰으로 보지 않습니다.</p><div><a href="${googlePlay}" rel="noopener noreferrer">다크엔젤: 천사 강림 Google Play 공식 앱 <span>열기 →</span></a></div></section><section><h3>제3자 프로모션 확인</h3><p>제3자 블로그의 TikTok Lite 연계 이벤트는 게임 운영사 공식 출처가 아니며 실제 지급 조건도 독립 확인하지 못했습니다. 외부 앱 설치·가입 전에는 해당 서비스의 현재 조건과 개인정보 안내를 직접 확인하세요.</p></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${oneStore}" rel="noopener noreferrer">ONE store 공식 배포 페이지</a> · <a href="${operatorPolicy}" rel="noopener noreferrer">U.LU Games 운영 정책 페이지</a> · <a href="${gameedu}" rel="noopener noreferrer">GameEDU 미확인 코드 목록</a> · <a href="${thirdPartyPromo1}" rel="noopener noreferrer">제3자 프로모션 기록 1</a> · <a href="${thirdPartyPromo2}" rel="noopener noreferrer">제3자 프로모션 기록 2</a></p>`,
  records
};

export const darkAngelAngelDescentArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:GAME,
    content:renderGamePeriodArticle(model),
    labels:['게임',GAME,'Dark Angel Angel Descent']
  },
  source:{
    type:'DARK_ANGEL_ANGEL_DESCENT_GLOBAL_CODE_RESEARCH',
    url:googlePlay,
    checkedAt,
    references:[googlePlay,oneStore,operatorPolicy,gameedu,thirdPartyPromo1,thirdPartyPromo2],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'다크엔젤: 천사 강림 쿠폰을 2026년 10월 14일 기준 조사했습니다. 운영사 공식 발급 확인 코드는 0개이며, GameEDU에 노출된 입력 후보 8개와 제3자 프로모션을 공식 여부와 분리해 정리합니다.',
    keywords:['다크엔젤 천사 강림 쿠폰','다크엔젤: 천사 강림 쿠폰','다크엔젤 쿠폰','다크엔젤 천사 강림 코드','다크엔젤 쿠폰 입력','Dark Angel Angel Descent code','Dark Angel Angel Descent coupon'],
    hashtags:['#다크엔젤천사강림','#다크엔젤','#게임쿠폰','#쿠폰코드'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialCurrentCodes:[],
    unverifiedCandidates:records.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:[],
    benefits:[
      {type:'REFERRAL',authority:'THIRD_PARTY',status:'UNVERIFIED',benefit:'TikTok Lite 연계 인게임 쿠폰·포인트 프로모션 안내',method:'제3자 게시물의 전용 링크를 통한 참여 안내',sourceUrl:thirdPartyPromo1,sourcePublishedAt:'2026-09-12',expiry:'2026-10-18',conditions:'운영사 공식 제휴·실제 쿠폰 문자열·지급 성공 미확인; 제3자 블로그 2026-09-13 게시물에서도 유사 안내 확인'}
    ]
  }
};
