import {homeR4,categoryHeaderR4} from '../theme/home-r4.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {escapeHtml as e} from '../src/coupons.js';
import {resolveGame} from '../src/game-identity.js';
import {icons} from '../theme/site-icons.mjs';
import {gameSearchTitleBranches} from '../src/game-search-titles.js';
const root=new URL('../',import.meta.url);
const heartSeeds=JSON.parse(await readFile(new URL('data/game-heart-seeds.json',root),'utf8'));
const identityMount=`<script type='text/javascript'>//<![CDATA[\nwindow.ncpResolveGame=(function(){const known=${JSON.stringify(Object.keys(heartSeeds))};const resolve=${resolveGame.toString()};return entry=>resolve(entry,known);})();\n//]]></script>`;
const catalogs=await Promise.all(['data/articles.json','data/articles-supplemental.json'].map(async path=>JSON.parse(await readFile(new URL(path,root),'utf8'))));
const hubModels=JSON.parse(await readFile(new URL('data/game-period-hubs.json',root),'utf8'));
const gameTitles=catalogs.flat().filter(article=>article.post.labels.includes('게임')).map(article=>article.post.title).concat(Object.values(hubModels).map(hub=>hub.title));
const descriptions=[...new Map(catalogs.flat().filter(a=>a.post?.searchDescription||a.source?.seo?.metaDescriptionDraft).map(a=>[a.post.title,a.post.searchDescription||a.source.seo.metaDescriptionDraft])).entries()];
const descriptionFallback="<meta expr:content='data:blog.pageName + &quot; — 쿠폰 정보와 사용 방법, 출처 및 적용 조건을 본문에서 확인하세요.&quot;' name='description'/>";
const descriptionBranches=descriptions.length?'<b:if cond=\'data:blog.pageName == &quot;'+e(descriptions[0][0])+'&quot;\'><meta name=\'description\' content=\''+e(descriptions[0][1])+'\'/>'+descriptions.slice(1).map(([title,description])=>'<b:elseif cond=\'data:blog.pageName == &quot;'+e(title)+'&quot;\'/><meta name=\'description\' content=\''+e(description)+'\'/>').join('')+'<b:else/>'+descriptionFallback+'</b:if>':descriptionFallback;
const base=(await readFile(new URL('theme/blogger-native-base.xml',root),'utf8')).replace('<!-- GAME_SEARCH_TITLE_BRANCHES -->',gameSearchTitleBranches(gameTitles)).replace(descriptionFallback,descriptionBranches);
const gameCss=await readFile(new URL('theme/game-icon-grid.css',root),'utf8');
const gameScript=await readFile(new URL('theme/game-icon-grid.js',root),'utf8');
const categories=['게임','유심·로밍','호스팅·도메인','해외직구','건강','VPN','교육'];
const coupons=JSON.parse(await readFile(new URL('data/coupons.json',root),'utf8'));
const manual=coupons.filter(c=>c.verificationResult==='SUCCESS');
const links=[['제우스: 오만의 신','/2026/10/blog-post.html'],['리니지M','/2026/10/m.html'],['명조:워더링 웨이브','/2026/10/blog-post_05.html']];
const css=`
/* R3 coupon shell; native Blogger widgets remain intact. */
:root{--ncp-ink:#172033;--ncp-blue:#2457d6;--ncp-line:#e2e8f0}
body{margin:0!important;padding:0!important;background:#f4f6f8!important}.centered-top-container,.centered-top-placeholder,.sidebar-container,.bg-photo,.bg-photo-overlay{display:none!important}.page_body{padding-top:0!important}.centered{padding-top:0!important;max-width:1180px!important}.ncp-home .page{display:none!important}
.ncp-r3{font-family:Arial,'Noto Sans KR',sans-serif;color:var(--ncp-ink)}.ncp-r3 a{text-decoration:none;color:var(--ncp-blue)}.ncp-r3-wrap{max-width:1180px;margin:auto;padding:24px}.ncp-r3-header{background:#fff;border-bottom:1px solid var(--ncp-line)}.ncp-r3-head{display:flex;align-items:center;gap:24px;flex-wrap:wrap}.ncp-r3-logo{font-size:26px;font-weight:800}.ncp-r3-search{display:flex;flex:1;min-width:240px;gap:8px}.ncp-r3 input{flex:1;min-width:0;padding:13px;border:1px solid var(--ncp-line);border-radius:10px}.ncp-r3 button,.ncp-r3-link{min-height:44px;padding:12px 16px;border:0;border-radius:10px;background:var(--ncp-blue);color:white!important;font-weight:700;cursor:pointer}.ncp-r3-rail{display:flex;gap:8px;overflow-x:auto;padding-top:0}.ncp-r3-chip{white-space:nowrap;padding:10px 14px;background:#edf2ff;border-radius:22px;font-size:14px}.ncp-r3-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.ncp-r3-card{padding:24px;border:1px solid var(--ncp-line);border-radius:16px;background:white;min-width:0}.ncp-r3 h1{font-size:36px;line-height:1.3}.ncp-r3 h2{margin:28px 0 16px;font-size:24px}.ncp-r3 h3{font-size:20px}.ncp-r3 p{line-height:1.8}.ncp-r3 code{display:block;padding:16px;background:#edf2ff;border-radius:10px;font-size:22px;overflow-wrap:anywhere}.ncp-r3-badge{display:inline-block;padding:6px 10px;background:#e8f6ed;border-radius:8px;font-size:13px}.ncp-r3-muted{color:#64748b;font-size:14px}.ncp-r3-footer{border-top:1px solid var(--ncp-line);margin-top:32px;background:white}.ncp-r3-copy-state{min-height:24px}.ncp-r3-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
.ncp-feed-preview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0 6px}.ncp-feed-stat{min-width:0;padding:12px 14px;border:1px solid var(--ncp-line);border-radius:10px;background:#f8fafc}.ncp-feed-stat span{display:block;margin-bottom:3px;color:#64748b;font-size:12px;font-weight:700}.ncp-feed-stat strong{display:block;color:#172033;font-size:15px;line-height:1.45;overflow-wrap:anywhere}.ncp-feed-preview-generic .ncp-feed-stat strong{font-size:14px}
@media(max-width:700px){.ncp-feed-preview{grid-template-columns:1fr;gap:8px}.ncp-r3-wrap{padding:16px}.ncp-r3-grid{grid-template-columns:1fr}.ncp-r3 h1{font-size:28px}.ncp-r3-head{gap:16px}.ncp-r3-search{flex-basis:100%}.ncp-r3-card{padding:18px}.ncp-r3-rail{padding-top:0}.centered{padding:0!important}}
`;
const header=`<div class='ncp-r3'><header class='ncp-r3-header'><div class='ncp-r3-wrap ncp-r3-head'><a class='ncp-r3-logo' href='/'>아끼고 보자</a><form class='ncp-r3-search' action='/search' method='get' role='search'><input name='q' aria-label='브랜드 또는 게임 검색' placeholder='브랜드 또는 게임 검색' type='search'/><button type='submit'>검색</button></form></div><nav class='ncp-r3-wrap ncp-r3-rail' aria-label='쿠폰 카테고리'>${categories.map(c=>`<a class='ncp-r3-chip' href='/search/label/${encodeURIComponent(c)}'>${e(c)}</a>`).join('')}</nav></header></div>`;
const cards=manual.map(c=>`<article class='ncp-r3-card'><span class='ncp-r3-badge'>사용 확인</span><h3>${e(c.brand)}</h3><code>${e(c.code)}</code><p>등록 성공 및 보상 수령 사례가 있습니다.</p><details><summary>보상 보기</summary><ul>${c.rewards.map(r=>`<li>${e(r.name)} ${e(r.quantity)}개</li>`).join('' )}</ul></details><p class='ncp-r3-muted'>서버 범위·전체 계정 조건·만료일은 확인되지 않았습니다.</p><div class='ncp-r3-actions'><button type='button' data-ncp-copy='${e(c.code)}'>코드 복사</button><a class='ncp-r3-link' href='/2026/10/blog-post.html'>보상·입력 방법</a></div><p class='ncp-r3-copy-state' role='status' aria-live='polite'></p></article>`).join('');
const home=`<b:if cond='data:view.isHomepage'><main class='ncp-r3 ncp-r3-wrap' id='ncp-coupon-home'><h1>쿠폰을 찾고, 확인하고, 사용하세요</h1><p>게임 쿠폰과 입력 방법을 빠르게 확인하세요.</p><h2>사용 확인 쿠폰</h2><div class='ncp-r3-grid'>${cards||'<p>현재 표시할 쿠폰이 없습니다.</p>'}</div><h2>게임 쿠폰 · 입력 안내</h2><div class='ncp-r3-grid'>${links.map(([name,url])=>`<article class='ncp-r3-card'><h3>${e(name)}</h3><p>쿠폰 코드 · 보상 · 입력 방법</p><a class='ncp-r3-link' href='${url}'>확인하기</a></article>`).join('')}</div><h2>최신 코드</h2><p>게임별 최신 쿠폰은 위 목록에서 확인하세요.</p><h2>만료 임박</h2><p>현재 표시할 만료 임박 쿠폰이 없습니다.</p></main></b:if>`;
const footer=`<footer class='ncp-r3 ncp-r3-footer'><div class='ncp-r3-wrap'><strong>아끼고 보자</strong><a href='/p/blog-page.html'>개인정보 처리 안내</a></div></footer>`;
const copyJs=await readFile(new URL('theme/coupon-copy.js',root),'utf8');
const analyticsJs=await readFile(new URL('theme/analytics-events.js',root),'utf8');
const copyCss=await readFile(new URL('theme/coupon-copy.css',root),'utf8');
const detailCss=await readFile(new URL('theme/game-detail.css',root),'utf8');
const detailJs=await readFile(new URL('theme/game-detail.js',root),'utf8');
const detailMount=`<b:if cond='data:view.isPost'><script type='text/javascript'>//<![CDATA[\n${detailJs}\n//]]></script></b:if>`;
const script=`<script type='text/javascript'>//<![CDATA[\n${analyticsJs}\n${copyJs}\n//]]></script>`;
const gameMount=`<b:if cond='data:blog.searchLabel'><script type='text/javascript'>//<![CDATA[\n${gameScript}\n//]]></script></b:if>`;
const homeCss=await readFile(new URL('theme/home-r4.css',root),'utf8');
const homeJs=await readFile(new URL('theme/home-r4.js',root),'utf8');
const siteCss=await readFile(new URL('theme/site-tools.css',root),'utf8');
const siteJs=await readFile(new URL('theme/site-tools.js',root),'utf8');
const updatedCss=await readFile(new URL('theme/post-updated.css',root),'utf8');
const typographyCss=await readFile(new URL('theme/article-typography.css',root),'utf8');
const compactCss=await readFile(new URL('theme/article-compact.css',root),'utf8');
const updatedJs=await readFile(new URL('theme/post-updated.js',root),'utf8');
const updatedMount=`<b:if cond='data:view.isPost'><script type='text/javascript'>//<![CDATA[
${updatedJs}
//]]></script></b:if>`;
const license=await readFile(new URL('theme/assets/licenses/lucide.txt',root),'utf8');
const siteMount=`<script type='text/javascript'>//<![CDATA[\n/* ${license.replace(/\*\//g,'* /')} */\nwindow.ncpIcons=${JSON.stringify(icons)};\n${siteJs}\n//]]></script>`;
const seoLinks=JSON.parse(await readFile(new URL('theme/seo-post-links.json',root),'utf8'));
const seoFallback=`<b:if cond='data:view.isHomepage'><noscript><nav class='ncp-r4 ncp-r4-wrap' aria-label='쿠폰 안내 글 목록'><h2>쿠폰·할인코드 안내</h2><p>JavaScript를 사용할 수 없어 글 링크를 표시합니다.</p><ul>${seoLinks.map(row=>`<li><a href='${e(row.url)}'>${e(row.title)}</a></li>`).join('')}</ul></nav></noscript></b:if>`;
const homeMount=`<b:if cond='data:view.isHomepage'><script type='text/javascript'>//<![CDATA[
${homeJs}
//]]></script></b:if>`;
const output=base.replace(']]></b:skin>',css+gameCss+homeCss+copyCss+detailCss+siteCss+updatedCss+typographyCss+compactCss+']]></b:skin>').replace('<body>',`<body><b:class cond='data:view.isHomepage' name='ncp-home'/><b:class cond='data:blog.searchLabel' name='ncp-category-page'/><b:if cond='!data:view.isHomepage'>${categoryHeaderR4(categories)}</b:if>${homeR4(categories)}`).replace('</body>',`<b:if cond='!data:view.isHomepage'>${footer}</b:if>`+siteMount+script+gameMount+homeMount+detailMount+updatedMount+'</body>');
// Keep the previously registered URL stable: bare /favicon.ico can retain old caches.
const brandFavicon="\n<!-- AKKIGO STABLE FAVICON: retain this URL across theme builds. -->\n<link rel='icon' type='image/x-icon' href='https://lsifl.blogspot.com/favicon.ico?v=akkigo-20261009-2'/>\n";
const faviconNormalize="<script type='text/javascript'>//<![CDATA[\n(function(){var icons=document.querySelectorAll('link[rel=icon]');for(var i=0;i<icons.length;i++){if(i<icons.length-1){icons[i].remove();}}})();\n//]]></script>\n";
const directoryBadges=await readFile(new URL('theme/directory-badges.xml',root),'utf8');
const naverAnalytics=await readFile(new URL('theme/naver-analytics.xml',root),'utf8');
await writeFile(new URL('akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml',root),output.replace('</head>',identityMount+brandFavicon+faviconNormalize+'</head>').replace('</body>',seoFallback+naverAnalytics+directoryBadges+'</body>'));
console.log('R3 theme generated using native Blogger widget base.');
