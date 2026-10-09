import model from '../data/cat-hero-codes-202610.json' with {type:'json'};
import {renderGamePeriodArticle} from './game-period-article.js';
export const catHeroArticle={
  articleKey:model.articleKey,
  approvedForPublish:true,
  post:{title:model.title,content:renderGamePeriodArticle(model),labels:['게임','캣히어로']},
  source:{type:'CAT_HERO_GAME_SOURCE_CROSSCHECK',url:'https://play.google.com/store/apps/details?id=net.gameduo.gv',checkedAt:'2026-10-09',
    references:["https://play.google.com/store/apps/eventdetails/4828782978293037948","https://www.facebook.com/100093382416226/videos/%EC%98%A4%EC%A7%81-%EC%A7%80%EA%B8%88%EB%A7%8C-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%97%AD%EB%8C%80%EA%B8%89-%ED%94%BD%EC%97%85-%EA%B8%B0%ED%9A%8C%EC%99%80-%ED%92%8D%EC%84%B1%ED%95%9C-%ED%98%9C%ED%83%9D%EC%9D%B4-%EA%B8%B0%EB%8B%A4%EB%A6%BD%EB%8B%88%EB%8B%A4/1727986271623037/","https://gall.dcinside.com/mgallery/board/view/?id=cathero&no=4553&page=1","https://honeybeejoa.co.kr/bbs/board.php?bo_table=Cat_Hero&wr_id=1","https://levelgeeks.net/cat-hero-codes/","https://ucngame.com/codes/cat-hero-codes/","https://www.bluestacks.com/blog/news/cat-hero-idle-rpg-redeem-codes-en.html","https://gameyd.io/cat-hero-codes/"],
    presentationVersion:'compact-r2',templateVersion:'game-period-tabs-r1',gamePeriodModel:model,
    searchDescription:'캣 히어로 쿠폰 2026년 10월 3주년 코드, 해외·과거 만료 이력, 출처 원문 게시일과 쿠폰 입력 방법.',
    keywords:["캣 히어로 쿠폰","캣히어로 쿠폰 2026 10월","캣히어로 3주년 쿠폰","CATHERO3RDDAY3","캣히어로 쿠폰 입력","캣히어로 만료 쿠폰","Cat Hero Idle RPG codes","Gameduo coupon"],hashtags:["#캣히어로","#캣히어로쿠폰","#캣히어로3주년","#CatHero","#CatHeroIdleRPG","#게임쿠폰","#쿠폰입력"]
  }
};
