import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gameSearchTitle,gameSearchTitleBranches} from '../src/game-search-titles.js';
test('SEO titles and descriptions preserve explicit article metadata',()=>{
 const xml=readFileSync(new URL('../theme/blogger-native-base.xml',import.meta.url),'utf8');
 assert.match(xml,/isHomepage'>아끼고 보자 \| 게임 쿠폰·할인코드 모음/);
 assert.match(xml,/<data:blog.searchLabel\/> 쿠폰·할인 안내/);
 assert.match(xml,/isSingleItem and !data:blog.metaDescription/);
 assert.equal((xml.match(/<title>/g)||[]).length,1);
});

test('short game search titles keep keywords without active-code claims',()=>{
 assert.equal(gameSearchTitle('메이플 키우기'),'메이플 키우기 쿠폰 코드 모음 | 만료 정보·입력 방법 — 아끼고 보자');
 const branches=gameSearchTitleBranches(['메이플 키우기','메이플 키우기','원신 쿠폰 모음']);
 assert.equal((branches.match(/<b:elseif/g)||[]).length,1);
 assert.match(branches,/data:view.isPost and data:blog.pageName/);
 assert.ok(!/최신|유효|사용 가능|2026/.test(branches));
});
test('No-JavaScript homepage links refer to published blog URLs',()=>{
 const links=JSON.parse(readFileSync(new URL('../theme/seo-post-links.json',import.meta.url),'utf8'));
 const xml=readFileSync(new URL('../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',import.meta.url),'utf8');
 assert.ok(links.length>0);
 assert.match(xml,/<noscript><nav/);
 for(const row of links){assert.equal(new URL(row.url).origin,'https://lsifl.blogspot.com');assert.ok(row.title);assert.ok(xml.includes(row.url));}
});

test('homepage has one consistent WebSite identity for Google site names',()=>{
 const xml=readFileSync(new URL('../theme/blogger-native-base.xml',import.meta.url),'utf8');
 const blocks=[...xml.matchAll(/<script type='application\/ld\+json'>(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
 const websites=blocks.filter(block=>block['@type']==='WebSite');
 assert.equal(websites.length,1);
 assert.equal(websites[0].name,'아끼고 보자');
 assert.equal(websites[0].url,'https://lsifl.blogspot.com/');
 assert.match(xml,/<meta content='아끼고 보자' property='og:site_name'\/>/);
 assert.match(xml,/<b:if cond='data:view.isHomepage'>\s*<script type='application\/ld\+json'>/);
});
