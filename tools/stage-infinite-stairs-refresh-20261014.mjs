import {readFileSync,writeFileSync,existsSync} from 'node:fs';

const key='infinite-stairs-codes-202610';
const checkedAt='2026-10-14';
const latestMentionUrl='https://alldig.tistory.com/entry/무한의-계단-티어표-등급표-리세마라-쿠폰-코드-공략-스킬-티어-조합';
const explicitCandidateUrl='https://www.digwow.net/%EB%AC%B4%ED%95%9C%EC%9D%98-%EA%B3%84%EB%8B%A8/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
const officialKLeagueUrl='https://www.kleague.com/news_view.do?category=notice&orderBy=seq&page=1&seq=94550&viewOption=album';
const teamKLeagueRunUrl='https://teamkleaguerun.com/';
const candidateCodes=['STAIRS','INFINITY','UPDATE','GIFT'];
const excludedInvalidProbes=['s6cki523bq','uwia30kjing','lz6ph653m4'];
const marker='data-ncp-refresh="2026-10-14"';
const worldwideMarker='data-ncp-worldwide-recheck="2026-10-14"';
const note=`<p ${marker}>2026년 10월 14일 다국어 재조사에서도 공식 발급·현재 사용 성공이 확인된 새 공용 쿠폰은 찾지 못했습니다. STAIRS, INFINITY, UPDATE, GIFT는 10월 13일 갱신된 제3자 목록에서 다시 확인했지만 최초 게시일·공식 발급·계정 입력 성공은 확인되지 않아 미확인 후보로 유지합니다.</p>`;
const worldwideNote=`<p ${worldwideMarker}>공식 혜택 이력: 2026년 3월 28일 팀 K리그 런 참가 기념품에 K리그×무한의 계단 한정 유니폼 스킨 쿠폰이 포함됐습니다. 참가자 지급형으로 공개 공용 문자열은 확인되지 않았고, 공식 쿠폰 사용 만료일도 미확인입니다. <a href="${teamKLeagueRunUrl}" rel="noopener noreferrer">행사 안내</a> · <a href="${officialKLeagueUrl}" rel="noopener noreferrer">K리그 공식 협업 공지</a></p>`;
const latestMentionLink=`<a href="${latestMentionUrl}" rel="noopener noreferrer">2026-10-11 제3자 쿠폰 언급 자료</a>`;
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const save=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};

function refreshCandidate(record){
  if(!candidateCodes.includes(record.code)) return;
  record.latest=false;
  record.sourcePublishedAt=null;
  record.statusLabel='사용 여부 미확인';
  record.sources=Array.isArray(record.sources)?record.sources:[];
  const source=record.sources.find(s=>s?.url===explicitCandidateUrl)||record.sources.find(s=>s?.referenceType==='THIRD_PARTY_CODE_MENTION');
  if(source){
    source.url=explicitCandidateUrl;
    source.name='DIGWOW 제3자 코드 목록';
    source.referenceType='THIRD_PARTY_CODE_MENTION';
    source.sourcePublishedAt=null;
    source.updatedAt='2026-10-13';
    source.checkedAt=checkedAt;
  }else{
    record.sources.push({name:'DIGWOW 제3자 코드 목록',url:explicitCandidateUrl,referenceType:'THIRD_PARTY_CODE_MENTION',sourcePublishedAt:null,updatedAt:'2026-10-13',checkedAt});
  }
}

if(process.argv.includes('--after-render')){
  const articles=load('data/articles.json');
  const article=articles.find(a=>a.articleKey===key);
  assert(article,'INFINITE_STAIRS_ARTICLE_MISSING');
  article.source={...article.source,checkedAt};
  article.source.references=Array.isArray(article.source.references)?article.source.references:[];
  for(const url of [latestMentionUrl,explicitCandidateUrl,officialKLeagueUrl,teamKLeagueRunUrl]) if(!article.source.references.some(r=>(typeof r==='string'?r:r?.url)===url)) article.source.references.push(url);
  save('data/articles.json',articles);
  const draftPath='drafts/'+key+'.json';
  if(existsSync(draftPath)){
    const draft=load(draftPath);
    draft.source={...draft.source,checkedAt};
    draft.source.references=Array.isArray(draft.source.references)?draft.source.references:[];
    for(const url of [latestMentionUrl,explicitCandidateUrl,officialKLeagueUrl,teamKLeagueRunUrl]) if(!draft.source.references.some(r=>(typeof r==='string'?r:r?.url)===url)) draft.source.references.push(url);
    save(draftPath,draft);
  }
  console.log('INFINITE_STAIRS_AFTER_RENDER_PASS',JSON.stringify({checkedAt,references:[latestMentionUrl,explicitCandidateUrl,officialKLeagueUrl,teamKLeagueRunUrl]}));
  process.exit(0);
}

