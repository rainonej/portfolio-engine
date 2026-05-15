// lint-staged config for downstream Portfolio Engine sites.
// Copy to repo root. Requires husky + lint-staged in devDependencies.
//
// Install:
//   pnpm add -D husky lint-staged
//   pnpm exec husky init
//   cp node_modules/@portfolio-engine/workflow-kit/templates/husky/pre-commit .husky/pre-commit
//   cp node_modules/@portfolio-engine/workflow-kit/templates/husky/lint-staged.config.mjs .
//
// Then add to package.json scripts:
//   "prepare": "husky"

export default {
  // Auto-fix ESLint issues and format TS/JS/Astro files on commit.
  '*.{ts,mjs,astro}': ['eslint --fix', 'prettier --write --ignore-unknown'],
  // Format prose, config, and data files.
  '*.{md,json,yml,yaml}': ['prettier --write'],
};
