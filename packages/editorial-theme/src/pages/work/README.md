# What this folder controls

This folder contains the individual work item screen.

| File          | Web address      | What it shows                                         |
|---------------|------------------|-------------------------------------------------------|
| `[slug].astro`| `/work/[slug]`   | One screen for each item in the `content/projects/` folder |

`[slug]` is an Astro convention — it means the file generates one screen per content item, using the item's filename as the web address.

For example, an item at `content/projects/acme-redesign.md` produces a screen at `/work/acme-redesign`.

A downstream site can fully replace this screen by setting `remappable: true` in the registry (which is already the case).
