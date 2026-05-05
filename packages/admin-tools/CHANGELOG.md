# @portfolio-engine/admin-tools

## 0.0.9

### Patch Changes

- Updated dependencies [0aca192]
  - @portfolio-engine/schema@0.2.0
  - @portfolio-engine/engine-core@0.2.0
  - @portfolio-engine/editorial-theme@0.2.0

## 0.0.8

### Patch Changes

- b10cfd6: Republish all core packages after release pipeline hardening so tarballs consistently include built dist artifacts.
- Updated dependencies [b10cfd6]
  - @portfolio-engine/engine-core@0.1.5

## 0.0.7

### Patch Changes

- c84249e: Ship `dist/` package exports, real `admin-tools` build (Astro routes + API copied to `dist`), Astro peer `^6.0.0`, and publishable `@portfolio-engine/admin-tools` with `publishConfig.access: public`.
- Updated dependencies [c84249e]
  - @portfolio-engine/engine-core@0.1.4

## 0.0.5

### Minor Changes

- Ship `adminTools()` Astro integration: injects `/admin` read-only dashboard (engine virtual modules + content collections) and `/api/auth/*` GitHub OAuth routes. Optional `devBypass` for local `astro dev` without OAuth.

### Patch Changes

- Enforce authentication in `/admin` server render before emitting dashboard HTML; remove client-only gate.
- OAuth: use `read:user repo`; validate token exchange responses; respect Astro `base` for callback, post-login redirect, and logout.
- Logout is `POST` only (`GET` returns 405) to avoid cross-site forced logout.
- Harden `getCollection` usage when optional collections are missing; expand `tsconfig` `include` for route TypeScript.

## 0.0.4

### Patch Changes

- Updated dependencies [a6e295c]
  - @portfolio-engine/engine-core@0.1.2

## 0.0.3

### Patch Changes

- Updated dependencies
  - @portfolio-engine/engine-core@0.1.1

## 0.0.2

### Patch Changes

- Updated dependencies [4c8ff7a]
- Updated dependencies [1e2155e]
  - @portfolio-engine/engine-core@0.1.0
