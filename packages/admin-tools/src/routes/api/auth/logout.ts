import type { APIRoute } from 'astro';
import { sessionCookieFlags } from '../../../server/session.js';

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const { origin } = url;
  const flags = sessionCookieFlags();
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${origin}/`,
      'Set-Cookie': `session=; ${flags}; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
};
