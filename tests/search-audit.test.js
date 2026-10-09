import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inspectPage,compareCoverage} from '../src/search-audit.js';
test('search audit detects reversed attributes, header blocking and duplicate metadata',()=>{
 const p=inspectPage(`<meta content="one" name="description"><meta name='description' content='two'><link href='/x' rel='canonical'><script type='application/ld+json'>{broken}</script>`,'https://lsifl.blogspot.com/x',200,{xRobots:'noindex'});
 assert.equal(p.noindex,true);assert.equal(p.descriptions.length,2);assert.deepEqual(p.canonical,['/x']);assert.equal(p.schemaErrors.length,1);
});
test('coverage distinguishes static href links and missing home links from indexing',()=>{
 const home=inspectPage(`<a href='/x?utm_source=a#b'>x</a><button onclick="go('/y')">y</button>`,'https://lsifl.blogspot.com/',200);
 const pages=['x','y'].map(s=>inspectPage(`<meta name='description' content='ok'><link rel='canonical' href='https://lsifl.blogspot.com/${s}'>`,'https://lsifl.blogspot.com/'+s,200));
 assert.deepEqual(compareCoverage(pages,home).notLinkedFromHome,['https://lsifl.blogspot.com/y']);
});
