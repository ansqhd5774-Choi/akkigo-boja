import {test} from 'node:test';
import assert from 'node:assert/strict';
import {extractLiveResults} from '../tools/collect-publish-result.mjs';

test('publication evidence collector ignores secrets and rejects unverified or foreign URLs',()=>{
  const row={articleKey:'game-r1',status:'LIVE',url:'https://lsifl.blogspot.com/2026/10/example.html',postId:'123',publicVerified:true};
  const log=['GITHUB_OIDC_TOKEN: secret', 'step\t'+JSON.stringify({...row,publicVerified:false}),
    JSON.stringify({...row,url:'https://example.com/'}),JSON.stringify({...row,url:row.url+'?token=secret'}),
    'step\t'+JSON.stringify(row),'step\t'+JSON.stringify(row)].join('\n');
  assert.deepEqual(extractLiveResults(log),[row]);
});
