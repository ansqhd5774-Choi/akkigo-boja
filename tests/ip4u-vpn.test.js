import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ip4uArticle} from '../src/ip4u-article.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

test('IP4U VPN 글은 기간할인·무료체험·교체권을 구분한다',()=>{
  const a=ip4uArticle;
  assert.equal(a.articleKey,'ip4u-benefits-202610');
  assert.equal(a.approvedForPublish,true);
  assert.deepEqual(a.post.labels,['VPN','IP4U']);
  const html=a.post.content;
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/최대 25%/);
  assert.match(html,/최대 20%/);
  assert.match(html,/마케팅 고정IP 최대 10%/);
  assert.match(html,/24시간 무료체험/);
  assert.match(html,/VPN 유동IP 1시간 무료체험/);
  assert.match(html,/PROXY 유동IP 1시간 무료체험/);
  assert.match(html,/무료 IP 교체권/);
  assert.match(html,/최초 가입 후 48시간 이내/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.equal(validateArticleDraft(a),true);
});

test('IP4U 공개코드와 출처 날짜 정책을 보존한다',()=>{
  const b=ip4uArticle.source.benefits;
  assert.equal(b.find(x=>x.name==='IP4U 고정IP 장기결제').value,'최대 25%');
  assert.equal(b.find(x=>x.name==='IP4U 고정IP 장기결제').sourcePublishedAt,null);
  assert.equal(b.find(x=>x.name==='VPN 유동IP 장기결제').value,'최대 20%');
  assert.equal(b.find(x=>x.name==='마케팅 고정IP 장기결제').value,'최대 10%');
  assert.equal(b.find(x=>x.name==='IP4U 고정IP 무료체험').value,'24시간');
  assert.equal(b.find(x=>x.name==='VPN 유동IP 무료체험').value,'1시간');
  assert.equal(b.find(x=>x.name==='PROXY 유동IP 무료체험').value,'1시간');
  assert.equal(b.find(x=>x.name==='무료 IP 교체권').value,'1~3개');
  assert.equal(ip4uArticle.source.publicStringCode.status,'NONE_VERIFIED_CURRENT');
  assert.equal(ip4uArticle.source.searchMeasurement.status,'NOT_MEASURED');
});
