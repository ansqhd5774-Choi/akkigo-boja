import {test} from 'node:test';
import assert from 'node:assert/strict';
import {twofastsArticle} from '../src/twofasts-article.js';

test('2026년 7월 운영 변경 공지에 맞는 투패스츠 혜택만 현재로 표시',()=>{
 const h=twofastsArticle.post.content;
 assert.match(h,/신규가입 \$1/);
 assert.match(h,/등급 상향 \$2/);
 assert.match(h,/배송비 1% 리워드 신규 적립/);
 assert.match(h,/>중지</);
 assert.doesNotMatch(twofastsArticle.post.title,/최대 \$10|적립 1%/);
 assert.equal(twofastsArticle.source.welcomeCoupon.status,'OFFICIAL_2026_NOTICE');
 assert.equal(twofastsArticle.source.suspended.find(x=>x.name==='배송비 1% 리워드 신규 적립')?.status,'SUSPENDED');
 assert.equal(twofastsArticle.source.changed.find(x=>x.name.includes('$10'))?.status,'SUPERSEDED');
});

test('종료된 공식 투패스츠 혜택은 현재 혜택과 분리하고 원문 날짜·조건을 보존한다',()=>{
 const h=twofastsArticle.post.content;
 const review=twofastsArticle.source.ended.find(x=>x.type==='REVIEW_COUPON');
 const storage=twofastsArticle.source.ended.find(x=>x.type==='TEMP_STORAGE_FEE_WAIVER');
 assert.equal(review?.status,'EXPIRED');
 assert.equal(review?.value,'$5');
 assert.equal(review?.sourcePublishedAt,'2026-07-16');
 assert.equal(review?.registrationDeadline,'2026-08-31');
 assert.equal(review?.issuedCouponExpiry,'NONE_STATED');
 assert.match(review?.conditions||'',/깡통배송/);
 assert.equal(storage?.status,'EXPIRED');
 assert.equal(storage?.sourcePublishedAt,'2026-09-01');
 assert.equal(storage?.benefitPeriod,'2026-07-10~2026-08-31');
 assert.match(h,/인스타그램 이용후기 \$5 쿠폰/);
 assert.match(h,/2026-07-10~08-31/);
});

test('현재 보관 무료기간은 일반회원과 유료회원을 구분하고 배송비 책정 후 규칙을 표시한다',()=>{
 const storage=twofastsArticle.source.benefits.find(x=>x.type==='FREE_STORAGE');
 assert.equal(storage?.status,'ACTIVE_CONDITIONAL');
 assert.equal(storage?.value,'일반 30일·유료회원 60일 무료');
 assert.match(storage?.conditions||'',/16일째/);
 assert.match(twofastsArticle.post.content,/일반 30일·유료회원 60일/);
});
