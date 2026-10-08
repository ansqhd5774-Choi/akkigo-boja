import {test} from 'node:test';
import assert from 'node:assert/strict';
import {eligibleRun, completeCoverage, requiredSteps, findVerification} from '../tools/verification-reuse.mjs';
import {selectGames, checkGames} from '../tools/check-game-icons.mjs';
import {expectedCertificate, matchesCertificate, parseCertificate} from '../tools/verification-certificate.mjs';
import {makeSummary} from '../tools/actions-summary.mjs';
import {readFileSync} from 'node:fs';
const sha = 'a'.repeat(40);
const repository = 'ansqhd5774-Choi/akkigo-boja';
const run = {id: 12, head_sha: sha, status: 'completed', conclusion: 'success', head_branch: 'codex/blogger-worker-r1', event: 'push', head_repository: {full_name: repository}};
const job = {id: 99, name: 'verify', conclusion: 'success', steps: requiredSteps.map(name => ({name, status: 'completed', conclusion: 'success'}))};
test('reuse rejects different SHA, failed/queued runs, PR and foreign repository', () => {
  assert.equal(eligibleRun(run, sha, repository), true);
  for(const patch of [{head_sha: 'b'.repeat(40)}, {status: 'in_progress'}, {conclusion: 'failure'}, {event: 'pull_request'}, {head_repository: {full_name: 'other/repo'}}, {head_branch: 'other'}]) {
    assert.equal(eligibleRun({...run, ...patch}, sha, repository), false);
  }
});
test('coverage rejects skipped build and missing XML or theme checks', () => {
  assert.equal(completeCoverage([job]), true);
  for(const name of requiredSteps) {
    assert.equal(completeCoverage([{...job, steps: job.steps.filter(s => s.name !== name)}]), false);
    assert.equal(completeCoverage([{...job, steps: job.steps.map(s => s.name === name ? {...s, conclusion: 'skipped'} : s)}]), false);
  }
});
test('lookup uses latest attempt job coverage and never waits for running Verify', async () => {
  const urls = [];
  const request = async url => {urls.push(url); return {ok: true, text: async () => '2026-10-09 VERIFY_CERTIFICATE ' + JSON.stringify(expectedCertificate(sha)), json: async () => url.includes('/jobs?') ? {jobs: [job]} : {workflow_runs: [{...run, id: 11, status: 'in_progress'}, run]}};};
  assert.equal(await findVerification({repository, sha, token: 'fixture', request}), 12);
  assert.equal(urls.length, 3);
  assert.match(urls[0], /head_sha=/);
  assert.match(urls[1], /runs\/12\/jobs\?filter=latest/);
});
test('certificate mismatch never authorizes reuse', () => {
  const expected = expectedCertificate(sha);
  assert.equal(matchesCertificate(parseCertificate('VERIFY_CERTIFICATE ' + JSON.stringify(expected)), expected), true);
  for(const key of Object.keys(expected)) assert.equal(matchesCertificate({...expected, [key]: 'different'}, expected), false);
  assert.equal(parseCertificate('VERIFY_CERTIFICATE invalid'), null);
});
test('lookup shares one total deadline across all API requests', async () => {
  let first;
  const request = async (url, options) => {
    if(!first) first = options.signal;
    else assert.equal(options.signal, first);
    return {ok: true, text: async () => 'VERIFY_CERTIFICATE ' + JSON.stringify(expectedCertificate(sha)), json: async () => url.includes('/jobs?') ? {jobs: [job]} : {workflow_runs: [run]}};
  };
  assert.equal(await findVerification({repository, sha, request}), 12);
});
test('icon failure is retained while subsequent games still execute', () => {
  const called = [];
  const results = checkGames(['aqualand', 'duck'], game => {called.push(game); if(game === 'aqualand') throw Error('fixture');});
  assert.deepEqual(called, ['aqualand', 'duck']);
  assert.deepEqual(results.map(x => x.result), ['FAIL', 'PASS']);
});
test('execution summary distinguishes reuse and local checks', () => {
  assert.match(makeSummary({VERIFY_REUSED:'true', DEPLOY_NEEDED:'false'}), /Dependency install scheduled \| 0/);
  assert.match(makeSummary({VERIFY_REUSED:'false', VERIFY_REASON:'LOOKUP_UNAVAILABLE_OR_TIMEOUT'}), /LOOKUP_UNAVAILABLE_OR_TIMEOUT/);
});
test('automatic deployment starts only after trusted Verify success and checks current source', () => {
  const yaml = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(yaml, /workflow_run:[\s\S]*workflows: \[Verify\]/);
  assert.doesNotMatch(yaml, /\n  push:/);
  assert.match(yaml, /workflow_run.conclusion == 'success'/);
  assert.match(yaml, /head_repository.full_name == github.repository/);
  assert.match(yaml, /node tools\/check-deploy-target.mjs/);
});
test('icon batch deduplicates allowed IDs and rejects arbitrary command/path input', () => {
  assert.deepEqual(selectGames('aqualand, duck,aqualand'), ['aqualand', 'duck']);
  assert.equal(selectGames('all').length, 10);
  for(const input of ['', '../secret', 'aqualand & echo x', 'unknown']) assert.throws(() => selectGames(input), /INVALID_GAME_ICON_INPUT/);
});
