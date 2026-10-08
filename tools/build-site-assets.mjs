import {readFile,writeFile,mkdir,copyFile,stat} from 'node:fs/promises';
import sharp from 'sharp';
import {optimize} from 'svgo';
import {fileURLToPath} from 'node:url';

const root=new URL('../',import.meta.url);
const asset=new URL('theme/assets/',root);
await mkdir(new URL('licenses/',asset),{recursive:true});
const names=['gamepad-2','smartphone','monitor','plane','heart','shield','graduation-cap','chevron-left','chevron-right','search','copy','check'];
const icons={};
for(const name of names){
  const original=await readFile(new URL(`node_modules/lucide-static/icons/${name}.svg`,root),'utf8');
  const svg=optimize(original,{plugins:['preset-default','removeDimensions']}).data;
  icons[name]=svg.replace('<svg ','<svg aria-hidden="true" focusable="false" ');
}
await writeFile(new URL('theme/site-icons.mjs',root),`// Generated from lucide-static 1.52.0. ISC + Feather MIT; see theme/assets/licenses/lucide.txt.\nexport const icons=${JSON.stringify(icons)};\n`);
await copyFile(new URL('node_modules/lucide-static/LICENSE',root),new URL('licenses/lucide.txt',asset));
await copyFile(new URL('node_modules/fuse.js/LICENSE',root),new URL('licenses/fuse.txt',asset));
const fuse=await readFile(new URL('node_modules/fuse.js/dist/fuse.basic.min.mjs',root),'utf8');
const exportMatch=fuse.match(/export\{(\w+) as default\};?\s*$/);
if(!exportMatch)throw Error('FUSE_MODULE_FORMAT_CHANGED');
await writeFile(new URL('fuse-7.5.0.min.js',asset),'/* Fuse.js 7.5.0, Apache-2.0. See /licenses/fuse.txt. */\n(function(){'+fuse.replace(exportMatch[0],`window.Fuse=${exportMatch[1]};`)+'})();\n');
await sharp(fileURLToPath(new URL('home-hero.png',asset))).resize({width:960,withoutEnlargement:true}).webp({quality:82}).toFile(fileURLToPath(new URL('home-hero.webp',asset)));
const png=(await stat(new URL('home-hero.png',asset))).size,webp=(await stat(new URL('home-hero.webp',asset))).size;
console.log(JSON.stringify({icons:names.length,heroPngBytes:png,heroWebpBytes:webp,savedPercent:Math.round((1-webp/png)*100)}));
