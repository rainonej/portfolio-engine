# What this folder controls

This folder contains the admin interface — a password-protected area at `/admin` where a site owner can view and edit their site's content.

This package is optional. A site works without it.

## What each file/folder does

| File / folder        | What it handles                                                      |
| -------------------- | -------------------------------------------------------------------- |
| `integration.ts`     | Astro integration entry point — adds the `/admin` route and API      |
| `index.ts`           | Public exports for this package                                      |
| `routes/admin.astro` | The admin UI screen at `/admin`                                      |
| `routes/api/`        | API endpoints for reading and writing content files                  |
| `routes/api/auth/`   | GitHub OAuth authentication (login, callback, logout, session check) |
| `server/`            | Server-side helpers: session management and file paths               |
| `client/`            | Browser-side helpers: content API calls and YAML frontmatter parsing |
| `components/`        | Astro components used inside the admin UI                            |
| `lib/`               | Shared utilities (design token groups, etc.)                         |

## Authentication

The admin area uses GitHub OAuth. Any GitHub account in the configured allowed list can log in. The `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `SESSION_SECRET` environment variables must be set.

## Current collection expectations and limits

The default admin dashboard is built around a fixed set of content collection names. Knowing what's wired and what isn't helps when a downstream site adds a custom collection.

- The default dashboard expects collections named `writing`, `projects`, `testimonials`, and `profile`. Per-collection counts, recent-entry lists, and "open this file" links target those four by name.
- The file editor can read and write any file under `src/content/`, `src/config/`, `src/context/`, `src/registry/`, and `public/`. Restricted to those roots — see the `allowedRoots` / `roots` definitions in `routes/api/content.ts` for the authoritative allowlist.
- If a downstream site adds a custom collection (e.g., `case-studies`), its files appear in the file browser and can be edited like any other tracked file, but no dedicated dashboard widget is generated automatically. Editing is possible; a tailored admin section for that collection requires code changes in `routes/admin.astro` and the corresponding API endpoints.
