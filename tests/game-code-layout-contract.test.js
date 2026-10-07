import {test} from 'node:test';
import assert from 'node:assert/strict';
import articles from '../data/articles.json' with {type:'json'};
import supplement from '../data/articles-supplemental.json' with {type:'json'};
import {LEGACY_GAME_ARTICLE_KEYS, validateGameCouponLayout} from '../src/game-code-layout-contract.js';
const all=[...articles,...supplement];
const article=articles.find(a=>a.articleKey==='pokemon-go-codes-202610');
test('all new published game codes must follow the fixed grid contract',()=>{
 const gameKeys=new Set(all.filter(a=>a.post?.labels?.includes('게임')&&a.post.content.includes('data-ncp-copy=')).map(a=>a.articleKey));
 for(const key of LEGACY_GAME_ARTICLE_KEYS)assert.ok(gameKeys.has(key),'unknown legacy exception '+key);
 for(const item of all)assert.equal(validateGameCouponLayout(item.articleKey,item.post),true);
 assert.equal(LEGACY_GAME_ARTICLE_KEYS.has(article.articleKey),false);
});
test('publisher rejects title duplication, wrong grid, wrong height, wrong copy value',()=>{
 const post=article.post;
 const changes=[
 post.content.replaceAll('class="ncp-list-header" role="row"','class="broken-header" role="row"'),
 post.content.replace('height:68px;min-height:68px','height:144px;min-height:144px'),
 post.content.replace('grid-template-columns:26px 61px 63px minmax(0,1fr) 54px','grid-template-columns:1fr auto'),
 post.content.replace('grid-template-columns:46px 116px 108px minmax(0,1fr) 74px','grid-template-columns:1fr auto'),
 post.content.replace('class="ncp-col-source" role="cell"','class="missing-source" role="cell"'),
 post.content.replace('data-ncp-copy="ADIDASxPOKEMON"','data-ncp-copy="INVALIDCODE"'),
 post.content+'<h1>Repeated title</h1>',
 post.content+'<ul class="ncp-historical-list"></ul>'
 ];
 for(const content of changes)assert.throws(()=>validateGameCouponLayout(article.articleKey,{...post,content}),/GAME_COUPON_LAYOUT_/);
 assert.throws(()=>validateGameCouponLayout('brand-new-game',{...post,content:'<button data-ncp-copy="FOO">복사</button>'}),/GAME_COUPON_LAYOUT_/);
});
