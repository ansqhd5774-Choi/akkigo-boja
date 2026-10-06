import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('eSIM4Travel 10월 글은 10% 코드 3개와 공식 플랜 정보를 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='esim4travel-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','eSIM4Travel']);
  const html=readFileSync(new URL('../drafts/esim4travel-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/esim4travel-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  for(const code of ['ESIMDB','ESIMP','E4T10']){
    assert.match(html,new RegExp(code));
    assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
  }
  assert.match(html,/10%/);
  assert.match(html,/Global 72/);
  assert.match(html,/\$1\.8\/GB/);
  assert.match(html,/24\/7/);
  assert.match(html,/My eSIM/);
  assert.match(html,/data-ncp-featured-image="esim4travel-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,3);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  for(const code of ['ESIMDB','ESIMP','E4T10']) assert.equal(preview.includes(code),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
