import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import coupons from '../data/coupons.json' with {type:'json'};
import {validateCoupon} from '../src/coupons.js';

test('Pokémon GO 10월 코드 데이터는 공식 adidas와 LEGO 아이템 보상을 구분한다',()=>{
  const adidas=coupons.find(x=>x.id==='pokemongo-adidas-202610');
  const lego=coupons.find(x=>x.id==='pokemongo-lego-berries-202610');
  assert.ok(adidas);
  assert.ok(lego);
  assert.equal(adidas.code,'ADIDASxPOKEMON');
  assert.equal(adidas.status,'UNVERIFIED');
  assert.equal(adidas.endMode,'FIXED_DATE');
  assert.equal(adidas.expiresAt,'2027-01-15T14:59:00.000Z');
  assert.equal(lego.code,'LEGOxPOKEMONGOxBERRIES');
  assert.equal(lego.status,'UNVERIFIED');
  assert.equal(lego.endMode,'UNKNOWN');
  assert.deepEqual(lego.rewards,[
    {name:'몬스터볼',quantity:10},
    {name:'라즈열매',quantity:5},
    {name:'파인열매',quantity:5},
    {name:'나나열매',quantity:5}
  ]);
  assert.equal(validateCoupon(adidas,Date.parse('2026-10-06T14:43:00Z')),adidas);
  assert.equal(validateCoupon(lego,Date.parse('2026-10-06T14:43:00Z')),lego);
});

test('Pokémon GO 공개 글은 현재 코드와 예정 Twitch Drop을 분리한다',()=>{
  const draft=JSON.parse(readFileSync(new URL('../drafts/pokemon-go-codes-202610.json',import.meta.url),'utf8'));
  const html=readFileSync(new URL('../drafts/pokemon-go-codes-202610.html',import.meta.url),'utf8');
  assert.equal(draft.articleKey,'pokemon-go-codes-202610');
  assert.equal(draft.publicationStatus,'READY');
  assert.equal(draft.approvedForPublish,true);
  assert.deepEqual(draft.post.labels,['게임','Pokémon GO']);
  assert.equal(draft.post.content,html.trim());
  assert.match(html,/ADIDASxPOKEMON/);
  assert.match(html,/LEGOxPOKEMONGOxBERRIES/);
  assert.match(html,/adidas 신발 아바타 아이템/);
  assert.match(html,/몬스터볼 10개/);
  assert.match(html,/2027년 1월 15일/);
  assert.match(html,/Pokémon Night Out Twitch Drop/);
  assert.match(html,/10월 25일 오전 11시 30분/);
  assert.match(html,/store\.pokemongo\.com\/offer-redemption/);
  assert.match(html,/<!--more-->/);
  const preview=html.slice(0,html.indexOf('<!--more-->'));
  assert.equal(preview.includes('ADIDASxPOKEMON'),false);
  assert.equal(preview.includes('LEGOxPOKEMONGOxBERRIES'),false);
  assert.equal(preview.includes('<script'),false);
  assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator|내부 운영 상태|활성 추천/);
});
