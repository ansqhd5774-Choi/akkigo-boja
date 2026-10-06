import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('Nomad eSIM 10월 글은 공개 20% 코드와 공식 추천 $5 할인을 분리한다',()=>{
  const article=articles.find(x=>x.articleKey==='nomad-esim-promo-202610');
  assert.ok(article);
  assert.equal(article.approvedForPublish,true);
  assert.deepEqual(article.post.labels,['유심·로밍','Nomad eSIM']);
  const html=readFileSync(new URL('../drafts/nomad-esim-promo-202610.html',import.meta.url),'utf8').trim();
  const draft=JSON.parse(readFileSync(new URL('../drafts/nomad-esim-promo-202610.json',import.meta.url),'utf8'));
  assert.equal(article.post.content,html);
  assert.equal(draft.post.content,html);
  assert.equal(draft.publicationStatus,'READY');
  assert.match(html,/TRAVELESIMEXPERT/);
  assert.match(html,/20%/);
  assert.match(html,/첫 구매 \$5 할인/);
  assert.match(html,/Add Promo Code/);
  assert.match(html,/Unlimited Thailand/);
  assert.match(html,/Trial eSIM/);
  assert.match(html,/data-ncp-featured-image="nomad-esim-202610"/);
  assert.equal((html.match(/data-ncp-copy=/g)||[]).length,1);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('TRAVELESIMEXPERT'),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
