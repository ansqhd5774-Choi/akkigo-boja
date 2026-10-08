import assert from 'node:assert/strict';
import {groupPeriodRecords,validateGamePeriodArticle} from '../src/game-period-article.js';
import {validatePresentationDOM} from '../tools/validate-presentation-dom.mjs';
export function assertPeriodHTML(content){
 const key=content.match(/data-ncp-article="([^"]+)"/)?.[1];
 assert.ok(key);
 assert.ok(content.includes('data-ncp-template="game-period-tabs-r1"'));
 assert.ok(content.includes('value="latest" checked="checked"'));
 const copies=[...content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(copies).size,copies.length);
 assert.deepEqual(copies,[...content.matchAll(/data-ncp-share="([^"]+)"/g)].map(m=>m[1]));
 assert.equal(validatePresentationDOM({articleKey:key,source:{presentationVersion:'compact-r2'},post:{content}}),true);
 return true;
}
export function assertPeriodArticle(a){
 assert.equal(validateGamePeriodArticle(a),true);
 const html=a.post.content;
 const groups=groupPeriodRecords(a.source.gamePeriodModel.records).filter(g=>g.rows.length);
 assert.equal((html.match(/class="ncp-list-header" role="row"/g)||[]).length,groups.length);
 assert.equal((html.match(/data-ncp-copy=/g)||[]).length,a.source.gamePeriodModel.records.length);
 assert.ok(!html.includes('<style>'));
 return true;
}
