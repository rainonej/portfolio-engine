---
'@portfolio-engine/workflow-kit': patch
---

Point generated agent templates to the root Portfolio Engine AGENTS.md workflow contract so downstream agent instructions stay aligned with the shared project rules.

#### Agent update note

Workflow-kit agent templates changed.

Downstream agents should compare and update:

- `.claude/CLAUDE.md` — add the AGENTS.md pointer line at the top (see upstream template)
- `.github/copilot-instructions.md` — same addition

The change is one line added near the top of each file. Existing consumer-site-specific content is unchanged.
