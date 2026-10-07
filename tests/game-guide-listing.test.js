import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
import {couponCatalog} from '../src/coupon-lifecycle.js';
import coupons from '../data/coupons.json' with {type:'json'};

const home=readFileSync(new URL('../theme/home-r4.js',import.meta.url),'utf8');
const label=readFileSync(new URL('../theme/game-icon-grid.js',import.meta.url),'utf8');
const theme=readFileSync(new URL('../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',import.meta.url),'utf8');
const legacy=readFileSync(new URL('../akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml',import.meta.url),'utf8');
const fort=articles.find(a=>a.articleKey==='fortblox-mobile-go-codes-202610');

test('포트블록스는 게임 라벨 글이지만 쿠폰 카탈로그 현재 목록에는 존재하지 않는다',()=>{
  assert.ok(fort);
  assert.deepEqual(fort.post.labels,['게임','포트블록스']);
  const catalog=couponCatalog(coupons);
  assert.equal(catalog.current.some(x=>x.brand==='포트블록스'),false);
  assert.equal(fort.source.status,'UNVERIFIED');
  assert.equal(fort.source.codes.length,25);
});

test('홈의 게임 목록은 LIVE Blogger feed를 카탈로그 날짜 검증에 의존하지 않고 표시한다',()=>{
  assert.match(home,/feeds\/posts\/default\?alt=json/);
  assert.match(home,/guideCodeCount\(entry\)/);
  assert.match(home,/data-ncp-copy=/);
  assert.doesNotMatch(home,/currentBrands|filter\(eligible\)|\/coupons\/catalog/);
  assert.match(home,/card\(entry,true,guideCodeCount\(entry\)\)/);
  const found=[...fort.post.content.matchAll(/data-ncp-copy=["']([^"']+)["']/g)];
  assert.equal(new Set(found.map(m=>m[1])).size,25);
});

test('게임 라벨 목록에서 포트블록스를 카탈로그 부재로 제외하지 않는다',()=>{
  assert.match(label,/feeds\/posts\/default\/-\//);
  assert.match(label,/querySelectorAll\('\[data-ncp-copy\]'\)/);
  assert.match(label,/codeCount>0/);
  assert.doesNotMatch(label,/currentBrands|\/coupons\/catalog/);
  assert.match(label,/card\.append\(wrap,date\)/);
});

test('테마 생성본에도 동일한 게임 글 목록 수정이 존재한다',()=>{
  assert.equal(theme,legacy);
  assert.ok(theme.includes(home));
  assert.ok(theme.includes(label));
  assert.doesNotMatch(theme,/currentBrands&&!currentBrands\.has\(name\)/);
});
