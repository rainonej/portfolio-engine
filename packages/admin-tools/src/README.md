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
