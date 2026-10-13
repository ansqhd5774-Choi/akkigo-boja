import {readFileSync,writeFileSync,existsSync} from 'node:fs';

const key='infinite-stairs-codes-202610';
const checkedAt='2026-10-14';
const freshUrl='https://alldig.tistory.com/entry/무한의-계단-티어표-등급표-리세마라-쿠폰-코드-공략-스킬-티어-조합';
const marker='data-ncp-refresh="2026-10-14"';
const note=`<p ${marker}>2026년 10월 14일 재조사에서 현재 사용 가능으로 확인된 새 쿠폰은 찾지 못했습니다. 10월 11일 제3자 글은 쿠폰을 언급하지만 공개 검색에서 실제 코드 문자열을 확인하지 못해 참고 출처로만 보존했습니다.</p>`;
const link=`<a href="${freshUrl}" rel="noopener noreferrer">2026-10-11 제3자 쿠폰 언급 자료</a>`;
const excludedInvalidProbes=['s6cki523bq','uwia30kjing','lz6ph653m4'];
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const save=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};

if(process.argv.includes('--after-render')){
  const articles=load('data/articles.json');
  const article=articles.find(a=>a.articleKey===key);
  assert(article,'INFINITE_STAIRS_ARTICLE_MISSING');
  article.source={...article.source,checkedAt};
  if(Array.isArray(article.source.references)&&!article.source.references.some(r=>(typeof r==='string'?r:r?.url)===freshUrl)) article.source.references.push(freshUrl);
  save('data/articles.json',articles);
  const draftPath='drafts/'+key+'.json';
  if(existsSync(draftPath)){
    const draft=load(draftPath);
    draft.source={...draft.source,checkedAt};
    if(Array.isArray(draft.source.references)&&!draft.source.references.some(r=>(typeof r==='string'?r:r?.url)===freshUrl)) draft.source.references.push(freshUrl);
    save(draftPath,draft);
  }
  console.log('INFINITE_STAIRS_AFTER_RENDER_PASS',JSON.stringify({checkedAt,reference:freshUrl}));
  process.exit(0);
}

const models=load('data/game-period-articles.json');
const model=models.find(m=>m.articleKey===key);
assert(model,'INFINITE_STAIRS_PERIOD_MODEL_MISSING');
assert(Array.isArray(model.records)&&model.records.length===49,'INFINITE_STAIRS_HISTORY_COUNT_CHANGED');
assert(new Set(model.records.map(r=>r.code)).size===49,'INFINITE_STAIRS_HISTORY_DUPLICATE');
assert(model.records.filter(r=>r.latest===true).length===0,'INFINITE_STAIRS_CURRENT_CODE_UNEXPECTED');
for(const code of excludedInvalidProbes) assert(!model.records.some(r=>r.code===code),'INFINITE_STAIRS_INVALID_PROBE_ENTERED_PERIOD_MODEL_'+code);
model.noticeHTML=(model.noticeHTML||'').replace(/<p data-ncp-refresh="2026-10-14">[\s\S]*?<\/p>/g,'').trim()+note;
if(!String(model.archiveHTML||'').includes(freshUrl)) model.archiveHTML=(model.archiveHTML||'')+`<p>${link}</p>`;
model.researchCheckedAt=checkedAt;
save('data/game-period-articles.json',models);

const researchPath='drafts/infinite-stairs-global-research-20261009.json';
const research=load(researchPath);
assert(research.records.length===49,'INFINITE_STAIRS_RESEARCH_HISTORY_COUNT_CHANGED');
assert(new Set(research.records.map(r=>r.code)).size===49,'INFINITE_STAIRS_RESEARCH_DUPLICATE');
research.checkedAt=checkedAt;
research.sources={...research.sources,latestMention20261011:freshUrl};
research.summary={...research.summary,accountVerifiedCurrent:0};
research.latestRecheck={
  checkedAt,
  sourcePublishedAt:'2026-10-11',
  sourceUrl:freshUrl,
  referenceType:'SOURCE_TEXT_ONLY',
  concreteCodeObserved:false,
  result:'NO_CURRENT_CODE_FOUND',
  excludedInvalidProbes,
  note:'쿠폰을 언급하는 제3자 글은 확인했지만 공개 검색에서 실제 코드 문자열을 확인하지 못해 쿠폰 행으로 추가하지 않음'
};
save(researchPath,research);
console.log('INFINITE_STAIRS_STAGE_PASS',JSON.stringify({records:model.records.length,current:model.records.filter(r=>r.latest===true).length,excludedInvalidProbes,checkedAt}));
