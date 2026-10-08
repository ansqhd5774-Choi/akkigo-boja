import {createDraft,findArticlePosts,publishDraft,updateExistingHub,validatePost,bloggerConfigured,BLOG_ID} from './blogger.js';
import {validateGameCouponLayout} from './game-code-layout-contract.js';
import {validateGameFeaturedImage} from './game-featured-image-policy.js';
import {validateGameCandidateCoverage} from './game-code-candidate-policy.js';

function configured(env) {
  if (env.PUBLISH_ENABLED!=='true') throw new Error('PUBLISH_DISABLED');
  if (!bloggerConfigured(env)) throw new Error('BLOGGER_OAUTH_MISSING');
  if (env.BLOGGER_BLOG_ID!==BLOG_ID) throw new Error('BLOG_TARGET_MISMATCH');
  if (!env.DB) throw new Error('STATE_DB_MISSING');
}

function validKey(key) {
  return /^[a-z0-9-]{1,100}$/.test(key || '');
}

async function upsertState(env,key,{postId,url,status}) {
  await env.DB.prepare(`INSERT INTO article_state(article_key,post_id,public_url,status,updated_at)
    VALUES(?,?,?,?,?)
    ON CONFLICT(article_key) DO UPDATE SET post_id=excluded.post_id,public_url=excluded.public_url,status=excluded.status,updated_at=excluded.updated_at`)
    .bind(key,postId || null,url || null,status,new Date().toISOString()).run();
}

async function publicCheck(url,articleKey,transport=fetch) {
  try {
    const response=await transport(url,{redirect:'follow',headers:{Accept:'text/html'},signal:AbortSignal.timeout(15000)});
    if (!response.ok) return false;
    const text=await response.text();
    const marker=text.includes(`data-ncp-article="${articleKey}"`);
    if (articleKey==='shibarpg-pickup-202610') {
      return marker && text.includes('data-ncp-feed-preview') && text.includes('ncp-help-list') && text.includes('ncp-copy-wrap') && text.includes('data-ncp-copy') && text.includes('현재 확인된 쿠폰') && text.includes('확인된 코드') && text.includes('ncp-count-muted') && !text.includes('현재 사용 가능한 쿠폰') && !text.includes('onclick=') && !text.includes('2713') && !text.includes('ncp-checklist');
    }
    return marker;
  } catch {
    return false;
  }
}

export async function publishApprovedArticle(env, articleKey, articles, transport=fetch) {
  configured(env);
  if (!validKey(articleKey)) throw new Error('INVALID_ARTICLE_KEY');
  const article=articles.find(x=>x.articleKey===articleKey);
  if (!article || article.approvedForPublish!==true) throw new Error('ARTICLE_NOT_APPROVED');
  validatePost(article.post);
  validateGameCouponLayout(articleKey,article.post);
  validateGameFeaturedImage(articleKey,article.post);
  validateGameCandidateCoverage(article);

  const stored=await env.DB.prepare('SELECT post_id,public_url,status FROM article_state WHERE article_key=?').bind(articleKey).first();
  if (stored?.status==='LIVE' && stored.public_url && stored.post_id) {
    const matches=await findArticlePosts(env,articleKey,transport);
    if (matches.length!==1 || matches[0].postId!==stored.post_id) throw new Error('ARTICLE_STATE_MISMATCH');
    const current=matches[0];
    const same=current.title===article.post.title && current.content===article.post.content;
    if (same) {
      return {postId:stored.post_id,status:'LIVE',url:stored.public_url,alreadyLive:true,updated:false,publicVerified:await publicCheck(stored.public_url,articleKey,transport)};
    }
    const attempt=crypto.randomUUID();
    await env.DB.prepare("INSERT INTO article_publish_attempts(attempt_id,article_key,operation,status,started_at) VALUES(?,?,'UPDATE','RUNNING',?)")
      .bind(attempt,articleKey,new Date().toISOString()).run();
    try {
      const updated=await updateExistingHub(env,stored.post_id,article.post,transport);
      await upsertState(env,articleKey,{postId:updated.postId,url:updated.url,status:'LIVE'});
      const publicVerified=await publicCheck(updated.url,articleKey,transport);
      await env.DB.prepare("UPDATE article_publish_attempts SET status='SUCCEEDED',finished_at=?,error_code=NULL WHERE attempt_id=?")
        .bind(new Date().toISOString(),attempt).run();
      return {postId:updated.postId,status:'LIVE',url:updated.url,alreadyLive:true,updated:true,publicVerified};
    } catch (error) {
      await env.DB.prepare("UPDATE article_publish_attempts SET status='UNKNOWN',finished_at=?,error_code=? WHERE attempt_id=?")
        .bind(new Date().toISOString(),String(error?.message || 'ARTICLE_UPDATE_FAILED').slice(0,120),attempt).run();
      throw error;
    }
  }

  const attempt=crypto.randomUUID();
  await env.DB.prepare("INSERT INTO article_publish_attempts(attempt_id,article_key,operation,status,started_at) VALUES(?,?,'CREATE_PUBLISH','RUNNING',?)")
    .bind(attempt,articleKey,new Date().toISOString()).run();

  try {
    const matches=await findArticlePosts(env,articleKey,transport);
    if (matches.length>1) throw new Error('DUPLICATE_ARTICLE_REVIEW_REQUIRED');

    let postId;
    let status;
    let url;
    if (matches.length===1) {
      ({postId,status,url}=matches[0]);
      await upsertState(env,articleKey,{postId,url,status});
    } else {
      const created=await createDraft(env,article.post,transport);
      postId=created.postId; status='DRAFT';
      await upsertState(env,articleKey,{postId,status});
    }

    if (status!=='LIVE') {
      const published=await publishDraft(env,postId,article.post,transport);
      postId=published.postId; status='LIVE'; url=published.url;
      await upsertState(env,articleKey,{postId,url,status});
    }

    const publicVerified=await publicCheck(url,articleKey,transport);
    await env.DB.prepare("UPDATE article_publish_attempts SET status='SUCCEEDED',finished_at=?,error_code=NULL WHERE attempt_id=?")
      .bind(new Date().toISOString(),attempt).run();
    return {postId,status,url,alreadyLive:matches[0]?.status==='LIVE',publicVerified};
  } catch (error) {
    await env.DB.prepare("UPDATE article_publish_attempts SET status='UNKNOWN',finished_at=?,error_code=? WHERE attempt_id=?")
      .bind(new Date().toISOString(),String(error?.message || 'ARTICLE_PUBLISH_FAILED').slice(0,120),attempt).run();
    throw error;
  }
}
