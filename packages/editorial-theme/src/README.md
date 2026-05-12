# What this folder controls

This folder contains the source code for the editorial theme — the default look, screens, and behavior that every site built on portfolio-engine gets out of the box.

| Subfolder    | What it controls                                                        |
|--------------|-------------------------------------------------------------------------|
| `pages/`     | The visitor-facing screens (what a visitor sees at each web address)    |
| `components/`| Reusable visual pieces used across multiple screens                     |
| `layouts/`   | The shared outer frame that wraps every screen (nav, footer, head)      |
| `styles/`    | Colors, spacing, fonts, and global visual rules                         |
| `lib/`       | Shared helper functions used by pages and components                    |

The theme is consumed as an npm package. Downstream sites do not edit this folder directly — they install the package and override specific pieces through the registry system.
