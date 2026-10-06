import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('Eskimo 10월 글은 1GB Gift·첫구매 할인·가입 무료 데이터를 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='eskimo-esim-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','Eskimo']);
  const html=readFileSync(new URL('../drafts/eskimo-esim-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/eskimo-esim-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  for(const code of ['TRIPLE-A','WELCOME','FREE500MB']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/글로벌 eSIM 1GB 무료/);
  assert.match(html,/첫 구매 50%/);
  assert.match(html,/글로벌 데이터 500MB 무료/);
  assert.match(html,/2026년 11월 30일까지/);
  assert.match(html,/175개 국가/);
  assert.match(html,/만료 없음/);
  assert.match(html,/data-ncp-featured-image="eskimo-esim-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,3);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['TRIPLE-A','WELCOME','FREE500MB']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
