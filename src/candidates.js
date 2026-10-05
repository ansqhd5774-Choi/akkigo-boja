const SOURCE_ID = /^[a-z0-9-]{1,100}$/;

export async function listUnverifiedCandidates(env, {sourceId, limit=50} = {}) {
  if (!env?.DB) throw new Error('STATE_DB_MISSING');
  const n=Number(limit);
  if (!Number.isInteger(n) || n < 1 || n > 100) throw new Error('INVALID_CANDIDATE_LIMIT');
  if (sourceId != null && !SOURCE_ID.test(sourceId)) throw new Error('INVALID_SOURCE_ID');
  const select=`SELECT candidate_id,source_id,brand,category,first_seen_at,last_seen_at,status,source_url,source_body_hash,payload_json
    FROM coupon_candidates WHERE status='UNVERIFIED'${sourceId ? ' AND source_id=?' : ''}
    ORDER BY last_seen_at DESC LIMIT ?`;
  const statement=sourceId ? env.DB.prepare(select).bind(sourceId,n) : env.DB.prepare(select).bind(n);
  const result=await statement.all();
  return (result.results || []).map(row=>{
    let payload;
    try {payload=JSON.parse(row.payload_json);} catch {throw new Error('CANDIDATE_PAYLOAD_INVALID');}
    return {
      candidateId:row.candidate_id, sourceId:row.source_id, brand:row.brand, category:row.category,
      firstSeenAt:row.first_seen_at, lastSeenAt:row.last_seen_at, status:row.status,
      sourceUrl:row.source_url, sourceBodyHash:row.source_body_hash, payload
    };
  });
}
