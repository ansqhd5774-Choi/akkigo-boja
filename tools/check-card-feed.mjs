import {mkdir,writeFile} from 'node:fs/promises';
const results=[];
for(const category of ['게임','유심·로밍','호스팅·도메인','해외직구','건강','VPN','교육']){
 try{
  const response=await fetch('https://akkigo-boja.ansqhd5774.workers.dev/public/card-feed?category='+encodeURIComponent(category),{signal:AbortSignal.timeout(45000)});
  const text=await response.text();let data;try{data=JSON.parse(text);}catch{}
  results.push({category,http:response.status,bytes:Buffer.byteLength(text),total:data?.total,entries:data?.entries?.length,pass:response.ok&&Array.isArray(data?.entries)&&data.entries.length===data.total});
 }catch{results.push({category,pass:false,state:'TRANSPORT_UNVERIFIED'});}
}
await mkdir('output',{recursive:true});await writeFile('output/card-feed-runtime.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
console.log(JSON.stringify(results));if(results.some(result=>!result.pass))process.exitCode=1;
