const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;

export function exactExpiryDate(value){
  return validDate(value)?value:null;
}

export function isExplicitHistoricalExpiry(value){
  if(typeof value!=='string')return false;
  const normalized=value.trim().replace(/\s+/g,' ');
  return /^(?:과거 )?(?:종료|만료) 보고$/i.test(normalized)||/^(?:EXPIRED|EXPIRED_REPORTED)$/i.test(normalized);
}

export function normalizeHistoricalPeriod(record,checkedAt){
  if(!record||typeof record!=='object')throw Error('PERIOD_POLICY_RECORD_INVALID');
  if(!validDate(checkedAt))throw Error('PERIOD_POLICY_CHECKED_AT_INVALID');
  const before=JSON.stringify({latest:record.latest,periodYear:record.periodYear});
  delete record.periodYear;
  const expiry=exactExpiryDate(record.expiry);
  const historical=Boolean(expiry&&expiry<checkedAt)||isExplicitHistoricalExpiry(record.expiry);
  if(historical){
    if(record.latest===true)record.latest=false;
    const year=expiry?.slice(0,4)||(/^\d{4}-\d{2}-\d{2}$/.test(record.sourcePublishedAt||'')?record.sourcePublishedAt.slice(0,4):null);
    if(year)record.periodYear=year;
  }
  return before!==JSON.stringify({latest:record.latest,periodYear:record.periodYear});
}

export function recordPeriod(record){
  if(/^\d{4}$/.test(record?.periodYear||''))return record.periodYear;
  if(record?.latest===true)return 'latest';
  if(/^\d{4}-\d{2}-\d{2}$/.test(record?.sourcePublishedAt||''))return record.sourcePublishedAt.slice(0,4);
  return 'unknown';
}

export function recordPeriodSortKey(record){
  if(/^\d{4}$/.test(record?.periodYear||''))return exactExpiryDate(record.expiry)||record.sourcePublishedAt||'';
  return record?.sourcePublishedAt||'';
}
