import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hotvpnArticle} from '../src/hotvpn-article.js';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';

test('HotVPN 한국 서비스 글은 가입 포인트·적립·기간 할인·정기결제를 구분한다',()=>{
  const a=hotvpnArticle;
  assert.equal(a.articleKey,'hotvpn-benefits-202610');
  assert.equal(a.approvedForPublish,true);
  assert.deepEqual(a.post.labels,['VPN','HotVPN']);
  const html=a.post.content;
  assert.equal((html.match(/<!--more-->/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/신규회원 3,000포인트/);
  assert.match(html,/결제금액의 10%/);
  assert.match(html,/180일 5%/);
  assert.match(html,/360일 10%/);
  assert.match(html,/정기결제 2%/);
  assert.match(html,/90일 5%/);
  assert.match(html,/180일 15%/);
  assert.match(html,/360일 25%/);
  assert.match(html,/정기결제 5%/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,0);
  assert.equal(validateArticleDraft(a),true);
});

test('HotVPN 동명이인 서비스와 날짜 정책을 분리한다',()=>{
  const b=hotvpnArticle.source.benefits;
  assert.equal(b.find(x=>x.name==='신규회원 가입 포인트').value,'3000P');
  assert.equal(b.find(x=>x.name==='신규회원 가입 포인트').sourcePublishedAt,null);
  assert.equal(b.find(x=>x.name==='서비스 결제 포인트 적립').value,'10%');
  assert.equal(b.find(x=>x.name==='고정 VPN 360일').value,'10%');
  assert.equal(b.find(x=>x.name==='유동 VPN 360일').value,'25%');
  assert.equal(hotvpnArticle.source.exclusions.length,2);
  assert.equal(hotvpnArticle.source.publicStringCode.status,'NONE_VERIFIED_CURRENT');
  assert.equal(hotvpnArticle.source.freeTrial.status,'NONE_VERIFIED_CURRENT');
  assert.equal(hotvpnArticle.source.searchMeasurement.status,'NOT_MEASURED');
});
