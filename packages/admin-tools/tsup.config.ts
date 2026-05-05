import { defineConfig } from 'tsup';
import { cpSync, existsSync, mkdirSync } from 'node:fs';

/** Routes, components, and server modules are consumed by Astro at consumer build time. */
function copyAstroAndApiTree() {
  mkdirSync('dist', { recursive: true });
  for (const dir of ['routes', 'components', 'server', 'lib']) {
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
  external: ['astro'],
  onSuccess: copyAstroAndApiTree,
});
