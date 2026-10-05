import {test} from 'node:test';
import assert from 'node:assert/strict';
import {updateStoredHub} from '../src/publisher.js';

function fixture() {
  const state = {unresolved:false,status:null,batches:0};
  const DB = {
    prepare(sql) {return {bind(...args) {return {
      async first() {return {post_id:'123'};},
      async run() {
        if (sql.startsWith('INSERT')) {
          if (state.unresolved) throw new Error('constraint');
          state.unresolved=true;state.status='RUNNING';
        } else {state.status='UNKNOWN';}
      }, sql,args
    };}};},
    async batch() {state.status='SUCCEEDED';state.unresolved=false;state.batches++;}
  };
  return {state,env:{DB,PUBLISH_ENABLED:'true',BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture',BLOGGER_BLOG_ID:'2339978524893611480'}};
}
const post={title:'제목',content:'본문'};
test('저장된 게시물 갱신 성공은 상태와 시도를 함께 저장한다',async()=>{
  const {state,env}=fixture();
  let calls=0;
  const transport=async()=>Response.json(++calls===1?{access_token:'fixture'}:{id:'123',blog:{id:env.BLOGGER_BLOG_ID},url:'https://lsifl.blogspot.com/test.html'});
  assert.equal((await updateStoredHub(env,'zeus',post,transport)).postId,'123');
  assert.equal(state.status,'SUCCEEDED');assert.equal(state.batches,1);
});
test('불명확한 API 결과는 UNKNOWN으로 보존하고 반복 호출을 차단한다',async()=>{
  const {state,env}=fixture();
  let calls=0;
  const transport=async()=>{calls++;throw new Error('fixture-private-error');};
  await assert.rejects(updateStoredHub(env,'zeus',post,transport),/^Error: PUBLISH_RECONCILIATION_REQUIRED$/);
  assert.equal(state.status,'UNKNOWN');
  await assert.rejects(updateStoredHub(env,'zeus',post,transport),/CHECKPOINT_UNAVAILABLE/);
  assert.equal(calls,1);
});
