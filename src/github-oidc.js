const ISSUER='https://token.actions.githubusercontent.com';
const JWKS='https://token.actions.githubusercontent.com/.well-known/jwks';
const AUDIENCE='akkigo-boja-publish';
const REPOSITORY='ansqhd5774-Choi/akkigo-boja';
const REF='refs/heads/codex/blogger-worker-r1';
const WORKFLOW_REF='ansqhd5774-Choi/akkigo-boja/.github/workflows/publish-article.yml@refs/heads/codex/blogger-worker-r1';

function decodePart(value) {
  const base64=value.replace(/-/g,'+').replace(/_/g,'/');
  const padded=base64+'='.repeat((4-base64.length%4)%4);
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded),c=>c.charCodeAt(0))));
}

function signatureBytes(value) {
  const base64=value.replace(/-/g,'+').replace(/_/g,'/');
  const padded=base64+'='.repeat((4-base64.length%4)%4);
  return Uint8Array.from(atob(padded),c=>c.charCodeAt(0));
}

function audOk(aud) {
  return aud===AUDIENCE || (Array.isArray(aud) && aud.includes(AUDIENCE));
}

export async function verifyGitHubOidc(request, transport=fetch) {
  const auth=request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) throw new Error('OIDC_MISSING');
  const token=auth.slice(7);
  const parts=token.split('.');
  if (parts.length!==3) throw new Error('OIDC_INVALID');
  const header=decodePart(parts[0]);
  const claims=decodePart(parts[1]);
  if (header.alg!=='RS256' || typeof header.kid!=='string') throw new Error('OIDC_HEADER_INVALID');
  const now=Math.floor(Date.now()/1000);
  if (claims.iss!==ISSUER || !audOk(claims.aud) || claims.repository!==REPOSITORY || claims.ref!==REF || claims.workflow_ref!==WORKFLOW_REF) throw new Error('OIDC_CLAIMS_INVALID');
  if (!Number.isFinite(claims.exp) || claims.exp < now || !Number.isFinite(claims.iat) || claims.iat > now+60) throw new Error('OIDC_TIME_INVALID');
  const response=await transport(JWKS,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('OIDC_JWKS_FAILED');
  const jwks=await response.json();
  const jwk=(jwks.keys || []).find(x=>x.kid===header.kid && x.kty==='RSA');
  if (!jwk) throw new Error('OIDC_KEY_NOT_FOUND');
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const ok=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,signatureBytes(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
  if (!ok) throw new Error('OIDC_SIGNATURE_INVALID');
  return {repository:claims.repository,sha:claims.sha,runId:claims.run_id};
}
