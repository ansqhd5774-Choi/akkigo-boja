import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compactEntry,cardFeed} from '../src/card-feed.js';
test('compact feed preserves identity, image and unique coupon records without full body',()=>{
 const entry={id:{$t:'1'},title:{$t:'게임'},content:{$t:'<article data-game-id="game" data-game-name="게임"><img src="https://example.com/icon.png" alt="게임"><button data-ncp-copy="ABC"></button><button data-ncp-copy="ABC"></button><p>'+ 'long text'.repeat(10000)+'</p></article>'}};
 const result=compactEntry(entry);assert.match(result.content.$t,/data-game-id="game"/);assert.match(result.content.$t,/icon.png/);assert.equal([...result.content.$t.matchAll(/data-ncp-copy=/g)].length,1);assert.ok(JSON.stringify(result).length<500);
});
test('pagination collects every entry and only complete responses are cached',async()=>{
 let calls=0,stored=0;const cache={match:async()=>null,put:async()=>stored++};
 const fetcher=async()=>({ok:true,json:async()=>({feed:{openSearch$totalResults:{$t:'2'},entry:[{id:{$t:String(++calls)},content:{$t:''}}]}})});
 const response=await cardFeed(new Request('https://example.com/?category='+encodeURIComponent('게임')),{fetcher,cache});
 assert.equal(response.status,200);assert.equal((await response.json()).entries.length,2);assert.equal(stored,1);assert.equal(calls,2);
});
test('failed or changing feeds are never cached as empty successful catalogs',async()=>{
 const response=await cardFeed(new Request('https://example.com/?category=VPN'),{cache:{match:async()=>null,put:()=>{throw Error('must not cache');}},fetcher:async()=>({ok:false})});assert.equal(response.status,503);
});
test('bounded parallel ranges preserve order and fill truncated batches without gaps',async()=>{
 let active=0,peak=0;const fetcher=async input=>{
  active++;peak=Math.max(peak,active);await new Promise(resolve=>setTimeout(resolve,5));active--;
  const url=new URL(input),start=Number(url.searchParams.get('start-index')),limit=Number(url.searchParams.get('max-results'));
  const size=Math.min(limit,3,35-start+1);
  return {ok:true,json:async()=>({feed:{openSearch$totalResults:{$t:'35'},entry:Array.from({length:size},(_,i)=>({id:{$t:String(start+i)},content:{$t:'<button data-ncp-copy="A"></button>'}}))}})};
 };
 const response=await cardFeed(new Request('https://example.com/?category=VPN&format=counts'),{fetcher,cache:null});
 assert.equal(response.status,200);const result=await response.json();assert.equal(result.total,35);
 assert.deepEqual(result.entries.map(e=>e.id.$t),Array.from({length:35},(_,i)=>String(i+1)));
 assert.ok(peak<=3);assert.ok(peak>1);assert.ok(result.entries.every(e=>e.ncpCodeCount===1&&!e.content.$t.includes('data-ncp-copy')));
});
test('duplicate records fail closed rather than advertising complete coverage',async()=>{
 const fetcher=async()=>({ok:true,json:async()=>({feed:{openSearch$totalResults:{$t:'2'},entry:[{id:{$t:'same'}},{id:{$t:'same'}}]}})});
 assert.equal((await cardFeed(new Request('https://example.com/?category=VPN'),{fetcher,cache:null})).status,503);
});
