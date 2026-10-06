import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('BNESIM 10월 글은 30% 코드 2개와 주문당 1개 적용 조건을 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='bnesim-esim-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','BNESIM']);
  const html=readFileSync(new URL('../drafts/bnesim-esim-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/bnesim-esim-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  for(const code of ['TRAVELESIMEXPERT','MYBESTSIM']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/30%/);
  assert.match(html,/주문당 할인코드 한 개/);
  assert.match(html,/200개 이상 국가/);
  assert.match(html,/data-ncp-featured-image="bnesim-esim-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,2);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['TRAVELESIMEXPERT','MYBESTSIM']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
