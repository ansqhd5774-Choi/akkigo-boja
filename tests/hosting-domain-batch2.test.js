import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};
const defs=[{"key":"gabia-domain-discount-202610","brand":"가비아"},{"key":"hostingkr-domain-discount-202610","brand":"호스팅케이알"},{"key":"dothome-domain-coupon-202610","brand":"닷홈"},{"key":"whois-nworks-domain-coupon-202610","brand":"후이즈"}];
for(const d of defs)test(d.brand+' 10월 호스팅·도메인 글 검증',()=>{const a=articles.find(x=>x.articleKey===d.key);assert.ok(a);assert.deepEqual(a.post.labels,['호스팅·도메인',d.brand]);const html=readFileSync(new URL('../drafts/'+d.key+'.html',import.meta.url),'utf8').trim();const draft=JSON.parse(readFileSync(new URL('../drafts/'+d.key+'.json',import.meta.url),'utf8'));assert.equal(a.post.content,html);assert.equal(draft.post.content,html);assert.match(html,new RegExp('data-ncp-featured-image="'+d.key+'"'));assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|내부 운영 상태/);});
