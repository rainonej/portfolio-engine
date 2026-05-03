# Contributing to Portfolio Engine

Thank you for your interest in contributing.

Portfolio Engine is designed around a clean separation between upstream reusable packages, downstream consumer sites, optional admin UI, optional AI/MCP workflow tooling, and open-source contribution safety.

## Before opening a pull request

1. Search existing issues.
2. Identify the target layer.
3. Keep the change narrow.
4. Avoid mixing unrelated work.
5. Check whether content/config/context/registry/override changes would solve the problem before changing upstream packages.
6. Disclose material AI assistance.
7. Make sure no private downstream data or secrets are included.

## Package boundaries

Required runtime packages:

- `packages/schema`
- `packages/engine-core`
- `packages/editorial-theme`

Optional packages:

- `packages/admin-tools`
- `packages/workflow-kit`

Examples:

- `examples/demo-site`

## Consumer-owned layers

Downstream consumer repos should own:

- `src/config`
- `src/content`
- `src/context`
- `src/registry`
- `src/overrides`
- `src/components`
- `src/pages-local`
- `public`
- `.portfolio-engine` generated/tool state

Do not add consumer-specific workarounds to upstream packages.

## Downstream-originated contributions

If you built a local workaround in a consumer repo and want to upstream it:

- generalize it;
- remove private content;
- remove consumer-specific naming;
- explain the downstream use case;
- link the upstream issue;
- describe how the downstream workaround can be removed after release.

## AI-assisted work

AI-assisted work is allowed. See `AI_USAGE.md`.

The person submitting a PR is responsible for the contribution.

## Sign-off

Contributions may require DCO sign-off. See `DCO.md`.

Use:

```bash
git commit -s
```

## Pull request checklist

Before submitting:

- [ ] I identified the target layer/package.
- [ ] I checked for private data, secrets, or consumer-specific hacks.
- [ ] I kept the change narrow.
- [ ] I disclosed material AI assistance.
- [ ] I added or updated docs where needed.
- [ ] I ran relevant checks where possible.
- [ ] I added a changeset if package behavior or public API changed.

## Security

Do not report security issues in public issues. See `SECURITY.md`.
