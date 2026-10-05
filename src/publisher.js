import {updateExistingHub, bloggerConfigured} from './blogger.js';

export async function updateStoredHub(env, hubKey, post, transport = fetch) {
  if (env.PUBLISH_ENABLED !== 'true') throw new Error('PUBLISH_DISABLED');
  if (!bloggerConfigured(env)) throw new Error('BLOGGER_OAUTH_MISSING');
  if (!env.DB) throw new Error('STATE_DB_MISSING');
  if (!/^[a-z0-9-]{1,80}$/.test(hubKey || '')) throw new Error('INVALID_HUB_KEY');
  const hub = await env.DB.prepare('SELECT post_id FROM hub_state WHERE hub_key=?').bind(hubKey).first();
  if (!hub?.post_id) throw new Error('HUB_POST_ID_MISSING');
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
