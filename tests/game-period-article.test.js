import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderGamePeriodArticle,groupPeriodRecords,validateGamePeriodArticle,normalizePeriodRecords} from '../src/game-period-article.js';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import hubModels from '../data/game-period-hubs.json' with {type:'json'};
import {validatePresentationDOM} from '../tools/validate-presentation-dom.mjs';
const record=i=>({code:'CODE'+i,sourcePublishedAt:'2026-08-31',sources:[],expiry:'미확인'});
test('6/13/20 codes remain in one year list with five visible rows, never five-row sections',()=>{
 for(const n of [6,13,20]){
  const model={articleKey:'example-game',records:Array.from({length:n},(_,i)=>record(i))};
  const content=renderGamePeriodArticle(model);
  assert.equal((content.match(/data-ncp-period="2026"/g)||[]).length,1);
  assert.equal((content.match(/class="ncp-list-more"/g)||[]).length,1);
  assert.ok(content.includes('더 보기 '+(n-5)));
  assert.equal(validatePresentationDOM({articleKey:model.articleKey,post:{content},source:{presentationVersion:'compact-r2'}}),true);
 }
});
test('original dates, unknown dates, latest evidence and deduplicated provenance stay distinct',()=>{
 const rows=[record(1),{...record(1),sources:[{url:'https://example.org'}]}, {...record(2),sourcePublishedAt:null}, {...record(3),sourcePublishedAt:'2025-09-01'}];
 const groups=groupPeriodRecords(rows);
 assert.equal(groups.find(g=>g.period==='unknown').rows.length,1);
 assert.equal(groups.find(g=>g.period==='2026').rows.length,1);
 assert.equal(normalizePeriodRecords(rows)[0].sources.length,1);
 assert.throws(()=>groupPeriodRecords([{...record(1),latest:true}]),/LATEST_EVIDENCE/);
 assert.throws(()=>groupPeriodRecords([{...record(1),sourcePublishedAt:'2026-02-30'}]),/SOURCE_DATE/);
});
test('all registered articles and 3 hubs share the generator; manual date-box edits fail closed',()=>{
 const all=[...primary,...supplemental].filter(a=>a.post.labels.includes('게임'));
 assert.ok(all.length>=36);
 assert.ok(all.reduce((n,a)=>n+a.source.gamePeriodModel.records.length,0)>=1427);
 for(const a of all){
  assert.equal(validateGamePeriodArticle(a),true);
  assert.equal(validatePresentationDOM(a),true);
  assert.throws(()=>validateGamePeriodArticle({...a,post:{...a.post,content:a.post.content+'<section><h2>8월 31일</h2></section>'}}),/GENERATED_CONTENT_DRIFT/);
 }
 assert.equal(Object.keys(hubModels).length,3);
 const dice=all.find(a=>a.articleKey==='random-dice-2-codes-202610');
 assert.equal(dice.source.gamePeriodModel.records.length,33);
 assert.equal(dice.source.gamePeriodModel.records.filter(r=>r.sourcePublishedAt===null).length,26);
});
