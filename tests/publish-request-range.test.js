import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {changedRequestPaths,classifyChangedRequestPaths} from '../tools/select-publish-requests.mjs';

const script=fileURLToPath(new URL('../tools/select-publish-requests.mjs',import.meta.url));

function fixture() {
  const dir=mkdtempSync(join(tmpdir(),'publish-range-'));
  const git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8'}).trim();
  git('init','-q');
  git('config','user.email','test@example.invalid');
  git('config','user.name','Workflow Test');
  function write(path,value) {
    const full=join(dir,path);
    mkdirSync(dirname(full),{recursive:true});
    writeFileSync(full,value);
  }
  function commit(message) {
    git('add','-A');
    git('commit','-qm',message);
    return git('rev-parse','HEAD');
  }
  return {dir,git,write,commit,cleanup:()=>rmSync(dir,{recursive:true,force:true})};
}

test('여러 커밋 Push는 HEAD^뿐 아니라 전체 before..after의 게시 요청을 선택한다',()=>{
  const f=fixture();
  try {
    f.write('publish-requests/previous.json','{"approved":true}');
    const before=f.commit('baseline');
    f.write('publish-requests/first.json','{"approved":true}');
    f.commit('first request');
    f.write('docs/notes.md','documentation');
    f.commit('documentation');
    f.write('publish-requests/second.json','{"approved":true}');
    f.commit('second request');
    f.write('publish-requests/hub-refresh-all.json','{"hubKeys":["zeus"]}');
    const head=f.commit('hub refresh request');
    const result=changedRequestPaths(before,head,{cwd:f.dir});
    assert.deepEqual(result.articlePaths,['publish-requests/first.json','publish-requests/second.json']);
    assert.deepEqual(result.hubPaths,['publish-requests/hub-refresh-all.json']);
  } finally {f.cleanup();}
});

test('삭제한 요청과 과거에 있던 요청은 다시 실행 대상이 아니다',()=>{
  const f=fixture();
  try {
    f.write('publish-requests/old.json','{}');
    f.write('publish-requests/deleted.json','{}');
    const before=f.commit('baseline');
    f.git('rm','publish-requests/deleted.json');
    const head=f.commit('delete request only');
    assert.deepEqual(changedRequestPaths(before,head,{cwd:f.dir}),{articlePaths:[],hubPaths:[]});
  } finally {f.cleanup();}
});

test('입력 SHA와 파일명은 검사하고, 관리 문서는 대상이 아니다',()=>{
  assert.throws(()=>changedRequestPaths('HEAD','HEAD'),/INVALID_PUSH_RANGE_SHA/);
  assert.deepEqual(classifyChangedRequestPaths(['publish-requests/readme.md']),{articlePaths:[],hubPaths:[]});
  assert.throws(()=>classifyChangedRequestPaths(['publish-requests/evil_FILE.json']),/INVALID_PUBLISH_REQUEST_PATH/);
});

test('GitHub Actions 실행에서는 추가·수정 요청만 출력하고 빈 범위는 실행하지 않는다',()=>{
  const f=fixture();
  try {
    f.write('publish-requests/old.json','{"approved":true}');
    const before=f.commit('baseline');
    f.write('docs/report.md','no action');
    const head=f.commit('docs only');
    const output=join(f.dir,'github-output.txt');
    f.write('github-output.txt','');
    const outputText=execFileSync(process.execPath,[script,before,head],{
      cwd:f.dir,
      env:{...process.env,RUNNER_TEMP:f.dir,GITHUB_OUTPUT:output},
      encoding:'utf8'
    });
    assert.match(outputText,/NO_NEW_PUBLISH_REQUESTS/);
    assert.match(readFileSync(output,'utf8'),/has_requests=false/);
    assert.equal(readFileSync(join(f.dir,'publish-article-paths.txt'),'utf8'),'');
  } finally {f.cleanup();}
});
