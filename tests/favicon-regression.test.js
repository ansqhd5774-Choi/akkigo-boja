import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('generated theme retains the registered favicon URL through rebuilds',async()=>{
  for(const file of ['blogger-theme-r1.xml','blogger-theme-r1_modified.xml']){
    const xml=await readFile(new URL('../akkigo_blogger_r1_bundle/theme/'+file,import.meta.url),'utf8');
    assert.match(xml,/<link rel='icon' type='image\/x-icon' href='https:\/\/lsifl\.blogspot\.com\/favicon\.ico\?v=akkigo-20261009-2'\/>/);
    assert.ok(xml.indexOf('AKKIGO STABLE FAVICON')<xml.indexOf('</head>'));
  }
});
