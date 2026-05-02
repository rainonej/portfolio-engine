import { defineConfig } from 'tsup';
import { cpSync, existsSync } from 'node:fs';

// Copies .astro and .css assets into dist/ after TypeScript compilation.
// Astro processes .astro files natively at consumer build time — they are not compiled here.
function copyAssets() {
  for (const dir of ['components', 'layouts', 'pages', 'styles']) {
    if (existsSync(`src/${dir}`)) {
      cpSync(`src/${dir}`, `dist/${dir}`, { recursive: true });
    }
  }
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  onSuccess: copyAssets,
});
