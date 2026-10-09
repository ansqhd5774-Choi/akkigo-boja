import {validateMonthlyGameCouponTimeline} from '../src/game-coupon-monthly.js';
import {validateArticlePresentation} from '../src/article-presentation.js';
import {validateGamePeriodArticle} from '../src/game-period-article.js';
import {validateGameCouponLayout} from '../src/game-code-layout-contract.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';
import {validateRepresentativeLogo} from '../src/representative-logo-policy.js';
import {validateGameCandidateCoverage} from '../src/game-code-candidate-policy.js';
export function validateArticleDraft(article){
 if(!article||article.approvedForPublish!==true||!article.post)throw Error('ARTICLE_NOT_APPROVED');
 if(!article.articleKey||!article.post.title?.trim())throw Error('ARTICLE_MISSING_TITLE');
 const h=article.post.content||'';
 validateArticlePresentation(article);
 validateRepresentativeLogo(article);
 // Game articles use the native Blogger heading. Existing commerce articles
 // retain their single in-body heading; multiple body headings remain invalid.
 const bodyHeadingCount=(h.match(/<h1\b/gi)||[]).length;
 if(bodyHeadingCount>1||(article.post.labels.includes('게임')&&bodyHeadingCount))throw Error('ARTICLE_DUPLICATE_TITLE');
 if((h.match(/<!--more-->/g)||[]).length!==1)throw Error('ARTICLE_JUMP_BREAK_COUNT');
 if(h.includes('data-ncp-copy=')&&new Set([...h.matchAll(/data-ncp-copy="([^"]+)"/g)].map(x=>x[1])).size!==(h.match(/data-ncp-copy=/g)||[]).length)throw Error('ARTICLE_DUPLICATE_COUPON');
 if(article.articleKey==='aniimo-codes-202610'&&!article.source?.gamePeriodModel){
  if(!h.includes('id="aniimo-tab-current"')||!h.includes('id="aniimo-tab-expired"')||!h.includes('id="aniimo-tab-guide"'))throw Error('ANIIMO_TABS_MISSING');
  if(!h.includes('#aniimo-tab-current:checked~.ncp-aniimo-panels')||!h.includes('#aniimo-tab-expired:checked~.ncp-aniimo-panels')||!h.includes('#aniimo-tab-guide:checked~.ncp-aniimo-panels'))throw Error('ANIIMO_TABS_NOT_INTERACTIVE');
  if(!h.includes('aniimoparty</strong> 안내 보상: 글리머 50개 · 고급 애니팟 5개 · 성장의 꽃 5개'))throw Error('ANIIMO_EXPIRED_REWARD_MISSING');
  if(!h.includes('미국 서버 전용')||!h.includes('Beebom')||!h.includes('GamesRadar+'))throw Error('ANIIMO_PROVENANCE_MISSING');
  if(!h.includes('data-ncp-featured-image="aniimo-codes-202610"'))throw Error('ANIIMO_ICON_MISSING');
 }
 if(article.post.labels.includes('게임'))validateGamePeriodArticle(article);
 validateGameCouponLayout(article.articleKey,article.post);
 validateGameFeaturedImage(article.articleKey,article.post);
 validateGameCandidateCoverage(article);
 validateMonthlyGameCouponTimeline(article);
 return true;
}
