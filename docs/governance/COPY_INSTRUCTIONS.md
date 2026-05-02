# Portfolio Engine governance/open-source foundation bundle

Copy these files into the root of `rainonej/portfolio-engine`.

This bundle implements the governance/open-source foundation epic:

- `LICENSE`
- `NOTICE`
- `GOVERNANCE.md`
- `CONTRIBUTING.md`
- `AI_USAGE.md`
- `DCO.md`
- `SECURITY.md`
- `TRADEMARK.md`
- `CITATION.cff`
- `CODE_OF_CONDUCT.md`
- `SUPPORT.md`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/*.yml`
- `docs/governance/open-source-policy.md`
- `docs/governance/recommended-labels.md`
- `docs/contributing/downstream-contributions.md`
- `docs/contributing/package-metadata-checklist.md`

## Assumptions made

I selected **Apache License 2.0** as the concrete default.

Why:

- It is a real open-source license.
- It allows commercial and noncommercial use.
- It includes an express patent grant.
- It has a standard `NOTICE` mechanism.
- It is common for infrastructure/tooling packages.

## Important open-source constraint

A true open-source license cannot require noncommercial-only use, permission before use, mandatory notification, or a complete AI-training/scraping ban.

Those can be expressed as project norms, citation requests, trademark restrictions, data/docs licensing choices, or separate commercial terms, but not as restrictions inside an OSI-style open-source code license.

This bundle therefore uses Apache-2.0 for code, citation/notification as requested norms, trademark policy for names/marks, AI contribution policy for repo contributions, security policy, and DCO sign-off language.

## Follow-up placeholders to replace

- `security@example.com`
- `jordan@example.com`
- version/date in `CITATION.cff` if needed

This is a strong open-source foundation, but it is not legal advice.
