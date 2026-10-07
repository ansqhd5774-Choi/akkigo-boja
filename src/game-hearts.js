import seeds from '../data/game-heart-seeds.json' with {type:'json'};
import articles from '../data/articles.json' with {type:'json'};
import supplemental from '../data/articles-supplemental.json' with {type:'json'};
import {resolveGame} from './game-identity.js';
const registry=new Map(Object.keys(seeds).map(name=>[name,{name,initial:seeds[name]}]));
for(const article of [...articles,...supplemental]){
 if(!article.approvedForPublish||!article.post?.labels?.includes('게임'))continue;
 const game=resolveGame({...article.post,category:article.post.labels},Object.keys(seeds));
 if(game.id&&!registry.has(game.id))registry.set(game.id,{name:game.name,initial:0});
}
const origin='https://lsifl.blogspot.com';
const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store','Vary':'Origin'};
export async function gameHearts(request,env){
  const respond=(body,status=200)=>Response.json(body,{status,headers});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(!env.DB)return respond({error:'STORAGE_UNAVAILABLE'},503);
  if(request.method==='POST'){
    if(request.headers.get('Origin')!==origin)return respond({error:'ORIGIN_NOT_ALLOWED'},403);
    if(Number(request.headers.get('Content-Length')||0)>1024)return respond({error:'INPUT_TOO_LARGE'},413);
    let input;try{input=await request.json();}catch{return respond({error:'INVALID_JSON'},400);}
    if(!registry.has(input.brand)||!/^[-a-f0-9]{36}$/.test(input.visitor||''))return respond({error:'INVALID_INPUT'},400);
    await env.DB.prepare('INSERT OR IGNORE INTO game_hearts (brand, visitor) VALUES (?, ?)').bind(input.brand,input.visitor).run();
    const row=await env.DB.prepare('SELECT COUNT(*) AS clicks FROM game_hearts WHERE brand = ?').bind(input.brand).first();
    const game=registry.get(input.brand);
    return respond({brand:input.brand,gameId:input.brand,gameName:game.name,initial:game.initial,clicks:Number(row.clicks),count:game.initial+Number(row.clicks)});
  }
  if(request.method!=='GET')return respond({error:'METHOD_NOT_ALLOWED'},405);
  const rows=await env.DB.prepare('SELECT brand, COUNT(*) AS clicks FROM game_hearts GROUP BY brand').all();
  const clicks=new Map(rows.results.map(row=>[row.brand,Number(row.clicks)]));
  return respond({hearts:[...registry].map(([brand,{name,initial}])=>({brand,gameId:brand,gameName:name,initial,clicks:clicks.get(brand)||0,count:initial+(clicks.get(brand)||0)}))});
}
