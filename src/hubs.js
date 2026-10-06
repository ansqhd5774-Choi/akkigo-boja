import {renderHub,escapeHtml} from './coupons.js';

export const hubs = {
  zeus:'제우스: 오만의 신',
  lineagem:'리니지M',
  wuthering:'명조:워더링 웨이브'
};

const featuredMedia = {
  wuthering:`<figure data-ncp-featured-image="wuthering" style="margin:0 0 24px"><img src="https://wutheringwaves.kurogames.com/website-preface/video/bg/bg-poster.webp" alt="명조: 워더링 웨이브 공식 대표 이미지" loading="eager" decoding="async" style="display:block;width:100%;height:auto;border-radius:14px"></figure>`,
  lineagem:`<figure data-ncp-featured-image="lineagem" style="margin:0 0 24px"><img src="https://assets.playnccdn.com/resource/lineagem/meta/sns171017.jpg" alt="리니지M 공식 대표 이미지" loading="eager" decoding="async" style="display:block;width:100%;height:auto;border-radius:14px"></figure>`,
  zeus:`<figure data-ncp-featured-image="zeus" style="margin:0 0 24px"><img src="https://zeuscommunity-fn.com2us.com/zeuscommunity/public/common/og/og_default.jpg" alt="제우스: 오만의 신 공식 대표 이미지" loading="eager" decoding="async" style="display:block;width:100%;height:auto;border-radius:14px"></figure>`
};

const guides = {
  zeus:`<section><h2>쿠폰 입력 방법</h2><ol><li><a href="https://coupon.withhive.com/2352" rel="noopener noreferrer">제우스 공식 쿠폰 등록</a>을 엽니다.</li><li>사용 중인 서버를 선택하고 게임 설정에서 확인한 CS Code를 입력합니다.</li><li>보유한 쿠폰 번호를 입력한 뒤 등록합니다. 서버와 계정을 먼저 확인하세요.</li><li>게임 내 우편함에서 보상을 확인합니다. 네트워크 상태에 따라 지급이 지연될 수 있습니다.</li></ol><p>이미 사용한 쿠폰은 다시 등록할 수 없습니다. CS Code나 개인 쿠폰 번호를 댓글에 남기지 마세요.</p></section>`,
  lineagem:`<section><h2>쿠폰 입력 방법</h2><ol><li><a href="https://nshop.plaync.com/shop/lms/kr/coupon" rel="noopener noreferrer">리니지M 공식 쿠폰 등록</a>을 엽니다. 로그인하면 보유 캐릭터를 확인할 수 있습니다.</li><li>화면의 선택 항목과 닉네임을 확인하고 보유한 쿠폰 번호를 입력합니다.</li><li>등록 전 대상 캐릭터와 등록기한을 확인합니다.</li><li>등록 완료 후 게임 내 인벤토리에서 지급된 보상을 확인합니다.</li></ol><p>이미 사용한 쿠폰은 재등록할 수 없으며 계정당 종류별 한 개만 등록할 수 있습니다. 개인별 발급 쿠폰은 공용 코드와 구분하세요.</p></section>`,
  wuthering:`<section><h2>쿠폰 입력 안내</h2><p>현재 공식 근거로 확인한 입력 경로가 없습니다. 확인 전까지 메뉴 위치나 사용 가능한 코드를 안내하지 않습니다.</p><p><a href="https://wutheringwaves.kurogames.com/en/main" rel="noopener noreferrer">명조 공식 홈페이지</a>에서 공지와 고객지원을 확인하세요.</p></section>`
};

function rewardText(coupon) {
  return coupon.rewards.map(r=>`${escapeHtml(r.name)} ${escapeHtml(r.quantity)}개`).join(' · ');
}

