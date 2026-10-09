// Optional adapter. No network, storage, page_view, URL, code or user identity is collected here.
(function(){
  if(window.ncpAnalyticsInstalled)return;
  window.ncpAnalyticsInstalled=true;
  const names=new Set(['coupon_copy','share','redeem_outbound']);
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a.ncp-detail-register,a[data-ncp-redeem]');
    if(!link||event.defaultPrevented)return;
    try{
      const target=new URL(link.href,location.href);
      if(target.protocol!=='https:'||target.origin===location.origin)return;
      window.dispatchEvent(new CustomEvent('ncp:action',{detail:{name:'redeem_outbound',method:'link',outcome:'click'}}));
    }catch{}
  });
  window.addEventListener('ncp:action',event=>{
    const detail=event.detail||{};
    if(!names.has(detail.name)||detail.outcome!==(detail.name==='redeem_outbound'?'click':'success'))return;
    // The site's consent controller must explicitly grant analytics; no inferred consent.
    if(window.ncpAnalyticsConsent!=='granted'||window.ncpAnalyticsEnabled!==true)return;
    if(window.ncpAnalyticsInternalTraffic===true||navigator.globalPrivacyControl===true)return;
    if(typeof window.gtag!=='function')return;
    // Disable inherited default page URL/title/referrer, which can contain user input.
    try{window.gtag('event',detail.name,{
      outcome:detail.name==='redeem_outbound'?'click':'success',
      method:detail.name==='redeem_outbound'?'link':detail.method==='native'?'native':'clipboard',
      page_location:location.origin+(/^\/\d{4}\/\d{2}\/[a-z0-9_-]+\.html$/i.test(location.pathname)?location.pathname:'/'),
      page_referrer:'',page_title:'',
      non_interaction:false
    });}catch{}
  });
})();
