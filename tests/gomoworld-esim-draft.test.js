import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('GoMoWorld 10월 글은 10%·정액 할인·무료 체험을 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='gomoworld-esim-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','GoMoWorld']);
  const html=readFileSync(new URL('../drafts/gomoworld-esim-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/gomoworld-esim-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  for(const code of ['TRAVELESIMEXPERT','SIMDB2']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/10%/);
  assert.match(html,/€3/);
  assert.match(html,/1GB 무료/);
  assert.match(html,/200개가 넘는 목적지|200\+ destinations/);
  assert.match(html,/700,000\+ travelers/);
  assert.match(html,/data-ncp-featured-image="gomoworld-esim-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,2);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['TRAVELESIMEXPERT','SIMDB2']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
