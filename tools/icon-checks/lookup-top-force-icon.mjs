const url='https://itunes.apple.com/lookup?id=6761893238&country=kr';
const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
if(!response.ok)throw Error('APPLE_HTTP_'+response.status);
const data=await response.json();
const app=data.results?.find(v=>String(v.trackId)==='6761893238');
if(!app||!/Century Games/i.test(app.artistName||'')||!/Top Force|탑 포스/i.test(app.trackName||''))throw Error('IDENTITY_NOT_CONFIRMED');
const icon=app.artworkUrl512||app.artworkUrl100;
if(!icon||new URL(icon).hostname!=='is1-ssl.mzstatic.com')throw Error('ICON_NOT_OFFICIAL_APPLE_CDN');
console.log(JSON.stringify({name:app.trackName,store:app.trackViewUrl,icon}));
