import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
test('Zeus category thumbnail retains the original banner aspect ratio at a bounded size',async()=>{
 const file=readFileSync(new URL('../theme/assets/cards/zeus-og-320.webp',import.meta.url));
 const metadata=await sharp(file).metadata();
 assert.equal(metadata.width,320);assert.equal(metadata.format,'webp');assert.ok(metadata.height>0);assert.ok(file.length<25000);
 const source=readFileSync(new URL('../theme/game-icon-grid.js',import.meta.url),'utf8');
 assert.match(source,/iconUrl\.href==='https:\/\/zeuscommunity-fn\.com2us\.com\/zeuscommunity\/public\/common\/og\/og_default\.jpg'/);
 assert.match(source,/cards\/zeus-og-320\.webp/);
});
