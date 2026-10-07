import seeds from '../data/game-heart-seeds.json' with {type:'json'};
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
    if(!Object.hasOwn(seeds,input.brand)||!/^[-a-f0-9]{36}$/.test(input.visitor||''))return respond({error:'INVALID_INPUT'},400);
    await env.DB.prepare('INSERT OR IGNORE INTO game_hearts (brand, visitor) VALUES (?, ?)').bind(input.brand,input.visitor).run();
    const row=await env.DB.prepare('SELECT COUNT(*) AS clicks FROM game_hearts WHERE brand = ?').bind(input.brand).first();
    return respond({brand:input.brand,initial:seeds[input.brand],clicks:Number(row.clicks),count:seeds[input.brand]+Number(row.clicks)});
  }
  if(request.method!=='GET')return respond({error:'METHOD_NOT_ALLOWED'},405);
  const rows=await env.DB.prepare('SELECT brand, COUNT(*) AS clicks FROM game_hearts GROUP BY brand').all();
  const clicks=new Map(rows.results.map(row=>[row.brand,Number(row.clicks)]));
  return respond({hearts:Object.entries(seeds).map(([brand,initial])=>({brand,initial,clicks:clicks.get(brand)||0,count:initial+(clicks.get(brand)||0)}))});
}
