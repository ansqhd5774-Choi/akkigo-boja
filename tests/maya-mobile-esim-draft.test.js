import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('Maya Mobile 10월 글은 공식 20%·백업 10%·만료 이력을 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='maya-mobile-esim-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','Maya Mobile']);
  const html=readFileSync(new URL('../drafts/maya-mobile-esim-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/maya-mobile-esim-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  for(const code of ['WELCOME20','MYBESTSIM']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/EXPERT10/);
  assert.match(html,/8월 25일/);
  assert.match(html,/165개 이상 국가/);
  assert.match(html,/data-ncp-featured-image="maya-mobile-esim-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,2);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['WELCOME20','MYBESTSIM']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
