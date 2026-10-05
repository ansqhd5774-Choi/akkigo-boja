import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {randomBytes,createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// 인증정보는 콘솔/파일에 기록하지 않고 Wrangler stdin으로만 전달한다.
const root=fileURLToPath(new URL('../',import.meta.url));
let server;
let timer;
try {
  const file=process.argv[2];
  if (!file) throw new Error('CLIENT_JSON_PATH_REQUIRED');
  const client=JSON.parse(await readFile(file,'utf8')).installed;
  if (!client?.client_id || !client?.client_secret) throw new Error('DESKTOP_CLIENT_REQUIRED');
  const state=randomBytes(32).toString('base64url');
  const verifier=randomBytes(48).toString('base64url');
  let consumed=false;
  let authUrl;
  let redirect;
  server=createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    const url=new URL(req.url,'http://127.0.0.1');
    if (url.pathname==='/') {
      res.end(`<h1>Blogger 연결</h1><p>아끼고 보자 운영 계정으로 로그인하세요. Blogger 관리 권한에 동의하면 대상 블로그를 확인한 뒤 Worker Secret에 저장합니다. 게시물은 발행하지 않습니다.</p><a href="${authUrl.toString().replaceAll('&','&amp;')}">Google 동의 화면 열기</a>`);return;
    }
    if (url.pathname!=='/callback' || consumed || url.searchParams.get('state')!==state) {res.statusCode=400;res.end('잘못된 요청입니다.');return;}
    consumed=true;
    try {
      const code=url.searchParams.get('code');
      if (!code) throw new Error('CONSENT_NOT_GRANTED');
      const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({client_id:client.client_id,client_secret:client.client_secret,code,code_verifier:verifier,redirect_uri:redirect,grant_type:'authorization_code'}),signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error('TOKEN_EXCHANGE_FAILED');
      const token=await response.json();
      if (!token.access_token || !token.refresh_token) throw new Error('OFFLINE_TOKEN_MISSING');
      const blogResponse=await fetch('https://www.googleapis.com/blogger/v3/blogs/2339978524893611480',{headers:{Authorization:`Bearer ${token.access_token}`},signal:AbortSignal.timeout(15000)});
      if (!blogResponse.ok) throw new Error('BLOG_ACCESS_NOT_CONFIRMED');
      const blog=await blogResponse.json();
      if (blog.id!=='2339978524893611480' || new URL(blog.url).hostname!=='lsifl.blogspot.com') throw new Error('BLOG_TARGET_MISMATCH');
      await new Promise((resolve,reject)=>{
        const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','secret','bulk'],{cwd:root,stdio:['pipe','ignore','ignore'],timeout:60000});
        child.on('error',()=>reject(new Error('SECRET_UPLOAD_FAILED')));
        child.stdin.on('error',()=>{});
        child.on('exit',exit=>exit===0?resolve():reject(new Error('SECRET_UPLOAD_FAILED')));
        child.stdin.end(JSON.stringify({BLOGGER_CLIENT_ID:client.client_id,BLOGGER_CLIENT_SECRET:client.client_secret,BLOGGER_REFRESH_TOKEN:token.refresh_token}));
      });
      res.end('연결 완료. 인증정보는 표시하지 않았습니다. Codex에 연결 완료라고 알려주세요.');
      console.log('BLOGGER_CONNECTION_STORED; PUBLISHING_REMAINS_DISABLED');
    } catch(error) {
      // allowlisted local codes only; external exception text is never printed.
      const allowed=['CONSENT_NOT_GRANTED','TOKEN_EXCHANGE_FAILED','OFFLINE_TOKEN_MISSING','BLOG_ACCESS_NOT_CONFIRMED','BLOG_TARGET_MISMATCH','SECRET_UPLOAD_FAILED'];
      const status=allowed.includes(error.message)?error.message:'CONNECTION_FAILED';
      console.log(status);res.statusCode=500;res.end('연결 실패. 재실행하지 말고 터미널의 상태 코드만 Codex에 알려주세요.');
      process.exitCode=1;
    } finally {clearTimeout(timer);server.close();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  redirect=`${base}/callback`;
  authUrl=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.search=new URLSearchParams({client_id:client.client_id,redirect_uri:redirect,response_type:'code',scope:'https://www.googleapis.com/auth/blogger',access_type:'offline',prompt:'consent',state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}).toString();
  console.log(`브라우저에서 ${base}/ 를 열어 Google 동의를 진행하세요. 대기시간 10분.`);
  timer=setTimeout(()=>{console.log('CONSENT_WAIT_TIMEOUT');server.close();process.exitCode=1;},600000);
} catch {
  console.log('CLIENT_SETUP_FAILED: 다운로드한 Desktop OAuth JSON 경로를 확인하세요.');
  server?.close();process.exitCode=1;
}