function zeusStyles() {
  return `<style>
.ncp-feed-preview{display:none!important}
[data-ncp-hub="zeus"]{--ink:#1f2937;--muted:#667085;--line:#e5e7eb;--soft:#f8fafc;--brand:#2563eb;--brand-dark:#1d4ed8;--ok:#067647;--ok-bg:#ecfdf3;color:var(--ink);font-size:16px;line-height:1.7}
[data-ncp-hub="zeus"] *{box-sizing:border-box}
[data-ncp-hub="zeus"] .ncp-hero{margin:0 0 28px;padding-bottom:22px;border-bottom:1px solid var(--line)}
[data-ncp-hub="zeus"] h1{margin:0 0 12px;font-size:clamp(28px,4vw,38px);line-height:1.22;letter-spacing:-.035em}
[data-ncp-hub="zeus"] h2{margin:34px 0 14px;font-size:24px;line-height:1.35;letter-spacing:-.025em}
[data-ncp-hub="zeus"] h3{margin:0 0 12px;font-size:18px;line-height:1.4}
[data-ncp-hub="zeus"] p{margin:0 0 14px}
[data-ncp-hub="zeus"] .ncp-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 12px;color:var(--muted);font-size:14px}
[data-ncp-hub="zeus"] .ncp-meta-badge{display:inline-flex;align-items:center;padding:4px 9px;border:1px solid var(--line);border-radius:999px;background:#fff;font-weight:700;color:#475467}
[data-ncp-hub="zeus"] .ncp-lead{font-size:17px;color:#344054}
[data-ncp-hub="zeus"] .ncp-quickbar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 28px}
[data-ncp-hub="zeus"] .ncp-quickitem{display:flex;min-height:64px;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:#fff;text-decoration:none!important;color:#101828!important}
[data-ncp-hub="zeus"] .ncp-quickitem strong{font-size:15px}
[data-ncp-hub="zeus"] .ncp-quickitem span{font-size:13px;color:var(--muted)}
[data-ncp-hub="zeus"] .ncp-quicknum{font-size:20px!important;font-weight:900!important;color:var(--ok)!important}
[data-ncp-hub="zeus"] .ncp-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:34px 0 14px}
[data-ncp-hub="zeus"] .ncp-section-head h2{margin:0}
[data-ncp-hub="zeus"] .ncp-count{display:inline-flex;min-width:28px;height:28px;align-items:center;justify-content:center;border-radius:999px;background:var(--ok-bg);color:var(--ok);font-size:13px;font-weight:800}
[data-ncp-hub="zeus"] .ncp-count-muted{background:#f2f4f7;color:#667085}
[data-ncp-hub="zeus"] .ncp-coupon-card{border:1px solid #d0d5dd;border-radius:16px;background:#fff;box-shadow:0 6px 18px rgba(16,24,40,.06);overflow:hidden}
[data-ncp-hub="zeus"] .ncp-coupon-card+.ncp-coupon-card{margin-top:14px}
[data-ncp-hub="zeus"] .ncp-coupon-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:20px 20px 14px}
[data-ncp-hub="zeus"] .ncp-label{display:block;margin-bottom:5px;color:var(--muted);font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
[data-ncp-hub="zeus"] .ncp-code{display:inline-block;font:800 22px/1.25 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-wrap:anywhere;color:#101828;background:#f2f4f7;padding:7px 10px;border-radius:8px}
[data-ncp-hub="zeus"] .ncp-copy-wrap{display:flex;min-width:112px;flex-direction:column;gap:6px;align-items:stretch}
[data-ncp-hub="zeus"] .ncp-copy{min-height:44px;padding:0 17px;border:1px solid #98a2b3;border-radius:10px;background:#fff;color:#344054;font-weight:800;cursor:pointer}
[data-ncp-hub="zeus"] .ncp-copy-state{display:inline-flex;align-items:center;justify-content:center;min-height:24px;color:var(--ok);font-size:13px;font-weight:700;text-align:center}
[data-ncp-hub="zeus"] .ncp-coupon-info{display:grid;grid-template-columns:1.35fr 1fr;border-top:1px solid var(--line)}
[data-ncp-hub="zeus"] .ncp-info-cell{padding:15px 20px}
[data-ncp-hub="zeus"] .ncp-info-cell+.ncp-info-cell{border-left:1px solid var(--line)}
[data-ncp-hub="zeus"] .ncp-info-value{font-weight:750;color:#101828}
[data-ncp-hub="zeus"] .ncp-note{margin:0;padding:12px 20px;border-top:1px solid var(--line);background:#f5f8ff;color:#344054}
[data-ncp-hub="zeus"] .ncp-actions{display:flex;gap:10px;flex-wrap:wrap;padding:16px 20px 20px;border-top:1px solid var(--line);background:var(--soft)}
[data-ncp-hub="zeus"] .ncp-btn{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:0 18px;border-radius:10px;text-decoration:none!important;font-weight:800}
[data-ncp-hub="zeus"] .ncp-btn-primary{background:var(--brand);color:#fff!important}
[data-ncp-hub="zeus"] .ncp-step-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
[data-ncp-hub="zeus"] .ncp-step-card{border:1px solid var(--line);border-radius:14px;padding:18px;background:#fff}
[data-ncp-hub="zeus"] .ncp-step-card ol{margin:0;padding-left:20px}
[data-ncp-hub="zeus"] .ncp-help-list{margin:0;padding:0;list-style:none;border:1px solid var(--line);border-radius:12px;overflow:hidden}
[data-ncp-hub="zeus"] .ncp-help-list li{padding:13px 16px;background:#fff}
[data-ncp-hub="zeus"] .ncp-help-list li+li{border-top:1px solid var(--line)}
[data-ncp-hub="zeus"] .ncp-link-list{display:grid;gap:10px}
[data-ncp-hub="zeus"] .ncp-link-card{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:#fff;text-decoration:none!important;color:#101828!important;font-weight:750}
[data-ncp-hub="zeus"] .ncp-link-card span{color:var(--muted);font-size:13px;font-weight:600}
[data-ncp-hub="zeus"] .ncp-faq{border-top:1px solid var(--line)}
[data-ncp-hub="zeus"] .ncp-faq details{border-bottom:1px solid var(--line)}
[data-ncp-hub="zeus"] .ncp-faq summary{cursor:pointer;padding:15px 2px;font-weight:800}
[data-ncp-hub="zeus"] .ncp-faq details p{padding:0 2px 15px;color:#475467}
@media(max-width:640px){
[data-ncp-hub="zeus"]{font-size:15px}
[data-ncp-hub="zeus"] h1{font-size:29px}
[data-ncp-hub="zeus"] h2{font-size:22px}
[data-ncp-hub="zeus"] .ncp-quickbar,[data-ncp-hub="zeus"] .ncp-step-grid{grid-template-columns:1fr}
[data-ncp-hub="zeus"] .ncp-coupon-top,[data-ncp-hub="zeus"] .ncp-coupon-info{grid-template-columns:1fr}
[data-ncp-hub="zeus"] .ncp-copy-wrap,[data-ncp-hub="zeus"] .ncp-copy{width:100%}
[data-ncp-hub="zeus"] .ncp-info-cell+.ncp-info-cell{border-left:0;border-top:1px solid var(--line)}
[data-ncp-hub="zeus"] .ncp-btn{width:100%}
}
</style>`;
}

