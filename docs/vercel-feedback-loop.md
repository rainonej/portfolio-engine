# Vercel feedback loop

This document describes the intended Portfolio Engine preview-feedback loop.

## Goal

Site owners should be able to review a preview deployment, leave visual feedback, and have that feedback become a structured GitHub issue that can be triaged for human or agent implementation.

## Current status

The intended workflow is partly manual today.

The repo can document and support:

- preview review;
- visual QA prompts;
- GitHub issue templates;
- labels for feedback source and owner;
- scoped agent-ready tasks;
- PR review;
- CI/build checks.

Do not claim fully automatic Vercel-comment-to-agent-PR behavior unless it is implemented and tested.

## Manual flow today

1. Site owner reviews a Vercel preview.
2. Site owner leaves feedback or screenshots.
3. Maintainer creates a GitHub issue using the preview-feedback template.
4. Maintainer labels the issue:
   - `source:vercel`;
   - appropriate `area:*`;
   - appropriate `owner:*`;
   - readiness/risk labels.
5. A human or agent works the issue.
6. PR opens.
7. New preview deploys.
8. Human reviews the preview before merge.

## Future automation target

The future workflow-kit target is:

```text
Vercel preview comment
  → structured GitHub issue
  → triage labels
  → agent-safe issue if appropriate
  → PR
  → preview deployment
  → visual review
  → merge
```

## Useful metadata for preview feedback

A good feedback issue should include:

- preview URL;
- route/path;
- viewport size;
- screenshot;
- visible problem;
- expected behavior;
- whether this is site-specific or reusable;
- affected component or section if known;
- acceptance criteria;
- visual QA routes;
- whether agent implementation is acceptable.

## Safety rules

Do not automatically assign agents to issues that involve:

- ambiguous design judgment;
- broad layout redesign;
- accessibility-sensitive changes without review;
- auth/admin/security;
- package boundary changes;
- dependency changes;
- production settings;
- secrets or private content.

## Template title format

```text
[Preview feedback]: concise description
```

Example:

```text
[Preview feedback]: homepage CTA still advertises booking instead of GitHub contribution
```
