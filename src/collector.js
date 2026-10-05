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

function isoDateKst(year,month,day,endOfDay=false) {
  const y=Number(year),m=Number(month),d=Number(day);
  if (![y,m,d].every(Number.isInteger)) return null;
  const check=new Date(Date.UTC(y,m-1,d));
  if (check.getUTCFullYear()!==y || check.getUTCMonth()!==m-1 || check.getUTCDate()!==d) return null;
  const hour=(endOfDay?23:0)-9;
  return new Date(Date.UTC(y,m-1,d,hour,endOfDay?59:0,endOfDay?59:0)).toISOString();
}

function wonAmount(value) {
  if (value == null) return null;
  const text=String(value).replace(/,/g,'').trim();
  const match=text.match(/(\d+(?:\.\d+)?)\s*(만|천)?\s*원/);
  if (!match) return null;
  const scale=match[2]==='만'?10000:match[2]==='천'?1000:1;
  const amount=Number(match[1])*scale;
  return Number.isFinite(amount)?amount:null;
}

function sectionByHeadings(text,start,endings=[]) {
  const startIndex=text.indexOf(start);
  if (startIndex < 0) return '';
  let end=Math.min(text.length,startIndex+2600);
  for (const heading of endings) {
    const index=text.indexOf(heading,startIndex+start.length);
    if (index >= 0 && index < end) end=index;
  }
  return text.slice(startIndex,end);
}

function october2026End(section) {
  const range=section.match(/2026\s*\/\s*10\s*\/\s*0?1[\s\S]{0,160}?~\s*(?:2026\s*\/\s*)?10\s*\/\s*(11|31)/i);
  return range?isoDateKst(2026,10,Number(range[1]),true):null;
}

function uniqueCandidates(items) {
  const seen=new Set();
  return items.filter(item=>{
    const key=JSON.stringify([item.offerType,item.discountKind,item.rate,item.fixedAmount,item.currency,item.minimum,item.cap,item.platformHint,item.audienceHint,item.mechanismHint,item.endMode,item.expiryHint,item.travel?.kind,item.travel?.regions]);
    if (seen.has(key)) return false;
    seen.add(key);return true;
  });
}

function extractAgoda(text, now) {
  const offers=[];
  const fixedRe=/(?:Up\s+to\s+)?([₩￦$])\s*([\d,]+)\s+Off\s+Hotels?/ig;
  for (const match of text.matchAll(fixedRe)) offers.push({index:match.index,end:match.index+match[0].length,kind:'FIXED',match});
  const percentRe=/(?:Up\s+to\s+)?(\d{1,2})%\s+off(?:\s+Hotels?)?/ig;
  for (const match of text.matchAll(percentRe)) offers.push({index:match.index,end:match.index+match[0].length,kind:'PERCENT',match});
  offers.sort((a,b)=>a.index-b.index);
  const candidates=[];
  for (let i=0;i<offers.length;i++) {
    const offer=offers[i];
    const next=offers[i+1]?.index ?? Math.min(text.length,offer.index+320);
    const context=text.slice(offer.index,next);
    const minimum=numberFromText(context.match(/(?:minimum|min\.?)\s*(?:spend)?(?:\s+of)?\s*[₩￦]\s*([\d,]+)/i)?.[1]);
    const relativeDays=Number(context.match(/Expires?\s+in\s+(\d+)\s+days?/i)?.[1] || NaN);
    const expiresAt=Number.isFinite(relativeDays)?new Date(now.getTime()+relativeDays*86400000).toISOString():null;
    const mechanismHint=/CLAIM\s+COUPON/i.test(context)?'CLAIM_COUPON':/ACTIVATE\s+NOW|BOOK\s+NOW/i.test(context)?'ACTIVATE_OR_BOOK':'UNCONFIRMED';
    const common={offerType:'AUTO_DISCOUNT',currency:'KRW',minimum:minimum ?? null,platformHint:'UNCONFIRMED',audienceHint:'UNCONFIRMED',mechanismHint,endMode:expiresAt?'FIXED_DATE':'UNKNOWN',expiresAt,expiryHint:Number.isFinite(relativeDays)?`RELATIVE_DAYS_${relativeDays}`:null,travel:{kind:'HOTEL',regions:['UNCONFIRMED']},evidenceLevel:'SOURCE_TEXT_ONLY',evidenceText:context.slice(0,240)};
    if (offer.kind==='FIXED') candidates.push({...common,discountKind:'FIXED',fixedAmount:numberFromText(offer.match[2]),currency:offer.match[1]==='$'?'USD':'KRW',cap:numberFromText(offer.match[2])});
    else candidates.push({...common,discountKind:'PERCENT',rate:Number(offer.match[1]),cap:null});
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
      offerType:'AUTO_DISCOUNT',discountKind:'PERCENT',rate:Number(match[1]),mechanismHint:'COUPON_UNCONFIRMED',currency:'KRW',minimum:null,cap:null,platformHint,audienceHint,
      endMode:endAt?'FIXED_DATE':'UNKNOWN',expiresAt:endAt,expiryHint:endAt?endAt.slice(0,10):null,
      travel:{kind,regions,...(startAt&&endAt?{bookingStartAt:startAt,bookingEndAt:endAt}:{})},
      evidenceLevel:'SOURCE_TEXT_ONLY',evidenceText:match[0].slice(0,200)
    });
  }
  return uniqueCandidates(candidates).filter(x => x.rate > 0);
}


