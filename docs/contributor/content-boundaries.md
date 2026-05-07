# Content boundaries (upstream)

`portfolio-engine` is upstream infrastructure. It must stay reusable and persona-neutral.

## Allowed

- Fictional or clearly labeled placeholder demo content
- Minimal generic defaults in theme pages and examples
- Route, config, and registry examples
- Optional recipes clearly marked as optional patterns

## Avoid in active upstream docs and examples

- Real downstream brand briefs or positioning
- Private implementation transcripts pasted verbatim
- Stale site copy from a specific person’s live site
- Consulting or service pricing for a particular downstream
- Example prose that reads like a recommended “canonical” brand voice

## Bugs and audits

If a real downstream site exposes an engine bug, document the bug in generic terms (route ownership, build output, schema). Put site-specific details in the downstream repository.

## Agents

Upstream setup prompts and examples must not become a substitute for the site owner’s own `src/config`, `src/content`, and `src/context`. See the **Content source-of-truth** sections in `docs/downstream/setup-with-claude.md` and `docs/downstream/new-site-setup.md`.
