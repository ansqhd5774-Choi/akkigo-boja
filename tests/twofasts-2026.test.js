import {test} from 'node:test';
import assert from 'node:assert/strict';
import {twofastsArticle} from '../src/twofasts-article.js';
test('2026년 7월 운영 변경 공지에 맞는 투패스츠 혜택만 현재로 표시',()=>{
 const h=twofastsArticle.post.content;
 assert.match(h,/신규가입 \$1/);
 assert.match(h,/등급 상향 \$2/);
 assert.match(h,/1% 리워드 신규 적립 중지/);
 assert.doesNotMatch(twofastsArticle.post.title,/최대 \$10|적립 1%/);
 assert.equal(twofastsArticle.source.welcomeCoupon.status,'OFFICIAL_2026_NOTICE');
});
