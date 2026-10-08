import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {icons} from '../theme/site-icons.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
export function planMinimalThemePatch(html,options){
 const edits=[];
 function replaceOnce(oldText,newText,label){const index=html.indexOf(oldText);if(index<0||html.indexOf(oldText,index+oldText.length)>=0)throw Error('PATCH_TARGET_NOT_UNIQUE_'+label);edits.push({index,oldText,newText,label});}
 replaceOnce(options.oldHome.trim(),options.newHome.trim(),'home-script');
 replaceOnce(options.oldGrid.trim(),options.newGrid.trim(),'category-script');
 replaceOnce(']]></b:skin>',options.css+']]></b:skin>','scoped-css');
 const copyStart=html.match(/<script type='text\/javascript'>\/\/<!\[CDATA\[\s*\/\/ AKKIGO persistent copy feedback:/)?.[0];
 if(!copyStart)throw Error('COPY_SCRIPT_ANCHOR_MISSING');
 replaceOnce(copyStart,options.mount+copyStart,'shared-tools');
 const mapping={'video-game':'gamepad-2','mobile-phone':'smartphone','desktop-computer':'monitor','airplane':'plane','red-heart':'heart','shield':'shield','graduation-cap':'graduation-cap'};
 let categoryCount=0;const expression=/<a class='ncp-r4-category'[^>]*><span>(<img[^>]*\/>)/g;
 for(const match of html.matchAll(expression)){
  const name=match[1].match(/twemoji\/([a-z-]+)\.svg/)?.[1];if(!mapping[name])throw Error('CATEGORY_ICON_NOT_RECOGNIZED');
  edits.push({index:match.index+match[0].length-match[1].length,oldText:match[1],newText:icons[mapping[name]],label:'category-icon-'+(++categoryCount)});
 }
 if(categoryCount!==14)throw Error('CATEGORY_ICON_COUNT_'+categoryCount);
 const hero=html.match(/<img[^>]*src='https:\/\/akkigo-boja\.ansqhd5774\.workers\.dev\/home-hero\.png'[^>]*\/>/)?.[0];if(!hero)throw Error('HERO_ANCHOR_MISSING');
 replaceOnce(hero,"<picture><source srcset='https://akkigo-boja.ansqhd5774.workers.dev/home-hero.webp' type='image/webp'/>"+hero+'</picture>','webp-hero');
 edits.sort((a,b)=>a.index-b.index);let delta=0,lastEnd=-1;for(const edit of edits){if(edit.index<lastEnd)throw Error('OVERLAPPING_PATCH');lastEnd=edit.index+edit.oldText.length;edit.afterIndex=edit.index+delta;delta+=edit.newText.length-edit.oldText.length;}
 let patched=html;for(const edit of [...edits].reverse())patched=patched.slice(0,edit.index)+edit.newText+patched.slice(edit.index+edit.oldText.length);
 const protectedBlocks=source=>[...source.matchAll(/<b:includable id='postBody(?:Snippet)?' var='post'>[\s\S]*?<\/b:includable>/g)].map(row=>row[0]);
 if(JSON.stringify(protectedBlocks(html))!==JSON.stringify(protectedBlocks(patched)))throw Error('POST_BODY_SCOPE_VIOLATION');
 if((patched.match(/id='postBodySnippet'/g)||[]).length!==2)throw Error('SNIPPET_COUNT');
 return {edits,patched,beforeSha256:hash(html),afterSha256:hash(patched)};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [backup,baseline]=process.argv.slice(2);if(!backup||!baseline||!/^[a-f0-9]{40}$/.test(baseline))throw Error('BACKUP_AND_BASELINE_SHA_REQUIRED');
 const old=path=>execFileSync('git',['show',`${baseline}:${path}`],{encoding:'utf8'});
 const read=path=>readFileSync(path,'utf8');const generated=read('akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml');
 const mount=generated.match(/<script type='text\/javascript'>\/\/<!\[CDATA\[\s*\/\* ISC License[\s\S]*?\/\/\]\]><\/script>/)?.[0];if(!mount)throw Error('COMMON_SCRIPT_NOT_FOUND');
 const plan=planMinimalThemePatch(read(backup),{oldHome:old('theme/home-r4.js'),oldGrid:old('theme/game-icon-grid.js'),newHome:read('theme/home-r4.js'),newGrid:read('theme/game-icon-grid.js'),css:read('theme/site-tools.css'),mount});
 writeFileSync('backups/blogger-site-minimal-patch-plan.json',JSON.stringify(plan));writeFileSync('backups/blogger-site-minimal-patch.xml',plan.patched);
 console.log(JSON.stringify({edits:plan.edits.map(row=>({label:row.label,removed:row.oldText.length,added:row.newText.length})),beforeSha256:plan.beforeSha256,afterSha256:plan.afterSha256}));
}
