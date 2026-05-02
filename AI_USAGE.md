# AI Usage Policy

Portfolio Engine welcomes AI-assisted development, but all AI-generated or AI-assisted work must remain reviewable, attributable, and safe.

## Human responsibility

The person submitting a contribution is responsible for it.

By submitting a PR, you confirm that:

- you reviewed the AI-assisted changes;
- you understand the code/docs being submitted;
- you have the right to submit the contribution;
- the contribution complies with the project license and policies;
- no private data, secrets, proprietary downstream content, or consumer-specific hacks were included.

## Disclosure

Pull requests should disclose material AI assistance.

Example:

> This PR was drafted with assistance from Claude/Copilot/another AI tool and reviewed by me.

A trivial autocomplete suggestion does not need detailed disclosure. A multi-file AI-generated implementation does.

## Agent approval

The label `agent:approved` means a human maintainer has approved an AI agent to act on the issue.

## Agent workflow

Before editing code, an agent should inspect:

1. the issue body;
2. the relevant epic;
3. `AGENTS.md`;
4. package boundaries;
5. the consumer layout contract;
6. the technical debt register, if relevant.

Agents should prefer the narrowest valid change.

## Layer-boundary rules

Agents must not:

- edit `node_modules`;
- vendor or copy upstream package source into a consumer repo;
- add consumer-specific logic to upstream packages;
- hardcode a downstream user's private data into `engine-core` or `editorial-theme`;
- put private files in `public/`;
- move tool state into `src/context`;
- commit secrets, tokens, API keys, or credentials.

For downstream requests, agents should prefer:

1. content;
2. config;
3. context;
4. supported override;
5. consumer registry;
6. temporary downstream workaround;
7. upstream feature request;
8. upstream PR.

## Consumer-originated patches

If a downstream consumer needs a local workaround, track package affected, reason, local patch location, upstream issue/PR link, removal condition, owner, and date added.

## AI training and data use

The project is open source under the license in `LICENSE`.

The maintainers request that third parties do not use the repository, issues, discussions, examples, or downstream-linked content to train or fine-tune AI systems in ways that misrepresent authorship, violate privacy, or ignore attribution. This request is a project norm and is not an additional restriction on the open-source license.

Do not submit training data, private downstream content, credentials, or confidential materials to public AI systems unless you have permission.

## Acceptable AI-assisted PRs

Good AI-assisted PRs are narrow, linked to an issue, labeled correctly, easy to review, covered by checks or tests, free of private data, consistent with package boundaries, and accompanied by a clear summary.

## Unacceptable AI-assisted PRs

PRs may be rejected if they perform broad rewrites without a clear issue, include hallucinated APIs, obscure authorship, add consumer-specific hacks to upstream packages, mix unrelated work, ignore the layer model, or introduce unsafe automation.
