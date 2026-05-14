# Downstream upgrade prompt

Use this prompt when applying a new Portfolio Engine release to a downstream site.

---

You are upgrading a downstream Portfolio Engine site to a new version of `@portfolio-engine/editorial-theme`.

## Before upgrading

1. Read the upstream `CHANGELOG.md` for the new version.
2. Note any breaking changes under the `### Breaking` heading.
3. Note any schema changes — new required fields must be added to all content files.
4. Note any workflow-kit template changes — compare local scripts against the new templates.

## Steps

1. Update the version in `package.json`:
   ```bash
   pnpm update @portfolio-engine/editorial-theme @portfolio-engine/engine-core @portfolio-engine/schema
   ```

2. Run `pnpm install` to update the lockfile.

3. Run `pnpm check` and fix any type errors before proceeding.

4. For each schema change:
   - If a field was added as required: add it to all relevant content files.
   - If a field was renamed: rename it in all content files.
   - If a field was removed: remove it from all content files.

5. If workflow-kit templates changed:
   - Compare `scripts/check-content-boundaries.mjs` against the new template.
   - Compare `scripts/check-schema-strictness.mjs` against the new template.
   - Compare `.github/workflows/ci.yml` against the new template.
   - Compare `.vscode/extensions.json` and `.vscode/settings.json` against the new templates.
   - Copy updates intentionally. Do not overwrite local customizations blindly.

6. Run `pnpm build` and confirm no errors.

7. Run `node scripts/check-content-boundaries.mjs` and `node scripts/check-schema-strictness.mjs`.

8. Open the site locally and confirm the golden path:
   - Home page loads
   - Work/projects list loads
   - A project detail page loads
   - Writing list loads
   - A writing detail page loads
   - Contact page loads (if enabled)

## Do not

- Do not upgrade across a major version without reading the migration guide.
- Do not accept the upgrade if `pnpm check` fails.
- Do not overwrite `src/content/`, `src/config/`, or `src/context/` during the upgrade.
