import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

// Run from an elevated CMD. The registration token exists only in child memory.
const root = 'C:\\actions-runner-akkigo-boja';
const repo = 'ansqhd5774-Choi/akkigo-boja';
const log = join(root, 'installation-status.txt');
function status(value) { writeFileSync(log, value + '\n'); console.log(value); }
try {
  if (process.platform !== 'win32') throw Error('WINDOWS_REQUIRED');
  execFileSync('net.exe', ['session'], {stdio:'ignore'});
  if (existsSync(join(root, '.runner'))) throw Error('RUNNER_ALREADY_CONFIGURED_INSPECT_FIRST');
  const gh = 'C:\\Program Files\\GitHub CLI\\gh.exe';
  const registered = JSON.parse(execFileSync(gh, ['api', `repos/${repo}/actions/runners`], {encoding:'utf8'}));
  if (registered.runners.some(r => r.name === 'akkigo-boja-runner')) throw Error('RUNNER_NAME_ALREADY_REGISTERED');
  const registration = JSON.parse(execFileSync(gh, ['api', '--method', 'POST', `repos/${repo}/actions/runners/registration-token`], {encoding:'utf8'}));
  const result = spawnSync(join(root,'bin','Runner.Listener.exe'), ['configure', '--unattended', '--url', `https://github.com/${repo}`, '--name', 'akkigo-boja-runner', '--labels', 'akkigo-boja', '--work', '_work', '--runasservice', '--windowslogonaccount', 'NT AUTHORITY\\NETWORK SERVICE'], {
    cwd:root, env:{...process.env,ACTIONS_RUNNER_INPUT_TOKEN:registration.token}, encoding:'utf8'
  });
  // Never forward captured runner diagnostics or registration credentials.
  if (result.status !== 0) throw Error('RUNNER_CONFIG_FAILED_INSPECT_PRIVATE_DIAGNOSTICS');
  const service = readFileSync(join(root,'.service'),'utf8').trim();
  if (!service.startsWith('actions.runner.ansqhd5774-Choi-akkigo-boja.')) throw Error('SERVICE_TARGET_MISMATCH');
  execFileSync('sc.exe',['config',service,'start=','delayed-auto'],{stdio:'ignore'});
  execFileSync('sc.exe',['failure',service,'reset=','86400','actions=','restart/60000/restart/60000/restart/60000'],{stdio:'ignore'});
  execFileSync('sc.exe',['failureflag',service,'1'],{stdio:'ignore'});
  const state=execFileSync('sc.exe',['query',service],{encoding:'utf8'});
  if (!state.includes('RUNNING')) execFileSync('sc.exe',['start',service],{stdio:'ignore'});
  status('RUNNER_SERVICE_CONFIGURED');
} catch (error) {
  status('INSTALLATION_STOPPED: ' + (error.message?.startsWith('Command failed:') ? 'ADMIN_OR_SERVICE_OPERATION_FAILED' : error.message));
  process.exitCode=1;
}
