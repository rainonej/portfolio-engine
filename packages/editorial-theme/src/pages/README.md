# What this folder controls

This folder contains the default visitor-facing screens that come with the theme.

Each `.astro` file describes what a visitor sees at a particular web address.

Some filenames come from Astro and cannot be made more descriptive:
- `index.astro` means "the main screen for this folder."
- `[slug].astro` means "one screen for each content item."

## Screens in this folder

| File               | Web address        | What it shows                                     |
|--------------------|--------------------|---------------------------------------------------|
| `index.astro`      | `/`                | The home screen (hero, featured work, writing)    |
| `about.astro`      | `/about`           | The about screen                                  |
| `work.astro`       | `/work`            | The list of all work items                        |
| `writing/`         | `/writing`         | The list of all writing items (subfolder)         |
| `contact.astro`    | `/contact`         | The contact screen                                |
| `resume.astro`     | `/resume`          | The résumé screen                                 |

## Subfolders

- `work/` — contains `[slug].astro`, the individual work item screen at `/work/[slug]`
- `writing/` — contains `index.astro` (writing list) and `[slug].astro` (individual writing screen)

A downstream site can replace any of these screens through the registry. See `../registry.ts`.
