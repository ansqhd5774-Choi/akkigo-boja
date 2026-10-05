import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

for (const path of [
  '../theme/blogger-native-base.xml',
  '../nutriments_blogger_r1_bundle/theme/blogger-theme-r1.xml'
]) {
  test(`${path} 목록 미리보기는 postSnippet 대신 jump-aware post body를 사용한다`,()=>{
    const xml=readFileSync(new URL(path,import.meta.url),'utf8');
    const blocks=[...xml.matchAll(/<b:includable id='postBodySnippet' var='post'>([\s\S]*?)<\/b:includable>/g)].map(x=>x[1]);
    assert.equal(blocks.length,2);
    for (const block of blocks) {
      assert.match(block,/<data:post\.body\/>/);
      assert.doesNotMatch(block,/name='postSnippet'/);
    }
  });
}
