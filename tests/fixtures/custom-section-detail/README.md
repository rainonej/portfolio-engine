# custom-section-detail-demo

End-to-end example proving the four replaceable editorial-theme screens can be disabled and replaced together.

## What this site does

This minimal Astro site:

1. Imports `editorialTheme` from `@portfolio-engine/editorial-theme/integration`.
2. Disables all four replaceable theme routes in `astro.config.mjs`:
   - `/work`
   - `/work/[slug]`
   - `/writing`
   - `/writing/[slug]`
3. Declares consumer-local replacements under `src/pages-local/` via `src/registry/portfolio-engine.registry.json`.
4. Wires those replacement pages through `Layout` from the editorial theme and imports universal content components from `@portfolio-engine/editorial-theme/components/content/*`.

Every replacement page renders a clearly-visible "Custom replacement screen — example only" banner so the build output and rendered HTML show at a glance that the consumer-local routes are in use.

## Verification

After running `pnpm --filter custom-section-detail-demo run build`, inspect
`.portfolio-engine/manifest.json` and confirm that the four target routes have
`"routeOrigin": "consumer-local"` instead of `"theme"`.
