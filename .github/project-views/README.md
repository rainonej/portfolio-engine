# Versioned GitHub Project views

Each `*.json` file is a **request body** for the GitHub REST API
[Create a view for a user-owned project](https://docs.github.com/en/rest/projects/views?apiVersion=2022-11-28#create-a-view-for-a-user-owned-project)
(or the org equivalent). Fields: `name`, `layout` (`table`, `board`, or `roadmap`), optional `filter`.

**Source of truth for filters and workflow context:** [docs/github-project-board.md](../../docs/github-project-board.md).

## After changing JSON here

1. Ensure `gh` has the **project** scope: `gh auth refresh -s project`
2. Replace `USER` and `PROJECT_NUMBER` (e.g. `rainonej` and **2** from [Project 2](https://github.com/users/rainonej/projects/2) if that is your board).
3. Create or update views (POST creates a new view; duplicate names may error — delete old views in the UI first if re-seeding):

```bash
export API_VERSION=2022-11-28
export USER=rainonej
export PROJECT_NUMBER=2

for f in epics decisions planner-queue ready-for-claude copilot-lane \
         tasks-unblocked tasks-unblocked-blocking human-dev site-owner; do
  gh api --method POST "users/${USER}/projectsV2/${PROJECT_NUMBER}/views" \
    --input ".github/project-views/${f}.json" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: ${API_VERSION}"
done
```

If the API returns 422, check the filter string against the project filter bar in the UI; GitHub occasionally tightens query syntax.

**Built-in project automations** (e.g. “Item closed → Done”) are not represented in these files — configure those under Project **Settings → Workflows**.
