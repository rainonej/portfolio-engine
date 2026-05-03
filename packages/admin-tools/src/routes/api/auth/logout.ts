import type { APIRoute } from 'astro';
import { sessionCookieFlags } from '../../../server/session.js';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

/** Clear session cookie; client navigates home (avoids fetch+redirect edge cases with `base`). */
export const POST: APIRoute = () => {
  const flags = sessionCookieFlags();
  return new Response(null, {
    status: 204,
    headers: {
      ...NO_STORE,
      'Set-Cookie': `session=; ${flags}; Max-Age=0`,
    },
  });
};

export const GET: APIRoute = () => {
  return new Response('Method Not Allowed — use POST to log out', {
    status: 405,
    headers: { ...NO_STORE, Allow: 'POST' },
  });
};
