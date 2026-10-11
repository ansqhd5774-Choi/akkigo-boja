import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {catHeroArticle} from './cat-hero-article.js';
import {malhaevocaArticle} from './malhaevoca-article.js';
import {duolingoArticle} from './duolingo-article.js';
import {tilesSurviveArticle} from './tiles-survive-article.js';
import {rokebiArticle} from './rokebi-article.js';
import {frombioArticle} from './frombio-article.js';
import {inflearnArticle} from './inflearn-article.js';
import {maaltalkArticle} from './maaltalk-article.js';
import {ip4uArticle} from './ip4u-article.js';
import {hotvpnArticle} from './hotvpn-article.js';
import {gigaipArticle} from './gigaip-article.js';
import {readyArticle as ohmyzipReadyArticle} from './ohmyzip-ready-article.js';
import {twofastsArticle} from './twofasts-article.js';
import {iwinvArticle} from './iwinv-article.js';
import {swordxstaffArticle} from './swordxstaff-article.js';
import {plantsOnFireArticle} from './plants-on-fire-article.js';
import {darkTowerArticle,honkaiImpact3rdArticle,neoMonstersArticle,tokyoDebunkerArticle,kartRiderRushPlusArticle} from './game-batch-20261012.js';
import {executionerSwordClassicArticle,majoArticle,blackDesertMobileArticle,zombieWavesArticle,rogueLegendArticle,aion2Article} from './game-batch-20261012-b.js';
import {dragonVillage3Article,evernightReverseArticle,xpHeroArticle,yulgangNextArticle,nyangjjikHeroesArticle} from './game-batch-20261012-c.js';
import {godSlayerArticle,romanticGanghoArticle,herollArticle,swordOfConvallariaArticle,treeOfSaviorMArticle} from './game-batch-20261012-d.js';
import {applyRepresentativeLogos} from './representative-logo-renderer.js';

const articleCatalogBase=[
  ...primary,
  ...supplemental,
  catHeroArticle,
  duolingoArticle,
  malhaevocaArticle,
  tilesSurviveArticle,
  frombioArticle,
  inflearnArticle,
  maaltalkArticle,
  ip4uArticle,
  hotvpnArticle,
  gigaipArticle,
  ohmyzipReadyArticle,
  twofastsArticle,
  iwinvArticle,
  swordxstaffArticle,
  plantsOnFireArticle,
  darkTowerArticle,
  honkaiImpact3rdArticle,
  neoMonstersArticle,
  tokyoDebunkerArticle,
  kartRiderRushPlusArticle,
  executionerSwordClassicArticle,
  majoArticle,
  blackDesertMobileArticle,
  zombieWavesArticle,
  rogueLegendArticle,
  aion2Article,
  dragonVillage3Article,
  evernightReverseArticle,
  xpHeroArticle,
  yulgangNextArticle,
  nyangjjikHeroesArticle,
  godSlayerArticle,
  romanticGanghoArticle,
  herollArticle,
  swordOfConvallariaArticle,
  treeOfSaviorMArticle
];

export const currentArticleCatalog=applyRepresentativeLogos([
  ...articleCatalogBase.filter(x=>x.articleKey!=='rokebi-promo-202610'),
  rokebiArticle
]);

export function assertArticleCatalogIntegrity(catalog=currentArticleCatalog){
  const seen=new Set();
  for(const article of catalog){
    if(!article || typeof article.articleKey!=='string' || !/^[a-z0-9-]{1,100}$/.test(article.articleKey)){
      throw new Error('ARTICLE_REGISTRY_INVALID_KEY');
    }
    if(seen.has(article.articleKey))throw new Error(`ARTICLE_REGISTRY_DUPLICATE_KEY:${article.articleKey}`);
    seen.add(article.articleKey);
    if(article.approvedForPublish===true && !article.post)throw new Error(`ARTICLE_REGISTRY_APPROVED_POST_MISSING:${article.articleKey}`);
  }
  return true;
}

assertArticleCatalogIntegrity();
