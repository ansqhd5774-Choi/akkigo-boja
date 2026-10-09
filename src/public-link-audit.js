export function safeInternalTarget(value, base) {
  try {
    const url = new URL(value, base);
    if (url.origin !== new URL(base).origin || url.username || url.password) return null;
    if (url.search && !/^\?(?:m=[01])$/.test(url.search)) return null;
    if (!/^\/$|^\/p\/[^/]+\.html$|^\/\d{4}\/\d{2}\/[^/]+\.html$|^\/search\/label\//.test(url.pathname)) return null;
    url.hash = '';
    return url.href;
  } catch { return null; }
}

export function bodySignals(html, url) {
  const isPost = /\/\d{4}\/\d{2}\/[^/]+\.html$/.test(new URL(url).pathname);
  const body = /\bid=["']post-body-\d+["']/.test(html);
  const errorText = /(?:죄송합니다[^<]{0,80}(?:찾을 수|존재하지)|Sorry,?[^<]{0,80}(?:does not exist|not found)|404[^<]{0,40}Page Not Found)/i.test(html.replace(/<script\b[\s\S]*?<\/script>/gi, ''));
  return {isPost, postBodyPresent: body, soft404Candidate: isPost && (!body || errorText)};
}
