import {renderHub} from './coupons.js';

export const hubs = {
  zeus:'제우스: 오만의 신',
  lineagem:'리니지M',
  wuthering:'명조:워더링 웨이브'
};

export function buildHubDraft(hubKey, coupons = []) {
  const brand=hubs[hubKey];
  if (!Object.hasOwn(hubs,hubKey)) throw new Error('UNKNOWN_HUB');
  return {
    title:`${brand} 쿠폰·입력 방법`,
    content:`<div data-ncp-hub="${hubKey}">${renderHub(brand,coupons)}</div>`,
    labels:['게임',brand]
  };
}