function zeusCouponCard(coupon,{ended=false,extra=false}={}) {
  const expiry=ended ? '2026년 10월 4일 23:59 종료' : extra ? '외부 추적 표기: 2026년 12월 31일' : '공식 종료일 미확인';
  const note=ended
    ? '10월 2일 개발자 라이브에서 공개된 코드입니다. 종료일이 지났지만 기록과 재확인용으로 남겨둡니다.'
    : extra
      ? '외부 쿠폰 추적 페이지에서 1명만 사용 가능한 웰컴 코드로 표시됩니다. 이미 사용됐다면 등록되지 않을 수 있습니다.'
      : '10월 5일 한 계정에서 등록 성공 및 보상 수령 사례가 있습니다. 공식 종료일은 확인되지 않아 먼저 입력해 보는 코드로 안내합니다.';
  return `<div class="ncp-coupon-card">
    <div class="ncp-coupon-top">
      <div><span class="ncp-label">${ended?'최근 종료 코드':extra?'추가 입력 시도 코드':'사용 확인 쿠폰'}</span><code class="ncp-code">${escapeHtml(coupon.code)}</code></div>
      <div class="ncp-copy-wrap"><button class="ncp-copy" type="button" data-ncp-copy="${escapeHtml(coupon.code)}" aria-label="${escapeHtml(coupon.code)} 제우스 쿠폰 복사">복사</button><span class="ncp-copy-state" role="status" aria-live="polite"></span></div>
    </div>
    <div class="ncp-coupon-info">
      <div class="ncp-info-cell"><span class="ncp-label">보상</span><div class="ncp-info-value">${rewardText(coupon)}</div></div>
      <div class="ncp-info-cell"><span class="ncp-label">기한</span><div class="ncp-info-value">${expiry}</div></div>
    </div>
    <p class="ncp-note">${note}</p>
    <div class="ncp-actions"><a class="ncp-btn ncp-btn-primary" href="https://coupon.withhive.com/2352" rel="noopener noreferrer">공식 쿠폰 입력 페이지 열기</a></div>
  </div>`;
}

