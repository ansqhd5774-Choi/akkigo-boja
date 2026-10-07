import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
const defs=[{"key":"hostinger-coupons-202610","brand":"Hostinger","codes":["COUPONSPAGE"]},{"key":"spaceship-domain-coupons-202610","brand":"Spaceship","codes":["COM67","NET19","XYZ52","IO85","SPSR86"]},{"key":"namecheap-birthday-202610","brand":"Namecheap","codes":["BDAYTRANSFER26"]},{"key":"cafe24-domain-discount-202610","brand":"카페24","codes":[]}];
for(const d of defs)test(d.brand+' 10월 호스팅·도메인 글 검증',()=>{const a=articles.find(x=>x.articleKey===d.key);assert.ok(a);assert.deepEqual(a.post.labels,['호스팅·도메인',d.brand]);const html=readFileSync(new URL('../drafts/'+d.key+'.html',import.meta.url),'utf8').trim();const draft=JSON.parse(readFileSync(new URL('../drafts/'+d.key+'.json',import.meta.url),'utf8'));assert.equal(a.post.content,html);assert.equal(draft.post.content,html);assert.match(html,new RegExp('data-ncp-featured-image="'+d.key+'"'));for(const c of d.codes)assert.match(html,new RegExp('data-ncp-copy="'+c+'"'));assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|내부 운영 상태/);});


test('Hostinger 글은 일반 OG 이미지가 아닌 공식 쿠폰 프로모션 이미지를 사용한다',()=>{
  const html=readFileSync(new URL('../drafts/hostinger-coupons-202610.html',import.meta.url),'utf8');
  assert.match(html,/3fc114d2-0a8c-4dc0-ddc7-f83749a96d00\/public/);
  assert.doesNotMatch(html,/hostinger\.com\/kr\/og-image\.png/);
});
