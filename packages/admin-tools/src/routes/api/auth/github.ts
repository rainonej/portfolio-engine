import type { APIRoute } from 'astro';
import { sessionCookieFlags } from '../../../server/session.js';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export const GET: APIRoute = ({ request }) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Server misconfiguration', {
      status: 500,
      headers: NO_STORE,
    });
  }

  const origin = new URL(request.url).origin;
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/callback`,
    scope: 'read:user public_repo',
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
