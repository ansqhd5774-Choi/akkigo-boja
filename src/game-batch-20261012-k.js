import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-12';
const officialSite='https://silverpalace.elementagames.com/ko-kr';
const officialKakao='https://pf.kakao.com/_kgFxkn/114394133';
const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.elementagames.silverpalace.google';
const appStore='https://apps.apple.com/us/app/silver-palace/id6758292278';
const iconUrl='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/26/3a/65/263a652a-30f8-0e05-036a-f26e5247edc1/Placeholder.mill/512x512bb.jpg';
const noCodeReference='https://salenhanh.com/en/silver-palace-redeem-codes/';
const digwow='https://www.digwow.net/%EC%8B%A4%EB%B2%84-%ED%8C%B0%EB%A6%AC%EC%8A%A4/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const aayyy='https://www.aayyy.com/silver-palace/codes';
const featured=`<figure data-ncp-featured-image="silver-palace-codes-202610" data-ncp-app-icon="true" data-ncp-app-icon-source="${appStore}" style="margin:0 0 24px"><a href="${appStore}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="실버 팰리스 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const thirdParty=(name,url,sourcePublishedAt)=>({name,url,sourcePublishedAt,checkedAt,referenceType:'THIRD_PARTY_CODE_MENTION'});
const unverified=(code,sourcePublishedAt,sources)=>({
  code,
  sourcePublishedAt,
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:'미확인 후보',
  sources,
  evidenceHTML:'<p>공식 발급 원문·실제 입력 성공·현재 사용 가능 여부는 확인되지 않았습니다. 저장소 정책에 따라 제3자 원문에 실버 팰리스 코드로 함께 게시된 문자열을 시도 가능한 후보로 보존합니다.</p>'
});

const records=[
  unverified('SILVERPALACE777','2026-10-12',[thirdParty('DIGWOW 실버 팰리스 쿠폰 모음',digwow,'2026-10-12')]),
  unverified('OPENINGGIFT','2026-10-12',[thirdParty('DIGWOW 실버 팰리스 쿠폰 모음',digwow,'2026-10-12')]),
  unverified('WELCOME2024','2026-09-29',[
    thirdParty('AAYYY Silver Palace Codes',aayyy,'2026-09-29'),
    thirdParty('DIGWOW 실버 팰리스 쿠폰 모음',digwow,'2026-10-12')
  ]),
  unverified('SILVER777','2026-09-29',[thirdParty('AAYYY Silver Palace Codes',aayyy,'2026-09-29')]),
  unverified('PALACE888','2026-09-29',[thirdParty('AAYYY Silver Palace Codes',aayyy,'2026-09-29')]),
  unverified('VIP999','2026-09-29',[thirdParty('AAYYY Silver Palace Codes',aayyy,'2026-09-29')])
];

const model={
  articleKey:'silver-palace-codes-202610',
  title:'실버 팰리스',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="실버 팰리스 쿠폰 요약"><div class="ncp-feed-stat"><span>미확인 후보</span><strong>6개</strong></div><div class="ncp-feed-stat"><span>공식 확인 코드</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>현재 혜택</span><strong>사전예약 보상</strong></div></div>',
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 12일 기준 Elementa Games 공식 사이트·공식 한국 채널·스토어에서 공식 공개 리딤코드는 확인되지 않았습니다. 다만 DIGWOW와 AAYYY의 실버 팰리스 코드 목록에서 6개 고유 문자열이 확인되어 저장소의 게임 쿠폰 후보 유지 정책에 따라 UNVERIFIED 후보로 보존했습니다. 복사 가능하더라도 공식 발급·사용 성공을 뜻하지 않습니다.</p><p>공식 혜택으로는 2026년 9월 23일 글로벌 사전예약 마일스톤 보상이 공지됐습니다. 1,500만 사전예약은 온스 80,000, 2,000만은 〈만물 연구〉 확장편 10개, 2,500만은 재연의 탄환 5개, 3,000만은 신규 4성 캐릭터, 3,500만은 재연의 탄환 10개이며 공식 SNS 팔로워 500만 달성 시 재연의 탄환 5개가 추가로 안내됐습니다.</p>',
  guideHTML:`<section><h3>쿠폰 확인·사전예약 방법</h3><p>현재 공식 쿠폰 입력 메뉴와 입력 성공 사례는 확인되지 않았습니다. 위 미확인 후보는 게임 출시 또는 쿠폰 입력 기능 공개 후 직접 시도할 수 있는 후보 기록입니다. 사전예약 혜택은 공식 사이트 또는 Google Play·App Store·PlayStation Store·Epic Games Store의 사전예약 경로를 이용하세요.</p><div><a href="${officialSite}" rel="noopener noreferrer">실버 팰리스 공식 사이트 <span>열기 →</span></a></div></section>`,
  archiveHTML:`<p><a href="${officialSite}" rel="noopener noreferrer">공식 사이트</a> · <a href="${officialKakao}" rel="noopener noreferrer">공식 한국 카카오톡 채널</a> · <a href="${googlePlay}" rel="noopener noreferrer">Google Play</a> · <a href="${appStore}" rel="noopener noreferrer">App Store</a> · <a href="${digwow}" rel="noopener noreferrer">DIGWOW 미확인 코드 목록</a> · <a href="${aayyy}" rel="noopener noreferrer">AAYYY 미확인 코드 목록</a> · <a href="${noCodeReference}" rel="noopener noreferrer">공식 코드 미확인 참고</a></p>`,
  records
};

export const silverPalaceArticle={
  articleKey:'silver-palace-codes-202610',
  approvedForPublish:true,
  post:{
    title:'실버 팰리스',
    content:renderGamePeriodArticle(model),
    labels:['게임','실버 팰리스','Silver Palace']
  },
  source:{
    type:'SILVER_PALACE_UNVERIFIED_CODE_CANDIDATES_AND_OFFICIAL_PREREG_MILESTONE',
    url:officialSite,
    checkedAt,
    references:[officialSite,officialKakao,googlePlay,appStore,digwow,aayyy,noCodeReference],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'실버 팰리스 쿠폰은 공식 확인 코드 0개, 제3자 원문에서 확인된 미확인 후보 6개를 구분해 정리하고 글로벌 사전예약 마일스톤 보상도 함께 안내합니다.',
    keywords:['실버 팰리스 쿠폰','실버팰리스 쿠폰','Silver Palace codes','실버 팰리스 사전예약','Silver Palace pre-registration'],
    hashtags:['#실버팰리스','#SilverPalace','#게임쿠폰','#사전예약'],
    searchMeasurement:{status:'NOT_MEASURED'},
    unverifiedCandidates:records.map(({code,sourcePublishedAt,expiry,status,sources})=>({code,sourcePublishedAt,expiry,status,sources})),
    benefits:[
      {type:'PRE_REGISTRATION_MILESTONE',authority:'OFFICIAL',status:'ACTIVE',benefit:'사전예약 1,500만~3,500만 단계 보상: 온스 80,000, 만물 연구 확장편 10개, 재연의 탄환 15개, 신규 4성 캐릭터',method:'글로벌 사전예약 후 마일스톤 달성',sourceUrl:officialKakao,sourcePublishedAt:'2026-09-23',expiry:'미확인'},
      {type:'SOCIAL_MILESTONE',authority:'OFFICIAL',status:'ACTIVE',benefit:'공식 글로벌 SNS 팔로워 500만 달성 시 재연의 탄환 5개',method:'공식 SNS 목표 달성',sourceUrl:officialKakao,sourcePublishedAt:'2026-09-23',expiry:'미확인'}
    ]
  }
};
