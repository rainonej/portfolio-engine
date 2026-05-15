# Rendered Interaction Review

Use this prompt when you need to verify that a site's interactive elements work correctly
in a real browser — not just that their hrefs exist in the static build.

This prompt is different from `visual-review.prompt.md`, which focuses on visual design
quality. This prompt focuses on whether users can actually click CTAs, cards, and navigation.

---

## Scope

Review rendered browser behavior for:

- **CTAs** — primary and secondary call-to-action buttons and links
- **Card clicks** — project cards, research cards, writing cards
- **Navigation** — header nav links, mobile menu, anchor links
- **Download / open links** — resume PDF, external document links
- **External links** — expected `target` and `rel` attributes
- **Empty sections** — no section visible with a heading but no content
- **Placeholder content** — no TODO, "Your Name Here", or Lorem ipsum visible
- **Desktop and mobile** — repeat checks at a wide viewport and a narrow viewport

Do **not** change content or design. Only diagnose interaction behavior.

---

## What to check

For each of the following, report PASS or FAIL with route, element, expected behavior,
actual behavior, suspected cause, and file pointer.

### Homepage CTAs

- Does the primary CTA (e.g. "View Work") navigate to the correct route?
- Does the secondary CTA (e.g. "Download Resume") open the correct file or route?
- Are the CTA elements actually clickable, or does something intercept the click?

### Cards

- Do project/research/writing cards navigate to their detail pages when clicked?
- Is the clickable area the full card, or only part of it?
- Are there nested anchors (`<a>` inside `<a>`) that could confuse click handling?

### Header navigation

- Does each nav link navigate to the correct route?
- Do nav links work on mobile (if a hamburger menu is present, does it open and close)?

### Related links

- Do "Related" or "See also" links on detail pages work?
- Are external links opening in a new tab with `rel="noopener noreferrer"`?

### Resume / PDF links

- Does the resume link open the PDF or route correctly?
- If it opens in a new tab, is `target="_blank"` and `rel` set correctly?

### Mailto / external links

- Do mailto links open the email client?
- Do external links have the expected `target` and `rel`.

### Overlay / interception checks

- Is there any `position: fixed`, `position: absolute`, or `inset-0` element that
  sits above interactive elements and intercepts clicks?
- Are `pointer-events: none` or `z-index` values hiding or blocking interactive areas?
- Does the Vercel Toolbar or any preview banner intercept CTA clicks?
- **Decorative background layers** — ambient gradient/blob backgrounds are a known
  source of click interception. A layer can be `aria-hidden` and visually behind the
  page (`-z-10`) yet still block clicks and text selection if it lacks `pointer-events:
none`. In `jordan-site` PR #60, `.ambient-bg` was the root cause: static
  rendered-link checks passed because hrefs were correct, but clicks failed in all
  browsers until `pointer-events: none` was applied to the layer. Search specifically:
  ```bash
  rg -n "ambient-bg|fixed|inset-0|pointer-events" src packages
  ```

### Nested anchor check

- Search for `<a` elements inside other `<a` elements. The HTML content model forbids
  nested interactive content — nested anchors produce undefined behavior in browsers.

### Empty section check

- Verify no section heading is visible with no body content beneath it.
- Verify no route renders a completely blank page.

---

## Diagnostic steps

When an interaction fails or is suspect, use the following to diagnose:

1. **Playwright role-based locator** — locate the element with `getByRole('link', { name: /view work/i })`.
   If the locator resolves but `.click()` throws, the element is obscured.

2. **`document.elementFromPoint(x, y)`** — use the browser console to find what element
   is at the pixel coordinates where the CTA appears. If it is not the `<a>` element,
   something is covering it.

3. **Inspect `pointer-events`, `z-index`, `position`** — in DevTools, check the computed
   styles of the CTA and its ancestors for `pointer-events: none`, high `z-index` siblings,
   or `position: absolute / fixed` overlays.

4. **Search for overlay patterns in source** — grep or search the component tree for:
   - `absolute`, `fixed`, `inset-0`, `z-`, `pointer-events`
   - `<a` inside another `<a`
   - `ambient-bg`, `ambient-blob`, or any decorative gradient layer

5. **Verify text selection** — if text cannot be selected on the page, a fixed overlay
   likely intercepts all pointer events, not just clicks. This is the same class of bug
   as click interception.

---

## References

- Playwright actionability checks: <https://playwright.dev/docs/actionability>
- Playwright locators (role-based): <https://playwright.dev/docs/locators>
- MDN anchor element content model: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a>
- Vercel Toolbar docs: <https://vercel.com/docs/vercel-toolbar>

---

## Output format

Provide a PASS/FAIL table with one row per interaction checked:

| Route | Element clicked       | Expected behavior                   | Actual behavior     | Suspected cause                                        | File pointer                   |
| ----- | --------------------- | ----------------------------------- | ------------------- | ------------------------------------------------------ | ------------------------------ |
| `/`   | "View Work" CTA       | Navigate to `/product-achievements` | Navigated correctly | —                                                      | —                              |
| `/`   | "Download Resume" CTA | Open `/resume.pdf`                  | Click intercepted   | Overlay `div.hero-overlay` has `z-index: 10` above CTA | `src/components/Hero.astro:42` |

After the table, list any additional findings (nested anchors, empty sections,
placeholder content) as a bulleted list.

Do not suggest content changes. Only report interaction issues and their suspected causes.
