import {renderArticleInfo} from './article-presentation.js';
import {annotateSourceHealth} from './source-health.js';
import {FIVE_COLUMN_HEADER} from './game-coupon-table.js';
import baseline from '../data/game-period-migration-baseline.json' with {type:'json'};

export const GAME_PERIOD_VERSION='game-period-tabs-r1';
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const date=s=>s==null?null:/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s?s:(()=>{throw Error('PERIOD_SOURCE_DATE_INVALID');})();
export function normalizePeriodRecords(records){
 const map=new Map();
 for(const r of records){
  if(!r||typeof r.code!=='string'||!r.code.trim()||/[<>"'&\s]/.test(r.code))throw Error('PERIOD_CODE_INVALID');
  const published=date(r.sourcePublishedAt);
  const sources=r.sources||[];
  const previous=map.get(r.code);
  if(previous){
   previous.sources=[...previous.sources,...sources];
   previous.sourcePublishedAt=[previous.sourcePublishedAt,published].filter(Boolean).sort()[0]??null;
   previous.evidenceHTML+=(r.evidenceHTML||'');
  }else map.set(r.code,{...r,sourcePublishedAt:published,sources:[...sources]});
 }
 return [...map.values()].map(r=>({...r,sources:[...new Map(r.sources.map(s=>[JSON.stringify(s),s])).values()]}));
}
export function groupPeriodRecords(records){
 const groups=new Map([['latest',[]],['2026',[]],['2025',[]],['2024',[]],['unknown',[]]]);
 for(const r of normalizePeriodRecords(records)){
  // Latest is an explicit evidence decision, never the collection/publication month.
  if(r.latest===true&&!r.latestEvidence)throw Error('PERIOD_LATEST_EVIDENCE_REQUIRED');
  const period=r.latest===true?'latest':r.sourcePublishedAt?.slice(0,4)||'unknown';
  if(!groups.has(period))groups.set(period,[]);
  groups.get(period).push(r);
 }
 return [...groups].filter(([p])=>p!=='unknown').sort(([a],[b])=>a==='latest'?-1:b==='latest'?1:b.localeCompare(a)).concat([['unknown',groups.get('unknown')]])
  .map(([period,rows])=>({period,rows:rows.sort((a,b)=>(b.sourcePublishedAt||'').localeCompare(a.sourcePublishedAt||''))}));
}
const share='<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>';
function row(r,i){
 const thirdPartyOnly=r.sources.length>0&&r.sources.every(s=>s.referenceType==='THIRD_PARTY_CODE_MENTION');
 const provenance=thirdPartyOnly?'<p data-source-provenance="third-party-reference">제3자 코드 목록에 수록된 것을 확인했습니다. 최초 공식 원문·원문 게시일·계정 입력 성공은 미확인입니다.</p>':!r.sources.some(s=>s.url)?'<p data-source-provenance="unconfirmed">코드별 원문 URL 연결 미확인입니다. 기존 수집 기록이며, 현재 사용 가능 여부를 보장하지 않습니다.</p>':'';
 const evidence=provenance+(r.evidenceHTML||'')+r.sources.map(s=>'<p>'+esc(s.sourcePublishedAt||'원문 게시일 미확인')+' · '+(s.url&&/^https?:\/\//.test(s.url)?'<a href="'+esc(s.url)+'" rel="noopener noreferrer">'+esc(s.name||'출처')+'</a>':esc(s.name||'출처 미확인'))+(s.checkedAt?' · 내용 확인 '+esc(s.checkedAt):'')+'</p>').join('');
 return '<div class="ncp-code-card" role="row"><span class="ncp-col-order" role="cell">'+String(i+1).padStart(2,'0')+'</span><span class="ncp-col-source" role="cell"><span>'+esc(r.sourcePublishedAt?.replaceAll('-','.')||'게시일 미확인')+'</span>'+renderArticleInfo(evidence||'<p>원문 날짜와 실제 사용 여부는 미확인입니다.</p>',r.code+' 출처·보상·확인 사항')+'</span><span class="ncp-col-expiry" role="cell">'+esc(r.expiry||'미확인')+'</span><code class="ncp-col-code" role="cell">'+esc(r.code)+'<small class="ncp-code-status">'+esc(r.statusLabel||'사용 여부 미확인')+'</small></code><span class="ncp-col-action" role="cell"><button class="ncp-share" type="button" data-ncp-share="'+esc(r.code)+'" aria-label="'+esc(r.code)+' 공유">'+share+'</button><button class="ncp-copy" type="button" data-ncp-copy="'+esc(r.code)+'" aria-label="'+esc(r.code)+' 쿠폰 복사">복사</button><span class="ncp-copy-state" role="status" aria-live="polite"></span></span></div>';
}
function list(rows,label){
 if(!rows.length)return '<p class="ncp-period-empty">'+(label==='최신'?'현재 입력 대상으로 분류할 근거가 확인된 코드가 없습니다. 연도별 기록과 게시일 미확인 기록을 확인하세요.':'이 기간에 원문 게시일이 확인된 기록이 없습니다.')+'</p>';
 const all=rows.map(row);
 return '<div class="ncp-card-list ncp-compact-list" role="table" aria-label="'+esc(label)+' 쿠폰 기록">'+FIVE_COLUMN_HEADER+all.slice(0,5).join('')+(all.length>5?'<details class="ncp-list-more"><summary aria-label="'+esc(label)+' 나머지 '+(all.length-5)+'개 보기">더 보기 '+(all.length-5)+'</summary>'+all.slice(5).join('')+'</details>':'')+'</div>';
}
function renderGamePeriodArticleBase(model){
 if(!/^[a-z0-9-]+$/.test(model.articleKey))throw Error('PERIOD_ARTICLE_KEY_INVALID');
 const groups=groupPeriodRecords(model.records);
 const codes=new Set(model.records.map(r=>r.code));
 for(const code of baseline[model.articleKey]||[])if(!codes.has(code))throw Error('PERIOD_HISTORY_OMITTED_'+code);
 for(const fragment of [model.featuredHTML,model.previewHTML,model.noticeHTML,model.guideHTML,model.archiveHTML,...model.records.map(r=>r.evidenceHTML)]){
  if(/<\/?(?:script|style|input|button|nav)\b|data-ncp-(?:copy|share|period|template)=|\bon\w+\s*=/i.test(fragment||''))throw Error('PERIOD_UNSAFE_OR_LEGACY_FRAGMENT');
 }
 const known=groups.filter(g=>g.period!=='unknown');
 const key=model.articleKey;
 const nav='<fieldset class="ncp-period-controls" style="--ncp-period-count:'+known.length+'"><legend class="ncp-sr-only">쿠폰 기록 기간</legend>'+known.map(g=>{
  const label=g.period==='latest'?'최신':g.period+'년 기록',id=key+'-choice-'+g.period;
  return '<div class="ncp-period-option"><input id="'+id+'" type="radio" name="'+key+'-period" value="'+g.period+'"'+(g.period==='latest'?' checked="checked"':'')+' aria-controls="'+key+'-period-'+g.period+'"><label for="'+id+'">'+(g.period==='latest'?'최신':g.period)+' <small>'+g.rows.length+'</small></label><section class="ncp-period-panel" data-ncp-period="'+g.period+'" id="'+key+'-period-'+g.period+'"><h2>'+label+'</h2>'+renderArticleInfo('<p>원문 글 게시일 기준입니다. 수집일·수정일·만료일을 발행 날짜로 사용하지 않습니다. 최신에 표시한 코드는 연도 목록에 중복 출력하지 않습니다.</p>',label+' 안내')+list(g.rows,label)+'</section></div>';
 }).join('')+'</fieldset>';
 const unknown=groups.find(g=>g.period==='unknown');
 return (model.previewHTML||'<div data-ncp-feed-preview class="ncp-feed-preview">'+esc(model.title)+' 쿠폰 기록 '+normalizePeriodRecords(model.records).length+'개</div>')+'\n<!--more-->\n<article class="ncp-coupon-article" data-ncp-article="'+key+'" data-ncp-presentation="compact-r2" data-ncp-template="'+GAME_PERIOD_VERSION+'">'+(model.featuredHTML||'')+'<div class="ncp-brief"><p>원문 게시일별 쿠폰 기록 '+normalizePeriodRecords(model.records).length+'개입니다. 사용 조건과 출처는 ⓘ에서 확인하세요. 복사 완료는 사용 성공을 뜻하지 않습니다.</p>'+renderArticleInfo((model.noticeHTML||'')+'<p>공식 발급·현재 사용 가능 여부가 미확인인 기록은 유효 쿠폰으로 단정하지 않습니다.</p>','자료와 날짜 안내')+'</div><div class="ncp-period-browser">'+nav+'</div>'+(unknown.rows.length?'<section class="ncp-period-unknown"><h2>게시일 미확인 기록</h2>'+renderArticleInfo('<p>원문 최초 게시일이 확인되지 않아 연도에 배정하지 않았습니다.</p>','게시일 미확인 안내')+list(unknown.rows,'게시일 미확인')+'</section>':'')+(model.guideHTML||'')+'<section class="ncp-period-evidence"><h2>출처와 상세 안내</h2>'+renderArticleInfo(model.archiveHTML||'<p>각 행의 출처를 확인하세요.</p>','기존 기록·보상·입력 방법·출처 전체 보기')+'</section></article>';
}
export function renderGamePeriodArticle(model){
 return annotateSourceHealth(renderGamePeriodArticleBase(model));
}
export function validateGamePeriodArticle(article){
 const model=article.source?.gamePeriodModel;
 if(!model||model.articleKey!==article.articleKey||article.source.templateVersion!==GAME_PERIOD_VERSION)throw Error('GAME_PERIOD_MODEL_REQUIRED');
 if(article.post.content!==renderGamePeriodArticle(model))throw Error('GAME_PERIOD_GENERATED_CONTENT_DRIFT');
 if((article.post.content.match(/<!--more-->/g)||[]).length!==1)throw Error('GAME_PERIOD_JUMP_BREAK_COUNT');
 return true;
}
