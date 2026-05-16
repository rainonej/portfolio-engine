# Apply order

Recommended order for applying this launch kit.

## PR 1: repo-front-door docs

Add or replace:

- `README.md`
- `VISION.md`
- `AGENTS.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `docs/agent-workflow.md`
- `docs/vercel-feedback-loop.md`

Goal: make the repo legible to vibe coders and human contributors.

## PR 2: issue templates

Add:

- `.github/ISSUE_TEMPLATE/agent_task.yml`
- `.github/ISSUE_TEMPLATE/vercel_preview_feedback.yml`
- `.github/ISSUE_TEMPLATE/architecture_review.yml`
- `.github/ISSUE_TEMPLATE/accessibility_review.yml`
- `.github/ISSUE_TEMPLATE/design_system_review.yml`
- `.github/ISSUE_TEMPLATE/consumer_feature_request.yml`

Goal: make outside feedback structured and agent-readable.

## PR 3: demo-site positioning

Update or compare against:

- `examples/demo-site/src/config/site.json`
- `examples/demo-site/src/config/navigation.json`
- `examples/demo-site/src/config/features.json`
- `examples/demo-site/src/content/profile/person.json`

Goal: ensure the demo-site is a project showcase, not a personal/resume site.

## PR 4: launch posts

Use:

- `docs/community-launch-plan.md`
- `docs/reddit-posts.md`

Goal: launch in waves, starting with technical communities.
