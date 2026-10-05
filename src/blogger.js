export const BLOG_ID = '2339978524893611480';

export function validatePost(post) {
  if (!post || typeof post.title !== 'string' || !post.title.trim() || typeof post.content !== 'string' || !post.content.trim() || post.content.length > 500000 || (post.labels != null && (!Array.isArray(post.labels) || post.labels.some(label=>typeof label !== 'string')))) throw new Error('INVALID_POST');
}

function assertTarget(env) {
  if (env.BLOGGER_BLOG_ID !== BLOG_ID) throw new Error('BLOG_TARGET_MISMATCH');
}

export async function createDraft(env, post, transport = fetch) {
  if (env.PUBLISH_ENABLED !== 'true') throw new Error('PUBLISH_DISABLED');
  assertTarget(env);validatePost(post);
  const token = await accessToken(env,transport);
  const response = await transport(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?isDraft=true`,{
    method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
    body:JSON.stringify({title:post.title,content:post.content,labels:post.labels || []}),signal:AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`BLOGGER_INSERT_HTTP_${response.status}`);
  const result = await response.json();
  if (!/^\d+$/.test(result.id || '') || result.blog?.id !== BLOG_ID || result.status !== 'DRAFT') throw new Error('BLOGGER_DRAFT_RESPONSE_MISMATCH');
  return {postId:result.id,status:'DRAFT'};
}

export async function findHubPosts(env, hubKey, transport = fetch) {
  assertTarget(env);
  if (!/^[a-z0-9-]{1,80}$/.test(hubKey || '')) throw new Error('INVALID_HUB_KEY');
  const token = await accessToken(env,transport);
  const matches = new Map();
  for (const status of ['draft','live','scheduled']) {
    let pageToken;
    for (let page=0;page<5;page++) {
      const url=new URL(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`);
      url.search=new URLSearchParams({status,view:'ADMIN',fetchBodies:'true',maxResults:'100',...(pageToken?{pageToken}:{})}).toString();
      const response=await transport(url.toString(),{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error('BLOGGER_RECONCILIATION_READ_FAILED');
      const result=await response.json();
      if (result.items != null && !Array.isArray(result.items)) throw new Error('BLOGGER_LIST_INVALID');
      for (const post of result.items || []) {
        if (post.content?.includes(`data-ncp-hub="${hubKey}"`)) {
          if (!/^\d+$/.test(post.id || '') || post.blog?.id !== BLOG_ID) throw new Error('BLOGGER_TARGET_RESPONSE_MISMATCH');
          matches.set(post.id,{postId:post.id,status:post.status});
        }
      }
      pageToken=result.nextPageToken;
      if (!pageToken) break;
      if (page===4) throw new Error('BLOGGER_SCAN_LIMIT');
    }
  }
  return [...matches.values()];
}

export async function publishDraft(env,postId,expected,transport=fetch) {
  if (env.PUBLISH_ENABLED !== 'true') throw new Error('PUBLISH_DISABLED');
  assertTarget(env);validatePost(expected);
  if (!/^\d+$/.test(postId || '')) throw new Error('INVALID_POST');
  const token=await accessToken(env,transport);
  const endpoint=`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${postId}`;
  const headers={Authorization:`Bearer ${token}`};
  const read=await transport(`${endpoint}?view=ADMIN`,{headers,signal:AbortSignal.timeout(15000)});
  if (!read.ok) throw new Error('BLOGGER_PREFLIGHT_READ_FAILED');
  const current=await read.json();
  if (current.id!==postId || current.blog?.id!==BLOG_ID || current.status!=='DRAFT' || current.title!==expected.title || current.content!==expected.content) throw new Error('BLOGGER_DRAFT_CONTENT_MISMATCH');
  const response=await transport(`${endpoint}/publish`,{method:'POST',headers,signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(`BLOGGER_PUBLISH_HTTP_${response.status}`);
  const result=await response.json();
  if (result.id!==postId || result.blog?.id!==BLOG_ID || result.status!=='LIVE' || typeof result.url!=='string') throw new Error('BLOGGER_PUBLISH_RESPONSE_MISMATCH');
  const url=new URL(result.url);
  if (url.hostname!=='lsifl.blogspot.com' || !['http:','https:'].includes(url.protocol)) throw new Error('BLOGGER_PUBLIC_URL_MISMATCH');
  return {postId:result.id,status:'LIVE',url:result.url};
}

export function bloggerConfigured(env) {
  return Boolean(env.BLOGGER_CLIENT_ID && env.BLOGGER_CLIENT_SECRET && env.BLOGGER_REFRESH_TOKEN);
}

export async function accessToken(env, transport = fetch) {
  if (!bloggerConfigured(env)) throw new Error('BLOGGER_OAUTH_MISSING');
  const response = await transport('https://oauth2.googleapis.com/token', {
    method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({client_id:env.BLOGGER_CLIENT_ID,client_secret:env.BLOGGER_CLIENT_SECRET,refresh_token:env.BLOGGER_REFRESH_TOKEN,grant_type:'refresh_token'}),
    signal:AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`BLOGGER_OAUTH_HTTP_${response.status}`);
  const token = await response.json();
  if (typeof token.access_token !== 'string' || !token.access_token) throw new Error('BLOGGER_OAUTH_INVALID_RESPONSE');
  return token.access_token;
}

// 저장된 postId가 있는 기존 허브만 갱신한다.
export async function updateExistingHub(env, postId, post, transport = fetch) {
  if (env.PUBLISH_ENABLED !== 'true') throw new Error('PUBLISH_DISABLED');
  assertTarget(env);validatePost(post);
  if (!/^\d+$/.test(postId)) throw new Error('INVALID_POST');
  const token = await accessToken(env, transport);
  const response = await transport(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${postId}`, {
    method:'PATCH', headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
    body:JSON.stringify({title:post.title,content:post.content,labels:post.labels || []}),
    signal:AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`BLOGGER_UPDATE_HTTP_${response.status}`);
  const result = await response.json();
  if (result.id !== postId || result.blog?.id !== BLOG_ID || typeof result.url !== 'string') throw new Error('BLOGGER_TARGET_RESPONSE_MISMATCH');
  const url = new URL(result.url);
  if (url.hostname !== 'lsifl.blogspot.com' || !['http:','https:'].includes(url.protocol)) throw new Error('BLOGGER_PUBLIC_URL_MISMATCH');
  return {postId:result.id,url:result.url};
}
