import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {hubs,buildHubDraft} from '../src/hubs.js';
const output=new URL('../drafts/',import.meta.url);
const coupons=JSON.parse(await readFile(new URL('../data/coupons.json',import.meta.url),'utf8'));
await mkdir(output,{recursive:true});
for (const key of Object.keys(hubs)) {
  const post=buildHubDraft(key,coupons);
  await writeFile(new URL(`${key}.json`,output),JSON.stringify({hubKey:key,post},null,2)+'\n');
  await writeFile(new URL(`${key}.html`,output),post.content+'\n');
}
console.log('게임별 로컬 초안 3개 생성 완료. Blogger 업로드/발행은 실행하지 않았습니다.');
