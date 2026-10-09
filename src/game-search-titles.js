import {escapeHtml} from './coupons.js';

// A short on-page game title keeps its own search title. No active-code claims.
export function gameSearchTitle(title){
 return `${title} 쿠폰 코드 모음 | 만료 정보·입력 방법 — 아끼고 보자`;
}
export function gameSearchTitleBranches(titles){
 return [...new Set(titles)].filter(title=>title&&!/쿠폰|할인|코드/.test(title)).map(title=>
  `<b:elseif cond='data:view.isPost and data:blog.pageName == &quot;${escapeHtml(title)}&quot;'/>${escapeHtml(gameSearchTitle(title))}`
 ).join('');
}
