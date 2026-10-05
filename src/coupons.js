export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function validateCoupon(coupon, now = Date.now()) {
  if (!coupon || typeof coupon !== 'object') throw new Error('INVALID_COUPON');
  for (const key of ['id', 'brand', 'category', 'code']) {
    if (typeof coupon[key] !== 'string' || !coupon[key].trim()) throw new Error(`MISSING_${key}`);
  }
  if (!['ACTIVE','EXPIRING_SOON','EXPIRED','UNVERIFIED','REMOVED'].includes(coupon.status)) throw new Error('INVALID_STATUS');
  const type = coupon.type || 'DISCOUNT';
  if (!['DISCOUNT','GAME_REWARD'].includes(type)) throw new Error('INVALID_TYPE');
  if (type === 'GAME_REWARD') {
    if (!Array.isArray(coupon.rewards) || !coupon.rewards.length || coupon.rewards.some(r => !r.name || !Number.isFinite(r.quantity) || r.quantity <= 0)) throw new Error('INVALID_REWARDS');
    if (!coupon.server || !coupon.redemptionMethod) throw new Error('MISSING_GAME_CONDITIONS');
  }
  for (const key of type === 'DISCOUNT' ? ['rate', 'minimum', 'cap'] : []) {
    if (!Number.isFinite(coupon[key]) || coupon[key] < 0) throw new Error(`INVALID_${key}`);
  }
  if (type === 'DISCOUNT' && coupon.rate > 100) throw new Error('INVALID_RATE');
  if (!['ALL','APP','WEB'].includes(coupon.platform) || !['ALL','NEW','EXISTING'].includes(coupon.member)) throw new Error('INVALID_CONDITIONS');
  const source = new URL(coupon.sourceUrl);
  if (source.protocol !== 'https:' || source.username || source.password) throw new Error('INVALID_SOURCE');
  const checked = Date.parse(coupon.sourceCheckedAt);
  if (!Number.isFinite(checked) || checked > now) throw new Error('INVALID_CHECK_TIME');
  if (['ACTIVE','EXPIRING_SOON'].includes(coupon.status)) {
    if (type === 'GAME_REWARD' && coupon.eligibilityConfirmed !== true) throw new Error('MISSING_ELIGIBILITY_EVIDENCE');
    const verified = Date.parse(coupon.workingVerifiedAt);
    if (!Number.isFinite(verified) || verified > now || coupon.verificationResult !== 'SUCCESS') throw new Error('MISSING_WORKING_EVIDENCE');
    if (now - verified > 86400000) throw new Error('STALE_WORKING_EVIDENCE');
  }
  if (coupon.expiresAt != null && !Number.isFinite(Date.parse(coupon.expiresAt))) throw new Error('INVALID_EXPIRY');
  return coupon;
}

export function rankCoupons(coupons, {amount, member, platform}, now = Date.now()) {
  if (!Number.isFinite(amount) || amount < 0) throw new Error('INVALID_AMOUNT');
  return coupons.map(c => validateCoupon(c, now)).filter(c =>
    (c.type || 'DISCOUNT') === 'DISCOUNT' && ['ACTIVE','EXPIRING_SOON'].includes(c.status) &&
    (!c.expiresAt || Date.parse(c.expiresAt) > now) && amount >= c.minimum &&
    (c.member === 'ALL' || c.member === member) && (c.platform === 'ALL' || c.platform === platform)
  ).map(c => ({...c, saving: Math.min(Math.floor(amount * c.rate / 100), c.cap)}))
    .sort((a,b) => b.saving - a.saving || Date.parse(b.workingVerifiedAt) - Date.parse(a.workingVerifiedAt));
}

export function renderHub(brand, coupons, now = Date.now()) {
  const items = coupons.map(c => validateCoupon(c, now)).filter(c => c.brand === brand && ['ACTIVE','EXPIRING_SOON'].includes(c.status) && (!c.expiresAt || Date.parse(c.expiresAt) > now));
  return `<div class="ncp-page" data-ncp-page><div class="ncp-wrap"><h1>${escapeHtml(brand)} 쿠폰</h1>${items.length ? items.map(c => renderOffer(c)).join('') : '<p>현재 검증된 쿠폰이 없습니다.</p>'}</div></div>`;
}

function renderOffer(c) {
  const benefit = c.type === 'GAME_REWARD'
    ? c.rewards.map(r=>`${escapeHtml(r.name)} ${escapeHtml(r.quantity)}개`).join(' · ')
    : `${escapeHtml(c.rate)}% 할인`;
  const conditions = c.type === 'GAME_REWARD'
    ? `서버: ${escapeHtml(c.server)} · 입력: ${escapeHtml(c.redemptionMethod)}`
    : `최소 ${escapeHtml(c.minimum)}원 · 최대 ${escapeHtml(c.cap)}원`;
  return `<article class="ncp-offer"><strong>${benefit}</strong><code>${escapeHtml(c.code)}</code><p>${conditions} · ${escapeHtml(c.platform)} · ${escapeHtml(c.member)}</p><p>작동 확인: ${escapeHtml(c.workingVerifiedAt)}</p><a href="${escapeHtml(c.sourceUrl)}" rel="noopener noreferrer">공식 출처</a></article>`;
}
