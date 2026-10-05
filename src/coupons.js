export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export const OFFER_TYPES = ['CODE','AUTO_DISCOUNT','CARD_CHANNEL','MEMBER','CASHBACK','REFERRAL','GAME_REDEEM','FREEBIE'];
export const END_MODES = ['FIXED_DATE','ONGOING','UNTIL_BUDGET_EXHAUSTED','UNTIL_STOCK_EXHAUSTED','UNKNOWN'];
export const TRAVEL_KINDS = ['HOTEL','FLIGHT','ACTIVITY','CAR_RENTAL','PACKAGE'];

function offerType(coupon) {
  if (coupon.offerType) return coupon.offerType;
  if (coupon.type === 'GAME_REWARD') return 'GAME_REDEEM';
  return 'CODE';
}

function discountKind(coupon) {
  if (coupon.discountKind) return coupon.discountKind;
  return Number.isFinite(coupon.fixedAmount) ? 'FIXED' : 'PERCENT';
}

function endMode(coupon) {
  if (coupon.endMode) return coupon.endMode;
  return coupon.expiresAt ? 'FIXED_DATE' : 'UNKNOWN';
}

function parseDate(value, code) {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(code);
  return parsed;
}

function validateOptionalRange(start, end, code) {
  if (start == null && end == null) return;
  if (start == null || end == null) throw new Error(code);
  if (parseDate(start, code) > parseDate(end, code)) throw new Error(code);
}

function isDiscountOffer(coupon) {
  return ['CODE','AUTO_DISCOUNT','CARD_CHANNEL','MEMBER','CASHBACK','REFERRAL'].includes(offerType(coupon));
}

function validateTravel(coupon) {
  if (coupon.category !== '여행·숙박') return;
  if (!coupon.travel || typeof coupon.travel !== 'object') throw new Error('MISSING_TRAVEL_CONDITIONS');
  if (!TRAVEL_KINDS.includes(coupon.travel.kind)) throw new Error('INVALID_TRAVEL_KIND');
  if (!Array.isArray(coupon.travel.regions) || !coupon.travel.regions.length || coupon.travel.regions.some(x => typeof x !== 'string' || !x.trim())) throw new Error('INVALID_TRAVEL_REGIONS');
  validateOptionalRange(coupon.travel.bookingStartAt, coupon.travel.bookingEndAt, 'INVALID_BOOKING_PERIOD');
  validateOptionalRange(coupon.travel.stayStartAt, coupon.travel.stayEndAt, 'INVALID_STAY_PERIOD');
  if (offerType(coupon) === 'CARD_CHANNEL' && (typeof coupon.paymentProvider !== 'string' || !coupon.paymentProvider.trim())) throw new Error('MISSING_PAYMENT_PROVIDER');
}

