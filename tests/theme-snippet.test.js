import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

for (const path of [
  '../theme/blogger-native-base.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml'
]) {
  test(`${path} 목록 미리보기는 쿠폰 본문과 스크립트를 노출하지 않는다`,()=>{
    const xml=readFileSync(new URL(path,import.meta.url),'utf8');
    const blocks=[...xml.matchAll(/<b:includable id='postBodySnippet' var='post'>([\s\S]*?)<\/b:includable>/g)].map(x=>x[1]);
    assert.equal(blocks.length,2);
    for (const block of blocks) {
      assert.match(block,/post-snippet-safe/);
      assert.match(block,/쿠폰 상세 내용은 자세히 보기에서 확인하세요/);
      assert.doesNotMatch(block,/data:post\.body/);
      assert.doesNotMatch(block,/navigator\.clipboard/);
    }
  });
}

for (const path of [
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml'
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
