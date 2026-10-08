const r=await fetch('https://itunes.apple.com/lookup?id=6759098797&country=us');
if(!r.ok)throw Error('APPLE_HTTP_'+r.status);
const a=(await r.json()).results?.find(x=>String(x.trackId)==='6759098797');
if(!a||a.trackName!=='Aniimo'||!/PAWPRINT/i.test(a.artistName||''))throw Error('IDENTITY_MISMATCH');
const icon=a.artworkUrl512||a.artworkUrl100;
if(new URL(icon).hostname!=='is1-ssl.mzstatic.com')throw Error('CDN_MISMATCH');
console.log(JSON.stringify({name:a.trackName,store:a.trackViewUrl,icon}));
