import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('허브 갱신 workflow는 HEAD^ diff를 위해 부모 커밋까지 checkout한다',()=>{
  const yaml=readFileSync(new URL('../.github/workflows/publish-article.yml',import.meta.url),'utf8');
  assert.match(yaml,/actions\/checkout@v7\.0\.1[\s\S]*?fetch-depth:\s*2/);
  assert.match(yaml,/git diff --name-only HEAD\^ HEAD -- 'publish-requests\/hub-refresh-\*\.json'/);
});
