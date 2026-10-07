import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
const defs=[{"key":"nygirlz-coupons-202610","brand":"뉴욕걸즈","asset":"nygirlz-202610.svg"},{"key":"malltail-coupons-202610","brand":"몰테일","asset":"malltail-202610.svg"}];
for(const d of defs)test(d.brand+' 해외직구 글 검증',()=>{const a=articles.find(x=>x.articleKey===d.key);assert.ok(a);assert.deepEqual(a.post.labels,['해외직구',d.brand]);const html=readFileSync(new URL('../drafts/'+d.key+'.html',import.meta.url),'utf8').trim();const draft=JSON.parse(readFileSync(new URL('../drafts/'+d.key+'.json',import.meta.url),'utf8'));assert.equal(a.post.content,html);assert.equal(draft.post.content,html);assert.match(html,new RegExp('https://akkigo-boja\\.ansqhd5774\\.workers\\.dev/'+d.asset.replace('.','\\.')));assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|video-game\.svg/);});
