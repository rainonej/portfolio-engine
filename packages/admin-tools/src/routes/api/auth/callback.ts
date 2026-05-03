import type { APIRoute } from 'astro';
import { parseCookies, buildSessionToken, sessionCookieFlags } from '../../../server/session.js';
import { sitePathUrl } from '../../../server/paths.js';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

const repoOwner = () => process.env.ADMIN_TOOLS_GITHUB_REPO_OWNER ?? process.env.REPO_OWNER ?? '';
const repoName = () => process.env.ADMIN_TOOLS_GITHUB_REPO_NAME ?? process.env.REPO_NAME ?? '';

export const GET: APIRoute = async ({ request, url }) => {
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  const cookies = parseCookies(request.headers.get('cookie'));
  const storedState = cookies['oauth_state'];
  if (!stateParam || !storedState || stateParam !== storedState) {
    return new Response('Invalid state parameter', { status: 400, headers: NO_STORE });
  }

  if (!code) {
    return new Response('Missing OAuth code', { status: 400, headers: NO_STORE });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const rawText = await tokenRes.text();
  let tokenData: { access_token?: string; error?: string; error_description?: string };
  try {
    tokenData = JSON.parse(rawText) as typeof tokenData;
  } catch {
    return new Response('OAuth token response was not valid JSON', { status: 502, headers: NO_STORE });
  }

  if (!tokenRes.ok) {
    const detail = tokenData.error_description ?? tokenData.error ?? `HTTP ${tokenRes.status}`;
    return new Response(`OAuth token exchange failed: ${detail}`, { status: 400, headers: NO_STORE });
  }

  if (!tokenData.access_token) {
    const detail = tokenData.error_description ?? tokenData.error ?? 'no access_token';
    return new Response(`OAuth token exchange failed: ${detail}`, { status: 400, headers: NO_STORE });
  }

  const { access_token } = tokenData;

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-engine-admin-tools',
    },
  });

  const userRaw = await userRes.text();
  let user: { login?: string };
  try {
    user = JSON.parse(userRaw) as { login?: string };
  } catch {
    return new Response('GitHub user response was not valid JSON', { status: 502, headers: NO_STORE });
  }

  if (!userRes.ok || !user.login) {
    return new Response('GitHub user request failed', { status: 502, headers: NO_STORE });
  }

  const { login } = user;
  const owner = repoOwner();
  const name = repoName();

  if (!owner || !name) {
    return new Response(
      'Missing ADMIN_TOOLS_GITHUB_REPO_OWNER / ADMIN_TOOLS_GITHUB_REPO_NAME (or REPO_OWNER / REPO_NAME) for collaborator verification',
      { status: 500, headers: NO_STORE },
    );
  }

  const collabRes = await fetch(
    `https://api.github.com/repos/${owner}/${name}/collaborators/${login}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-engine-admin-tools',
      },
    },
  );
  if (collabRes.status !== 204) {
    return new Response('Access denied — not a repo collaborator', { status: 403, headers: NO_STORE });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return new Response('Server misconfiguration', { status: 500, headers: NO_STORE });
  }

  const issuedAt = Date.now();
  const sessionToken = await buildSessionToken(login, issuedAt, access_token, secret);
  const maxAge = 24 * 60 * 60;
  const flags = sessionCookieFlags();

  const headers = new Headers({
    Location: sitePathUrl(request, 'admin'),
    ...NO_STORE,
  });
  headers.append('Set-Cookie', `session=${sessionToken}; ${flags}; Max-Age=${maxAge}`);
  headers.append('Set-Cookie', `oauth_state=; ${flags}; Max-Age=0`);
  return new Response(null, { status: 302, headers });
};
