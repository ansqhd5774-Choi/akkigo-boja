import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

const cases=[
  {
    key:'haiip-discount-code-202610',
    labels:['VPN','하이아이피'],
    code:'adsoft',
    image:/og_image_haiip\.png/,
    required:[/5~25%/,/제휴사\/할인코드/,/3일/,/월 9,000원/]
  },
  {
    key:'coolip-discount-code-202610',
    labels:['VPN','쿨아이피'],
    code:'adsoft',
    image:/coolip\.co\.kr\/img\/og_image\.jpg/,
    required:[/5~25%/,/무료테스트/,/하이온넷/,/60일부터 5% 할인/]
  },
  {
    key:'momoip-discount-code-202610',
    labels:['VPN','모모아이피'],
    code:'adsoft',
    image:/momoip\.net\/img\/og_image\.jpg/,
    required:[/5~25%/,/KT 고정IP/,/하이온넷/,/월 15,000원/]
  }
];

for(const c of cases){
  test(c.key+' adsoft 직접입력 할인코드 글 검증',()=>{
    const a=articles.find(x=>x.articleKey===c.key);
    assert.ok(a);
    assert.deepEqual(a.post.labels,c.labels);
    assert.equal(a.source.status,'UNVERIFIED');
    assert.equal(a.source.code,c.code);
    assert.match(a.source.partnerSource,/ad-soft\.co\.kr/);
    const html=readFileSync(new URL('../drafts/'+c.key+'.html',import.meta.url),'utf8').trim();
    const draft=JSON.parse(readFileSync(new URL('../drafts/'+c.key+'.json',import.meta.url),'utf8'));
    assert.equal(a.post.content,html);
    assert.equal(draft.post.content,html);
    assert.match(html,c.image);
    assert.match(html,/data-ncp-copy="adsoft"/);
    assert.match(html,/<code class="ncp-code">adsoft<\/code>/);
    assert.match(html,/25%가 항상 적용되는 것은 아닙니다/);
    assert.match(html,/한국 사이트/);
    for(const pattern of c.required) assert.match(html,pattern);
    assert.doesNotMatch(html,/proas5|hismarketing|ACTIVE 확정|전 상품 25%|무조건 25% 할인됩니다|항상 25% 할인/);
  });
}
