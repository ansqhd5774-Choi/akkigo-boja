import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('SimCorner 10월 글은 BOGO25·WELCOME10 공식 조건을 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='simcorner-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','SimCorner']);
  const html=readFileSync(new URL('../drafts/simcorner-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/simcorner-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  for(const code of ['BOGO25','WELCOME10']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/두 번째 대상 상품 25% 할인/);
  assert.match(html,/첫 eligible 주문/);
  assert.match(html,/한 주문에 프로모코드 한 개/);
  assert.match(html,/5% Price Beat/);
  assert.match(html,/30-day Price Lock/);
  assert.match(html,/data-ncp-featured-image="simcorner-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,2);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['BOGO25','WELCOME10']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
