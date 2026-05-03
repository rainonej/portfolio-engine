/**
 * URLs that respect Astro `base` / `import.meta.env.BASE_URL` (subpath deployments).
 */
export function siteRootUrl(request: Request): URL {
  return new URL(import.meta.env.BASE_URL, request.url);
}

export function sitePathUrl(request: Request, relativePath: string): string {
  const rel = relativePath.replace(/^\//, '');
  return new URL(rel, siteRootUrl(request)).href;
}

export function siteHomeUrl(request: Request): string {
  return siteRootUrl(request).href;
}
