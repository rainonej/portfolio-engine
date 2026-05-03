import type { APIRoute } from 'astro';
import { parseCookies, verifySession } from '../../../server/session.js';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export const GET: APIRoute = async ({ request }) => {
  if (process.env.ADMIN_TOOLS_DEV_BYPASS === '1' && import.meta.env.DEV) {
    return Response.json(
      { authenticated: true, username: 'dev', readOnly: true },
      { headers: NO_STORE },
    );
  }

  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies['session'];

  if (!token) {
    return Response.json({ authenticated: false }, { headers: NO_STORE });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return Response.json({ error: 'Server misconfiguration' }, { status: 500, headers: NO_STORE });
  }

  const session = await verifySession(token, secret);
  if (!session) {
    return Response.json({ authenticated: false }, { headers: NO_STORE });
  }

  return Response.json(
    { authenticated: true, username: session.login, readOnly: false },
    { headers: NO_STORE },
  );
};
