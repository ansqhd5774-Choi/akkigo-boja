import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import sources from '../data/sources.json' with {type:'json'};
import {collectSources} from '../src/collector.js';

function d1(db) {
  return {prepare(sql){return {bind(...args){return {async run(){return db.prepare(sql).run(...args);}};}};}};
}

test('공식 여행 텍스트 후보는 UNVERIFIED candidate로 저장되고 재관찰 시 중복 증가하지 않는다',async()=>{
  const db=new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_state.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../migrations/0004_collection_runs.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../migrations/0005_coupon_candidates.sql',import.meta.url),'utf8'));
  const env={DB:d1(db)};
  const transport=async url=>{
    if (url.includes('agoda.com')) return new Response('<title>Agoda</title><div>Up to ₩40,000 Off Hotels Minimum spend of ₩138,200 Expires in 3 days</div>',{headers:{'content-type':'text/html'}});
    if (url.includes('trip.com')) return new Response('<title>Trip</title><div>프로모션 기간 2026년 7월 1일 ~ 12월 31일 국내 투어·티켓 5% 할인쿠폰</div>',{headers:{'content-type':'text/html'}});
    return new Response('<title>fixture</title>',{headers:{'content-type':'text/html'}});
  };
  try {
    const first=await collectSources(env,transport);
    assert.equal(first.length,sources.length);
    assert.equal(first.filter(x=>x.candidateCount>0).length,2);
    const rows=db.prepare('SELECT candidate_id,source_id,status,payload_json FROM coupon_candidates ORDER BY source_id').all();
    assert.equal(rows.length,2);
    assert.ok(rows.every(x=>x.status==='UNVERIFIED'));
    assert.ok(rows.every(x=>JSON.parse(x.payload_json).evidenceLevel==='SOURCE_TEXT_ONLY'));
    await collectSources(env,transport);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM coupon_candidates').get().n,2);
  } finally {db.close();}
});
