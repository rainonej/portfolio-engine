# Issue labels

Labels encode where work came from, what kind of work it is, who executes it, and (optionally) automation state. **portfolio-engine** reuses the same taxonomy as **`professional_site`** so issues can move consistently across your GitHub Projects.

For small chores you may use only a subset (for example `task:chore` + `area:ci`); for epics and multi-owner work, prefer the full groups below.

---

## Source labels

| Label           | Meaning                                                             |
| --------------- | ------------------------------------------------------------------- |
| `source:human`  | Opened directly by a human in GitHub                                |
| `source:vercel` | Created via Vercel's "Convert to GitHub Issue" on a preview comment |
| `source:cms`    | Reserved for CMS-originated issues                                  |

---

## Task-kind labels

| Label           | Meaning                                         |
| --------------- | ----------------------------------------------- |
| `type:epic`     | Parent deliverable with child task issues       |
| `task:feat`     | Feature implementation                          |
| `task:bug-fix`  | Bug fix                                         |
| `task:chore`    | Tooling, CI, docs-only, repo hygiene            |
| `task:decision` | A tracked human decision that blocks other work |
| `task:content`  | Content entry or editing                        |

**Epics vs tasks:** a `type:epic` issue is the parent; children get one `task:*` and one `owner:*` each.

---

## Owner labels

**Every task issue must carry exactly one owner label.** This is not optional. The label determines who can pick up the ticket — do not mix owners on a single ticket; split the ticket instead.

| Label              | Who executes                | Concrete meaning                                                                                          |
| ------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `owner:simple-ai`  | GitHub Copilot coding agent | Fully specced, single-file or mechanical multi-file change. No decisions required.                        |
| `owner:agentic-ai` | Claude / agentic automation | Multi-file, exploratory, or reasoning-required work. Can be picked up autonomously with `claude-ready`.   |
| `owner:human-dev`  | Human maintainer (Jordan)   | Requires a human: UI click, credential/access grant, architecture decision, or something outside a shell. |
| `owner:site-owner` | Site/product owner          | Content entry, approval, or config decision made by the site owner (e.g. Agreni for downstream sites).    |

**Rule of thumb for `owner:human-dev`:** if you cannot complete this ticket entirely from a terminal + editor, it is `human-dev`. Examples: connecting a repo to Vercel in the dashboard, granting GitHub App access, approving a PR, setting a secret in GitHub UI.

---

## Automation state labels

| Label                | Meaning                                                 |
| -------------------- | ------------------------------------------------------- |
| `automation:plan`    | Maintainer triggers planner (when that workflow exists) |
| `automation:planned` | Planner finished shaping the issue                      |
| `automation:started` | AI execution underway                                   |

---

## Approval gate label

| Label          | Meaning                              |
| -------------- | ------------------------------------ |
| `claude-ready` | Human approved for gated Claude runs |

---

## Area labels (portfolio-engine)

| Label        | Meaning                       |
| ------------ | ----------------------------- |
| `area:ci`    | GitHub Actions, lint, checks  |
| `area:demo`  | `examples/demo-site`          |
| `area:docs`  | README, CONTRIBUTING, `docs/` |
| `area:theme` | `packages/editorial-theme`    |

---

## Board and Status hints

These labels align with the **Status** field in [github-project-board.md](github-project-board.md). Executor labels pair with views in [`.github/project-views/`](../.github/project-views/).
