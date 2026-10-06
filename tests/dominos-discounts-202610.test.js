import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('도미노피자 10월 글은 배달과 방문포장 혜택을 구분한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/dominos-discounts-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/dominos-discounts-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'dominos-discounts-202610');
  assert.equal(draft.approvedForPublish,true);
  assert.equal(draft.publicationStatus,'READY');
  assert.deepEqual(draft.post.labels,['배달·외식','도미노피자']);
  assert.equal(draft.post.content,html.trim());
  assert.match(html,/KT 달\.달\.혜택/);
  assert.match(html,/50%/);
  assert.match(html,/방문포장/);
  assert.match(html,/25,000원 이상 45,000원까지/);
  assert.match(html,/유독\+Google AI PRO/);
  assert.match(html,/배달비 제외 15,000원 이상/);
  assert.match(html,/최대 20%/);
  assert.match(html,/1일 1회 최대 10,000원/);
  assert.match(html,/<!--more-->/);
  assert.doesNotMatch(html,/&#10003;|실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});

test('도미노피자 목록 미리보기에는 요약만 노출한다',()=>{
  const html=readFileSync(new URL('../drafts/dominos-discounts-202610.html',import.meta.url),'utf8');
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.match(preview,/10월 최대 할인/);
  assert.match(preview,/배달 할인/);
  assert.match(preview,/50%/);
  assert.equal(preview.includes('<script'),false);
});
