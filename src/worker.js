import coupons from '../data/coupons.json' with { type: 'json' };
import { bloggerConfigured } from './blogger.js';

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (request.method !== 'GET') return new Response('Method not allowed', {status:405});
    if (path !== '/health' && path !== '/') return new Response('Not found', {status:404});
    return Response.json({
      service:'akkigo-boja', status:'READY', blogUrl:env.BLOGGER_PUBLIC_URL,
      couponCount:coupons.length, publishing:'DISABLED', collection:'NOT_CONFIGURED',
      oauthConfigured:bloggerConfigured(env)
    }, {headers:{'Cache-Control':'no-store'}});
  }
};
