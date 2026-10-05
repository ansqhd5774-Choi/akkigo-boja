import {updateExistingHub, bloggerConfigured, validatePost, createDraft, findHubPosts, publishDraft, BLOG_ID} from './blogger.js';
import {buildHubDraft} from './hubs.js';

function configured(env) {
  if (env.PUBLISH_ENABLED !== 'true') throw new Error('PUBLISH_DISABLED');
  if (!bloggerConfigured(env)) throw new Error('BLOGGER_OAUTH_MISSING');
  if (env.BLOGGER_BLOG_ID !== BLOG_ID) throw new Error('BLOG_TARGET_MISMATCH');
  if (!env.DB) throw new Error('STATE_DB_MISSING');
}

export async function createStoredDraft(env,hubKey,coupons=[],transport=fetch) {
  configured(env);
  const post=buildHubDraft(hubKey,coupons);
  const hub=await env.DB.prepare('SELECT post_id FROM hub_state WHERE hub_key=?').bind(hubKey).first();
  if (hub?.post_id) return {postId:hub.post_id,status:'ALREADY_REGISTERED'};
  const attempt=crypto.randomUUID(), started=new Date().toISOString();
  try {
    await env.DB.prepare("INSERT INTO publish_attempts(attempt_id,hub_key,status,started_at,operation) VALUES(?,?,'RUNNING',?,'CREATE')").bind(attempt,hubKey,started).run();
  } catch {throw new Error('PUBLISH_CHECKPOINT_UNAVAILABLE');}
  try {
    // 앞선 요청이 첫 조회와 잠금 획득 사이에 완료됐을 수 있으므로 다시 확인한다.
    const registered=await env.DB.prepare('SELECT post_id FROM hub_state WHERE hub_key=?').bind(hubKey).first();
    if (registered?.post_id) {
      await env.DB.prepare("UPDATE publish_attempts SET status='SUCCEEDED',finished_at=? WHERE attempt_id=?").bind(new Date().toISOString(),attempt).run();
      return {postId:registered.post_id,status:'ALREADY_REGISTERED'};
    }
    const result=await createDraft(env,post,transport);
    await storeDraft(env,hubKey,result,attempt);
    return result;
  } catch {
    await env.DB.prepare("UPDATE publish_attempts SET status='UNKNOWN',finished_at=?,error_code='RECONCILIATION_REQUIRED' WHERE attempt_id=?").bind(new Date().toISOString(),attempt).run();
    throw new Error('PUBLISH_RECONCILIATION_REQUIRED');
  }
}

async function storeDraft(env,hubKey,result,attempt) {
  const finished=new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO hub_state(hub_key,post_id,status,updated_at) VALUES(?,?,?,?) ON CONFLICT(hub_key) DO UPDATE SET post_id=excluded.post_id,status=excluded.status,updated_at=excluded.updated_at').bind(hubKey,result.postId,result.status,finished),
    env.DB.prepare("UPDATE publish_attempts SET status='SUCCEEDED',finished_at=?,error_code=NULL WHERE attempt_id=?").bind(finished,attempt)
  ]);
}

export async function reconcileDraft(env,hubKey,transport=fetch) {
  configured(env);buildHubDraft(hubKey);
  const attempt=await env.DB.prepare("SELECT attempt_id,status,started_at FROM publish_attempts WHERE hub_key=? AND operation='CREATE' AND status IN ('RUNNING','UNKNOWN')").bind(hubKey).first();
  if (!attempt) throw new Error('NO_CREATE_TO_RECONCILE');
  // 생성 중이거나 직후에는 복구 처리를 실행하지 않는다.
  if (!Number.isFinite(Date.parse(attempt.started_at)) || Date.now()-Date.parse(attempt.started_at)<300000) throw new Error('RECONCILIATION_TOO_EARLY');
  const matches=await findHubPosts(env,hubKey,transport);
  if (matches.length!==1) throw new Error(matches.length?'DUPLICATE_HUB_REVIEW_REQUIRED':'NO_MATCH_KEEP_BLOCKED');
  if (!['DRAFT','LIVE','SCHEDULED'].includes(matches[0].status)) throw new Error('INVALID_POST_STATUS');
  await storeDraft(env,hubKey,matches[0],attempt.attempt_id);
  return matches[0];
}

