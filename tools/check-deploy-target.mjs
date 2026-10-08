import {execFileSync} from 'node:child_process';
const sha = process.env.SOURCE_SHA;
const head = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const remote = execFileSync('git', ['ls-remote', 'origin', 'refs/heads/codex/blogger-worker-r1'], {encoding:'utf8'}).trim().split(/\s+/)[0];
if(!sha || head !== sha || remote !== sha || process.env.GITHUB_SHA !== sha) throw Error('DEPLOY_SOURCE_OUTDATED_OR_MISMATCH');
console.log('CURRENT_DEPLOY_SOURCE_CONFIRMED ' + sha);
