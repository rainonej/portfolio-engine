import type { APIRoute } from 'astro';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseCookies, verifySession } from '../../server/session.js';

export const prerender = false;
const NO_STORE = { 'Cache-Control': 'no-store' } as const;

interface FileEntry { path: string; size: number; ext: string }

const repoOwner = () => process.env.ADMIN_TOOLS_GITHUB_REPO_OWNER ?? process.env.REPO_OWNER ?? '';
const repoName = () => process.env.ADMIN_TOOLS_GITHUB_REPO_NAME ?? process.env.REPO_NAME ?? '';
const repoBranch = () => process.env.ADMIN_TOOLS_GITHUB_REPO_BRANCH ?? process.env.REPO_BRANCH ?? 'main';

async function walk(dir: string, root: string): Promise<FileEntry[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: FileEntry[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(abs, root)));
    else {
      const stat = await fs.stat(abs);
      out.push({ path: path.relative(root, abs).replaceAll(path.sep, '/'), size: stat.size, ext: path.extname(entry.name) });
    }
  }
  return out;
}

function resolveAllowed(cwd: string, relativePath: string): string | null {
  const clean = relativePath.replace(/^\/+/, '');
  const allowedRoots = ['src/content/', 'src/config/', 'src/context/', 'src/registry/', 'public/'];
  if (!allowedRoots.some((r) => clean.startsWith(r))) return null;
  const abs = path.resolve(cwd, clean);
  if (!abs.startsWith(path.resolve(cwd) + path.sep)) return null;
  return abs;
}



function resolvePublicDirectory(cwd: string, relativeDir: string): string | null {
  const clean = relativeDir.replace(/^\/+/, '');
  const prefixed = clean ? `public/${clean}`.replace(/\/+/g, '/') : 'public';
  const abs = path.resolve(cwd, prefixed);
  const publicRoot = path.resolve(cwd, 'public');
  if (abs !== publicRoot && !abs.startsWith(publicRoot + path.sep)) return null;
  return abs;
}

async function auth(request: Request): Promise<{ devBypass: boolean; accessToken: string | null; error?: Response }> {
  const devBypass = process.env.ADMIN_TOOLS_DEV_BYPASS === '1' && import.meta.env.DEV;
  if (devBypass) return { devBypass, accessToken: null };
  const token = parseCookies(request.headers.get('cookie'))['session'];
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return { devBypass, accessToken: null, error: Response.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE }) };
  const session = await verifySession(token, secret);
  if (!session) return { devBypass, accessToken: null, error: Response.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE }) };
  return { devBypass, accessToken: session.accessToken };
}

export const GET: APIRoute = async ({ request, url }) => {
  const authed = await auth(request); if (authed.error) return authed.error;
  const cwd = process.cwd();
  const file = url.searchParams.get('file');
  if (file) {
    const abs = resolveAllowed(cwd, file);
    if (!abs) return Response.json({ error: 'Invalid file path' }, { status: 400, headers: NO_STORE });
    try {
      const content = await fs.readFile(abs, 'utf8');
      return Response.json({ file, content }, { headers: NO_STORE });
    } catch {
      return Response.json({ error: 'Not found' }, { status: 404, headers: NO_STORE });
    }
  }

  const section = url.searchParams.get('section') ?? 'content';
  const roots: Record<string, string> = { content: 'src/content', config: 'src/config', context: 'src/context', assets: 'public', registry: 'src/registry' };
  const relative = roots[section];
  if (!relative) return Response.json({ error: 'Unknown section' }, { status: 400, headers: NO_STORE });
  try { return Response.json({ section, files: await walk(path.join(cwd, relative), cwd) }, { headers: NO_STORE }); }
  catch { return Response.json({ section, files: [] }, { headers: NO_STORE }); }
};

