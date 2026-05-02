import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'node:fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  async onSuccess() {
    mkdirSync('dist', { recursive: true });
    copyFileSync('src/client.d.ts', 'dist/client.d.ts');
  },
});