function extract11st(text) {
  const candidates=[];
  const common=(section,extra={})=>({
    currency:'KRW',
    mechanismHint:'DOWNLOAD_COUPON',
    evidenceLevel:'SOURCE_TEXT_ONLY',
    evidenceText:section.slice(0,360),
    ...extra
  });

  const plus=sectionByHeadings(text,'[11번가플러스 10월 장바구니 쿠폰]',['[10% 컴백 스페셜 쿠폰]','[이벤트 문의]']);
  if (plus) {
    const rate=Number(plus.match(/최대\s*(\d{1,2})%/)?.[1] || NaN);
    const minimum=wonAmount(plus.match(/([\d,.]+\s*(?:만|천)?\s*원)\s*이상\s*구매/i)?.[1]);
    const cap=wonAmount(plus.match(/최대\s*([\d,.]+\s*(?:만|천)?\s*원)/i)?.[1]);
    const expiresAt=october2026End(plus);
    if (Number.isFinite(rate) && minimum!=null && cap!=null) candidates.push(common(plus,{
      offerType:'MEMBER',discountKind:'PERCENT',rate,minimum,cap,
      platformHint:'WEB_APP',audienceHint:'ELEVEN_PLUS',
      endMode:expiresAt?'FIXED_DATE':'UNKNOWN',expiresAt,expiryHint:expiresAt?expiresAt.slice(0,10):null,scopeHint:'CART'
    }));
  }

  const comeback=sectionByHeadings(text,'[10% 컴백 스페셜 쿠폰]',['[이벤트 문의]','패션뷰티 페스타']);
  if (comeback) {
    const rate=Number(comeback.match(/최대\s*(\d{1,2})%/)?.[1] || comeback.match(/(\d{1,2})%\s*컴백/)?.[1] || NaN);
    const minimum=wonAmount(comeback.match(/([\d,.]+\s*(?:만|천)?\s*원)\s*이상\s*구매/i)?.[1]);
    const cap=wonAmount(comeback.match(/최대\s*([\d,.]+\s*(?:만|천)?\s*원)/i)?.[1]);
    const expiresAt=october2026End(comeback);
    if (Number.isFinite(rate) && minimum!=null && cap!=null) candidates.push(common(comeback,{
      offerType:'MEMBER',discountKind:'PERCENT',rate,minimum,cap,
      platformHint:'WEB_APP',audienceHint:'RECENT_3_MONTH_NO_PURCHASE',
      endMode:expiresAt?'FIXED_DATE':'UNKNOWN',expiresAt,expiryHint:expiresAt?expiresAt.slice(0,10):null,scopeHint:'CART'
    }));
  }

  const beauty=sectionByHeadings(text,'[패션뷰티 장바구니 쿠폰 유의사항]',['[패션 장바구니 쿠폰]']);
  if (beauty) {
    const rate=Number(beauty.match(/할인\s*조건\s*:\s*(\d{1,2})%/)?.[1] || NaN);
    const minimum=wonAmount(beauty.match(/\(([\d,.]+\s*원)\s*이상\s*구매/i)?.[1]);
    const cap=wonAmount(beauty.match(/최대\s*([\d,.]+\s*원)/i)?.[1]);
    const expiresAt=october2026End(beauty);
    if (Number.isFinite(rate) && minimum!=null && cap!=null) candidates.push(common(beauty,{
      offerType:'AUTO_DISCOUNT',discountKind:'PERCENT',rate,minimum,cap,
      platformHint:'WEB_APP',audienceHint:'MEMBERS',
      endMode:/선착순|한정수량/.test(beauty)?'UNTIL_STOCK_EXHAUSTED':expiresAt?'FIXED_DATE':'UNKNOWN',
      expiresAt,expiryHint:expiresAt?expiresAt.slice(0,10):null,scopeHint:'FASHION_BEAUTY_EVENT'
    }));
  }

  const fashion=sectionByHeadings(text,'[패션 장바구니 쿠폰]',['[쿠폰 사용 유의사항]']);
  if (fashion) {
    const fixedAmount=wonAmount(fashion.match(/이상\s*구매\s*시\s*([\d,.]+\s*(?:만|천)?\s*원)\s*할인/i)?.[1]);
    const minimum=wonAmount(fashion.match(/([\d,.]+\s*(?:만|천)?\s*원)\s*이상\s*구매/i)?.[1]);
    const expiresAt=october2026End(fashion);
    if (fixedAmount!=null && minimum!=null) candidates.push(common(fashion,{
      offerType:'AUTO_DISCOUNT',discountKind:'FIXED',fixedAmount,minimum,cap:fixedAmount,
      platformHint:'APP',audienceHint:'MEMBERS',
      endMode:expiresAt?'FIXED_DATE':'UNKNOWN',expiresAt,expiryHint:expiresAt?expiresAt.slice(0,10):null,scopeHint:'FASHION'
    }));
  }

  return uniqueCandidates(candidates).filter(x => (x.fixedAmount ?? x.rate) > 0);
}

export function extractCandidates(source, html, now = new Date()) {
  const text=htmlToText(html);
  if (source.parserProfile === 'TRAVEL_DEALS') {
    if (source.id === 'agoda-deals' || source.brand === 'Agoda') return extractAgoda(text,now);
    if (source.id === 'tripcom-domestic-2026' || source.brand === 'Trip.com') return extractTripCom(text);
  }
  if (source.parserProfile === 'ELEVENST_PROMOTIONS' && source.id === '11st-october-2026') return extract11st(text);
  return [];
}

async function candidateId(source,candidate) {
  const identity={sourceId:source.id,offerType:candidate.offerType,discountKind:candidate.discountKind,rate:candidate.rate ?? null,fixedAmount:candidate.fixedAmount ?? null,currency:candidate.currency ?? null,minimum:candidate.minimum ?? null,cap:candidate.cap ?? null,platformHint:candidate.platformHint ?? null,audienceHint:candidate.audienceHint ?? null,mechanismHint:candidate.mechanismHint ?? null,endMode:candidate.endMode ?? null,expiryHint:candidate.expiryHint ?? null,travel:candidate.travel ?? null};
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
    await env.DB.prepare("UPDATE collection_runs SET finished_at=?,status='FAILED',observed_count=? WHERE run_id=?")
      .bind(new Date().toISOString(),observations.length,runId).run();
    throw new Error('COLLECTION_STORAGE_FAILED');
  }
}
