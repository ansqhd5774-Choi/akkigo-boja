import {normalizePeriodRecords} from './game-period-article.js';

// Count the same deduplicated rows used by the public renderer. A status label
// is a source record, not proof of successful redemption or official expiry.
export function summarizeGamePeriodModel(model){
 const rows=normalizePeriodRecords(model.records);
 const expired=rows.filter(r=>/만료|종료/.test(r.statusLabel||''));
 return {articleKey:model.articleKey,title:model.title,total:rows.length,
  copyButtons:rows.length,shareButtons:rows.length,
  sourceDateUnknown:rows.filter(r=>!r.sourcePublishedAt).length,
  expiredRecords:expired.length,expiredCodes:expired.map(r=>r.code)};
}
