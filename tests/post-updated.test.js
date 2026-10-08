import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const script=readFileSync(new URL('../theme/post-updated.js',import.meta.url),'utf8');
function render(dateModified,path='/2026/10/test.html',schemaPath=path){
  const result={hidden:false,classes:[]};
  const time={classList:{add:x=>result.classes.push(x)},closest:()=>({setAttribute:()=>result.hidden=true})};
  const document={querySelector:()=>time,querySelectorAll:()=>[{textContent:JSON.stringify({'@type':'BlogPosting',mainEntityOfPage:{'@id':'https://lsifl.blogspot.com'+schemaPath},dateModified})}]};
  runInNewContext(script,{document,location:{pathname:path,href:'https://lsifl.blogspot.com'+path},URL,Date,Intl});
  return {...result,...time};
}
test('게시물 날짜는 실제 수정 시각을 한국시간으로 표시한다',()=>{
  const result=render('2026-10-08T13:44:46-07:00');
  assert.equal(result.textContent,'업데이트 · 2026. 10. 9.');
  assert.equal(result.dateTime,'2026-10-08T13:44:46-07:00');
  assert.deepEqual(result.classes,['ncp-post-updated']);
});
test('누락 또는 다른 게시물 수정일을 오늘 날짜로 대체하지 않는다',()=>{
  assert.equal(render('invalid').hidden,true);
  assert.equal(render('2026-10-08T13:44:46-07:00',undefined,'/2026/10/other.html').hidden,true);
});
test('홈과 카테고리 날짜를 수정하지 않는다',()=>{
  assert.equal(render('2026-10-08T13:44:46-07:00','/').hidden,false);
});
