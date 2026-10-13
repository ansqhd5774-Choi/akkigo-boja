import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {normalizeHistoricalPeriod,recordPeriod} from '../src/game-period-policy.js';
import {groupPeriodRecords} from '../src/game-period-article.js';

const base={code:'CODE',sourcePublishedAt:null,sources:[],expiry:'미확인',latest:true,latestEvidence:'third-party current list'};

test('past exact expiry overrides a newer latest claim and assigns the expiry year',()=>{
  const record={...base,expiry:'2024-03-30'};
  assert.equal(normalizeHistoricalPeriod(record,'2026-10-14'),true);
  assert.equal(record.latest,false);
  assert.equal(record.periodYear,'2024');
  assert.equal(recordPeriod(record),'2024');
  assert.equal(groupPeriodRecords([record]).find(g=>g.period==='2024').rows.length,1);
});

test('explicit ended report leaves latest and falls back to source year when available',()=>{
  const record={...base,sourcePublishedAt:'2023-12-15',expiry:'과거 종료 보고'};
  normalizeHistoricalPeriod(record,'2026-10-14');
  assert.equal(record.latest,false);
  assert.equal(record.periodYear,'2023');
  assert.equal(recordPeriod(record),'2023');
});

test('ended report without a defensible year becomes unknown instead of latest',()=>{
  const record={...base,expiry:'과거 종료 보고'};
  normalizeHistoricalPeriod(record,'2026-10-14');
  assert.equal(record.latest,false);
  assert.equal(record.periodYear,undefined);
  assert.equal(recordPeriod(record),'unknown');
});

test('same-day or future expiry is not prematurely demoted',()=>{
  for(const expiry of ['2026-10-14','2026-10-15']){
    const record={...base,expiry};
    assert.equal(normalizeHistoricalPeriod(record,'2026-10-14'),false);
    assert.equal(record.latest,true);
    assert.equal(record.periodYear,undefined);
    assert.equal(recordPeriod(record),'latest');
  }
});

test('persisted historical period wins even if stale latest data survives elsewhere',()=>{
  const record={...base,periodYear:'2024'};
  assert.equal(recordPeriod(record),'2024');
  assert.equal(groupPeriodRecords([record]).find(g=>g.period==='2024').rows.length,1);
});

test('declarative refresh normalizes period data before generated rendering without adding a blocking validator',()=>{
  const source=readFileSync('tools/apply-game-period-refresh.mjs','utf8');
  assert.match(source,/normalizeHistoricalPeriod/);
  assert.match(source,/GAME_PERIOD_REFRESH_PERIOD_NORMALIZED/);
  assert.doesNotMatch(source,/GAME_PERIOD_REFRESH_EXPIRED_LATEST_REJECTED/);
});
