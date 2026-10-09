import {readdir,stat} from 'node:fs/promises';
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const directory=new URL('../theme/assets/logos/',import.meta.url);
let original=0,optimized=0;
for(const name of await readdir(directory)){
 if(!name.endsWith('-representative.png'))continue;
 const source=new URL(name,directory),output=new URL(name.replace(/\.png$/,'.webp'),directory);
 await sharp(fileURLToPath(source)).resize({width:360,withoutEnlargement:true}).webp({quality:82}).toFile(fileURLToPath(output));
 original+=(await stat(source)).size;optimized+=(await stat(output)).size;
}
console.log(JSON.stringify({originalBytes:original,optimizedBytes:optimized}));