export async function publishStoredHub(env,hubKey,coupons=[],transport=fetch) {
  configured(env);
  const expected=buildHubDraft(hubKey,coupons);
  const hub=await env.DB.prepare('SELECT post_id,status,public_url FROM hub_state WHERE hub_key=?').bind(hubKey).first();
  if (!hub?.post_id || hub.status!=='DRAFT') throw new Error('REGISTERED_DRAFT_REQUIRED');
  const attempt=crypto.randomUUID(),started=new Date().toISOString();
  try {
    await env.DB.prepare("INSERT INTO publish_attempts(attempt_id,hub_key,status,started_at,operation) VALUES(?,?,'RUNNING',?,'PUBLISH')").bind(attempt,hubKey,started).run();
  } catch {throw new Error('PUBLISH_CHECKPOINT_UNAVAILABLE');}
  try {
    const result=await publishDraft(env,hub.post_id,expected,transport);
    const finished=new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare("UPDATE hub_state SET public_url=?,status='LIVE',updated_at=? WHERE hub_key=? AND post_id=?").bind(result.url,finished,hubKey,hub.post_id),
      env.DB.prepare("UPDATE publish_attempts SET status='SUCCEEDED',finished_at=? WHERE attempt_id=?").bind(finished,attempt)
    ]);
    return result;
  } catch {
    await env.DB.prepare("UPDATE publish_attempts SET status='UNKNOWN',finished_at=?,error_code='RECONCILIATION_REQUIRED' WHERE attempt_id=?").bind(new Date().toISOString(),attempt).run();
    throw new Error('PUBLISH_RECONCILIATION_REQUIRED');
  }
}

export async function updateStoredHub(env, hubKey, post, transport = fetch) {
  validatePost(post);
  configured(env);
  if (!/^[a-z0-9-]{1,80}$/.test(hubKey || '')) throw new Error('INVALID_HUB_KEY');
  const hub = await env.DB.prepare('SELECT post_id FROM hub_state WHERE hub_key=?').bind(hubKey).first();
  if (!hub?.post_id) throw new Error('HUB_POST_ID_MISSING');
  if (!/^\d+$/.test(hub.post_id)) throw new Error('INVALID_STORED_POST_ID');
  const attempt = crypto.randomUUID();
  const started = new Date().toISOString();
  try {
    await env.DB.prepare("INSERT INTO publish_attempts(attempt_id,hub_key,status,started_at) VALUES(?,?,'RUNNING',?)").bind(attempt,hubKey,started).run();
  } catch {
    throw new Error('PUBLISH_CHECKPOINT_UNAVAILABLE');
  }
  try {
    const result = await updateExistingHub(env,hub.post_id,post,transport);
    const finished = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare("UPDATE hub_state SET public_url=?,status='UPDATED',updated_at=? WHERE hub_key=? AND post_id=?").bind(result.url,finished,hubKey,hub.post_id),
      env.DB.prepare("UPDATE publish_attempts SET status='SUCCEEDED',finished_at=? WHERE attempt_id=?").bind(finished,attempt)
    ]);
    return result;
  } catch {
    // API timeout 또는 응답/저장 실패는 실제 반영 여부가 불명확하다. 자동 재시도하지 않는다.
    await env.DB.prepare("UPDATE publish_attempts SET status='UNKNOWN',finished_at=?,error_code='RECONCILIATION_REQUIRED' WHERE attempt_id=?").bind(new Date().toISOString(),attempt).run();
    throw new Error('PUBLISH_RECONCILIATION_REQUIRED');
  }
}
