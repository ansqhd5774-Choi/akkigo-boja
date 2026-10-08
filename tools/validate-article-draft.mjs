import {validateMonthlyGameCouponTimeline} from '../src/game-coupon-monthly.js';
import {validateGameCouponLayout} from '../src/game-code-layout-contract.js';
import {validateGameFeaturedImage} from '../src/game-featured-image-policy.js';
import {validateGameCandidateCoverage} from '../src/game-code-candidate-policy.js';
export function validateArticleDraft(article){
 if(!article||article.approvedForPublish!==true||!article.post)throw Error('ARTICLE_NOT_APPROVED');
 if(!article.articleKey||!article.post.title?.trim())throw Error('ARTICLE_MISSING_TITLE');
 const h=article.post.content||'';
 if(h.includes('<h1'))throw Error('ARTICLE_DUPLICATE_TITLE');
 if((h.match(/<!--more-->/g)||[]).length!==1)throw Error('ARTICLE_JUMP_BREAK_COUNT');
 if(h.includes('data-ncp-copy=')&&new Set([...h.matchAll(/data-ncp-copy="([^"]+)"/g)].map(x=>x[1])).size!==(h.match(/data-ncp-copy=/g)||[]).length)throw Error('ARTICLE_DUPLICATE_COUPON');
 validateGameCouponLayout(article.articleKey,article.post);
 validateGameFeaturedImage(article.articleKey,article.post);
 validateGameCandidateCoverage(article);
 validateMonthlyGameCouponTimeline(article);
 return true;
}
