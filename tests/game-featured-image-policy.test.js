import {test} from 'node:test';
import assert from 'node:assert/strict';
import articles from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import registry from '../data/game-app-icons.json' with {type:'json'};
import {LEGACY_GAME_ICON_KEYS,validateGameFeaturedImage} from '../src/game-featured-image-policy.js';
import {readFileSync} from 'node:fs';
const all=[...articles,...supplemental];
const key='pokemon-go-codes-202610';
const pokemon=all.find(x=>x.articleKey===key);
test('official Pokémon GO app icon and original article are consistent',()=>{
  const r=registry.find(x=>x.articleKey===key);
  assert.ok(r);assert.equal(r.gameName,'Pokémon GO');
  assert.equal(validateGameFeaturedImage(key,pokemon.post),true);
  const iconTag=pokemon.post.content.slice(pokemon.post.content.indexOf('<img ')).split('>')[0]+'>';
  assert.ok(iconTag.includes(r.iconUrl));
  assert.ok(pokemon.post.content.includes(r.appStoreUrl));
  assert.ok(readFileSync(new URL('../theme/article-compact.css',import.meta.url),'utf8').includes('aspect-ratio:1/1;object-fit:contain'));
  assert.equal((pokemon.post.content.match(/data-ncp-featured-image=/g)||[]).length,1);
  assert.equal((pokemon.post.content.match(/data-ncp-app-icon="true"/g)||[]).length,1);
});
test('new game pages require verified store icon; existing game posts are preserved',()=>{
  const existing=all.filter(x=>x.post?.labels?.includes('게임')&&LEGACY_GAME_ICON_KEYS.has(x.articleKey)).map(x=>x.articleKey);
  assert.equal(existing.length,16); // only protected legacy keys, not new icon-verified articles
  assert.deepEqual([...LEGACY_GAME_ICON_KEYS].sort(),existing.sort());
  for(const article of all)assert.equal(validateGameFeaturedImage(article.articleKey,article.post),true);
  assert.throws(()=>validateGameFeaturedImage('new-game',{labels:['게임'],content:pokemon.post.content}),/GAME_APP_ICON_REGISTRY_REQUIRED/);
});
test('publisher refuses marketing banners, fake icons, wrong aspect and wrong official source',()=>{
  const h=pokemon.post.content,r=registry.find(x=>x.articleKey===key);
  const bad=[
    h.replace(r.iconUrl,'https://example.org/random-banner.jpg'),
    h.replace('data-ncp-app-icon="true"','data-ncp-app-icon="false"'),
    h.replace('data-ncp-app-icon-source="'+r.appStoreUrl+'"','data-ncp-app-icon-source="https://example.org"'),
    h.replace('data-ncp-template="game-period-tabs-r1"','data-ncp-template="wrong"'),
    h.replace('height="512"','height="300"'),
    h.replace('alt="Pokémon GO 공식 앱 아이콘"','alt="마케팅 포스터"'),
    h.replace('width="512"','width="1000"'),
    h.replace('<figure class="ncp-featured-image"','<img src="https://example.org/unrelated.jpg"><figure class="ncp-featured-image"')
  ];
  for(const content of bad)assert.throws(()=>validateGameFeaturedImage(key,{...pokemon.post,content}),/GAME_APP_ICON_/);
});
