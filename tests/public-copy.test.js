import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const publicFiles=[
  '../drafts/zeus.html',
  '../drafts/lineagem.html',
  '../drafts/wuthering.html',
  '../drafts/shibarpg-pickup-202610.html',
  '../drafts/cpbv26-codes-202610.html',
  '../drafts/trickcal-revive-codes-202610.html',
  '../drafts/browndust2-codes-202610.html',
  '../drafts/genshin-codes-202610.html',
  '../drafts/honkai-star-rail-codes-202610.html',
  '../drafts/blue-archive-codes-202610.html',
  '../drafts/tripcom-hotel-coupons-202610.html',
  '../drafts/dominos-discounts-202610.html',
  '../drafts/pokemon-go-codes-202610.html',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',
  '../akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml',
  '../drafts/roblox-promo-codes-202610.html',
  '../drafts/brawl-stars-rewards-202610.html',
  '../drafts/whiteout-survival-codes-202610.html',
  '../drafts/maplestory-idle-codes-202610.html',
  '../drafts/kingshot-codes-202610.html',
  '../drafts/fc-mobile-codes-202610.html',
  '../drafts/lucky-defense-codes-202610.html',
  '../drafts/nikke-codes-202610.html',
  '../drafts/nomad-esim-promo-202610.html',
  '../drafts/jetpac-esim-promo-202610.html',
  '../drafts/yesim-esim-promo-202610.html',
  '../drafts/maya-mobile-esim-promo-202610.html',
  '../drafts/bnesim-esim-promo-202610.html',
  '../drafts/simcorner-promo-202610.html',
  '../drafts/gigago-esim-promo-202610.html',
  '../drafts/eskimo-esim-promo-202610.html',
  '../drafts/gomoworld-esim-promo-202610.html',
  '../drafts/keepgo-esim-promo-202610.html',
  '../drafts/globalyo-esim-promo-202610.html',
  '../drafts/esim4travel-promo-202610.html',
  '../drafts/redteago-esim-promo-202610.html',

  '../drafts/usimsa-promo-202610.html',
];

test('공개 HTML 자산에 내부 검증/운영 문구가 다시 들어가지 않는다',()=>{
  for (const path of publicFiles) {
    const html=readFileSync(new URL(path,import.meta.url),'utf8');
    assert.doesNotMatch(html,/실사용 미검증|UNVERIFIED|workingVerifiedAt|verificationResult|evidenceMethod|validator 관련|내부 운영 상태|쿠폰 확인 기준|활성 추천에는 포함하지 않음|직접 적용 · 공식 출처 · 미검증|게임 보상은 현금 할인액/);
  }
});
