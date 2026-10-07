import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

test('유심사 10월 글은 공개 25% 코드와 제휴 30% 프로모션을 구분한다',()=>{
  const article=articles.find(x=>x.articleKey==='usimsa-promo-202610');
  assert.ok(article);
  assert.deepEqual(article.post.labels,['유심·로밍','유심사']);
  const html=readFileSync(new URL('../drafts/usimsa-promo-202610.html',import.meta.url),'utf8').trim();
  assert.equal(article.post.content,html);
  assert.match(html,/DISPOTGIFT/);
  assert.match(html,/25%/);
  assert.match(html,/최대 30%/);
  assert.match(html,/1,000원/);
  assert.match(html,/150개 이상 국가/);
  assert.match(html,/data-ncp-copy="DISPOTGIFT"/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('DISPOTGIFT'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|내부 운영 상태/);
});
