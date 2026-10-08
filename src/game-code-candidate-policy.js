import candidates from '../data/game-code-candidates.json' with {type:'json'};

// CANDIDATE is NOT ACTIVE. Never use the strict ACTIVE aggregator to discard
// source-listed game codes; it answers a different question.
export function validateGameCodeCandidates(rows=candidates){
  if(!Array.isArray(rows))throw Error('GAME_CANDIDATES_INVALID');
  const unique=new Set();
  for(const candidate of rows){
    if(!candidate||typeof candidate.gameName!=='string'||!candidate.gameName.trim()||
       !/^[A-Za-z0-9_-]{3,80}$/.test(candidate.code||''))throw Error('GAME_CANDIDATE_INVALID_CODE');
    const id=candidate.gameName+'|'+candidate.code;
    if(unique.has(id))throw Error('GAME_CANDIDATE_DUPLICATE');
    unique.add(id);
    if(candidate.sourceAuthority!=='THIRD_PARTY'&&candidate.sourceAuthority!=='OFFICIAL')throw Error('GAME_CANDIDATE_INVALID_SOURCE');
    if(!candidate.sourceName||!candidate.sourceUrl||!candidate.sourceGame)throw Error('GAME_CANDIDATE_MISSING_PROVENANCE');
    let sourceUrl;
    try{sourceUrl=new URL(candidate.sourceUrl);}catch{throw Error('GAME_CANDIDATE_INVALID_SOURCE_URL');}
    if(sourceUrl.protocol!=='https:')throw Error('GAME_CANDIDATE_INVALID_SOURCE_URL');
    if(!['UNVERIFIED','EXPIRED','REMOVED'].includes(candidate.status))throw Error('GAME_CANDIDATE_INVALID_STATUS');
    if(candidate.status!=='UNVERIFIED'){
      if(!candidate.statusEvidenceUrl||!candidate.statusEvidenceReason)throw Error('GAME_CANDIDATE_STATUS_EVIDENCE_REQUIRED');
      let evidenceUrl;try{evidenceUrl=new URL(candidate.statusEvidenceUrl);}catch{throw Error('GAME_CANDIDATE_STATUS_EVIDENCE_REQUIRED');}
      if(evidenceUrl.protocol!=='https:')throw Error('GAME_CANDIDATE_STATUS_EVIDENCE_REQUIRED');
    }
  }
  return true;
}
export function gameCodeCandidates(gameName){
  validateGameCodeCandidates();
  return candidates.filter(x=>x.gameName===gameName);
}
export function validateGameCandidateCoverage(article){
  if(!article?.post?.labels?.includes('게임'))return true;
  const matched=candidates.filter(x=>article.post.labels.includes(x.gameName));
  if(!matched.length)return true;
  validateGameCodeCandidates();
  const content=article.post.content||'';
  const copyValues=new Set([...content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(x=>x[1]));
  for(const candidate of matched){
    // EXPIRED belongs in the historical copyable list. One-account failure,
    // generic-looking strings, or unknown expiry MUST NOT silently remove a code.
    if(candidate.status==='REMOVED')continue;
    if(!copyValues.has(candidate.code))throw Error('GAME_CANDIDATE_OMITTED_'+candidate.code);
  }
  if(!/미확인|적용 여부|입력 시도/.test(content))throw Error('GAME_CANDIDATE_DISCLOSURE_MISSING');
  return true;
}