export function validateCoupon(coupon, now = Date.now()) {
  if (!coupon || typeof coupon !== 'object') throw new Error('INVALID_COUPON');
  for (const key of ['id', 'brand', 'category']) {
    if (typeof coupon[key] !== 'string' || !coupon[key].trim()) throw new Error(`MISSING_${key}`);
  }
  const kind = offerType(coupon);
  if (!OFFER_TYPES.includes(kind)) throw new Error('INVALID_OFFER_TYPE');
  if (['CODE','REFERRAL','GAME_REDEEM'].includes(kind) && (typeof coupon.code !== 'string' || !coupon.code.trim())) throw new Error('MISSING_code');
  if (coupon.code != null && typeof coupon.code !== 'string') throw new Error('INVALID_code');
  if (!['ACTIVE','EXPIRING_SOON','EXPIRED','UNVERIFIED','REMOVED'].includes(coupon.status)) throw new Error('INVALID_STATUS');

  if (coupon.type != null && !['DISCOUNT','GAME_REWARD'].includes(coupon.type)) throw new Error('INVALID_TYPE');
  if (kind === 'GAME_REDEEM') {
    if (!Array.isArray(coupon.rewards) || !coupon.rewards.length || coupon.rewards.some(r => !r.name || !Number.isFinite(r.quantity) || r.quantity <= 0)) throw new Error('INVALID_REWARDS');
    if (!coupon.server || !coupon.redemptionMethod) throw new Error('MISSING_GAME_CONDITIONS');
  }

  if (isDiscountOffer(coupon)) {
    if (!Number.isFinite(coupon.minimum) || coupon.minimum < 0) throw new Error('INVALID_minimum');
    const mode = discountKind(coupon);
    if (!['PERCENT','FIXED'].includes(mode)) throw new Error('INVALID_DISCOUNT_KIND');
    if (mode === 'PERCENT') {
      if (!Number.isFinite(coupon.rate) || coupon.rate < 0 || coupon.rate > 100) throw new Error('INVALID_rate');
      if (!Number.isFinite(coupon.cap) || coupon.cap < 0) throw new Error('INVALID_cap');
    } else {
      if (!Number.isFinite(coupon.fixedAmount) || coupon.fixedAmount < 0) throw new Error('INVALID_FIXED_AMOUNT');
      if (coupon.cap != null && (!Number.isFinite(coupon.cap) || coupon.cap < 0)) throw new Error('INVALID_cap');
    }
  }

  if (!['ALL','APP','WEB'].includes(coupon.platform) || !['ALL','NEW','EXISTING'].includes(coupon.member)) throw new Error('INVALID_CONDITIONS');
  const source = new URL(coupon.sourceUrl);
  if (source.protocol !== 'https:' || source.username || source.password) throw new Error('INVALID_SOURCE');
  const checked = Date.parse(coupon.sourceCheckedAt);
  if (!Number.isFinite(checked) || checked > now) throw new Error('INVALID_CHECK_TIME');

  const ending = endMode(coupon);
  if (!END_MODES.includes(ending)) throw new Error('INVALID_END_MODE');
  if (ending === 'FIXED_DATE') {
    if (!coupon.expiresAt) throw new Error('EXPIRY_REQUIRED');
    parseDate(coupon.expiresAt, 'INVALID_EXPIRY');
  } else if (coupon.expiresAt != null) {
    parseDate(coupon.expiresAt, 'INVALID_EXPIRY');
  }

  validateTravel(coupon);

  if (['ACTIVE','EXPIRING_SOON'].includes(coupon.status)) {
    if (kind === 'GAME_REDEEM' && coupon.eligibilityConfirmed !== true) throw new Error('MISSING_ELIGIBILITY_EVIDENCE');
    const verified = Date.parse(coupon.workingVerifiedAt);
    if (!Number.isFinite(verified) || verified > now || coupon.verificationResult !== 'SUCCESS') throw new Error('MISSING_WORKING_EVIDENCE');
    if (now - verified > 86400000) throw new Error('STALE_WORKING_EVIDENCE');
  }
  return coupon;
}

export function calculateSaving(coupon, amount) {
  if (!Number.isFinite(amount) || amount < 0) throw new Error('INVALID_AMOUNT');
  if (!isDiscountOffer(coupon)) return 0;
  if (amount < coupon.minimum) return 0;
  if (discountKind(coupon) === 'FIXED') {
    const raw = Math.min(amount, coupon.fixedAmount);
    return coupon.cap == null ? raw : Math.min(raw, coupon.cap);
  }
  return Math.min(Math.floor(amount * coupon.rate / 100), coupon.cap);
}

function couponEligible(c, {amount, member, platform}, now) {
  if (!['ACTIVE','EXPIRING_SOON'].includes(c.status)) return false;
  if (endMode(c) === 'FIXED_DATE' && Date.parse(c.expiresAt) <= now) return false;
  if (!isDiscountOffer(c) || amount < c.minimum) return false;
  if (!(c.member === 'ALL' || c.member === member)) return false;
  if (!(c.platform === 'ALL' || c.platform === platform)) return false;
  return true;
}

export function rankCoupons(coupons, {amount, member, platform}, now = Date.now()) {
  if (!Number.isFinite(amount) || amount < 0) throw new Error('INVALID_AMOUNT');
  return coupons.map(c => validateCoupon(c, now)).filter(c => couponEligible(c,{amount,member,platform},now))
    .map(c => ({...c, saving: calculateSaving(c, amount), finalPrice: Math.max(0, amount - calculateSaving(c, amount))}))
    .sort((a,b) => b.saving - a.saving || Date.parse(b.workingVerifiedAt) - Date.parse(a.workingVerifiedAt));
}

export function renderHub(brand, coupons, now = Date.now()) {
  const items = coupons.map(c => validateCoupon(c, now)).filter(c => c.brand === brand && ['ACTIVE','EXPIRING_SOON'].includes(c.status) && (endMode(c) !== 'FIXED_DATE' || Date.parse(c.expiresAt) > now));
  return `<div class="ncp-page" data-ncp-page><div class="ncp-wrap"><h1>${escapeHtml(brand)} 쿠폰</h1>${items.length ? items.map(c => renderOffer(c)).join('') : '<section class="ncp-empty-verified"><h2>현재 확인된 사용 가능 쿠폰이 없습니다.</h2><p>새 쿠폰이 확인되면 이 페이지에 추가됩니다.</p></section>'}</div></div>`;
}

