import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publishApprovedArticle} from '../src/articles.js';

const article={
  articleKey:'shibarpg-pickup-202610',
  approvedForPublish:true,
  post:{
    title:'시바 모험단 쿠폰 코드 모음 (2026년 10월) | 입력 방법·보상',
    content:'<article data-ncp-article="shibarpg-pickup-202610">새본문</article>',
    labels:['게임','시바 모험단']
  }
};

function fixtureDb(initialArticle=null) {
  const state={article:initialArticle,attempt:null};
  return {
    state,
    DB:{
      prepare(sql){
        return {
          bind(...args){
            return {
              async first(){
                if (sql.includes('FROM article_state')) return state.article;
                return null;
              },
              async run(){
                if (sql.startsWith('INSERT INTO article_publish_attempts')) {
                  state.attempt={id:args[0],articleKey:args[1],status:'RUNNING',operation:args[2] || null};
                } else if (sql.startsWith('INSERT INTO article_state')) {
                  state.article={article_key:args[0],post_id:args[1],public_url:args[2],status:args[3]};
                } else if (sql.startsWith('UPDATE article_publish_attempts')) {
                  state.attempt.status=sql.includes("status='SUCCEEDED'")?'SUCCEEDED':'UNKNOWN';
                }
                return {success:true};
              }
            };
          }
        };
      }
    }
  };
}

test('승인된 신규 글은 초안 생성 후 한 번만 공개한다',async()=>{
  const {state,DB}=fixtureDb();
  const env={DB,PUBLISH_ENABLED:'true',BLOGGER_BLOG_ID:'2339978524893611480',BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture'};
  let inserts=0,publishes=0;
  const transport=async(url,options={})=>{
    if (url==='https://oauth2.googleapis.com/token') return Response.json({access_token:'fixture'});
    if (url.startsWith('https://www.googleapis.com/blogger/v3/blogs/') && url.includes('/posts?') && options.method!=='POST') return Response.json({items:[]});
    if (url.includes('/posts?isDraft=true') && options.method==='POST') {
      inserts++;
      return Response.json({id:'555',blog:{id:env.BLOGGER_BLOG_ID},status:'DRAFT'});
    }
    if (url.endsWith('/posts/555?view=ADMIN')) return Response.json({id:'555',blog:{id:env.BLOGGER_BLOG_ID},status:'DRAFT',...article.post});
    if (url.endsWith('/posts/555/publish')) {
      publishes++;
      return Response.json({id:'555',blog:{id:env.BLOGGER_BLOG_ID},status:'LIVE',url:'https://lsifl.blogspot.com/2026/10/shiba-test.html'});
    }
    if (url==='https://lsifl.blogspot.com/2026/10/shiba-test.html') return new Response(article.post.content,{status:200});
    throw new Error('UNEXPECTED_URL '+url);
  };
  const result=await publishApprovedArticle(env,article.articleKey,[article],transport);
  assert.equal(result.status,'LIVE');
  assert.equal(result.publicVerified,true);
  assert.equal(inserts,1);
  assert.equal(publishes,1);
  assert.equal(state.article.status,'LIVE');
  assert.equal(state.attempt.status,'SUCCEEDED');
});

test('기존 LIVE 글은 내용이 바뀐 경우 같은 postId를 PATCH하고 중복 생성하지 않는다',async()=>{
  const initial={post_id:'555',public_url:'https://lsifl.blogspot.com/2026/10/shiba-test.html',status:'LIVE'};
  const {state,DB}=fixtureDb(initial);
  const env={DB,PUBLISH_ENABLED:'true',BLOGGER_BLOG_ID:'2339978524893611480',BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture'};
  let patches=0,inserts=0;
  const oldPost={title:'옛 제목',content:'<article data-ncp-article="shibarpg-pickup-202610">옛본문</article>'};
  const transport=async(url,options={})=>{
    if (url==='https://oauth2.googleapis.com/token') return Response.json({access_token:'fixture'});
    if (url.includes('/posts?') && options.method!=='POST') return Response.json({items:[{id:'555',blog:{id:env.BLOGGER_BLOG_ID},status:'LIVE',url:initial.public_url,...oldPost}]});
    if (url.endsWith('/posts/555') && options.method==='PATCH') {
      patches++;
      const body=JSON.parse(options.body);
      assert.equal(body.title,article.post.title);
      return Response.json({id:'555',blog:{id:env.BLOGGER_BLOG_ID},url:initial.public_url});
    }
    if (url.includes('/posts?isDraft=true') && options.method==='POST') { inserts++; }
    if (url===initial.public_url) return new Response(article.post.content,{status:200});
    throw new Error('UNEXPECTED_URL '+url);
  };
  const result=await publishApprovedArticle(env,article.articleKey,[article],transport);
  assert.equal(result.updated,true);
  assert.equal(result.postId,'555');
  assert.equal(patches,1);
  assert.equal(inserts,0);
  assert.equal(state.attempt.status,'SUCCEEDED');
});

test('승인되지 않은 일반 글은 Blogger 호출 전에 차단한다',async()=>{
  const {DB}=fixtureDb();
  const env={DB,PUBLISH_ENABLED:'true',BLOGGER_BLOG_ID:'2339978524893611480',BLOGGER_CLIENT_ID:'fixture',BLOGGER_CLIENT_SECRET:'fixture',BLOGGER_REFRESH_TOKEN:'fixture'};
  await assert.rejects(
    publishApprovedArticle(env,'blocked',[{...article,articleKey:'blocked',approvedForPublish:false}],()=>{throw new Error('NETWORK_SHOULD_NOT_RUN');}),
    /ARTICLE_NOT_APPROVED/
  );
});
