// Shared by the reproducible build and minimal patches of the current live theme.
export function applyAdsensePolicy(text) {
  if(text.includes('NCP_POLICY_CONTENT_20261018')) return text;
  const marker='<!-- NCP_POLICY_CONTENT_20261018 -->';
  const head="<b:include data='blog' name='all-head-content'/>";
  if(!text.includes(head)) throw Error('HEAD_INCLUDE_NOT_FOUND');
  text=text.replace(head,marker+head);
  // Blogger injects a loader independently of all-head-content. On non-post
  // views restrict executable external scripts; do not merely hide ad units.
  text=text.replace('<head>',`<head><b:if cond='!data:view.isPost'><meta content="script-src 'self' 'unsafe-inline' https://www.blogger.com https://www.gstatic.com https://apis.google.com https://resources.blogblog.com https://wcs.pstatic.net https://akkigo-boja.ansqhd5774.workers.dev" http-equiv='Content-Security-Policy'/></b:if>`);
  text=text.replace("cond='(data:widgets.AdSense.first or data:blog.adsenseClientId) and not data:blog.adsenseAutoAds'", "cond='data:view.isPost and (data:widgets.AdSense.first or data:blog.adsenseClientId) and not data:blog.adsenseAutoAds'");
  // In addition to the head loader, keep native units out of utility/list pages.
  text=text.replace(/<b:widget\b([^>]*type='AdSense'[^>]*)>/g,(all,attrs)=>`<b:widget cond='data:view.isPost'${attrs}>`);
  const hub=/<section class='ncp-r3' (?=[^>]*id='ncp-game-hub')[^>]*><h1><data:blog.searchLabel\/><\/h1>/;
  if(!hub.test(text))throw Error('CATEGORY_HUB_NOT_FOUND');
  text=text.replace(hub,match=>match+`<section class='ncp-policy-guide'><h2>혜택을 확인하는 방법</h2><p>입력 코드는 등록 화면에서 사용하고, 가입 혜택은 신규 회원 조건을, 결제 할인은 최소 금액과 제외 상품을 확인하세요. 게임 보상과 일반 할인은 적용 방식이 다릅니다.</p><p>아래 개수는 수집한 코드 기록이며 현재 사용 가능한 수량을 뜻하지 않습니다. 만료 기록과 미확인 후보도 포함될 수 있습니다. 상세 글의 출처·기간·대상 조건을 확인하세요.</p><h2>최근 안내 글</h2><div class='ncp-policy-summaries'><b:loop index='summaryIndex' values='data:posts' var='post'><b:if cond='data:summaryIndex &lt; 4'><article><h3><a expr:href='data:post.url'><data:post.title/></a></h3><p><b:eval expr='snippet(data:post.body, {length: 180, links: false, linebreaks: false})'/></p></article></b:if></b:loop></div></section>`);
  const home="<main class='ncp-r4-wrap' id='ncp-coupon-home'>";
  if(!text.includes(home))throw Error('HOME_MAIN_NOT_FOUND');
  text=text.replace(home,home+`<section class='ncp-policy-guide'><h2>내게 맞는 쿠폰·할인 찾기</h2><p>아끼고 보자는 게임 입력 코드와 생활 서비스의 가입·결제 혜택을 구분해 안내합니다. 코드를 복사하기 전에 공식 등록 화면, 적용 대상, 종료일을 확인하세요. 자동 할인이나 회원 가입 혜택은 별도 코드 없이 적용될 수 있습니다.</p><p>수집한 기록 수는 현재 사용 가능 수량이 아닙니다. 과거 만료·해외 보고·미확인 후보는 상세 글에서 구분하며, 복사 완료는 계정에서의 사용 성공을 의미하지 않습니다.</p><h3>이용 안내</h3><ul><li>게임: 서버·지역·계정 조건과 우편함 지급 여부 확인</li><li>생활·교육: 신규 회원 여부, 최소 결제액, 할인 제외 상품과 중복 적용 조건 확인</li><li>출처와 확인 상태를 확인하고 최종 조건은 공식 서비스에서 재확인</li></ul><p><a href='/2026/10/blog-post_917.html'>세븐나이츠 리버스 코드·입력 안내</a> · <a href='/2026/10/3-2026-10-1020-30.html'>해커스공무원 혜택·등록 안내</a> · <a href='/2026/10/rag-2026-10-20.html'>패스트캠퍼스 할인·조건 안내</a></p></section>`);
  text=text.replace(']]></b:skin>',`.ncp-policy-guide{margin:0 0 24px;padding:20px;border:1px solid #dce4ef;border-radius:14px;background:#fff;color:#172033;line-height:1.8}.ncp-policy-guide h2{font-size:21px!important;margin:0 0 12px!important}.ncp-policy-guide h3{font-size:17px;margin:12px 0 6px}.ncp-policy-guide p{margin:8px 0}.ncp-policy-summaries{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.ncp-policy-summaries article{min-width:0;overflow-wrap:anywhere}.ncp-policy-summaries p{font-size:14px}@media(max-width:600px){.ncp-policy-summaries{grid-template-columns:1fr}.ncp-policy-guide{padding:16px}}]]></b:skin>`);
  text=text.replace(/(<h1><data:blog.searchLabel\/><\/h1>)(<section class='ncp-policy-guide'>[\s\S]*?<\/section>)(<div class='ncp-game-grid'\/>)/,(_match,heading,guide,grid)=>heading+grid+guide);
  text=text.replaceAll("badge.textContent='코드 '+count+'개'", "badge.textContent=game?'기록 '+count+'개':(count?'코드 '+count+'개':'혜택 안내')");
  text=text.replaceAll("badge.textContent='코드 '+codeCount+'개'", "badge.textContent=category==='게임'?'기록 '+codeCount+'개':(codeCount?'코드 '+codeCount+'개':'혜택 안내')");
  return text;
}
