import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {collectSources} from '../src/collector.js';

test('실행 기록은 예약 실행과 수동 실행을 구분하고 일부 원천 실패를 보존한다',async()=>{
  const db=new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_state.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../migrations/0004_collection_runs.sql',import.meta.url),'utf8'));
  const env={DB:{prepare(sql){return {bind(...args){return {async run(){return db.prepare(sql).run(...args);}};}};}}};
  try {
    let calls=0;
    await collectSources(env,async()=>++calls===2?new Response('denied',{status:403}):new Response('<title>fixture</title>',{headers:{'content-type':'text/html'}}),{trigger:'SCHEDULED',scheduledAt:'2026-10-05T09:00:00Z'});
    const scheduled=db.prepare('SELECT * FROM collection_runs').get();
    assert.equal(scheduled.trigger_kind,'SCHEDULED');
    assert.equal(scheduled.scheduled_at,'2026-10-05T09:00:00Z');
    assert.equal(scheduled.status,'PARTIAL');
    assert.equal(scheduled.observed_count,4);assert.equal(scheduled.fetched_count,3);
    await collectSources(env,async()=>new Response('<title>fixture</title>',{headers:{'content-type':'text/html'}}));
    const manual=db.prepare("SELECT * FROM collection_runs WHERE trigger_kind='MANUAL'").get();
    assert.equal(manual.status,'SUCCEEDED');assert.equal(manual.scheduled_at,null);
  } finally {db.close();}
});
