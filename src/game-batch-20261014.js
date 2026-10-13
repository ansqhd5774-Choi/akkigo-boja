import {renderGamePeriodArticle} from './game-period-article.js';

const checkedAt='2026-10-14';
const googlePlay='https://play.google.com/store/apps/details?hl=ko&id=com.nep.tr.hybrid.cg.rock';
const appStore='https://apps.apple.com/kr/app/%EC%99%80%EB%A5%B4%EB%A5%B4%EB%B9%84%EB%B2%84/id6798071755';
const developer='https://www.treeplla.com/';
const lineGames='https://www.linegames.org/ko/%EC%99%80%EB%A5%B4%EB%A5%B4%EB%B9%84%EB%B2%84-%EC%BF%A0%ED%8F%B0/';
const gameEdu='https://game.edu.kg/ko/%EC%99%80%EB%A5%B4%EB%A5%B4%EB%B9%84%EB%B2%84/%EC%BF%A0%ED%8F%B0/';
const iconUrl='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/8b/8b/9b/8b8b9b01-5162-82b2-466b-531e707cf05f/Placeholder.mill/512x512bb.jpg';
const articleKey='waruru-beaver-codes-202610';
const featured=`<figure data-ncp-featured-image="${articleKey}" data-ncp-app-icon="true" data-ncp-app-icon-source="${appStore}" style="margin:0 0 24px"><a href="${appStore}" rel="noopener noreferrer"><img src="${iconUrl}" width="512" height="512" alt="와르르비버 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:100%;max-width:256px;height:auto;margin:0 auto;border-radius:14px"/></a></figure>`;

const source=(name,url)=>({name,url,sourcePublishedAt:null,checkedAt,referenceType:'THIRD_PARTY_CODE_MENTION'});
const lineSource=()=>source('LINEGames 와르르비버 쿠폰 코드 목록',lineGames);
const eduSource=()=>source('GameEDU 와르르비버 쿠폰 코드 목록',gameEdu);
const candidate=(code,sources)=>({
  code,
  sourcePublishedAt:null,
  latest:true,
  latestEvidence:'2026-10-14 공개 페이지에서 와르르비버 현재 쿠폰 목록에 노출된 문자열이다. 공식 발급 원문·정확한 최초 게시일·개별 계정 입력 성공은 확인되지 않았다.',
  expiry:'미확인',
  status:'UNVERIFIED',
  statusLabel:'제3자 현재 후보·사용 여부 미확인',
  sources,
  evidenceHTML:'<p>제3자 쿠폰 페이지에 와르르비버 코드로 게시된 문자열입니다. 해당 페이지들은 게임사 공식 채널이 아니며, 공식 발급·보상·유효기간·실제 입력 성공은 독립적으로 확인되지 않았습니다. 범용 문자열처럼 보여도 삭제하지 않고 미확인 후보로 보존합니다.</p>'
});

const records=[
  candidate('WELCOME',[eduSource()]),
  candidate('VIP222',[lineSource(),eduSource()]),
  candidate('VIP333',[lineSource(),eduSource()]),
  candidate('VIP555',[lineSource(),eduSource()]),
  candidate('VIP666',[lineSource(),eduSource()]),
  candidate('VIP777',[lineSource()]),
  candidate('VIP888',[lineSource(),eduSource()]),
  candidate('VIP2024',[eduSource()]),
  candidate('GO2024',[lineSource()]),
  candidate('FBGIFT',[eduSource()]),
  candidate('DCGIFT',[lineSource()])
];

const model={
  articleKey,
  title:'와르르비버',
  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="와르르비버 쿠폰 요약"><div class="ncp-feed-stat"><span>제3자 현재 후보</span><strong>11개</strong></div><div class="ncp-feed-stat"><span>공식 확인 코드</span><strong>0개</strong></div><div class="ncp-feed-stat"><span>확인일</span><strong>10.14</strong></div></div>',
  featuredHTML:featured,
  noticeHTML:'<p>2026년 10월 14일 기준 NEPTUNE(TREEPLLA)의 Google Play·App Store와 개발사 공개 경로에서 공식 쿠폰 코드 또는 공식 쿠폰 입력 안내는 확인되지 않았습니다. 반면 LINEGames와 GameEDU 공개 페이지에는 와르르비버 코드라고 표시된 문자열이 있어 중복을 제거한 11개를 제3자 미확인 후보로 보존했습니다.</p><p>두 제3자 페이지는 게임사와 무관한 사이트임을 스스로 안내하고 있으며, WELCOME·VIP 계열처럼 다른 게임에서도 반복되는 범용형 문자열이 포함됩니다. 따라서 복사 버튼은 시도를 돕기 위한 것이며 공식 발급이나 사용 성공을 뜻하지 않습니다. 원문 최초 게시일은 정확히 확인되지 않아 수집일로 대체하지 않았습니다.</p>',
  guideHTML:`<section><h3>쿠폰 입력 방법</h3><p>공식 스토어 설명과 개발사 공개 페이지에서 와르르비버의 쿠폰 입력 메뉴를 확인하지 못했습니다. 제3자 페이지는 프로필·설정의 쿠폰 메뉴를 안내하지만 공식 근거가 확인되지 않았으므로, 실제 게임에서 해당 메뉴가 보이는 경우에만 위 후보를 직접 시도하세요. 메뉴가 없다면 별도 공식 안내가 나오기 전까지 입력 경로 미확인으로 보는 것이 안전합니다.</p><div><a href="${googlePlay}" rel="noopener noreferrer">와르르비버 Google Play <span>열기 →</span></a></div></section>`,
  archiveHTML:`<p><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="${appStore}" rel="noopener noreferrer">App Store 공식 앱</a> · <a href="${developer}" rel="noopener noreferrer">NEPTUNE(TREEPLLA) 개발사 사이트</a> · <a href="${lineGames}" rel="noopener noreferrer">LINEGames 제3자 코드 목록</a> · <a href="${gameEdu}" rel="noopener noreferrer">GameEDU 제3자 코드 목록</a></p>`,
  records
};

export const waruruBeaverArticle={
  articleKey,
  approvedForPublish:true,
  post:{
    title:'와르르비버',
    content:renderGamePeriodArticle(model),
    labels:['게임','와르르비버','Waruru Beaver']
  },
  source:{
    type:'WARURU_BEAVER_THIRD_PARTY_CODE_CANDIDATES',
    url:googlePlay,
    checkedAt,
    references:[googlePlay,appStore,developer,lineGames,gameEdu],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'와르르비버 쿠폰은 공식 확인 코드 0개와 LINEGames·GameEDU 공개 목록의 제3자 미확인 후보 11개를 구분해 정리합니다. 공식 발급·사용 성공·유효기간이 확인되지 않은 문자열은 후보로만 표시합니다.',
    keywords:['와르르비버 쿠폰','와르르비버 코드','와르르 비버 쿠폰','Waruru Beaver codes','와르르비버 쿠폰 입력'],
    hashtags:['#와르르비버','#게임쿠폰','#쿠폰코드','#방치형게임'],
    searchMeasurement:{status:'NOT_MEASURED'},
    unverifiedCandidates:records.map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    officialCurrentCodes:[],
    benefits:[]
  }
};
