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
import {chunoIdleArticle,cookieRunCrumbleArticle,switchingHeroesArticle,realfarmArticle,mongilStarDiveArticle} from './game-batch-20261012-e.js';
import {blackWizardInfiniteDefenseArticle,pixelDefendersArticle,battleCatsArticle,lastWarSurvivalArticle} from './game-batch-20261012-f.js';
import {catHeroesMergeDefenseArticle,darkWarSurvivalArticle,lastZSurvivalShooterArticle,darkSlayerIdleArticle,zombieTowerArticle} from './game-batch-20261012-g.js';
import {luckyOffenseArticle,potatoZombieArticle,imoWorldOfMagicArticle,mahjongSoulKrArticle} from './game-batch-20261012-h.js';
import {evilLandsArticle,muMonarch2Article,rfOnlineNextArticle,pixelMageIdleArticle,overgearedHeroArticle} from './game-batch-20261012-i.js';
import {mobileLegendsArticle,clashRoyaleArticle,muMonarchArticle,anipang4Article} from './game-batch-20261012-j.js';
import {silverPalaceArticle} from './game-batch-20261012-k.js';
import {applyRepresentativeLogos} from './representative-logo-renderer.js';

const canonicalArticles=[...primary,...supplemental];
const legacyArticleCatalog=[
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
  treeOfSaviorMArticle,
  chunoIdleArticle,
  cookieRunCrumbleArticle,
  switchingHeroesArticle,
  realfarmArticle,
  mongilStarDiveArticle,
  blackWizardInfiniteDefenseArticle,
  pixelDefendersArticle,
  battleCatsArticle,
  lastWarSurvivalArticle,
  catHeroesMergeDefenseArticle,
  darkWarSurvivalArticle,
  lastZSurvivalShooterArticle,
  darkSlayerIdleArticle,
  zombieTowerArticle,
  luckyOffenseArticle,
  potatoZombieArticle,
  imoWorldOfMagicArticle,
  mahjongSoulKrArticle,
  evilLandsArticle,
  muMonarch2Article,
  rfOnlineNextArticle,
  pixelMageIdleArticle,
  overgearedHeroArticle,
  mobileLegendsArticle,
  clashRoyaleArticle,
  muMonarchArticle,
  anipang4Article,
  silverPalaceArticle
];

// Canonical JSON is the migration destination. A canonical article replaces the
// same legacy registration, while unrelated legacy duplicates remain visible to
// the integrity check and therefore still fail.
export function mergeCanonicalAndLegacy(canonical=[],legacy=[]){
  const canonicalKeys=new Set(canonical.map(article=>article?.articleKey));
  return [
    ...canonical,
    ...legacy.filter(article=>!canonicalKeys.has(article?.articleKey))
  ];
}

const articleCatalogBase=mergeCanonicalAndLegacy(canonicalArticles,legacyArticleCatalog);

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
