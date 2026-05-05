import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(scriptDir, '..');
const dist = join(pkgRoot, 'dist');
mkdirSync(dist, { recursive: true });
copyFileSync(join(pkgRoot, 'src', 'client.d.ts'), join(dist, 'client.d.ts'));
