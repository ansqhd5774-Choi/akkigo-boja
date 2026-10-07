// Both browser lists and the heart service use this resolver.
export function resolveGame(entry,knownNames=[]){
 const title=String(entry.title?.$t||entry.title||'').trim();
 const body=String(entry.content?.$t||entry.content||'');
 const explicit=body.match(/data-game-name=["']([^"']+)["']/)?.[1];
 const labels=(entry.category||[]).map(x=>x.term||x);
 const generic=new Set(['게임','쿠폰','교환코드','리딤코드','프로모션','할인코드','기프트코드','쿠폰코드']);
 const candidate=[...knownNames,...labels].filter(x=>x&&!generic.has(x)&&title.startsWith(x)).sort((a,b)=>b.length-a.length)[0];
 const name=explicit||candidate||title.split(/\s+(?:쿠폰|프로모션|리딤|교환|기프트|코드|할인)/)[0]||title;
 const explicitId=body.match(/data-game-id=["']([^"']+)["']/)?.[1];
 const articleKey=body.match(/data-ncp-article=["']([^"']+)["']/)?.[1];
 // Existing names are legacy primary keys: retain their votes and browser state.
 const legacy=knownNames.find(value=>value.replace(/\s/g,'')===name.replace(/\s/g,''));
 const id=legacy||explicitId||articleKey?.replace(/-\d{6}(?:.*)?$/,'')||name;
 return {id,name};
}
