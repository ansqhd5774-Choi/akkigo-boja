import sources from '../data/sources.json' with {type:'json'};
const MAX_BYTES = 1000000;

function htmlToText(html) {
  return String(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;|&#160;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/&lt;/gi,'<')
    .replace(/&gt;/gi,'>')
    .replace(/&quot;|&#34;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'")
    .replace(/\s+/g,' ')
    .trim();
}

function numberFromText(value) {
  if (value == null) return null;
  const n = Number(String(value).replace(/[^0-9.]/g,''));
  return Number.isFinite(n) ? n : null;
}

function isoDate(year,month,day,endOfDay=false) {
  const y=Number(year),m=Number(month),d=Number(day);
  if (![y,m,d].every(Number.isInteger)) return null;
  const dt = new Date(Date.UTC(y,m-1,d,endOfDay?23:0,endOfDay?59:0,endOfDay?59:0));
  if (dt.getUTCFullYear()!==y || dt.getUTCMonth()!==m-1 || dt.getUTCDate()!==d) return null;
  return dt.toISOString();
}

function uniqueCandidates(items) {
  const seen=new Set();
  return items.filter(item=>{
    const key=JSON.stringify([item.offerType,item.discountKind,item.rate,item.fixedAmount,item.currency,item.minimum,item.cap,item.travel?.kind,item.travel?.regions]);
    if (seen.has(key)) return false;
    seen.add(key);return true;
  });
}

function extractAgoda(text, now) {
  const candidates=[];
  const relativeDays = Number(text.match(/Expires?\s+in\s+(\d+)\s+days?/i)?.[1] || NaN);
  const expiresAt = Number.isFinite(relativeDays) ? new Date(now.getTime()+relativeDays*86400000).toISOString() : null;
  const minimum = numberFromText(text.match(/(?:minimum|min\.?)(?:\s+spend)?(?:\s+of)?\s*[₩￦]\s*([\d,]+)/i)?.[1]);
  const fixedRe=/(?:Up\s+to\s+)?([₩￦$])\s*([\d,]+)\s+Off\s+Hotels?/ig;
  for (const match of text.matchAll(fixedRe)) {
    candidates.push({
      offerType:'CODE',discountKind:'FIXED',fixedAmount:numberFromText(match[2]),currency:match[1]==='$'?'USD':'KRW',minimum:minimum ?? null,cap:numberFromText(match[2]),platformHint:'UNCONFIRMED',audienceHint:'UNCONFIRMED',endMode:expiresAt?'FIXED_DATE':'UNKNOWN',expiresAt,
      travel:{kind:'HOTEL',regions:['UNCONFIRMED']},evidenceLevel:'SOURCE_TEXT_ONLY',evidenceText:match[0].slice(0,200)
    });
  }
  const percentRe=/(?:Up\s+to\s+)?(\d{1,2})%\s+Off(?:\s+Hotels?)?/ig;
  for (const match of text.matchAll(percentRe)) {
    candidates.push({
      offerType:'CODE',discountKind:'PERCENT',rate:Number(match[1]),currency:'KRW',minimum:minimum ?? null,cap:null,platformHint:'UNCONFIRMED',audienceHint:'UNCONFIRMED',endMode:expiresAt?'FIXED_DATE':'UNKNOWN',expiresAt,
      travel:{kind:'HOTEL',regions:['UNCONFIRMED']},evidenceLevel:'SOURCE_TEXT_ONLY',evidenceText:match[0].slice(0,200)
    });
  }
  return uniqueCandidates(candidates).filter(x => (x.fixedAmount ?? x.rate) > 0);
}

function extractTripCom(text) {
  const candidates=[];
  const period=text.match(/(?:프로모션|이벤트)\s*기간[^0-9]*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*[~～\-–—]\s*(?:(\d{4})년\s*)?(\d{1,2})월\s*(\d{1,2})일/i);
  const startAt=period?isoDate(period[1],period[2],period[3]):null;
  const endAt=period?isoDate(period[4] || period[1],period[5],period[6],true):null;
  const platformHint = /앱|APP/i.test(text) && /웹|PC|모바일웹/i.test(text) ? 'WEB_APP' : /앱|APP/i.test(text) ? 'APP' : 'UNCONFIRMED';
  const audienceHint = /회원/i.test(text) ? 'MEMBERS' : 'UNCONFIRMED';
  const kind = /투어|티켓|액티비티/i.test(text) ? 'ACTIVITY' : /렌터카/i.test(text) ? 'CAR_RENTAL' : /항공/i.test(text) ? 'FLIGHT' : 'HOTEL';
  const regions = /국내|대한민국|한국/i.test(text) ? ['KR'] : ['GLOBAL'];
  const percentRe=/(\d{1,2})%\s*할인\s*쿠폰/ig;
  for (const match of text.matchAll(percentRe)) {
    candidates.push({
      offerType:'CODE',discountKind:'PERCENT',rate:Number(match[1]),currency:'KRW',minimum:null,cap:null,platformHint,audienceHint,
      endMode:endAt?'FIXED_DATE':'UNKNOWN',expiresAt:endAt,
      travel:{kind,regions,...(startAt&&endAt?{bookingStartAt:startAt,bookingEndAt:endAt}:{})},
      evidenceLevel:'SOURCE_TEXT_ONLY',evidenceText:match[0].slice(0,200)
    });
  }
  return uniqueCandidates(candidates).filter(x => x.rate > 0);
}

export function extractCandidates(source, html, now = new Date()) {
  if (source.parserProfile !== 'TRAVEL_DEALS') return [];
  const text=htmlToText(html);
  if (source.id === 'agoda-deals' || source.brand === 'Agoda') return extractAgoda(text,now);
  if (source.id === 'tripcom-domestic-2026' || source.brand === 'Trip.com') return extractTripCom(text);
  return [];
}

async function candidateId(source,candidate) {
  const identity={sourceId:source.id,offerType:candidate.offerType,discountKind:candidate.discountKind,rate:candidate.rate ?? null,fixedAmount:candidate.fixedAmount ?? null,currency:candidate.currency ?? null,minimum:candidate.minimum ?? null,cap:candidate.cap ?? null,travel:candidate.travel ?? null};
  const bytes=new TextEncoder().encode(JSON.stringify(identity));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
}

async function storeCandidates(env,source,observation) {
  if (!observation.candidates?.length || !observation.bodyHash) return;
  for (const candidate of observation.candidates) {
    const id=await candidateId(source,candidate);
    await env.DB.prepare(`INSERT INTO coupon_candidates(candidate_id,source_id,brand,category,first_seen_at,last_seen_at,status,source_url,source_body_hash,payload_json)
      VALUES(?,?,?,?,?,?,'UNVERIFIED',?,?,?)
      ON CONFLICT(candidate_id) DO UPDATE SET last_seen_at=excluded.last_seen_at,source_body_hash=excluded.source_body_hash,payload_json=excluded.payload_json`)
      .bind(id,source.id,source.brand,source.category || null,observation.checkedAt,observation.checkedAt,source.url,observation.bodyHash,JSON.stringify(candidate)).run();
  }
}

export async function observeSource(source, transport = fetch, now = new Date()) {
  const observation = {id:source.id,url:source.url,checkedAt:now.toISOString(),httpStatus:null,status:'FETCH_FAILED',bodyHash:null,title:null,candidates:[]};
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
    observation.candidates=extractCandidates(source,html,now);
    // 원천 텍스트에서 혜택 후보를 발견해도 검증 성공이나 ACTIVE로 승격하지 않는다.
    observation.status = source.requiresImageReview ? 'SOURCE_FETCHED_IMAGE_REVIEW_REQUIRED' : observation.candidates.length ? 'SOURCE_FETCHED_CANDIDATES_UNVERIFIED' : 'SOURCE_FETCHED_UNPARSED';
  } catch { /* 원문 오류나 인증정보를 저장하지 않는다. */ }
  return observation;
}

export async function collectSources(env, transport = fetch, execution = {}) {
  if (!env.DB) throw new Error('STATE_DB_MISSING');
  const runId=crypto.randomUUID();
  const trigger=execution.trigger === 'SCHEDULED' ? 'SCHEDULED' : 'MANUAL';
  await env.DB.prepare("INSERT INTO collection_runs(run_id,trigger_kind,scheduled_at,started_at,status) VALUES(?,?,?,?,'RUNNING')")
    .bind(runId,trigger,execution.scheduledAt || null,new Date().toISOString()).run();
  const observations = [];
  try {
  for (const source of sources) {
    const result = await observeSource(source,transport);
    await env.DB.prepare(`INSERT INTO source_observations(source_id,url,checked_at,http_status,status,body_hash,title)
      VALUES(?,?,?,?,?,?,?) ON CONFLICT(source_id) DO UPDATE SET checked_at=excluded.checked_at,http_status=excluded.http_status,status=excluded.status,body_hash=excluded.body_hash,title=excluded.title`)
      .bind(result.id,result.url,result.checkedAt,result.httpStatus,result.status,result.bodyHash,result.title).run();
    await storeCandidates(env,source,result);
    observations.push({id:result.id,httpStatus:result.httpStatus,status:result.status,candidateCount:result.candidates.length});
  }
  const fetched=observations.filter(x=>x.status.startsWith('SOURCE_FETCHED')).length;
  await env.DB.prepare('UPDATE collection_runs SET finished_at=?,status=?,observed_count=?,fetched_count=? WHERE run_id=?')
    .bind(new Date().toISOString(),fetched===observations.length?'SUCCEEDED':'PARTIAL',observations.length,fetched,runId).run();
  return observations;
  } catch {
    await env.DB.prepare("UPDATE collection_runs SET finished_at=?,status='FAILED',observed_count=? WHERE runId=?")
      .bind(new Date().toISOString(),observations.length,runId).run();
    throw new Error('COLLECTION_STORAGE_FAILED');
  }
}