export function renderTravelComparison(brand, coupons, context, now = Date.now()) {
  const ranked = rankCoupons(coupons.filter(c => c.brand === brand && c.category === '여행·숙박'), context, now);
  if (!ranked.length) return '<section class="ncp-empty-verified"><h2>현재 조건에서 사용 가능한 여행 할인이 없습니다.</h2></section>';
  const rows = ranked.map((c,index) => `<tr${index===0?' class="ncp-best-row"':''}><td>${escapeHtml(offerTypeLabel(c))}</td><td>${escapeHtml(travelConditionLabel(c))}</td><td>${escapeHtml(c.saving.toLocaleString('ko-KR'))}원</td><td>${escapeHtml(c.finalPrice.toLocaleString('ko-KR'))}원</td><td>${index===0?'현재 더 유리':'비교 가능'}</td></tr>`).join('');
  return `<section class="ncp-travel-compare"><h2>${escapeHtml(brand)} 쿠폰·채널 최종가 비교</h2><table><thead><tr><th>방법</th><th>조건</th><th>예상 절감</th><th>예상 최종가</th><th>판정</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

export function renderCommerceComparison(brand, coupons, context, now = Date.now()) {
  const ranked = rankCoupons(coupons.filter(c => c.brand === brand && c.category !== '게임' && c.category !== '여행·숙박'), context, now);
  if (!ranked.length) return '<section class="ncp-empty-verified"><h2>현재 조건에서 사용 가능한 할인이 없습니다.</h2></section>';
  return `<section class="ncp-commerce-compare"><h2>${escapeHtml(brand)} 예상 절감액 비교</h2>${ranked.map((c,index)=>`<article class="ncp-offer${index===0?' ncp-offer--best':''}"><strong>${escapeHtml(offerTypeLabel(c))}</strong><p>예상 절감 ${escapeHtml(c.saving.toLocaleString('ko-KR'))}원 · 예상 결제 ${escapeHtml(c.finalPrice.toLocaleString('ko-KR'))}원</p><p>${escapeHtml(c.platform)} · ${escapeHtml(c.member)} · 최소 ${escapeHtml(c.minimum.toLocaleString('ko-KR'))}원</p></article>`).join('')}</section>`;
}

function offerTypeLabel(c) {
  return ({CODE:'쿠폰 코드',AUTO_DISCOUNT:'자동 할인',CARD_CHANNEL:`카드채널${c.paymentProvider?` · ${c.paymentProvider}`:''}`,MEMBER:'회원 할인',CASHBACK:'캐시백',REFERRAL:'추천인 할인',GAME_REDEEM:'게임 코드',FREEBIE:'무료 혜택'})[offerType(c)] || offerType(c);
}

function travelConditionLabel(c) {
  const travel = c.travel;
  return [c.platform, travel?.kind, ...(travel?.regions || [])].filter(Boolean).join(' · ');
}

function endConditionLabel(c) {
  const mode = endMode(c);
  if (mode === 'FIXED_DATE') return c.expiresAt;
  return ({ONGOING:'상시',UNTIL_BUDGET_EXHAUSTED:'예산 소진 시 종료',UNTIL_STOCK_EXHAUSTED:'재고 소진 시 종료',UNKNOWN:'종료일 미확인'})[mode] || mode;
}

function renderOffer(c) {
  const kind = offerType(c);
  const benefit = kind === 'GAME_REDEEM'
    ? c.rewards.map(r=>`${escapeHtml(r.name)} ${escapeHtml(r.quantity)}개`).join(' · ')
    : discountKind(c) === 'FIXED' ? `${escapeHtml(c.fixedAmount)}원 할인` : `${escapeHtml(c.rate)}% 할인`;
  const conditions = kind === 'GAME_REDEEM'
    ? `서버: ${escapeHtml(c.server)} · 입력: ${escapeHtml(c.redemptionMethod)}`
    : `최소 ${escapeHtml(c.minimum)}원${c.cap != null?` · 최대 ${escapeHtml(c.cap)}원`:''}`;
  return `<article class="ncp-offer"><strong>${benefit}</strong>${c.code?`<code>${escapeHtml(c.code)}</code>`:''}<p>${escapeHtml(offerTypeLabel(c))} · ${conditions} · ${escapeHtml(c.platform)} · ${escapeHtml(c.member)}</p><p>종료: ${escapeHtml(endConditionLabel(c))}</p><a href="${escapeHtml(c.sourceUrl)}" rel="noopener noreferrer">공식 출처</a></article>`;
}
