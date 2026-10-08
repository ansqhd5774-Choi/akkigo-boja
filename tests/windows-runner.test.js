import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {assertVerifiedSource,isSuccessfulDeploymentRun,isWorkerPath} from '../tools/actions-runtime.mjs';
import {probeExistingArticle} from '../src/articles.js';
import {selectLiveProbeTarget} from '../tools/live-probe-target.mjs';
import primary from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};

test('runtime publication probe selects an approved current article that passes all draft checks',()=>{
  assert.equal(selectLiveProbeTarget([...primary,...supplemental]),'royal-match-codes-202610');
  assert.throws(()=>selectLiveProbeTarget([]),/ARTICLE_NOT_APPROVED/);
});

test('publication accepts only the exact SHA that completed prerequisite Verify',()=>{
  const sha='a'.repeat(40);
  assert.equal(assertVerifiedSource(sha,sha),sha);
  assert.throws(()=>assertVerifiedSource('b'.repeat(40),sha),/SOURCE_VERIFY_SHA_MISMATCH/);
  assert.throws(()=>assertVerifiedSource(undefined,sha),/SOURCE_VERIFY_SHA_MISMATCH/);
});
test('read-only probe and failed runs cannot be treated as Worker deployments',()=>{
  const run={status:'completed',conclusion:'success',event:'workflow_dispatch'};
  assert.equal(isSuccessfulDeploymentRun(run,'publish-article.yml'),false);
  assert.equal(isSuccessfulDeploymentRun({...run,event:'push'},'publish-article.yml'),true);
  assert.equal(isSuccessfulDeploymentRun({...run,conclusion:'failure'},'deploy.yml'),false);
  assert.equal(isSuccessfulDeploymentRun(run,'deploy.yml'),true);
  assert.equal(isWorkerPath('src/articles.js'),true);
  assert.equal(isWorkerPath('docs/runner.md'),false);
});
test('public repository workflows use standard hosted Ubuntu and Bash without self-hosted or paid runners',()=>{
  for(const file of readdirSync('.github/workflows').filter(n=>n.endsWith('.yml'))) {
    const yaml=readFileSync('.github/workflows/'+file,'utf8');
    assert.match(yaml,/runs-on: ubuntu-24\.04/,file);
    assert.match(yaml,/shell: bash/,file);
    assert.match(yaml,/github\.event\.repository\.private == false/,file);
    assert.doesNotMatch(yaml,/self-hosted|windows-latest|shell: (cmd|pwsh)|npm install --global|if errorlevel|%PUSH_BEFORE%/,file);
  }
});
test('LIVE probe performs only SELECT and Blogger reads even when source differs',async()=>{
  const key='fixture-game';const postId='123';const url='https://lsifl.blogspot.com/2026/10/fixture.html';
  const env={PUBLISH_ENABLED:'true',BLOGGER_BLOG_ID:'2339978524893611480',BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture',DB:{prepare(sql){
    assert.match(sql,/^SELECT /);return {bind(k){assert.equal(k,key);return {async first(){return {status:'LIVE',post_id:postId,public_url:url};}};}};
  }}};
  let reads=0;
  const transport=async(endpoint,options={})=>{
    if(endpoint==='https://oauth2.googleapis.com/token')return Response.json({access_token:'fixture'});
    assert.equal(options.method,undefined,'no Blogger write methods');reads++;
    const status=new URL(endpoint).searchParams.get('status');
    return Response.json({items:status==='live'?[{id:postId,blog:{id:env.BLOGGER_BLOG_ID},status:'LIVE',url,title:'actual',content:`<article data-ncp-article="${key}">actual</article>`}]:[]});
  };
  const result=await probeExistingArticle(env,key,[{articleKey:key,approvedForPublish:true,post:{title:'different',content:'different'}}],transport);
  assert.equal(result.readOnly,true);assert.equal(result.status,'LIVE');assert.equal(result.postId,postId);assert.equal(result.url,url);assert.equal(result.contentMatches,false);assert.equal(reads,3);
});
test('LIVE probe refuses missing state without contacting Blogger',async()=>{
  const env={PUBLISH_ENABLED:'true',BLOGGER_BLOG_ID:'2339978524893611480',BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture',DB:{prepare(){return {bind(){return {first:async()=>null};}};}}};
  await assert.rejects(()=>probeExistingArticle(env,'fixture',[{articleKey:'fixture',approvedForPublish:true}],()=>{throw Error('NETWORK_MUST_NOT_RUN');}),/ARTICLE_NOT_LIVE/);
});
