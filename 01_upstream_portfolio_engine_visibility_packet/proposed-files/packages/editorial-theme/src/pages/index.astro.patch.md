# Patch: packages/editorial-theme/src/pages/index.astro

Homepage public work lists should use listed projects only.

The current call can remain:

```ts
const projects = config.features.work ? await getProjects() : [];
```

because the new default is `visibility: 'listed'`.

Or make intent explicit:

```ts
const projects = config.features.work ? await getProjects({ visibility: 'listed' }) : [];
```
