import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('Global YO 10월 글은 15% 코드와 공식 자동 세일·YOYO 혜택을 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='globalyo-esim-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','Global YO']);
  const html=readFileSync(new URL('../drafts/globalyo-esim-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/globalyo-esim-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  for(const code of ['MYBESTSIM15','EDC15','LOWCOSTEROS']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/15%/);
  assert.match(html,/200\+ 국가/);
  assert.match(html,/YOYO\$/);
  assert.match(html,/최대 50%/);
  assert.match(html,/자동 세일/);
  assert.match(html,/data-ncp-featured-image="globalyo-esim-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,3);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['MYBESTSIM15','EDC15','LOWCOSTEROS']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
