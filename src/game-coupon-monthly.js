// Monthly game-code history: preserve original discovery month when a post is updated.
// Never infer a code's month from the post's publication/update date.
import {renderGameCouponTable} from './game-coupon-table.js';

const MONTH=/^\d{4}-(0[1-9]|1[0-2])$/;
// Official Korean-language gift codes must remain case- and Unicode-exact.
const VALID_CODE=/^[\p{L}\p{N}_-]{3,80}$/u;
const escapeHTML=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function checkMonth(month){
  if(!MONTH.test(month||''))throw Error('GAME_MONTH_INVALID');
  return month;
}
function assertRows(rows){
  if(!Array.isArray(rows))throw Error('GAME_MONTH_ROWS_INVALID');
  const used=new Set();
  for(const row of rows){
    if(!row || !VALID_CODE.test(row.code||'') || used.has(row.code))throw Error('GAME_MONTH_DUPLICATE_OR_INVALID_CODE');
    if(row.firstSeenMonth!=null)checkMonth(row.firstSeenMonth);
    used.add(row.code);
  }
}

// Include all previous rows, even if not observed in the latest check.
// Newly observed codes receive the observation month exactly once.
export function mergeMonthlyGameCodes(previousRows,newlyObservedRows,{observationMonth}={}){
  checkMonth(observationMonth);
  assertRows(previousRows);
  assertRows(newlyObservedRows);
  const old=new Map(previousRows.map(r=>[r.code,r]));
  const merged=previousRows.map(r=>({...r}));
  for(const current of newlyObservedRows){
    const original=old.get(current.code);
    if(original){
      const index=merged.findIndex(r=>r.code===current.code);
      merged[index]={...original,...current,firstSeenMonth:original.firstSeenMonth??null};
    } else {
      merged.push({...current,firstSeenMonth:observationMonth});
    }
  }
  return merged;
}

export function groupMonthlyGameCodes(rows,{currentMonth}={}){
  checkMonth(currentMonth);
  assertRows(rows);
  const grouped=new Map();
  for(const row of rows){
    const month=row.firstSeenMonth??'unknown';
    if(month!=='unknown' && month>currentMonth)throw Error('GAME_MONTH_IN_FUTURE');
    if(!grouped.has(month))grouped.set(month,[]);
    grouped.get(month).push(row);
  }
  return [...grouped].sort(([a],[b])=>a==='unknown'?1:b==='unknown'?-1:b.localeCompare(a))
    .map(([month,codes])=>({month,codes,isNew:month===currentMonth,
      heading:month==='unknown'?'최초 발견 월 미상 쿠폰':month.slice(0,4)+'년 '+Number(month.slice(5))+'월 '+(month===currentMonth?'신규 쿠폰':'이전 쿠폰')}));
}

// Render every month OPEN with the existing five-column, 68px copy-button table.
export function renderMonthlyGameCouponSections(rows,{currentMonth}={}){
  const groups=groupMonthlyGameCodes(rows,{currentMonth});
  return groups.map(group=>{
    const label=group.heading+' · '+group.codes.length+'개';
    const items=group.codes.map(row=>({code:row.code,source:row.source||'출처 확인',expiry:row.expiry||'미확인'}));
    return '<section class="ncp-monthly-group" data-ncp-coupon-month="'+group.month+'">'+
      '<h2>'+escapeHTML(label)+'</h2>'+
      (group.month==='unknown'?'<p>최초 발견 시점이 확인되지 않아 신규 쿠폰으로 분류하지 않았습니다.</p>':'')+
      renderGameCouponTable(items,{label})+'</section>';
  }).join('\n');
}

// Enforce the history-to-visible-copy mapping for updated game articles that
// declare source.gameCouponTimeline = {currentMonth, codes:[{code,firstSeenMonth,...}]}.
export function validateMonthlyGameCouponTimeline(article){
  const timeline=article?.source?.gameCouponTimeline;
  if(timeline==null)return true; // legacy articles without source dates are not relabelled.
  if(!article?.post?.labels?.includes('게임'))throw Error('GAME_MONTH_NOT_GAME');
  const groups=groupMonthlyGameCodes(timeline.codes,{currentMonth:timeline.currentMonth});
  const html=article.post.content||'';
  const marks=[...html.matchAll(/<section class="ncp-monthly-group" data-ncp-coupon-month="([^"]+)">/g)];
  if(marks.length!==groups.length)throw Error('GAME_MONTH_GROUP_COUNT');
  const actual=new Set();
  for(let i=0;i<marks.length;i++){
    const group=groups[i];
    if(marks[i][1]!==group.month)throw Error('GAME_MONTH_WRONG_ORDER');
    const from=marks[i].index+marks[i][0].length;
    const end=html.indexOf('</section>',from);
    if(end<0 || (marks[i+1]&&end>=marks[i+1].index))throw Error('GAME_MONTH_SECTION_UNCLOSED');
    const content=html.slice(from,end);
    if(/<details\b/.test(content))throw Error('GAME_MONTH_CODES_COLLAPSED');
    if(!content.includes('<h2>'+escapeHTML(group.heading)+' · '+group.codes.length+'개</h2>'))throw Error('GAME_MONTH_HEADING');
    const copies=[...content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
    if(copies.length!==group.codes.length)throw Error('GAME_MONTH_CODE_COUNT');
    const expected=new Set(group.codes.map(r=>r.code));
    for(const code of copies){
      if(!expected.has(code)||actual.has(code))throw Error('GAME_MONTH_WRONG_CODE');
      actual.add(code);
    }
  }
  const total=[...html.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);
  if(total.length!==timeline.codes.length||actual.size!==timeline.codes.length)throw Error('GAME_MONTH_MISSING_CODE');
  return true;
}
