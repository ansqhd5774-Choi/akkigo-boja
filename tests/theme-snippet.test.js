import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

for (const path of [
  '../theme/blogger-native-base.xml',
  '../nutriments_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../nutriments_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml'
]) {
  test(`${path} 목록 미리보기는 Jump Break를 우선하고 기존 snippet fallback을 보존한다`,()=>{
    const xml=readFileSync(new URL(path,import.meta.url),'utf8');
    const blocks=[...xml.matchAll(/<b:includable id='postBodySnippet' var='post'>([\s\S]*?)<\/b:includable>/g)].map(x=>x[1]);
    assert.equal(blocks.length,2);
    for (const block of blocks) {
      assert.match(block,/data:post\.hasJumpLink/);
      assert.match(block,/<data:post\.body\/>/);
      assert.match(block,/name='postSnippet'/);
      assert.ok(block.indexOf('<data:post.body/>') < block.indexOf("name='postSnippet'"));
    }
  });
}

for (const path of [
  '../nutriments_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../nutriments_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml'
]) {
  test(`${path} 복사 UX는 성공/실패 피드백 후 버튼 문구를 복구한다`,()=>{
    const xml=readFileSync(new URL(path,import.meta.url),'utf8');
    assert.match(xml,/navigator\.clipboard\.writeText\(button\.dataset\.ncpCopy\|\|''\)/);
    assert.match(xml,/button\.textContent='복사됨'/);
    assert.match(xml,/button\.textContent='복사 실패'/);
    assert.match(xml,/setTimeout\(function\(\)\{button\.textContent=before;button\.disabled=false;\},1400\)/);
    assert.match(xml,/closest\('\.ncp-coupon-card,\.ncp-r3-card,article'\)/);
  });
}
