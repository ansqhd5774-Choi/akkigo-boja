import {readFileSync, appendFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
export const verificationRule = 2;
export function expectedCertificate(sha) {
  return {sha, rule: verificationRule, node: process.version, pnpm: '11.19.0', platform: process.platform, arch: process.arch, lock: createHash('sha256').update(readFileSync('pnpm-lock.yaml')).digest('hex')};
}
export function matchesCertificate(certificate, expected) {
  return Boolean(certificate) && Object.entries(expected).every(([key, value]) => certificate[key] === value);
}
export function parseCertificate(log) {
  const lines = log.split(/\r?\n/).filter(x => x.includes('VERIFY_CERTIFICATE '));
  if(lines.length !== 1) return null;
  try {return JSON.parse(lines[0].slice(lines[0].indexOf('VERIFY_CERTIFICATE ') + 19));} catch {return null;}
}
if(process.argv[1] === fileURLToPath(import.meta.url)) {
  const sha = process.env.GITHUB_SHA;
  if(!/^[a-f0-9]{40}$/.test(sha || '')) throw Error('INVALID_VERIFIED_SHA');
  const pnpm = process.platform === 'win32' ? execFileSync('cmd.exe', ['/d', '/s', '/c', 'pnpm --version'], {encoding:'utf8'}).trim() : execFileSync('pnpm', ['--version'], {encoding:'utf8'}).trim();
  if(pnpm !== '11.19.0' || !process.version.startsWith('v24.') || process.platform !== 'win32' || process.arch !== 'x64') throw Error('VERIFY_ENVIRONMENT_MISMATCH');
  console.log('VERIFY_CERTIFICATE ' + JSON.stringify(expectedCertificate(sha)));
  appendFileSync(process.env.GITHUB_OUTPUT, `verified_sha=${sha}\n`);
}
