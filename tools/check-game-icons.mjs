import {execFileSync} from 'node:child_process';
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
if(process.argv[1] === fileURLToPath(import.meta.url)) {
  for(const game of selectGames(process.env.ICON_GAMES || process.argv[2])) {
    console.log(`ICON_CHECK_START ${game}`);
    execFileSync(process.execPath, [fileURLToPath(new URL(`./icon-checks/${iconScripts[game]}`, import.meta.url))], {stdio: 'inherit'});
    console.log(`ICON_CHECK_PASS ${game}`);
  }
}
