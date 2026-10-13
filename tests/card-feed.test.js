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
