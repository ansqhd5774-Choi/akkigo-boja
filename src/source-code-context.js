const plain=html=>html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
// Reward descriptions and prose mentioning a word are not code declarations.
export function observeDeclaredCode(html,code){
 const body=html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'');
 const tokens=[];
 for(const m of body.matchAll(/<(li|tr|code)\b[^>]*>([\s\S]*?)<\/\1>/gi)){
  if(m[1].toLowerCase()==='tr'){
   for(const cell of m[2].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi))tokens.push(plain(cell[1]));
  }else if(m[1].toLowerCase()==='code')tokens.push(plain(m[2]));
  else {const token=plain(m[2]).match(/^([^\s–—:|]+)\s*(?:[-–—:|]|$)/)?.[1];if(token)tokens.push(token);}
 }
 // A labelled gift-code paragraph is an explicit declaration, unlike ordinary prose.
 for(const m of body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)){
  const label=plain(m[1]).match(/^ギフトコード\s*[：:]\s*([A-Za-z0-9]+)(?=\s|$)/);
  if(label)tokens.push(label[1]);
 }
 if(tokens.includes(code))return {state:'EXACT_CODE_DECLARATION',observedSpelling:code};
 const variant=tokens.find(t=>t.toLowerCase()===code.toLowerCase());
 return variant?{state:'CASE_VARIANT_DECLARATION',observedSpelling:variant}:{state:'CODE_DECLARATION_NOT_OBSERVED',observedSpelling:null};
}
