import {test} from 'node:test';
import assert from 'node:assert/strict';
import {eligibleRun, completeCoverage, requiredSteps, findVerification} from '../tools/verification-reuse.mjs';
import {selectGames} from '../tools/check-game-icons.mjs';
const sha = 'a'.repeat(40);
const repository = 'ansqhd5774-Choi/akkigo-boja';
const run = {id: 12, head_sha: sha, status: 'completed', conclusion: 'success', head_branch: 'codex/blogger-worker-r1', event: 'push', head_repository: {full_name: repository}};
const job = {name: 'verify', conclusion: 'success', steps: requiredSteps.map(name => ({name, status: 'completed', conclusion: 'success'}))};
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
  const request = async url => {urls.push(url); return {ok: true, json: async () => url.includes('/jobs?') ? {jobs: [job]} : {workflow_runs: [{...run, id: 11, status: 'in_progress'}, run]}};};
  assert.equal(await findVerification({repository, sha, token: 'fixture', request}), 12);
  assert.equal(urls.length, 2);
  assert.match(urls[0], /head_sha=/);
  assert.match(urls[1], /runs\/12\/jobs\?filter=latest/);
});
test('icon batch deduplicates allowed IDs and rejects arbitrary command/path input', () => {
  assert.deepEqual(selectGames('aqualand, duck,aqualand'), ['aqualand', 'duck']);
  assert.equal(selectGames('all').length, 10);
  for(const input of ['', '../secret', 'aqualand & echo x', 'unknown']) assert.throws(() => selectGames(input), /INVALID_GAME_ICON_INPUT/);
});
