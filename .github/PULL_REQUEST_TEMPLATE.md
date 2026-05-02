# Pull request

## Summary

Explain what this PR changes and why.

## Target layer

- [ ] `packages/schema`
- [ ] `packages/engine-core`
- [ ] `packages/editorial-theme`
- [ ] `packages/admin-tools`
- [ ] `packages/workflow-kit`
- [ ] `examples/demo-site`
- [ ] docs/governance
- [ ] CI/release tooling
- [ ] downstream consumer repo
- [ ] other:

## Issue link

Closes or relates to:

- #

## Downstream origin

Was this change prompted by a downstream consumer repo?

- [ ] No
- [ ] Yes — `agreni-site`
- [ ] Yes — `jordan-site`
- [ ] Yes — other:

If yes, explain why the solution belongs upstream instead of staying as consumer content/config/context/registry/override.

## Layer check

Could this have been solved with a narrower downstream layer?

- [ ] content
- [ ] config
- [ ] context
- [ ] registry
- [ ] override
- [ ] no, upstream package change is required

Explain:

## AI assistance

Was AI materially used to draft this PR?

- [ ] No
- [ ] Yes

If yes, name the tool and confirm you reviewed the output.

## Private data and secrets check

- [ ] I did not include secrets, credentials, tokens, or private keys.
- [ ] I did not include private downstream content that should not be public.
- [ ] I did not put private files in `public/`.
- [ ] I did not hardcode consumer-specific logic into upstream packages.

## Tests/checks

Commands run:

```bash
# paste commands here
```

- [ ] `pnpm check` passes
- [ ] `pnpm build` passes
- [ ] Tests updated (if applicable)
- [ ] Relevant docs updated

## Changeset

- [ ] Not needed
- [ ] Added
- [ ] Needed but not yet added

## Reviewer notes

Anything the maintainer should pay special attention to?
