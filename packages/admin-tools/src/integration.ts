import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';

export interface AdminToolsOptions {
  /**
   * When true with `astro dev`, `/api/auth/session` reports authenticated without GitHub.
   * Dashboard is read-only until the GitHub Contents API is wired for this site.
   */
  devBypass?: boolean;
}

export function adminTools(options: AdminToolsOptions = {}): AstroIntegration {
  const devBypass = options.devBypass === true;

  return {
    name: '@portfolio-engine/admin-tools',
    hooks: {
      'astro:config:setup': ({ injectRoute, command }) => {
        if (devBypass && command === 'dev') {
          process.env.ADMIN_TOOLS_DEV_BYPASS = '1';
        }

        const route = (pattern: string, relative: string) =>
          injectRoute({
            pattern,
            entrypoint: fileURLToPath(new URL(relative, import.meta.url)),
          });

        route('/admin', './routes/admin.astro');
        route('/api/auth/session', './routes/api/auth/session.ts');
        route('/api/auth/logout', './routes/api/auth/logout.ts');
        route('/api/auth/github', './routes/api/auth/github.ts');
        route('/api/auth/callback', './routes/api/auth/callback.ts');
      },
    },
  };
}
