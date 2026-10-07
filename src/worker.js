import {gameHearts} from './game-hearts.js';
import {couponCatalog} from './coupon-lifecycle.js';
import coupons from '../data/coupons.json' with { type: 'json' };
import articles from '../data/articles.json' with { type: 'json' };
import supplementalArticles from '../data/articles-supplemental.json' with { type: 'json' };
import { bloggerConfigured } from './blogger.js';
import { collectSources } from './collector.js';
import { listUnverifiedCandidates } from './candidates.js';
import { updateStoredHub, createStoredDraft, reconcileDraft, publishStoredHub } from './publisher.js';
import { buildHubDraft } from './hubs.js';
import { publishApprovedArticle } from './articles.js';
import {articleSnapshot} from './article-snapshot.js';
import { verifyGitHubOidc } from './github-oidc.js';

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname.length>1 ? requestUrl.pathname.replace(/\/+$/,'') : requestUrl.pathname;
    if(path==='/games/hearts'){try{return await gameHearts(request,env);}catch{return Response.json({error:'HEART_STORAGE_FAILED'},{status:503,headers:{'Access-Control-Allow-Origin':'https://lsifl.blogspot.com'}});}}
    if (path === '/coupons/catalog' && request.method === 'GET') {
      return Response.json(couponCatalog(coupons),{headers:{'Cache-Control':'no-store','Access-Control-Allow-Origin':'https://lsifl.blogspot.com'}});
    }
    if (path === '/internal/articles/preflight' && request.method === 'POST') {
      try { await verifyGitHubOidc(request); } catch { return new Response('Unauthorized',{status:401}); }
      let input;
      try {input=await request.json();}catch{return Response.json({error:'INVALID_JSON'},{status:400});}
      try {return Response.json(await articleSnapshot(input.articleKey,[...articles,...supplementalArticles]),{headers:{'Cache-Control':'no-store'}});}
      catch{return Response.json({error:'INVALID_ARTICLE_KEY'},{status:400});}
    }
    if (path === '/internal/articles/publish' && request.method === 'POST') {
      try {
        await verifyGitHubOidc(request);
      } catch {
        return new Response('Unauthorized',{status:401});
      }
      let input;
      try { input=await request.json(); } catch { return Response.json({error:'INVALID_JSON'},{status:400}); }
      try {
        const source=await articleSnapshot(input.articleKey,[...articles,...supplementalArticles]);
        if(!source.approved || source.postSha256!==input.postSha256)throw new Error('ARTICLE_SNAPSHOT_MISMATCH');
        const result=await publishApprovedArticle(env,input.articleKey,[...articles,...supplementalArticles]);
        return Response.json(result,{headers:{'Cache-Control':'no-store'}});
      } catch (error) {
        const code=String(error?.message || 'ARTICLE_PUBLISH_FAILED').slice(0,120);
        return Response.json({error:code},{status:409});
      }
    }
    if (path === '/internal/hubs/refresh' && request.method === 'POST') {
      try {
        await verifyGitHubOidc(request);
      } catch {
        return new Response('Unauthorized',{status:401});
      }
      if (env.PUBLISH_ENABLED !== 'true') return Response.json({error:'PUBLISH_DISABLED'},{status:409});
      let input;
      try {input=await request.json();} catch {return Response.json({error:'INVALID_JSON'},{status:400});}
      try {
        const post=buildHubDraft(input.hubKey,coupons);
        return Response.json(await updateStoredHub(env,input.hubKey,post),{headers:{'Cache-Control':'no-store'}});
      } catch (error) {
        const code=String(error?.message || 'HUB_REFRESH_FAILED').slice(0,120);
        return Response.json({error:code},{status:409});
      }
    }
    if (path === '/internal/candidates' && request.method === 'GET') {
      if (!env.ADMIN_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return new Response('Unauthorized',{status:401});
      try {
        const candidates=await listUnverifiedCandidates(env,{
          sourceId:requestUrl.searchParams.get('sourceId') || undefined,
          limit:requestUrl.searchParams.get('limit') || 50
        });
        return Response.json({candidates},{headers:{'Cache-Control':'no-store'}});
      } catch (error) {
        const known=['INVALID_CANDIDATE_LIMIT','INVALID_SOURCE_ID'];
        const code=known.includes(error?.message) ? error.message : 'CANDIDATE_READ_FAILED';
        return Response.json({error:code},{status:known.includes(code)?400:409});
      }
    }
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
  async scheduled(event, env, ctx) {ctx.waitUntil(collectSources(env,fetch,{trigger:'SCHEDULED',scheduledAt:new Date(event.scheduledTime).toISOString()}));}
};
