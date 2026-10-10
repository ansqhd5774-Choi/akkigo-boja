import models from '../data/game-period-articles.json' with {type:'json'};
import {renderGamePeriodArticle} from './game-period-article.js';

const articleKey='tiles-survive-codes-202610';
const model=models.find(x=>x.articleKey===articleKey);
if(!model)throw new Error('TILES_SURVIVE_PERIOD_MODEL_MISSING');

export const tilesSurviveArticle={
  articleKey,
  approvedForPublish:true,
  post:{title:'타일 서바이벌',content:renderGamePeriodArticle(model),labels:['게임','타일서바이벌']},
  source:{
    type:'TILES_SURVIVE_GLOBAL_CROSSCHECK',
    url:'https://tilessurvive.com/en/list',
    checkedAt:'2026-10-10',
    references:[
      'https://tilessurvive.com/en/list',
      'https://apps.apple.com/kr/app/%ED%83%80%EC%9D%BC-%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C/id6738109752',
      'https://play.google.com/store/apps/details?id=com.funplus.ts.global',
      'https://twstalker.com/TilesSurvive',
      'https://tilessurvive.net/en/guides/gift-code-how-to-use/',
      'https://wotpack.ru/ko/kody-tiles-survive-v-dekabre-2025/',
      'https://buffhub.com/blog/tiles-survive/tiles-survive-codes.html',
      'https://game.edu.kg/ja/tiles-survive/',
      'https://game.edu.kg/ru/tiles-survive%21/%D0%BA%D0%BE%D0%B4%D1%8B/',
      'https://game.edu.kg/ar/tiles-survive%21/codes/',
      'https://temtekplay.com/en/codes/',
      'https://www.ldshop.gg/jp/blog/tiles-survive/tiles-code-jp.html',
      'https://www.ldshop.gg/blog/tiles-survive/top-up-guide.html',
      'https://www.lootbar.com/ko/top-up/tiles-survive'
    ],
    presentationVersion:'compact-r2',
    templateVersion:'game-period-tabs-r1',
    gamePeriodModel:model,
    searchDescription:'타일 서바이벌 쿠폰 코드와 TS777·TS888·TS999, 만료 코드, 공식 첫 결제 5% 할인과 충전 혜택, 입력 방법·출처 게시일을 정리했습니다.',
    keywords:['타일 서바이벌 쿠폰','타일 서바이벌 쿠폰 코드','타일 서바이벌 기프트 코드','Tiles Survive codes','Tiles Survive gift code','타일 서바이벌 충전 할인','TS777','TS888','TS999'],
    hashtags:['#타일서바이벌','#TilesSurvive','#타일서바이벌쿠폰','#게임쿠폰','#기프트코드','#쿠폰코드','#충전할인'],
    measuredSearch:{keyword:'타일 서바이벌 쿠폰',measuredAt:'2026-09-29T17:23:00+09:00',monthlySearchRange:'500~1천',mobileShare:'62%',source:'https://blokey.co.kr/k/%ED%83%80%EC%9D%BC%2B%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C%2B%EC%BF%A0%ED%8F%B0'},
    benefits:[
      {type:'PAYMENT_DISCOUNT',authority:'OFFICIAL',status:'ACTIVE',benefit:'첫 결제 5% 할인',method:'공식 Top-Up Center',sourceUrl:'https://store.funplus.com/tilessurvive/',sourcePublishedAt:null,expiry:null},
      {type:'POINTS_EXCHANGE',authority:'OFFICIAL',status:'ACTIVE',benefit:'Top-Up Points 주간 교환',method:'공식 Top-Up Center',sourceUrl:'https://twstalker.com/TilesSurvive',sourcePublishedAt:null,expiry:null},
      {type:'PAYMENT_CODE',authority:'THIRD_PARTY',status:'ACTIVE',benefit:'다음 결제 5% 할인',method:'LDSHOP5FF',sourceUrl:'https://www.ldshop.gg/blog/tiles-survive/top-up-guide.html',sourcePublishedAt:'2026-05-27',expiry:'2026-10-31 23:59:59'},
      {type:'PAYMENT_DISCOUNT',authority:'THIRD_PARTY',status:'UNVERIFIED',benefit:'Waypoints 최대 22% 할인 표시',method:'LootBar',sourceUrl:'https://www.lootbar.com/ko/top-up/tiles-survive',sourcePublishedAt:null,expiry:null},
      {type:'ELIGIBILITY_APPLICATION',authority:'OFFICIAL',status:'ACTIVE',benefit:'Creator Program 전용 프레임·월간 보상·성과형 추가 보상',method:'신청 폼',sourceUrl:'https://twstalker.com/TilesSurvive',sourcePublishedAt:null,expiry:'2026-10-11'}
    ]
  }
};
