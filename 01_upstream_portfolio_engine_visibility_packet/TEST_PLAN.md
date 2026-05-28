# Test plan

Run:

```bash
pnpm format
pnpm lint
pnpm check
pnpm build
```

Behavior checks:

1. Published project appears in public work index and has detail route.
2. Unlisted project does not appear in public index but has detail route.
3. Draft project does not appear in public index and has no detail route.
4. Existing projects without `visibility` behave as published.
5. Writing `draft` behavior is unchanged.
