import {test} from 'node:test';
import assert from 'node:assert/strict';
import articles from '../data/articles.json' with {type:'json'};
import {readFileSync} from 'node:fs';
import {validateArticleDraft} from '../tools/validate-article-draft.mjs';
test('무한의 계단 49개 쿠폰·다국어 재조사·공식 발급형 이력 검증',()=>{
const a=articles.find(x=>x.articleKey==='infinite-stairs-codes-202610');assert.ok(a);assert.equal(a.post.title,'무한의 계단');assert.equal(validateArticleDraft(a),true);
const r=JSON.parse(readFileSync(new URL('../drafts/infinite-stairs-global-research-20261009.json',import.meta.url),'utf8'));
assert.equal(r.records.length,49);assert.equal(new Set(r.records.map(x=>x.code)).size,49);
assert.equal(r.records.filter(x=>x.publishedAt!==null).length,22);
assert.equal(r.records.filter(x=>x.publishedAt===null).length,27);
assert.equal(r.records.find(x=>x.code==='ming4rs29a').publishedAt,'2021-05-31');
assert.equal(r.records.find(x=>x.code==='gb2pu7nt').publishedAt,'2023-07-25');
assert.equal(r.records.find(x=>x.code==='mXR772rn').publishedAt,'2017-10-16');
const digwow='https://www.digwow.net/%EB%AC%B4%ED%95%9C%EC%9D%98-%EA%B3%84%EB%8B%A8/%EC%BF%A0%ED%8F%B0-%EB%AA%A8%EC%9D%8C/';
for(const code of ['STAIRS','INFINITY','UPDATE','GIFT']){const item=r.records.find(x=>x.code===code);assert.ok(item);assert.equal(item.publishedAt,null);assert.equal(item.sourcePublishedAt,null);assert.equal(item.sourceUpdatedAt,'2026-10-13');assert.equal(item.status,'UNVERIFIED');assert.equal(item.sourceUrl,digwow);}
assert.equal(r.latestRecheck.currentVerifiedCodeCount,0);assert.deepEqual(r.latestRecheck.scopeLanguages,['ko','en','ja','zh-CN','zh-TW','th','vi','id']);
assert.deepEqual(r.latestRecheck.explicitThirdPartyCandidates,['STAIRS','INFINITY','UPDATE','GIFT']);
assert.equal(r.latestRecheck.explicitCandidateSource.sourcePublishedAt,null);assert.equal(r.latestRecheck.explicitCandidateSource.sourceUpdatedAt,'2026-10-13');assert.equal(r.latestRecheck.explicitCandidateSource.officialIssueVerified,false);assert.equal(r.latestRecheck.explicitCandidateSource.redemptionVerified,false);
assert.equal(r.latestRecheck.officialIssuedBenefits.length,1);const benefit=r.latestRecheck.officialIssuedBenefits[0];assert.equal(benefit.type,'PARTICIPANT_ISSUED_COUPON');assert.equal(benefit.eventDate,'2026-03-28');assert.equal(benefit.publicSharedCode,false);assert.equal(benefit.redemptionExpiry,null);
assert.match(a.post.content,/팀 K리그 런/);assert.match(a.post.content,/한정 유니폼 스킨 쿠폰|한정 유니폼 스킨쿠폰/);assert.match(a.post.content,/10월 13일 갱신된 제3자 목록/);
const codes=[...a.post.content.matchAll(/data-ncp-copy="([^"]+)"/g)].map(m=>m[1]);assert.equal(codes.length,49);for(const item of r.records)assert.ok(codes.includes(item.code),item.code);
const h=readFileSync(new URL('../drafts/infinite-stairs-codes-202610.html',import.meta.url),'utf8').trim();assert.equal(h,a.post.content);
});
