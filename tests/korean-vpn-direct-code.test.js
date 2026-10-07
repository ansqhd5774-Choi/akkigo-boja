import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

const cases=[
  {
    key:'haiip-discount-code-202610',
    labels:['VPN','하이아이피'],
    code:'proas5',
    image:/og_image_haiip\.png/,
    required:[/매 결제 5%/,/제휴사\/할인코드/,/고정IP <strong>3일<\/strong>/]
  },
  {
    key:'coolip-discount-code-202610',
    labels:['VPN','쿨아이피'],
    code:'hismarketing',
    image:/coolip\.co\.kr\/img\/og_image\.jpg/,
    required:[/10% 할인/,/무료테스트/,/하이온넷/]
  },
  {
    key:'momoip-discount-code-202610',
    labels:['VPN','모모아이피'],
    code:'hismarketing',
    image:/momoip\.net\/img\/og_image\.jpg/,
    required:[/10% 할인/,/5~25% 요금할인/,/하이온넷/]
  }
];

for(const c of cases){
  test(c.key+' 직접입력 할인코드 글 검증',()=>{
    const a=articles.find(x=>x.articleKey===c.key);
    assert.ok(a);
    assert.deepEqual(a.post.labels,c.labels);
    assert.equal(a.source.status,'UNVERIFIED');
    assert.equal(a.source.code,c.code);
    const html=readFileSync(new URL('../drafts/'+c.key+'.html',import.meta.url),'utf8').trim();
    const draft=JSON.parse(readFileSync(new URL('../drafts/'+c.key+'.json',import.meta.url),'utf8'));
    assert.equal(a.post.content,html);
    assert.equal(draft.post.content,html);
    assert.match(html,c.image);
    assert.match(html,new RegExp('data-ncp-copy="'+c.code+'"'));
    assert.match(html,new RegExp('<code class="ncp-code">'+c.code+'</code>'));
    for(const pattern of c.required) assert.match(html,pattern);
    assert.doesNotMatch(html,/실사용 미검증|ACTIVE 확정|전 상품 보장|video-game\.svg/);
  });
}
