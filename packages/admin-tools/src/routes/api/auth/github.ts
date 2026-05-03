import type { APIRoute } from 'astro';
import { sessionCookieFlags } from '../../../server/session.js';
import { sitePathUrl } from '../../../server/paths.js';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

/** `repo` is required for collaborator checks and future Contents API writes on private repos. */
const OAUTH_SCOPE = 'read:user repo';

export const GET: APIRoute = ({ request }) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Server misconfiguration', {
      status: 500,
      headers: NO_STORE,
    });
  }

  const redirect_uri = sitePathUrl(request, 'api/auth/callback');
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri,
    scope: OAUTH_SCOPE,
    state,
  });
  const flags = sessionCookieFlags();
  const headers = new Headers({
    Location: `https://github.com/login/oauth/authorize?${params}`,
    'Set-Cookie': `oauth_state=${state}; ${flags}; Max-Age=600`,
  });
  headers.set('Cache-Control', 'no-store');
  return new Response(null, { status: 302, headers });
};