const models=load('data/game-period-articles.json');
const model=models.find(m=>m.articleKey===key);
assert(model,'INFINITE_STAIRS_PERIOD_MODEL_MISSING');
assert(Array.isArray(model.records)&&model.records.length===49,'INFINITE_STAIRS_HISTORY_COUNT_CHANGED');
assert(new Set(model.records.map(r=>r.code)).size===49,'INFINITE_STAIRS_HISTORY_DUPLICATE');
assert(model.records.filter(r=>r.latest===true).length===0,'INFINITE_STAIRS_CURRENT_CODE_UNEXPECTED');
for(const code of excludedInvalidProbes) assert(!model.records.some(r=>r.code===code),'INFINITE_STAIRS_INVALID_PROBE_ENTERED_PERIOD_MODEL_'+code);
for(const code of candidateCodes) assert(model.records.some(r=>r.code===code),'INFINITE_STAIRS_KNOWN_CANDIDATE_MISSING_'+code);
for(const record of model.records) refreshCandidate(record);
model.noticeHTML=(model.noticeHTML||'').replace(/<p data-ncp-refresh="2026-10-14">[\s\S]*?<\/p>/g,'').trim()+note;
model.archiveHTML=(model.archiveHTML||'').replace(/<p data-ncp-worldwide-recheck="2026-10-14">[\s\S]*?<\/p>/g,'').trim()+worldwideNote;
if(!String(model.archiveHTML||'').includes(latestMentionUrl)) model.archiveHTML=(model.archiveHTML||'')+`<p>${latestMentionLink}</p>`;
model.researchCheckedAt=checkedAt;
save('data/game-period-articles.json',models);

const researchPath='drafts/infinite-stairs-global-research-20261009.json';
const research=load(researchPath);
assert(research.records.length===49,'INFINITE_STAIRS_RESEARCH_HISTORY_COUNT_CHANGED');
assert(new Set(research.records.map(r=>r.code)).size===49,'INFINITE_STAIRS_RESEARCH_DUPLICATE');
for(const code of candidateCodes) assert(research.records.some(r=>r.code===code),'INFINITE_STAIRS_RESEARCH_KNOWN_CANDIDATE_MISSING_'+code);
research.checkedAt=checkedAt;
research.sources={...research.sources,latestMention20261011:latestMentionUrl,explicitCandidates20261013:explicitCandidateUrl,officialKLeague20260311:officialKLeagueUrl,teamKLeagueRun20260328:teamKLeagueRunUrl};
research.summary={...research.summary,accountVerifiedCurrent:0};
for(const record of research.records){
  if(!candidateCodes.includes(record.code)) continue;
  record.status='UNVERIFIED';
  record.sourceAuthority='THIRD_PARTY';
  record.sourceType='UNCORROBORATED';
  record.sourceUrl=explicitCandidateUrl;
  record.publishedAt=null;
  record.sourcePublishedAt=null;
  record.sourceUpdatedAt='2026-10-13';
  record.dateBasis='SOURCE_ORIGINAL_PUBLICATION_DATE_NOT_EXPOSED_UPDATE_DATE_NOT_SUBSTITUTED';
  record.sourceCheckedAt=checkedAt;
  record.workingVerifiedAt=null;
  record.redemptionResult=null;
}
research.latestRecheck={
  checkedAt,
  scopeLanguages:['ko','en','ja','zh-CN','zh-TW','th','vi','id'],
  currentVerifiedCodeCount:0,
  preservedRecordCount:49,
  explicitThirdPartyCandidates:candidateCodes,
  explicitCandidateSource:{url:explicitCandidateUrl,sourcePublishedAt:null,sourceUpdatedAt:'2026-10-13',officialIssueVerified:false,redemptionVerified:false},
  latestSourceMention:{sourcePublishedAt:'2026-10-11',sourceUrl:latestMentionUrl,referenceType:'SOURCE_TEXT_ONLY',concreteCodeObserved:false},
  officialIssuedBenefits:[{type:'PARTICIPANT_ISSUED_COUPON',event:'2026 서울 팀 K리그 런',eventDate:'2026-03-28',benefit:'K리그×무한의계단 한정 유니폼 스킨쿠폰',publicSharedCode:false,redemptionExpiry:null,sourceUrl:teamKLeagueRunUrl,officialCollabUrl:officialKLeagueUrl}],
  result:'NO_OFFICIAL_CURRENT_PUBLIC_CODE_CONFIRMED',
  excludedInvalidProbes,
  note:'제3자 명시 문자열 4개는 기존 49개 후보에 이미 포함돼 있어 중복 추가하지 않음. 10월 13일은 페이지 갱신일이므로 최초 게시일로 대체하지 않음.'
};
save(researchPath,research);
console.log('INFINITE_STAIRS_STAGE_PASS',JSON.stringify({records:model.records.length,current:model.records.filter(r=>r.latest===true).length,candidateCodes,officialIssuedBenefitCount:1,excludedInvalidProbes,checkedAt}));
