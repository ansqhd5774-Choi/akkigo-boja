const linkedTypes=new Set(['OFFICIAL_CODE_CONTEXT','THIRD_PARTY_CODE_MENTION','THIRD_PARTY_CASE_VARIANT']);
export function summarizeSourceGaps(gaps,articles){
 const models=new Map(articles.map(a=>[a.articleKey,a.source?.gamePeriodModel]));
 let linked=0;
 for(const gap of gaps){const record=models.get(gap.articleKey)?.records?.find(r=>r.code===gap.code);if(record?.sources?.some(s=>linkedTypes.has(s.referenceType)))linked++;}
 return {original:gaps.length,linked,unconfirmed:gaps.length-linked};
}
