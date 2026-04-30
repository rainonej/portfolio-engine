# Project management conventions

This repo manages work in **GitHub Issues** and **[Project 2](https://github.com/users/rainonej/projects/2)**. The rules below are the source of truth for how work is created, routed, and completed.

---

## Where the rules live

| Doc                                                    | Purpose                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| **[issue-labels.md](issue-labels.md)**                 | Label taxonomy: source, task-kind, owner, automation state |
| **[github-project-board.md](github-project-board.md)** | Board setup, Status field, views, branch model             |

**Optional reference:** the sibling **professional_site** repo has **`docs/ai-workflows.md`** (planner, Claude, unblocker, Vercel-to-issue flow). Those automations are **not wired in portfolio-engine** yet; copy workflows and docs when you want the same behavior here.

---

## Conventions at a glance

- **Epics** (`type:epic`): parent deliverables. Title: describe the outcome.
- **Tasks**: child issues, each with exactly one `task:*` and one `owner:*` label (when using the full taxonomy).
- **Linking:** use GitHub sub-issues (Relationships sidebar) to attach tasks to their epic.
- **Blocking:** Relationships → Blocked by / Blocking.
- **Status:** Inbox → Planned → Blocked/Ready → In Progress → In Review → Done

---

## How a new issue flows (human-driven default)

1. Issue created — lands in **Inbox** (if auto-add is on).
2. Maintainer triages, sets labels, and moves to **Planned** / **Ready** as appropriate.
3. PR opened — **In Review**; [**CI**](../.github/workflows/ci.yml) must pass for merge.
4. Merged — close issue and set **Done** (manually or via Project automation).

When planner / Claude / unblocker workflows are added, extend this section to match `professional_site`’s automated issue-to-PR model.

---

## Branch and PR conventions

| Branch            | Targets                      | Example                            |
| ----------------- | ---------------------------- | ---------------------------------- |
| `task/<N>-<slug>` | `epic/<N>-<slug>` (or `dev`) | `task/42-fix-schema`               |
| `epic/<N>-<slug>` | `dev`                        | `epic/175-extract-editorial-theme` |
| `dev`             | `main`                       | release PR                         |

See [CONTRIBUTING.md](../CONTRIBUTING.md) for changesets and local consumption of packages.
