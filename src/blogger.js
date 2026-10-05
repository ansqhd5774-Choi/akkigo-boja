const BLOG_ID = '2339978524893611480';

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

// 저장된 postId가 있는 기존 허브만 갱신한다. 신규 생성은 영구 저장과 복구 구현 후 연결한다.
export async function updateExistingHub(env, postId, post, transport = fetch) {
  if (env.PUBLISH_ENABLED !== 'true') throw new Error('PUBLISH_DISABLED');
  if (env.BLOGGER_BLOG_ID !== BLOG_ID) throw new Error('BLOG_TARGET_MISMATCH');
  if (!/^\d+$/.test(postId) || !post?.title || !post?.content) throw new Error('INVALID_POST');
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
