# Project visibility specification

## Field

```yaml
visibility: published | unlisted | draft
```

This is a content-level publishing control, not authentication.

## Defaults

If omitted, the project is treated as:

```yaml
visibility: published
```

## Caller guidance

Public list callers:

```ts
getProjects();
// or
getProjects({ visibility: 'listed' });
```

Static path generation for detail pages:

```ts
getProjects({ visibility: 'buildable' });
```

Admin/editorial tools:

```ts
getProjects({ visibility: 'all' });
```

## Edge cases

- `featured: true` + `visibility: unlisted` must not appear in public featured work.
- `featured: true` + `visibility: draft` must not appear anywhere public.
- Unknown values must fail schema validation.
- Missing value defaults to `published`.
