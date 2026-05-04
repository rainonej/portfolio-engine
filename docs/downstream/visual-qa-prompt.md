# Visual QA prompt

Use this prompt after meaningful layout, style, routing, content, or override changes.

---

You are reviewing a `portfolio-engine` consumer site.

Run the local site:

```bash
pnpm dev
```

Open the local URL in Playwright.

Review these routes:

- `/`
- `/work`
- `/writing`
- `/about`
- `/contact`
- `/admin` if admin tools are enabled

Review these viewport sizes:

- desktop: `1440x1000`
- laptop: `1280x800`
- tablet: `768x1024`
- mobile: `390x844`

For each important page, report:

1. visual hierarchy issues
2. spacing or rhythm problems
3. overflow, clipping, or horizontal scroll
4. unreadable text or contrast concerns
5. broken images
6. broken links
7. console errors
8. navigation problems
9. mobile-specific problems
10. places where the design feels generic, unpolished, or off-brand

Do not make changes immediately.

First produce:

```md
## Visual QA findings

### Critical

- ...

### Should fix

- ...

### Nice to improve

- ...

### No issue found

- ...
```

Then propose a small patch plan.

Only after that, edit files.
