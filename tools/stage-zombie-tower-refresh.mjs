import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const KEY='zombie-tower-codes-202610';
const SOURCE_PATH='src/game-batch-20261012-g.js';
const CHECKED='2026-10-13';
const STORE='https://play.google.com/store/apps/details?hl=ko&id=com.pi.zombie.tower';
const SITE='https://www.pigame-mobile.com/';
let source=readFileSync(SOURCE_PATH,'utf8');

const oldMake="const make=({articleKey,title,english,storeUrl,iconUrl,sourceUrl,references,records,previewHTML,noticeHTML,guideHTML,archiveHTML,searchDescription,keywords,hashtags,benefits=[],type})=>{";
const newMake="const make=({articleKey,title,english,storeUrl,iconUrl,sourceUrl,references,records,previewHTML,noticeHTML,guideHTML,archiveHTML,searchDescription,keywords,hashtags,benefits=[],type,sourceCheckedAt=checkedAt})=>{";
if(source.includes(oldMake))source=source.replace(oldMake,newMake);
if(!source.includes(newMake))throw Error('ZOMBIE_TOWER_MAKE_SIGNATURE_MISSING');
source=source.replace("source:{type,url:sourceUrl,checkedAt,references,presentationVersion:'compact-r2'","source:{type,url:sourceUrl,checkedAt:sourceCheckedAt,references,presentationVersion:'compact-r2'");
if(!source.includes("checkedAt:sourceCheckedAt,references"))throw Error('ZOMBIE_TOWER_SOURCE_CHECKED_AT_HOOK_MISSING');

const start=source.indexOf('// Zombie Tower');
if(start<0)throw Error('ZOMBIE_TOWER_BLOCK_MISSING');
const tail=source.slice(start);
const blockMatch=tail.match(/^\/\/ Zombie Tower[\s\S]*?^\}\);/m);
if(!blockMatch)throw Error('ZOMBIE_TOWER_BLOCK_END_MISSING');
const oldBlock=blockMatch[0];
const newBlock=`// Zombie Tower\nconst ztStore='${STORE}';\nconst ztIcon='https://play-lh.googleusercontent.com/Q3ZcQA5m7pA2QjE5iY5x3dEMMp73wGFHOfs3YxA5134p8eXdczpxo80HplO0gWdLoDBu6vGA_2_mniWc6oaHqA%3Dw240-h480';\nconst ztSite='${SITE}';\nconst ztCheckedAt='${CHECKED}';\nexport const zombieTowerArticle=make({\n  articleKey:'${KEY}',title:'Zombie Tower',english:'Zombie Tower',storeUrl:ztStore,iconUrl:ztIcon,sourceUrl:ztStore,sourceCheckedAt:ztCheckedAt,\n  references:[ztStore,ztSite],records:[],type:'ZOMBIE_TOWER_NO_PUBLIC_REDEEM_CODE_FOUND',\n  previewHTML:'<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="Zombie Tower 쿠폰 요약"><div class="ncp-feed-stat"><span>공개 코드</span><strong>0개 확인</strong></div><div class="ncp-feed-stat"><span>공식 앱</span><strong>Pi Game</strong></div><div class="ncp-feed-stat"><span>최근 앱 업데이트</span><strong>2026.05.11</strong></div></div>',\n  noticeHTML:'<p data-refresh-evidence="zombie-tower-20261013">2026년 10월 13일 국내외 공개 자료를 다시 확인했지만 Pi Game의 Zombie Tower(com.pi.zombie.tower) 전용 공개 리딤코드나 공식 쿠폰 입력 체계는 찾지 못했습니다. 검색되는 Roblox Zombie Tower Defense·Zombie Tower의 코드는 다른 게임이므로 이 글의 쿠폰으로 등록하지 않습니다.</p>',\n  guideHTML:'<section><h3>현재 확인</h3><p>Google Play 공식 앱은 Pi Game의 com.pi.zombie.tower이며 2026년 5월 11일 업데이트가 확인됩니다. 공식 스토어와 Pi Game 개발사 사이트에서는 이 모바일 게임 전용 공개 쿠폰 번호나 리딤 메뉴 안내가 확인되지 않았습니다. 향후 공식 앱·개발사 채널에서 입력형 혜택이 공개되면 이 기록에 추가합니다.</p></section>',\n  archiveHTML:\`<p><a href="\${ztStore}" rel="noopener noreferrer">Google Play 공식 앱</a> · <a href="\${ztSite}" rel="noopener noreferrer">Pi Game 개발사 사이트</a></p>\`,\n  searchDescription:'Pi Game Zombie Tower 쿠폰을 2026년 10월 13일 다시 조사했습니다. 현재 공개 리딤코드는 확인되지 않았으며 Roblox 동명 게임 코드는 분리했습니다.',\n  keywords:['Zombie Tower coupon','Zombie Tower codes','좀비 타워 쿠폰','좀비 타워 코드','Pi Game Zombie Tower'],hashtags:['#ZombieTower','#좀비타워','#PiGame','#게임쿠폰']\n});`;
source=source.replace(oldBlock,newBlock);
writeFileSync(SOURCE_PATH,source);

const moduleUrl=pathToFileURL(resolve(SOURCE_PATH)).href+'?refresh='+Date.now();
const {zombieTowerArticle}=await import(moduleUrl);
if(!zombieTowerArticle)throw Error('ZOMBIE_TOWER_IMPORT_FAILED');
if(zombieTowerArticle.source.checkedAt!==CHECKED)throw Error('ZOMBIE_TOWER_CHECKED_AT_DRIFT');
if(zombieTowerArticle.source.gamePeriodModel.records.length!==0)throw Error('ZOMBIE_TOWER_FALSE_CODE_COUNT');
const body=zombieTowerArticle.post.content;
if(!body.includes('zombie-tower-20261013'))throw Error('ZOMBIE_TOWER_REFRESH_MARKER_MISSING');
for(const code of ['UPDATE4','500LIKES','Overhaul_Real','Holidays2024'])if(body.toLowerCase().includes(code.toLowerCase()))throw Error('ZOMBIE_TOWER_ROBLOX_CODE_LEAK_'+code);
const draftHtml='drafts/'+KEY+'.html';
if(existsSync(draftHtml))writeFileSync(draftHtml,body+'\n');
const draftJson='drafts/'+KEY+'.json';
if(existsSync(draftJson))writeFileSync(draftJson,JSON.stringify(zombieTowerArticle,null,2)+'\n');
console.log('ZOMBIE_TOWER_REFRESH_STAGED',KEY,CHECKED);
