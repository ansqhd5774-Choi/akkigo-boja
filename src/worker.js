import coupons from '../data/coupons.json' with { type: 'json' };
import { bloggerConfigured } from './blogger.js';
import { collectSources } from './collector.js';
import { updateStoredHub, createStoredDraft, reconcileDraft, publishStoredHub } from './publisher.js';

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (['/internal/hubs/create','/internal/hubs/reconcile','/internal/hubs/publish'].includes(path) && request.method === 'POST') {
      if (!env.ADMIN_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return new Response('Unauthorized',{status:401});
      if (env.PUBLISH_ENABLED !== 'true') return Response.json({error:'PUBLISH_DISABLED'},{status:409});
      let input;
      try {input = await request.json();} catch {return Response.json({error:'INVALID_JSON'},{status:400});}
      try {
        return Response.json(path.endsWith('/create')
          ? await createStoredDraft(env,input.hubKey,coupons)
          : path.endsWith('/publish') ? await publishStoredHub(env,input.hubKey,coupons)
          : await reconcileDraft(env,input.hubKey));
      } catch {return Response.json({error:'HUB_NOT_COMPLETED_CHECK_STATE'},{status:409});}
    }
    if (path === '/internal/hubs/update' && request.method === 'POST') {
      if (!env.ADMIN_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return new Response('Unauthorized',{status:401});
      if (env.PUBLISH_ENABLED !== 'true') return Response.json({error:'PUBLISH_DISABLED'},{status:409});
      let input;
      try {input = await request.json();} catch {return Response.json({error:'INVALID_JSON'},{status:400});}
      try {return Response.json(await updateStoredHub(env,input.hubKey,input.post));}
      catch {return Response.json({error:'PUBLISH_NOT_COMPLETED_CHECK_STATE'},{status:409});}
    }
    if (path === '/internal/collect' && request.method === 'POST') {
      if (!env.ADMIN_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return new Response('Unauthorized',{status:401});
      return Response.json({observations:await collectSources(env)});
    }
    if (request.method !== 'GET') return new Response('Method not allowed', {status:405});
    if (path !== '/health' && path !== '/') return new Response('Not found', {status:404});
    return Response.json({
      service:'akkigo-boja', status:'READY', blogUrl:env.BLOGGER_PUBLIC_URL,
      couponCount:coupons.length, unverifiedCouponCount:coupons.filter(c=>c.status==='UNVERIFIED').length,
      publishing:env.PUBLISH_ENABLED === 'true' ? 'ENABLED' : 'DISABLED', collection:'SOURCE_OBSERVATION_ONLY',
      stateStorage:env.DB ? 'D1_BOUND' : 'MISSING',
      oauthConfigured:bloggerConfigured(env)
    }, {headers:{'Cache-Control':'no-store'}});
  },
  async scheduled(event, env, ctx) {ctx.waitUntil(collectSources(env));}
};
