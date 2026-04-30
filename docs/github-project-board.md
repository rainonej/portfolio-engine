# GitHub Project board

This document describes how the GitHub Project is configured for **portfolio-engine**: **Status** values, **views**, branch flow, and how CI relates to issues. **Versioned view definitions** (API request bodies) live under [`.github/project-views/`](../.github/project-views/) — see [Syncing views from the repo](#syncing-views-from-the-repo).

Project hub: [github.com/users/rainonej/projects](https://github.com/users/rainonej/projects)

Primary board for this repo’s delivery work: **[Project 2](https://github.com/users/rainonej/projects/2)** (confirm the number in the URL matches your active project).

---

## Related tracking (portfolio-engine)

Use GitHub issues in **`rainonej/portfolio-engine`** and link them to Project 2. Reference issue numbers in PR descriptions when shipping scoped work.

_(The sibling **professional_site** repo lists specific epic/issue numbers in its copy of this doc; those numbers are site-repo specific and are not mirrored here.)_

---

## Status field

Use a single **Status** field with these values (aligns with labels and manual process):

| Status          | Meaning                          | Set when                                        |
| --------------- | -------------------------------- | ----------------------------------------------- |
| **Inbox**       | New issue, not yet planned       | Issue created (auto-add automation, if enabled) |
| **Planned**     | Shaped and ready to schedule     | `automation:planned` label or manual            |
| **Blocked**     | Open dependencies                | Blocking relationship exists                    |
| **Ready**       | No open blockers; work may begin | Maintainer sets Status                          |
| **In Progress** | Work started                     | Human/agent picks up                            |
| **In Review**   | Open PR linked                   | Native automation or manual                     |
| **Done**        | Closed / delivered               | Issue closed or native “Item closed → Done”     |

**Not in this repo yet:** `professional_site` automations such as **`unblocker.yml`**, **`planner.yml`**, **`close-task-on-merge.yml`**, and Claude-triggered flows. Until those workflows exist here, treat **Blocked → Ready** and planner-driven transitions as **manual** in the Project UI.

---

## View definitions (versioned in git)

Each row matches a JSON file in `.github/project-views/`. Filters use the project search syntax; verify in the UI if the API rejects a query.

| View                      | JSON file                       | Filter (summary)                               |
| ------------------------- | ------------------------------- | ---------------------------------------------- |
| Epics                     | `epics.json`                    | Open issues with `type:epic`                   |
| Decisions                 | `decisions.json`                | Open issues with `task:decision`               |
| Planner queue             | `planner-queue.json`            | Open issues with `automation:plan`             |
| Ready for Claude          | `ready-for-claude.json`         | Open, `claude-ready` + `owner:agentic-ai`      |
| Copilot lane              | `copilot-lane.json`             | Open, `owner:simple-ai` + `automation:planned` |
| Tasks (unblocked)         | `tasks-unblocked.json`          | Open non-epics, `-is:blocked` if supported     |
| Tasks unblocked, blocking | `tasks-unblocked-blocking.json` | Above + `is:blocking` if supported             |
| Human dev                 | `human-dev.json`                | Open, `owner:human-dev`                        |
| Site owner                | `site-owner.json`               | Open, `owner:site-owner`                       |

**Main board:** keep a default **Board** or **Table** grouped by **Status** (`is:issue`). Easiest to set once in the Project UI.

If `-is:blocked` / `is:blocking` are unsupported in your project, use Relationships columns and the owner/label views above.

---

## Syncing views from the repo

1. Change or add JSON under `.github/project-views/`.
2. Merge to your integration branch.
3. With a token that has **project** scope, run the loop in [`.github/project-views/README.md`](../.github/project-views/README.md) (set `USER`, `PROJECT_NUMBER` — **2** for this board if that matches your URL — and `X-GitHub-Api-Version` per current GitHub docs).

Alternatively, open each JSON file and **paste the `filter`** string into **New view → Filter** in the Project UI.

**Not in JSON:** Project **Settings → Workflows** automations (e.g. **Auto-add issues**, **Item closed → Done**, **Pull request merged → Done**). Configure those once in GitHub; they are not exported with these files.

---

## Branch model

```text
task/<number>-<slug>  →  epic/<number>-<slug>  →  dev  →  main
```

| PR type    | Head branch       | Target branch                               |
| ---------- | ----------------- | ------------------------------------------- |
| Task PR    | `task/<N>-<slug>` | `epic/<N>-<slug>` (or `dev` for standalone) |
| Epic PR    | `epic/<N>-<slug>` | `dev`                                       |
| Release PR | `dev`             | `main`                                      |

**Not yet in portfolio-engine:** `branch-name-check.yml` and **`close-task-on-merge.yml`** from `professional_site`. Add those workflows when you want automated branch-name enforcement and issue auto-close on epic/task merges.

---

## PR targets and issue auto-close

GitHub only auto-closes linked issues when a PR merges into the **default branch**. Task PRs that target **`epic/*`** do not get magic “Closes #N” from GitHub alone until a **`close-task-on-merge`**-style workflow exists (see `professional_site`).

---

## Blockers and dependencies

- **Sub-issues:** epic → child tasks (Relationships → Sub-issues).
- **Blocking:** Relationships → Blocked by / Blocking.

---

## How CI relates to the board

| Event               | Automation                                                | Typical board follow-up        |
| ------------------- | --------------------------------------------------------- | ------------------------------ |
| PR opened / updated | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | **In Review** while CI runs    |
| PR merged           | _(manual)_                                                | Move linked issues to **Done** |
| Issue created       | Auto-add _(if configured in Project)_                     | **Inbox**                      |

---

## One-time checklist

- [ ] Status field has the values above (or your chosen subset)
- [ ] Main view grouped by Status
- [ ] Auto-add, Item closed → Done, PR merged → Done (as desired) under Project **Settings → Workflows**
- [ ] Apply views from `.github/project-views/*.json` via API or UI
- [ ] Confirm filters parse (especially `-is:blocked` / `is:blocking`)
