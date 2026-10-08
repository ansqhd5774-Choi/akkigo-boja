import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

for (const path of [
  '../theme/blogger-native-base.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml'
]) {
  test(`${path} 목록 미리보기는 Jump Break 본문만 사용하고 기존 글은 안전한 쿠폰 요약으로 대체한다`,()=>{
    const xml=readFileSync(new URL(path,import.meta.url),'utf8');
    const blocks=[...xml.matchAll(/<b:includable id='postBodySnippet' var='post'>([\s\S]*?)<\/b:includable>/g)].map(x=>x[1]);
    assert.equal(blocks.length,2);
    for (const block of blocks) {
      assert.match(block,/data:post\.hasJumpLink/);
      assert.match(block,/<data:post\.body\/>/);
      assert.match(block,/ncp-feed-preview-generic/);
      assert.match(block,/쿠폰 안내/);
      assert.match(block,/코드 · 보상/);
      assert.match(block,/입력 안내/);
      assert.doesNotMatch(block,/name='postSnippet'/);
      assert.doesNotMatch(block,/navigator\.clipboard/);
    }
  });
}

for (const path of [
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml'
]) {
  test(`${path} 목록 쿠폰 요약은 PC 3열/모바일 1열 스타일과 복사 피드백을 보존한다`,()=>{
    const xml=readFileSync(new URL(path,import.meta.url),'utf8');
    assert.match(xml,/\.ncp-feed-preview\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
    assert.match(xml,/@media\(max-width:700px\)\{\.ncp-feed-preview\{grid-template-columns:1fr/);
    assert.match(xml,/navigator\.clipboard\.writeText\(button\.dataset\.ncpCopy\|\|''\)/);
    assert.match(xml,/button\.textContent='복사 완료'/);
    assert.match(xml,/localStorage\.setItem\(key\(button\),'1'\)/);
    assert.match(xml,/data-ncp-copied='true'/);
    assert.match(xml,/button\.textContent='복사 실패'/);
    assert.match(xml,/finally\{button\.disabled=false;\}/);
    assert.match(xml,/localStorage\.getItem\(key\(button\)\)==='1'\)mark\(button\)/);
    assert.doesNotMatch(xml,/setTimeout\(function\(\)\{button\.textContent=before/);
  });
}

for (const path of [
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml'
]) {
  test(`${path} 공개 홈/푸터는 내부 운영 문구를 노출하지 않는다`,()=>{
    const xml=readFileSync(new URL(path,import.meta.url),'utf8');
    assert.doesNotMatch(xml,/직접 적용 · 공식 출처 · 미검증|게임 보상은 현금 할인액|공식 출처와 실제 적용 기록을 구분해 안내합니다|직접 적용 확인 기록|확인 기록:/);
    assert.match(xml,/필요한 쿠폰,/);
    assert.match(xml,/ncp-r4-game-list/);
    assert.doesNotMatch(xml,/<h2>최근 업데이트<\/h2>/);
    assert.match(xml,/게임 쿠폰을 불러오는 중입니다/);
  });
}
