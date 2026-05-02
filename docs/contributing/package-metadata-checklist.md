# Package metadata checklist

Use this checklist when preparing packages for publication.

## Root package

The root `package.json` may remain private if it is only the monorepo root.

Recommended root fields:

```json
{
  "name": "portfolio-engine",
  "private": true,
  "description": "Monorepo root for the @portfolio-engine/* packages",
  "license": "Apache-2.0"
}
```

## Published packages

Each published package should include:

```json
{
  "license": "Apache-2.0",
  "author": "Jordan Rainone",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rainonej/portfolio-engine.git",
    "directory": "packages/<package-name>"
  },
  "bugs": {
    "url": "https://github.com/rainonej/portfolio-engine/issues"
  },
  "homepage": "https://github.com/rainonej/portfolio-engine#readme",
  "publishConfig": {
    "access": "public"
  }
}
```

## Files to include

Published packages should include only what consumers need:

- `dist/`
- `README.md`
- `LICENSE`
- `NOTICE`
- package-specific docs if needed

Avoid publishing private examples, credentials, raw audit artifacts unless intentional, and development-only scratch files.

## Changesets

Public API changes should include a changeset.

## SPDX headers

Optional but recommended for source files:

```text
SPDX-License-Identifier: Apache-2.0
```
