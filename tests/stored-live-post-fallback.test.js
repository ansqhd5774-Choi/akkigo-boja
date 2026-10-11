import test from 'node:test';
import assert from 'node:assert/strict';
import {publishApprovedArticle} from '../src/articles.js';
import catalog from '../data/articles.json' with {type:'json'};

const article=catalog.find(a=>a.articleKey==='shibarpg-pickup-202610');
const blogId='2339978524893611480';
const publicUrl='https://lsifl.blogspot.com/2026/10/shiba-existing.html';

function fixtureDb(){
 const state={article:{post_id:'555',public_url:publicUrl,status:'LIVE'},attempt:null};
 return {state,DB:{prepare(sql){return {bind(...args){return {
  async first(){if(sql.includes('FROM article_state'))return state.article;return null;},
  async run(){
   if(sql.startsWith('INSERT INTO article_publish_attempts'))state.attempt={id:args[0],status:'RUNNING'};
   else if(sql.startsWith('INSERT INTO article_state'))state.article={post_id:args[1],public_url:args[2],status:args[3]};
   else if(sql.startsWith('UPDATE article_publish_attempts'))state.attempt.status=sql.includes("status='SUCCEEDED'")?'SUCCEEDED':'UNKNOWN';
   return {success:true};
  }
 };}};}}};
}

function env(DB){return {DB,PUBLISH_ENABLED:'true',BLOGGER_BLOG_ID:blogId,BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture'};}

function mismatchTransport(post,{onPatch=()=>{}}={}){
 return async(url,options={})=>{
  if(url==='https://oauth2.googleapis.com/token')return Response.json({access_token:'fixture'});
  if(url.includes('/posts?')&&options.method!=='POST')return Response.json({items:[]});
  if(url.endsWith('/posts/555?view=ADMIN'))return Response.json(post);
  if(options.method==='PATCH'){onPatch();throw Error('PATCH_MUST_NOT_RUN');}
  throw Error('UNEXPECTED_URL '+url);
 };
}

test('stored LIVE postId is used as safe fallback when legacy body marker is not discoverable by list scan',async()=>{
 const {DB,state}=fixtureDb();let patches=0,inserts=0,directReads=0;
 const transport=async(url,options={})=>{
  if(url==='https://oauth2.googleapis.com/token')return Response.json({access_token:'fixture'});
  if(url.includes('/posts?')&&options.method!=='POST')return Response.json({items:[]});
  if(url.endsWith('/posts/555?view=ADMIN')){directReads++;return Response.json({id:'555',blog:{id:blogId},status:'LIVE',url:publicUrl,title:'legacy title',content:'<p>legacy body without article marker</p>'});}
  if(url.endsWith('/posts/555')&&options.method==='PATCH'){patches++;return Response.json({id:'555',blog:{id:blogId},url:publicUrl});}
  if(url.includes('/posts?isDraft=true')&&options.method==='POST'){inserts++;throw Error('INSERT_MUST_NOT_RUN');}
  if(url===publicUrl)return new Response(article.post.content,{status:200});
  throw Error('UNEXPECTED_URL '+url);
 };
 const result=await publishApprovedArticle(env(DB),article.articleKey,[article],transport);
 assert.equal(result.postId,'555');
 assert.equal(result.updated,true);
 assert.equal(directReads,1);
 assert.equal(patches,1);
 assert.equal(inserts,0);
 assert.equal(state.attempt.status,'SUCCEEDED');
});

test('stored postId fallback reports URL identity mismatch before PATCH',async()=>{
 const {DB,state}=fixtureDb();let patches=0;
 const post={id:'555',blog:{id:blogId},status:'LIVE',url:'https://lsifl.blogspot.com/2026/10/wrong.html',title:'legacy',content:'legacy'};
 await assert.rejects(publishApprovedArticle(env(DB),article.articleKey,[article],mismatchTransport(post,{onPatch:()=>patches++})),/ARTICLE_STATE_URL_MISMATCH/);
 assert.equal(patches,0);
 assert.equal(state.attempt,null);
});

test('stored postId fallback reports post, blog and status mismatches separately before PATCH',async()=>{
 const cases=[
  [{id:'556',blog:{id:blogId},status:'LIVE',url:publicUrl,title:'legacy',content:'legacy'},/ARTICLE_STATE_POST_ID_MISMATCH/],
  [{id:'555',blog:{id:'other'},status:'LIVE',url:publicUrl,title:'legacy',content:'legacy'},/ARTICLE_STATE_BLOG_ID_MISMATCH/],
  [{id:'555',blog:{id:blogId},status:'DRAFT',url:publicUrl,title:'legacy',content:'legacy'},/ARTICLE_STATE_STATUS_MISMATCH/]
 ];
 for(const [post,error] of cases){
  const {DB,state}=fixtureDb();let patches=0;
  await assert.rejects(publishApprovedArticle(env(DB),article.articleKey,[article],mismatchTransport(post,{onPatch:()=>patches++})),error);
  assert.equal(patches,0);
  assert.equal(state.attempt,null);
 }
});
