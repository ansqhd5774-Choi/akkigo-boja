import {execFileSync} from 'node:child_process';
import {appendFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export const iconScripts = Object.freeze({
  aqualand: 'check-aqualand-icon.mjs',
  'cat-gunner': 'check-cat-gunner-app-icon.mjs',
  'dokkaebi-world': 'check-dokkaebi-world-icon.mjs',
  duck: 'check-duck-icon-source.mjs',
  outerplane: 'check-outerplane-icon-source.mjs',
  rogw: 'check-rogw-app-icon.mjs',
  'royal-kingdom': 'check-royal-kingdom-icon.mjs',
  'top-lords': 'check-top-lords-icon.mjs',
  aniimo: 'lookup-aniimo-icon.mjs',
  'top-force': 'lookup-top-force-icon.mjs',
});
export function selectGames(value) {
  const games = value === 'all' ? Object.keys(iconScripts) : [...new Set((value || '').split(',').map(x => x.trim()).filter(Boolean))];
  if(!games.length || games.some(x => !Object.hasOwn(iconScripts, x))) throw Error('INVALID_GAME_ICON_INPUT');
  return games;
}
export function checkGames(games, execute = game => execFileSync(process.execPath, [fileURLToPath(new URL(`./icon-checks/${iconScripts[game]}`, import.meta.url))], {stdio: 'inherit', timeout: 120000})) {
  const results = [];
  for(const game of games) {
    console.log(`ICON_CHECK_START ${game}`);
    try {execute(game); results.push({game, result:'PASS'}); console.log(`ICON_CHECK_PASS ${game}`);}
    catch {results.push({game, result:'FAIL'}); console.log(`ICON_CHECK_FAIL ${game}`);}
  }
  return results;
}
if(process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = checkGames(selectGames(process.env.ICON_GAMES || process.argv[2]));
  if(process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '| Game | Result |\n|---|---|\n' + results.map(x => `| ${x.game} | ${x.result} |`).join('\n') + '\n');
  console.log('ICON_BATCH_RESULT ' + JSON.stringify(results));
  if(results.some(x => x.result === 'FAIL')) process.exitCode = 1;
}
