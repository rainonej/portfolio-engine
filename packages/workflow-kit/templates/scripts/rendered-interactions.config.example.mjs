/**
 * Example rendered interaction config for downstream Portfolio Engine sites.
 *
 * Copy this file to scripts/rendered-interactions.config.mjs in your downstream
 * repo and edit it to match your site's routes, viewports, and interactions.
 *
 * The checks below are based on the failure mode exposed by jordan-site PR #60,
 * where static rendered-link checks passed but homepage CTAs, resume links, and
 * research cards were not reliably clickable in a real browser.
 *
 * Root cause: the decorative .ambient-bg layer from @portfolio-engine/editorial-theme
 * was aria-hidden and visually behind the page (-z-10), but lacked pointer-events:none.
 * It intercepted all clicks and text selection. This is now fixed upstream, but if you
 * see clicks fail while hrefs are correct, check decorative fixed/background layers first.
 *
 * See check-rendered-interactions.mjs for the runner.
 */

export default {
  // Base URL for the deployed or local preview to test.
  // Override with SITE_URL env var for Vercel previews.
  baseUrl: process.env.SITE_URL ?? 'http://localhost:4321',

  // Routes to visit. The runner asserts that a visible <h1> exists on each.
  routes: ['/', '/product-achievements', '/research', '/resume', '/contact'],

  // Viewports to test across. The runner repeats all checks on each viewport.
  viewports: [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ],

  // Click interaction checks.
  // Each entry navigates to `from`, locates the element by role + name, clicks it,
  // and asserts the resulting URL matches `expectedUrl`.
  //
  // Playwright's click() is actionability-checked: if the element is obscured by an
  // overlay, has pointer-events:none, or is inside a nested anchor, it will throw —
  // which is exactly the class of issues that static rendered-link checks miss.
  clickChecks: [
    // Homepage primary CTA — navigates to the work/projects/achievements page.
    // Adjust the name pattern and expectedUrl to match your site's copy.
    {
      from: '/',
      role: 'link',
      name: /view work/i,
      expectedUrl: /\/work|\/projects|\/product-achievements/,
    },

    // Homepage resume/download link — may open in a new tab.
    // Set allowNewPage: true when the link opens a PDF or external page.
    {
      from: '/',
      role: 'link',
      name: /resume/i,
      expectedUrl: /\/resume(\.pdf)?/,
      allowNewPage: true,
    },

    // Research card — verify a real card click navigates to a detail page.
    // Replace the name pattern with a specific article title from your content.
    {
      from: '/research',
      role: 'link',
      name: /.+/,
      expectedUrl: /\/research\/.+/,
      note: 'Replace with a specific article title in downstream repos.',
    },
  ],
};
