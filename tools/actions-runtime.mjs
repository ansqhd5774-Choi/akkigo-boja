import {appendFileSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const workerPaths = ['src/','data/','theme/assets/','migrations/','wrangler.jsonc','package.json','pnpm-lock.yaml','pnpm-workspace.yaml'];
export const isWorkerPath = path => workerPaths.some(p => p.endsWith('/') ? path.startsWith(p) : path === p);
export function assertVerifiedSource(verified, current) {
  if(verified!==current || !/^[a-f0-9]{40}$/.test(verified||''))throw Error('SOURCE_VERIFY_SHA_MISMATCH');
  return verified;
}
export function isSuccessfulDeploymentRun(run, workflow) {
  return run.status==='completed' && run.conclusion==='success' && (workflow!=='publish-article.yml' || run.event==='push');
}
export function output(name,value) {
  if (!process.env.GITHUB_OUTPUT) throw Error('GITHUB_OUTPUT_MISSING');
  appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
const gitOk=(...args)=>spawnSync('git',args,{stdio:'ignore'}).status===0;
async function runs(workflow,limit) {
  const repo=process.env.GITHUB_REPOSITORY;
  if(repo!=='ansqhd5774-Choi/akkigo-boja')throw Error('REPOSITORY_TARGET_MISMATCH');
  const url=`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs?branch=codex%2Fblogger-worker-r1&per_page=${limit}`;
  const response=await fetch(url,{headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error('WORKFLOW_LOOKUP_HTTP_'+response.status);
  return (await response.json()).workflow_runs;
}
export async function requestOidc() {
  if(!process.env.ACTIONS_ID_TOKEN_REQUEST_URL || !process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN)throw Error('OIDC_CONTEXT_MISSING');
  const url=new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
  url.searchParams.set('audience','akkigo-boja-publish');
  const response=await fetch(url,{headers:{Authorization:`bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}`},signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error('OIDC_HTTP_'+response.status);
  const {value}=await response.json();
  if(typeof value!=='string'||!value)throw Error('OIDC_TOKEN_MISSING');
  console.log('::add-mask::'+value);
  output('token',value);
}
async function main(command) {
  if(command==='changes') {
    const before=process.env.PUSH_BEFORE;
    if(process.env.GITHUB_EVENT_NAME!=='push') {output('worker',true);console.log('WORKER_BUILD_REQUIRED_NON_PUSH');return;}
    if(!before || /^0+$/.test(before) || !gitOk('cat-file','-e',before+'^{commit}')) {output('worker',true);console.log('WORKER_BUILD_REQUIRED_UNCERTAIN_DIFF');return;}
    const needed=git('diff','--name-only',before,process.env.GITHUB_SHA).split(/\r?\n/).some(isWorkerPath);
    output('worker',needed);console.log(needed?'WORKER_BUILD_REQUIRED':'WORKER_BUILD_SKIPPED');
  } else if(command==='verified-source') {
    // Either exact-SHA complete coverage was reused or local full checks passed.
    console.log('SOURCE_SNAPSHOT_VERIFIED '+assertVerifiedSource(process.env.VERIFIED_SOURCE_SHA,process.env.GITHUB_SHA));
  } else if(command==='worker') {
    if(process.env.WORKER_READY==='true'){output('deploy_needed',false);console.log('WORKER_SNAPSHOT_MATCH_SKIP_DEPLOY');return;}
    const source=git('log','-1','--format=%H','HEAD','--',...workerPaths);
    if(source)for(const [workflow,limit,label] of [['deploy.yml',30,'WORKER_ALREADY_DEPLOYED_BY_DEPLOY_WORKFLOW'],['publish-article.yml',20,'WORKER_ALREADY_DEPLOYED_BY_SUCCESSFUL_PUBLISH']]) {
      for(const run of await runs(workflow,limit)) {
        const sha=run.head_sha;
        if(isSuccessfulDeploymentRun(run,workflow) && gitOk('cat-file','-e',sha+'^{commit}') && gitOk('merge-base','--is-ancestor',source,sha) && gitOk('merge-base','--is-ancestor',sha,'HEAD')) {
          output('deploy_needed',false);console.log(label);return;
        }
      }
    }
    output('deploy_needed',true);console.log('WORKER_REPAIR_DEPLOY_REQUIRED');
  } else if(command==='oidc') await requestOidc();
  else if(command==='auth') {
    if(!process.env.CLOUDFLARE_API_TOKEN)throw Error('CLOUDFLARE_API_TOKEN_MISSING');
    output('ready',true);console.log('CLOUDFLARE_API_TOKEN_PRESENT');
  } else if(command==='publish') {
    const temp=process.env.RUNNER_TEMP;
    if(!temp)throw Error('RUNNER_TEMP_MISSING');
    const list=name=>readFileSync(join(temp,name),'utf8').split(/\r?\n/).filter(Boolean);
    const hubs=list('publish-hub-paths.txt');const articles=list('publish-article-paths.txt');
    if([...hubs,...articles].some(p=>!/^publish-requests\/[a-z0-9-]+\.json$/.test(p)))throw Error('INVALID_PUBLISH_REQUEST_PATH');
    const run=(script,paths)=>execFileSync(process.execPath,[script,...paths],{stdio:'inherit'});
    for(const path of hubs)run('tools/refresh-approved-hubs.mjs',[path]);
    if(articles.length)run('tools/publish-approved-requests.mjs',articles);
  } else throw Error('UNKNOWN_ACTION_COMMAND');
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main(process.argv[2]);