export const PUT: APIRoute = async ({ request }) => {
  const authed = await auth(request); if (authed.error) return authed.error;
  const body = await request.json().catch(() => null) as { file?: string; content?: string; message?: string } | null;
  if (!body?.file || typeof body.content !== 'string') return Response.json({ error: 'Missing file or content' }, { status: 400, headers: NO_STORE });
  const cwd = process.cwd();
  const abs = resolveAllowed(cwd, body.file);
  if (!abs) return Response.json({ error: 'Invalid file path' }, { status: 400, headers: NO_STORE });

  if (authed.devBypass) {
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, body.content, 'utf8');
    return Response.json({ ok: true, mode: 'local-dev' }, { headers: NO_STORE });
  }

  const owner = repoOwner(); const repo = repoName(); const branch = repoBranch();
  if (!owner || !repo || !authed.accessToken) return Response.json({ error: 'Repo/auth misconfiguration' }, { status: 500, headers: NO_STORE });

  const ghPath = body.file.replace(/^\/+/, '');
  const base = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(ghPath).replace(/%2F/g, '/')}`;
  const headers = { Authorization: `Bearer ${authed.accessToken}`, Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-engine-admin-tools' };
  const currentRes = await fetch(`${base}?ref=${encodeURIComponent(branch)}`, { headers });
  let sha: string | undefined;
  if (currentRes.ok) {
    const current = await currentRes.json() as { sha?: string };
    sha = current.sha;
  }

  const upRes = await fetch(base, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: body.message ?? `admin-tools: update ${ghPath}`, content: Buffer.from(body.content, 'utf8').toString('base64'), sha, branch }),
  });
  if (!upRes.ok) {
    const detail = await upRes.text();
    return Response.json({ error: 'GitHub write failed', detail }, { status: 502, headers: NO_STORE });
  }
  return Response.json({ ok: true, mode: 'github' }, { headers: NO_STORE });
};


export const POST: APIRoute = async ({ request }) => {
  const authed = await auth(request); if (authed.error) return authed.error;
  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ error: 'Expected multipart form data' }, { status: 400, headers: NO_STORE });

  const targetDir = String(form.get('targetDir') ?? '').trim();
  const files = form.getAll('files').filter((v): v is File => v instanceof File);
  if (files.length === 0) return Response.json({ error: 'No files uploaded' }, { status: 400, headers: NO_STORE });

  const cwd = process.cwd();
  const dirAbs = resolvePublicDirectory(cwd, targetDir);
  if (!dirAbs) return Response.json({ error: 'Invalid targetDir' }, { status: 400, headers: NO_STORE });

  const saved: string[] = [];

  if (authed.devBypass) {
    await fs.mkdir(dirAbs, { recursive: true });
    for (const file of files) {
      const name = path.basename(file.name);
      const abs = path.join(dirAbs, name);
      const bytes = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(abs, bytes);
      saved.push(path.relative(cwd, abs).replaceAll(path.sep, '/'));
    }
    return Response.json({ ok: true, mode: 'local-dev', saved }, { headers: NO_STORE });
  }

  const owner = repoOwner(); const repo = repoName(); const branch = repoBranch();
  if (!owner || !repo || !authed.accessToken) return Response.json({ error: 'Repo/auth misconfiguration' }, { status: 500, headers: NO_STORE });
  const headers = { Authorization: `Bearer ${authed.accessToken}`, Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-engine-admin-tools', 'Content-Type': 'application/json' };

  for (const file of files) {
    const name = path.basename(file.name);
    const rel = path.relative(cwd, path.join(dirAbs, name)).replaceAll(path.sep, '/');
    const base = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(rel).replace(/%2F/g, '/')}`;
    const currentRes = await fetch(`${base}?ref=${encodeURIComponent(branch)}`, { headers });
    let sha: string | undefined;
    if (currentRes.ok) {
      const current = await currentRes.json() as { sha?: string };
      sha = current.sha;
    }
    const content = Buffer.from(await file.arrayBuffer()).toString('base64');
    const upRes = await fetch(base, { method: 'PUT', headers, body: JSON.stringify({ message: `admin-tools: upload ${rel}`, content, sha, branch }) });
    if (!upRes.ok) {
      return Response.json({ error: `Upload failed for ${rel}`, detail: await upRes.text() }, { status: 502, headers: NO_STORE });
    }
    saved.push(rel);
  }

  return Response.json({ ok: true, mode: 'github', saved }, { headers: NO_STORE });
};
