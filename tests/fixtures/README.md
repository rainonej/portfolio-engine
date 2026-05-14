# tests/fixtures

Internal validation fixtures. These are not user-facing examples.

The only public example is [`examples/demo-site`](../../examples/demo-site/).

## Fixtures

| Directory | Purpose |
|---|---|
| `node-ssr` | `@astrojs/node` + `output: 'server'` adapter — validates SSR support |
| `custom-section-detail` | Consumer-local route overrides — validates `src/pages-local/` + registry patterns |

These fixtures are included in the pnpm workspace so they resolve `workspace:*` dependencies
during CI. They are built in the `build` CI job to confirm no regressions.

Do not add user-facing documentation, persona content, or marketing copy to these fixtures.
