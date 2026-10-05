/* NUTRIMENTS Coupon UI R3 — Blogger Edition */
(() => {
  const root = document.querySelector('[data-ncp-page]');
  if (!root) return;

  const toast = document.querySelector('[data-ncp-toast]');
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.hidden = true, 1800);
  };

  document.addEventListener('click', async (e) => {
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      const code = copy.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(code);
        showToast(`${code} 복사됨`);
        const before = copy.textContent;
        copy.textContent = '복사됨';
        setTimeout(() => copy.textContent = before, 1200);
      } catch {
        showToast('복사에 실패했습니다');
      }
    }

    const filter = e.target.closest('[data-filter]');
    if (filter) {
      document.querySelectorAll('[data-filter]').forEach(x => x.classList.remove('active'));
      filter.classList.add('active');
      const key = filter.dataset.filter;
      document.querySelectorAll('[data-offer]').forEach(card => {
        const tags = (card.dataset.tags || '').split(',');
        card.hidden = key !== 'ALL' && !tags.includes(key);
      });
    }
  });

  const calcBtn = document.querySelector('[data-calc]');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const amount = Number(document.querySelector('[data-amount]')?.value || 0);
      const member = document.querySelector('[data-member]')?.value || 'ALL';
      const platform = document.querySelector('[data-platform]')?.value || 'WEB';

      const candidates = [...document.querySelectorAll('[data-offer]')].map(el => {
        const min = Number(el.dataset.min || 0);
        const rate = Number(el.dataset.rate || 0);
        const cap = Number(el.dataset.cap || 0);
        const eligibleMember = !el.dataset.member || el.dataset.member === 'ALL' || el.dataset.member === member;
        const eligiblePlatform = !el.dataset.platform || el.dataset.platform === 'ALL' || el.dataset.platform === platform;
        const eligible = amount >= min && eligibleMember && eligiblePlatform;
        const saving = eligible ? Math.min(Math.floor(amount * rate / 100), cap || Infinity) : -1;
        return { el, saving, eligible };
      }).filter(x => x.eligible);

      candidates.sort((a,b) => b.saving - a.saving);
      const best = candidates[0];
      const out = document.querySelector('[data-result]');
      if (!out) return;

      if (!best) {
        out.innerHTML = '<div><strong>현재 조건에서 사용 가능한 쿠폰이 없습니다.</strong><span>회원/플랫폼 조건을 바꿔 확인해보세요.</span></div>';
        return;
      }

      const name = best.el.querySelector('[data-offer-name]')?.textContent.trim() || '추천 쿠폰';
      out.innerHTML = `<div><strong>${best.saving.toLocaleString('ko-KR')}원 절약 예상</strong><span>${name}이 현재 입력 조건에서 가장 유리합니다.</span></div><button class="ncp-btn soft">비교표 보기</button>`;
    });
  }
})();
