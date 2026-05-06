import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/doctor.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
});
