import sources from '../data/sources.json' with {type:'json'};
const MAX_BYTES = 1000000;

export async function observeSource(source, transport = fetch, now = new Date()) {
  const observation = {id:source.id,url:source.url,checkedAt:now.toISOString(),httpStatus:null,status:'FETCH_FAILED',bodyHash:null,title:null};
  try {
    const response = await transport(source.url,{redirect:'manual',signal:AbortSignal.timeout(15000),headers:{Accept:'text/html'}});
    observation.httpStatus = response.status;
    if (!response.ok) { observation.status = response.status >= 300 && response.status < 400 ? 'REDIRECT_REVIEW_REQUIRED' : 'HTTP_FAILED'; return observation; }
    if (!response.headers.get('content-type')?.includes('text/html')) {observation.status='UNSUPPORTED_CONTENT';return observation;}
    const reader = response.body.getReader();
    const chunks = []; let bytes = 0;
    try {
      while (true) {
        const {value,done} = await reader.read(); if (done) break;
        bytes += value.length;
        if (bytes > MAX_BYTES) {observation.status='BODY_LIMIT';await reader.cancel();return observation;}
        chunks.push(value);
      }
    } finally {reader.releaseLock();}
    const body = new Uint8Array(bytes); let offset=0;
    for (const chunk of chunks) {body.set(chunk,offset);offset+=chunk.length;}
    observation.bodyHash = [...new Uint8Array(await crypto.subtle.digest('SHA-256',body))].map(x=>x.toString(16).padStart(2,'0')).join('');
    const html = new TextDecoder().decode(body);
    observation.title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '').trim().slice(0,200);
    // 페이지 접근 성공은 쿠폰 코드 발견이나 게임 내 작동 성공이 아니다.
    observation.status = source.requiresImageReview ? 'SOURCE_FETCHED_IMAGE_REVIEW_REQUIRED' : 'SOURCE_FETCHED_UNPARSED';
  } catch { /* 원문 오류나 인증정보를 저장하지 않는다. */ }
  return observation;
}

export async function collectSources(env, transport = fetch) {
  if (!env.DB) throw new Error('STATE_DB_MISSING');
  const observations = [];
  for (const source of sources) {
    const result = await observeSource(source,transport);
    await env.DB.prepare(`INSERT INTO source_observations(source_id,url,checked_at,http_status,status,body_hash,title)
      VALUES(?,?,?,?,?,?,?) ON CONFLICT(source_id) DO UPDATE SET checked_at=excluded.checked_at,http_status=excluded.http_status,status=excluded.status,body_hash=excluded.body_hash,title=excluded.title`)
      .bind(result.id,result.url,result.checkedAt,result.httpStatus,result.status,result.bodyHash,result.title).run();
    observations.push({id:result.id,httpStatus:result.httpStatus,status:result.status});
  }
  return observations;
}
