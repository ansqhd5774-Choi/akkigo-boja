// Listing eligibility is separate from successful redemption verification.
export function classifyCoupon(coupon, now = Date.now()) {
  if (!Number.isFinite(now)) throw new Error('INVALID_POLICY_TIME');
  const official = coupon.sourceAuthority === 'OFFICIAL';
  if (coupon.status === 'REMOVED') return 'EXCLUDED';
  const expiry = Date.parse(coupon.expiresAt);
  if (coupon.expiresAt != null && !Number.isFinite(expiry)) return 'EXCLUDED';
  if (coupon.status === 'EXPIRED' || (Number.isFinite(expiry) && expiry <= now)) return official ? 'HISTORY' : 'EXCLUDED';
  if (coupon.startsAt != null) {
    const start = Date.parse(coupon.startsAt);
    if (!Number.isFinite(start) || start > now || (Number.isFinite(expiry) && start >= expiry)) return 'EXCLUDED';
  }
  if (!['ACTIVE','EXPIRING_SOON','UNVERIFIED'].includes(coupon.status)) return 'EXCLUDED';
  if (Number.isFinite(expiry)) return 'CURRENT';
  // ONGOING or a missing date alone does not establish an unlimited period.
  if (official && coupon.validity === 'UNLIMITED' && coupon.validityEvidenceUrl === coupon.sourceUrl) return 'CURRENT';
  return 'EXCLUDED';
}

export function couponLifecycle(coupons, now = Date.now()) {
  const result = {current:[],history:[],excluded:[]};
  for (const coupon of coupons) {
    const state = classifyCoupon(coupon, now);
    result[state === 'CURRENT' ? 'current' : state === 'HISTORY' ? 'history' : 'excluded'].push(coupon);
  }
  return result;
}

export function couponCatalog(coupons, now = Date.now()) {
  const {current,history} = couponLifecycle(coupons, now);
  const summarize = rows => [...new Set(rows.map(c => c.brand))].map(brand => ({brand,category:rows.find(c=>c.brand===brand).category,count:rows.filter(c=>c.brand===brand).length}));
  const nextExpiry=current.map(c=>Date.parse(c.expiresAt)).filter(Number.isFinite).sort((a,b)=>a-b)[0];
  return {nextExpiry:nextExpiry ? new Date(nextExpiry).toISOString() : null, policyVersion:1, evaluatedAt:new Date(now).toISOString(), current:summarize(current), history:summarize(history)};
}
