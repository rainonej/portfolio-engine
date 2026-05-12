# What this folder controls

This folder contains the writing list screen and the individual writing item screen.

| File           | Web address         | What it shows                                          |
|----------------|---------------------|--------------------------------------------------------|
| `index.astro`  | `/writing`          | The list of all writing items (excludes drafts)        |
| `[slug].astro` | `/writing/[slug]`   | One screen for each item in the `content/writing/` folder |

`[slug]` is an Astro convention — it means the file generates one screen per content item, using the item's filename as the web address.

For example, an item at `content/writing/my-post.md` produces a screen at `/writing/my-post`.

A downstream site can fully replace either of these screens through the registry. See `../../registry.ts`.