function buildZeusModern(coupons, manual) {
  const ended=coupons.filter(c=>c.brand===hubs.zeus && c.status==='EXPIRED' && ['ZEUS1002LIVE','ZEUS1002GIFT'].includes(c.code));
  const extras=coupons.filter(c=>c.brand===hubs.zeus && c.status==='UNVERIFIED' && ['6RYFJ242','AVG768Y1'].includes(c.code));
  const primary=manual.filter(c=>c.code==='DEVLIVE0911');
  if (!primary.length && !ended.length && !extras.length) return null;
  return `<div class="ncp-feed-preview" data-ncp-feed-preview aria-label="제우스 오만의 신 쿠폰 요약">
  <div class="ncp-feed-stat"><span>우선 시도</span><strong>${primary.length}개</strong></div>
  <div class="ncp-feed-stat"><span>추가 시도</span><strong>${extras.length}개</strong></div>
  <div class="ncp-feed-stat"><span>최근 종료</span><strong>${ended.length}개</strong></div>
</div>
<!--more-->
<div data-ncp-hub="zeus">
${zeusStyles()}
${featuredMedia.zeus}
<header class="ncp-hero">
  <div class="ncp-meta"><span class="ncp-meta-badge">2026년 10월</span><span>마지막 업데이트 2026-10-07</span></div>
  <h1>제우스: 오만의 신 쿠폰 코드 모음 (2026년 10월) | 입력 방법·보상</h1>
  <p class="ncp-lead">현재 바로 입력해 볼 코드, 최근 종료된 라이브 코드, 상품에서 개별 발급되는 공식 콜라보 쿠폰을 구분해 정리했습니다. 실패 가능성이 있는 코드는 숨기지 않고 상태를 함께 표시합니다.</p>
</header>
<nav class="ncp-quickbar" aria-label="제우스 쿠폰 빠른 이동">
  <a class="ncp-quickitem" href="#ncp-zeus-try"><span><strong>우선 시도</strong><br>최근 수령 사례</span><span class="ncp-quicknum">${primary.length}</span></a>
  <a class="ncp-quickitem" href="#ncp-zeus-ended"><span><strong>최근 종료</strong><br>10월 라이브</span><span class="ncp-quicknum">${ended.length}</span></a>
  <a class="ncp-quickitem" href="https://coupon.withhive.com/2352" rel="noopener noreferrer"><span><strong>공식 입력</strong><br>HIVE 교환소</span><span>열기 →</span></a>
</nav>

<section id="ncp-zeus-try">
  <div class="ncp-section-head"><h2>먼저 입력해 볼 쿠폰</h2><span class="ncp-count">${primary.length}</span></div>
  ${primary.map(c=>zeusCouponCard(c)).join('')}
</section>

${extras.length?`<section>
  <div class="ncp-section-head"><h2>추가로 시도할 수 있는 코드</h2><span class="ncp-count">${extras.length}</span></div>
  <p>아래 두 코드는 외부 최신 추적 페이지에서 <strong>1명만 사용 가능한 웰컴 코드</strong>로 표시됩니다. 이미 다른 사람이 사용했으면 실패할 수 있지만, 입력 자체는 시도해 볼 수 있습니다.</p>
  ${extras.map(c=>zeusCouponCard(c,{extra:true})).join('')}
</section>`:''}

<section id="ncp-zeus-ended">
  <div class="ncp-section-head"><h2>10월 최근 종료 쿠폰</h2><span class="ncp-count ncp-count-muted">${ended.length}</span></div>
  ${ended.map(c=>zeusCouponCard(c,{ended:true})).join('')}
</section>

<section id="ncp-how">
  <h2>제우스 쿠폰 입력 방법</h2>
  <div class="ncp-step-grid">
    <div class="ncp-step-card"><h3>공식 웹에서 입력</h3><ol>
      <li>게임 설정에서 <strong>CS Code</strong>를 확인합니다.</li>
      <li><a href="https://coupon.withhive.com/2352" rel="noopener noreferrer">제우스 공식 HIVE 쿠폰 등록</a>을 엽니다.</li>
      <li>서버와 CS Code를 입력합니다.</li>
      <li>쿠폰 코드를 붙여넣고 등록합니다.</li>
      <li>게임 내 우편함에서 보상을 확인합니다.</li>
    </ol></div>
    <div class="ncp-step-card"><h3>게임에서 입력</h3><ol>
      <li>게임 메뉴에서 <strong>환경설정</strong>을 엽니다.</li>
      <li><strong>계정 → 쿠폰 등록</strong>으로 이동합니다.</li>
      <li>쿠폰 번호를 입력합니다.</li>
      <li>등록 후 우편함에서 보상을 확인합니다.</li>
    </ol><p>이마트24 공식 이벤트도 같은 게임 내 경로를 안내합니다.</p></div>
  </div>
</section>

<section>
  <h2>지금 받을 수 있는 개별 발급 쿠폰</h2>
  <ul class="ncp-help-list">
    <li><strong>이마트24 e24 코인 쿠폰</strong> — 콜라보 상품에 동봉된 개별 번호. 2026년 11월 25일 23:59까지 등록 가능하며 계정당 횟수 제한 없이 중복 등록할 수 있습니다.</li>
    <li><strong>새싹보리 럭키보리 쿠폰</strong> — 콜라보 상품 라벨의 개별 번호. 2026년 12월 3일 23:59까지 등록할 수 있습니다.</li>
  </ul>
  <p>이 두 종류는 인터넷에 공개된 공용 문자열이 아니라 상품에서 각각 발급되는 쿠폰입니다.</p>
</section>

<section><h2>쿠폰이 안 될 때 확인</h2><ul class="ncp-help-list">
  <li><code>ZEUS1002LIVE</code>와 <code>ZEUS1002GIFT</code>는 안내된 10월 4일 23:59 기한이 지났습니다.</li>
  <li><code>DEVLIVE0911</code>은 공식 종료일을 확인하지 못했으므로 실제 등록 결과를 우선하세요.</li>
  <li>웰컴 코드는 1명 제한으로 추적되어 이미 사용된 경우 실패할 수 있습니다.</li>
  <li>웹 등록에서는 서버와 CS Code가 맞는지 확인하세요.</li>
  <li>코드 앞뒤에 공백이 붙지 않았는지 확인하세요.</li>
  <li>보상이 바로 보이지 않으면 게임 내 우편함을 다시 확인하세요.</li>
</ul></section>

<section><h2>출처</h2><div class="ncp-link-list">
  <a class="ncp-link-card" href="https://zeus.com2us.com/p/8746aaf1-3391-478d-a8bf-6a495da0801c" rel="noopener noreferrer">10월 2일 개발자 라이브 공식 공지 <span>공식 →</span></a>
  <a class="ncp-link-card" href="https://www.gamevu.co.kr/news/articleView.html?idxno=61201" rel="noopener noreferrer">10월 2일 라이브 쿠폰 코드 보도 <span>코드 확인 →</span></a>
  <a class="ncp-link-card" href="https://zeus.com2us.com/events/emart24" rel="noopener noreferrer">제우스 × 이마트24 공식 이벤트 <span>공식 →</span></a>
  <a class="ncp-link-card" href="https://zeus.com2us.com/p/56ce04aa-99ce-455a-ba45-84a5fc88678d" rel="noopener noreferrer">제우스 × 컨디션·새싹보리 공식 이벤트 <span>공식 →</span></a>
  <a class="ncp-link-card" href="https://coupon.withhive.com/2352" rel="noopener noreferrer">제우스 공식 쿠폰 등록 <span>입력 →</span></a>
</div></section>

<section><h2>자주 묻는 질문</h2><div class="ncp-faq">
  <details><summary>2026년 10월 7일 기준 먼저 입력해 볼 코드는 무엇인가요?</summary><p><code>DEVLIVE0911</code>은 10월 5일 등록 성공 및 보상 수령 사례가 있어 우선 시도 코드로 남겨두었습니다. 공식 종료일은 확인되지 않았습니다.</p></details>
  <details><summary>ZEUS1002LIVE와 ZEUS1002GIFT도 입력해 봐도 되나요?</summary><p>두 코드는 10월 4일 23:59 종료로 안내됐습니다. 종료 기록으로 분리했지만 코드는 남겨두어 직접 입력해 볼 수 있습니다.</p></details>
  <details><summary>이마트24·새싹보리 쿠폰 번호는 왜 적혀 있지 않나요?</summary><p>공용 코드가 아니라 구매한 상품에 각각 들어 있는 개별 쿠폰 번호이기 때문입니다.</p></details>
</div></section>
</div>`;
}

