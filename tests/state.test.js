import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';

test('실제 migration SQL은 미해결 시도 중복을 막고 완료 뒤 같은 허브 시도를 허용한다',()=>{
  const db=new DatabaseSync(':memory:');
  try {
    for (const name of ['0001_state.sql','0002_publish_lock.sql','0003_attempt_operation.sql']) db.exec(readFileSync(new URL(`../migrations/${name}`,import.meta.url),'utf8'));
    const insert=db.prepare('INSERT INTO publish_attempts(attempt_id,hub_key,status,started_at,operation) VALUES(?,?,?,?,?)');
    insert.run('one','zeus','RUNNING','2026-10-05T00:00:00Z','CREATE');
    assert.throws(()=>insert.run('two','zeus','RUNNING','2026-10-05T00:00:00Z','CREATE'),/UNIQUE/);
    db.exec("UPDATE publish_attempts SET status='UNKNOWN' WHERE attempt_id='one'");
    assert.throws(()=>insert.run('two','zeus','RUNNING','2026-10-05T00:00:00Z','CREATE'),/UNIQUE/);
    db.exec("UPDATE publish_attempts SET status='SUCCEEDED' WHERE attempt_id='one'");
    insert.run('two','zeus','RUNNING','2026-10-05T00:00:00Z','UPDATE');
    assert.equal(db.prepare('SELECT count(*) AS n FROM publish_attempts').get().n,2);
  } finally {db.close();}
});
