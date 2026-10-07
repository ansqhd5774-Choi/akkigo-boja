import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('SEO titles and descriptions preserve explicit article metadata',()=>{
 const xml=readFileSync(new URL('../theme/blogger-native-base.xml',import.meta.url),'utf8');
 assert.match(xml,/isHomepage'>아끼고 보자 \| 게임 쿠폰·할인코드 모음/);
 assert.match(xml,/<data:blog.searchLabel\/> 쿠폰·할인 안내/);
 assert.match(xml,/isSingleItem and !data:blog.metaDescription/);
 assert.equal((xml.match(/<title>/g)||[]).length,1);
});
test('No-JavaScript homepage links refer to published blog URLs',()=>{
 const links=JSON.parse(readFileSync(new URL('../theme/seo-post-links.json',import.meta.url),'utf8'));
 const xml=readFileSync(new URL('../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',import.meta.url),'utf8');
 assert.ok(links.length>0);
 assert.match(xml,/<noscript><nav/);
 for(const row of links){assert.equal(new URL(row.url).origin,'https://lsifl.blogspot.com');assert.ok(row.title);assert.ok(xml.includes(row.url));}
});