export function buildHubDraft(hubKey, coupons = []) {
  const brand=hubs[hubKey];
  if (!Object.hasOwn(hubs,hubKey)) throw new Error('UNKNOWN_HUB');
  const manual=coupons.filter(c=>c.brand===brand && c.status==='UNVERIFIED' && c.verificationResult==='SUCCESS');
  if (hubKey==='zeus') {
    const modern=buildZeusModern(coupons,manual);
    if (modern) return {
      title:'제우스: 오만의 신 쿠폰 코드 모음 (2026년 10월) | 입력 방법·보상',
      content:modern,
      labels:['게임',brand]
    };
  }
  const featured=featuredMedia[hubKey] || '';
  const observations=manual.length ? `<section><h2>사용 확인 쿠폰</h2>${manual.map(c=>`<p><code>${escapeHtml(c.code)}</code> · 등록 성공 및 보상 수령 사례가 있습니다.</p><p>서버 범위·전체 계정 조건·만료일은 확인되지 않았습니다.</p><p><a href="${escapeHtml(c.sourceUrl)}" rel="noopener noreferrer">공식 쿠폰 공지</a></p>`).join('')}</section>` : '';
  return {
    title:`${brand} 쿠폰·입력 방법`,
    content:`<div data-ncp-hub="${hubKey}">${featured}${renderHub(brand,coupons)}${observations}${guides[hubKey]}</div>`,
    labels:['게임',brand]
  };
}
