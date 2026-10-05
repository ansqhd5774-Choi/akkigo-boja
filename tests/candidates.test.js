import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {listUnverifiedCandidates} from '../src/candidates.js';

function d1(db) {
  return {prepare(sql){return {bind(...args){return {async all(){return {results:db.prepare(sql).all(...args)};}};}};}};
}
function fixture() {
  const db=new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0005_coupon_candidates.sql',import.meta.url),'utf8'));
  const insert=db.prepare(`INSERT INTO coupon_candidates(candidate_id,source_id,brand,category,first_seen_at,last_seen_at,status,source_url,source_body_hash,payload_json) VALUES(?,?,?,?,?,?,?,?,?,?)`);
  insert.run('a','agoda-deals','Agoda','여행·숙박','2026-10-05T00:00:00Z','2026-10-05T02:00:00Z','UNVERIFIED','https://www.agoda.com/deals','h1',JSON.stringify({rate:15,evidenceLevel:'SOURCE_TEXT_ONLY'}));
  insert.run('b','tripcom-domestic-2026','Trip.com','여행·숙박','2026-10-05T00:00:00Z','2026-10-05T03:00:00Z','UNVERIFIED','https://kr.trip.com/sale/x','h2',JSON.stringify({rate:5,evidenceLevel:'SOURCE_TEXT_ONLY'}));
  insert.run('c','agoda-deals','Agoda','여행·숙박','2026-10-04T00:00:00Z','2026-10-05T04:00:00Z','REMOVED','https://www.agoda.com/deals','h3','{}');
  return {db,env:{DB:d1(db)}};
}

test('UNVERIFIED 후보만 최근 관찰순으로 조회한다',async()=>{
  const {db,env}=fixture();try {
    const rows=await listUnverifiedCandidates(env);
    assert.deepEqual(rows.map(x=>x.candidateId),['b','a']);
    assert.equal(rows[0].payload.evidenceLevel,'SOURCE_TEXT_ONLY');
  } finally {db.close();}
});

test('sourceId 필터와 limit을 적용한다',async()=>{
  const {db,env}=fixture();try {
    const rows=await listUnverifiedCandidates(env,{sourceId:'agoda-deals',limit:1});
    assert.equal(rows.length,1);assert.equal(rows[0].sourceId,'agoda-deals');
  } finally {db.close();}
});

test('잘못된 조회 인자는 차단한다',async()=>{
  const {db,env}=fixture();try {
    await assert.rejects(listUnverifiedCandidates(env,{limit:0}),/INVALID_CANDIDATE_LIMIT/);
    await assert.rejects(listUnverifiedCandidates(env,{sourceId:'bad id'}),/INVALID_SOURCE_ID/);
  } finally {db.close();}
});
