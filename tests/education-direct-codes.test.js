import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import articles from '../data/articles.json' with {type:'json'};

const expected=[
  {
    key:'hackers-gosi-direct-codes-202610',
    labels:['교육','해커스공무원'],
    codes:['6A88D3EC5954A4BR','8A52AFEDCD7D4FFD','962F5LQETQY06G45'],
    sources:['cdn.hackers.com','gosi.hackers.com'],
    values:['10만원 할인','20% 할인','30일 이용권','등록 후','7일','2026년 12월 31일']
  },
  {
    key:'fastcampus-rag-code-202610',
    labels:['교육','패스트캠퍼스'],
    codes:['RAG비법노트'],
    sources:['wikidocs.net/265342','fastcampus.co.kr'],
    values:['20% 할인','2026년 12월 31일','마이페이지','쿠폰 내역']
  }
];

for(const item of expected){
  test(item.key+' 국내 입력형 쿠폰 원문/초안/공개 글 일치',()=>{
    const article=articles.find(x=>x.articleKey===item.key);
    assert.ok(article);
    assert.equal(article.approvedForPublish,true);
    assert.deepEqual(article.post.labels,item.labels);
    const html=readFileSync(new URL('../drafts/'+item.key+'.html',import.meta.url),'utf8').trim();
    const draft=JSON.parse(readFileSync(new URL('../drafts/'+item.key+'.json',import.meta.url),'utf8'));
    assert.equal(article.post.content,html);
    assert.equal(draft.post.content,html);
    assert.equal(draft.articleKey,item.key);
    assert.equal((html.match(/<!--more-->/g)||[]).length,1);
    assert.equal((html.match(/data-ncp-featured-image=/g)||[]).length,1);
    assert.match(html,/loading="eager"/);
    assert.equal((html.match(/data-ncp-copy=/g)||[]).length,item.codes.length);
    for(const code of item.codes){
      assert.match(html,new RegExp('data-ncp-copy="'+code+'"'));
      assert.ok(article.source.codes.includes(code));
    }
    for(const source of item.sources) assert.ok(html.includes(source),source);
    for(const value of item.values) assert.ok(html.includes(value),value);
    assert.ok(!html.includes('실사용 미검증'));
    assert.ok(!html.includes('UNVERIFIED'));
    assert.ok(!html.includes('video-game.svg'));
    assert.equal(article.source.status,'UNVERIFIED');
    assert.equal(article.publicationStatus,'READY');
  });
}
