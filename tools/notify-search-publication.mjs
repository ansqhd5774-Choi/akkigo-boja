import {appendFile,mkdir} from 'node:fs/promises';

export async function notifyPublication(result,{token=process.env.NAVER_CRAWL_ACCESS_TOKEN,fetcher=fetch}={}) {
  const report={url:result.url,provider:'NAVER',indexed:'UNVERIFIED'};
  let url;
  try {url=new URL(result.url);} catch {return {...report,state:'INVALID_URL'};}
  if(url.origin!=='https://lsifl.blogspot.com'||url.username||url.password||url.search||url.hash)
    return {...report,state:'INVALID_URL'};
  if(result.status!=='LIVE'||result.publicVerified!==true)
    return {...report,state:'SKIPPED_PUBLIC_UNVERIFIED'};
  if(result.alreadyLive===true&&result.updated!==true)
    return {...report,state:'SKIPPED_UNCHANGED'};
  if(!token)return {...report,state:'BLOCKED_CREDENTIAL_MISSING'};
  try {
    const response=await fetcher('https://apis.naver.com/searchadvisor/crawl-request/submit.json',{
      method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
      body:JSON.stringify({urls:[{url:url.href,type:'update'}]}),signal:AbortSignal.timeout(15000)});
    const body=await response.json().catch(()=>null);
    return {...report,httpStatus:response.status,
      state:response.ok&&Number(body?.errorCode)===0&&body?.result?.totalUpdateCount===1
        ?'REQUEST_ACCEPTED':'REQUEST_REJECTED'};
  } catch {return {...report,state:'REQUEST_STATE_UNKNOWN'};}
}

export async function recordPublicationNotification(result) {
  const report=await notifyPublication(result);
  // Provider response bodies and credential-bearing exceptions are never logged.
  console.log('SEARCH_NOTIFICATION',JSON.stringify(report));
  try {
    await mkdir('output',{recursive:true});
    await appendFile('output/search-notifications.jsonl',JSON.stringify({...report,checkedAt:new Date().toISOString()})+'\n');
    if(process.env.GITHUB_STEP_SUMMARY)
      await appendFile(process.env.GITHUB_STEP_SUMMARY,`\n- 검색 알림: ${report.state} / ${report.url} / 실제 색인: 미검증\n`);
  } catch {console.log('SEARCH_NOTIFICATION_REPORT_WRITE_FAILED');}
  return report;
}
