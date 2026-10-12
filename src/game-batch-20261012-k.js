import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-12';
const officialSite='https://silverpalace.elementagames.com/ko-kr';
const officialKakao='https://pf.kakao.com/_kgFxkn/114394133';
const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.elementagames.silverpalace.google';
const appStore='https://apps.apple.com/us/app/silver-palace/id6758292278';
const iconUrl='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/26/3a/65/263a652a-30f8-0e05-036a-f26e5247edc1/Placeholder.mill/512x512bb.jpg';
const noCodeReference='https://salenhanh.com/en/silver-palace-redeem-codes/';
const featured=`<figure data-ncp-featured-image="silver-palace-codes-202610" data-ncp-app-icon="true" data-ncp-app-icon-source="${appStore}" style="margin:0 0 24px"><a href="${appStore}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="실버 팰리스 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const model={
  articleKey:'silver-palace-codes-202610',
  title:'실버 팰리스',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="실버 팰리스 쿠폰 요약"><div class="ncp-feed-stat"><span>공개 코드</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>현재 혜택</span><strong>사전예약 보상</strong></div><div class="ncp-feed-stat"><span>상태</span><strong>출시 전</strong></div></div>',
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 12일 기준 Elementa Games 공식 사이트·공식 한국 채널·스토어에서 공개 리딤코드는 확인되지 않았습니다. 출시 전 단계에서 존재하지 않는 문자열을 쿠폰으로 만들지 않습니다.</p><p>대신 2026년 9월 23일 공식 채널에서 글로벌 사전예약 마일스톤 보상이 공지됐습니다. 1,500만 사전예약은 온스 80,000, 2,000만은 〈만물 연구〉 확장편 10개, 2,500만은 재연의 탄환 5개, 3,000만은 신규 4성 캐릭터, 3,500만은 재연의 탄환 10개이며 공식 SNS 팔로워 500만 달성 시 재연의 탄환 5개가 추가로 안내됐습니다.</p>',
  guideHTML:`<section><h3>받는 방법</h3><p>현재는 쿠폰 입력이 아니라 사전예약형 혜택입니다. 공식 사이트 또는 Google Play·App Store·PlayStation Store·Epic Games Store의 사전예약 경로를 이용하세요. 마일스톤 달성 여부와 실제 지급 시점은 공식 공지를 최종 기준으로 확인합니다.</p><div><a href="${officialSite}" rel="noopener noreferrer">실버 팰리스 공식 사이트 <span>열기 →</span></a></div></section>`,
  archiveHTML:`<p><a href="${officialSite}" rel="noopener noreferrer">공식 사이트</a> · <a href="${officialKakao}" rel="noopener noreferrer">공식 한국 카카오톡 채널</a> · <a href="${googlePlay}" rel="noopener noreferrer">Google Play</a> · <a href="${appStore}" rel="noopener noreferrer">App Store</a> · <a href="${noCodeReference}" rel="noopener noreferrer">제3자 코드 현황 참고</a></p>`,
  records:[]
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
    type:'SILVER_PALACE_NO_PUBLIC_CODES_AND_OFFICIAL_PREREG_MILESTONE',
    url:officialSite,
    checkedAt,
    references:[officialSite,officialKakao,googlePlay,appStore,noCodeReference],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'실버 팰리스 쿠폰은 현재 공식 공개 코드 0개이며, 글로벌 사전예약 마일스톤 보상과 사전예약 방법을 정리했습니다.',
    keywords:['실버 팰리스 쿠폰','실버팰리스 쿠폰','Silver Palace codes','실버 팰리스 사전예약','Silver Palace pre-registration'],
    hashtags:['#실버팰리스','#SilverPalace','#게임쿠폰','#사전예약'],
    searchMeasurement:{status:'NOT_MEASURED'},
    benefits:[
      {type:'PRE_REGISTRATION_MILESTONE',authority:'OFFICIAL',status:'ACTIVE',benefit:'사전예약 1,500만~3,500만 단계 보상: 온스 80,000, 만물 연구 확장편 10개, 재연의 탄환 15개, 신규 4성 캐릭터',method:'글로벌 사전예약 후 마일스톤 달성',sourceUrl:officialKakao,sourcePublishedAt:'2026-09-23',expiry:'미확인'},
      {type:'SOCIAL_MILESTONE',authority:'OFFICIAL',status:'ACTIVE',benefit:'공식 글로벌 SNS 팔로워 500만 달성 시 재연의 탄환 5개',method:'공식 SNS 목표 달성',sourceUrl:officialKakao,sourcePublishedAt:'2026-09-23',expiry:'미확인'}
    ]
  }
};
