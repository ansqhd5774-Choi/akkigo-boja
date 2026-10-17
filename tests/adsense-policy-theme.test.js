import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DOMParser} from '@xmldom/xmldom';
import {applyAdsensePolicy} from '../tools/adsense-policy-theme.mjs';
const built=readFileSync('akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml','utf8');
test('policy build retains native metadata and server-rendered summaries',()=>{
  const errors=[];
  const doc=new DOMParser({onError:(level,message)=>errors.push(message)}).parseFromString(built,'application/xml');
  assert.deepEqual(errors,[]);
  assert.ok(doc.getElementsByTagName('b:eval').length>0);
  const hub=[...Array.from(doc.getElementsByTagName('section'))].find(e=>e.getAttribute('id')==='ncp-game-hub');
  assert.ok(hub);
  assert.equal(Array.from(hub.getElementsByTagName('div')).filter(e=>e.getAttribute('class')==='ncp-game-grid').length,1);
  assert.ok(built.includes("name='all-head-content'"));
  assert.ok(built.includes("data:summaryIndex &lt; 4"));
  assert.equal(applyAdsensePolicy(built),built);
});
test('utility script policy is early and excludes advertising script origins',()=>{
  const meta=/<head><b:if cond='!data:view.isPost'><meta content="([^"]+)" http-equiv='Content-Security-Policy'\/>/.exec(built);
  assert.ok(meta);
  assert.ok(meta[1].includes("'self' 'unsafe-inline'"));
  assert.ok(meta[1].includes('wcs.pstatic.net'));
  assert.ok(!/googlesyndication|doubleclick/.test(meta[1]));
  for(const widget of built.matchAll(/<b:widget\b[^>]*type='AdSense'[^>]*>/g))assert.ok(widget[0].includes("cond='data:view.isPost'"));
});
