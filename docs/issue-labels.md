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

| Label              | Meaning                     | When to use                                               |
| ------------------ | --------------------------- | --------------------------------------------------------- |
| `owner:simple-ai`  | GitHub Copilot coding agent | Small, fully specced tasks                                |
| `owner:agentic-ai` | Claude / agentic automation | Multi-file or exploratory work                            |
| `owner:human-dev`  | Human maintainer            | Architecture, security, infra                             |
| `owner:site-owner` | Site/product owner          | Content and approvals (often Agreni for downstream sites) |

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
