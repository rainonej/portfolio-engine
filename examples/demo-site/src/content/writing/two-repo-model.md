---
title: 'The two-repo model'
date: 2026-02-04
description: "Engine packages live in a public repo. Your content, config, and identity live in a private repo. They share no git history — and that's the whole point."
tags: ['Architecture', 'Privacy', 'Workflows']
---

## The split

portfolio-engine has two natural git repos:

- The **engine repo** (this one) — public, MIT-licensed, contains the four `@portfolio-engine/*` packages, the docs, the demo site, and the SSR demo.
- The **consumer repo** — private, contains your config, content, photos, résumé PDF, override components, and the `.env` with your GitHub OAuth client secret.

They share no git history. They share no secrets. They share a clear contract: the consumer repo depends on published npm versions of the engine packages.

## Why the split is non-negotiable

If your CV, your client list, and your draft writing live in the same repo as the engine, three bad things happen:

1. **Your private content is one `git push --force` away from being public.** Even with private forks, a mistake means leaked drafts.
2. **Engine contributors get visibility into your personal data.** They shouldn't.
3. **Engine releases get tangled in your content edits.** You can't ship `0.7.0` cleanly if the working tree also has a half-written blog post.

By making the split structural — two repos, no merging — none of these failure modes are possible.

## How upgrades work

Bump `@portfolio-engine/*` versions in your consumer repo's `package.json`. Run `pnpm install`. Run the build. Read the changelog if anything fails. There's a one-click upgrade script (`docs/downstream/scripts/upgrade-portfolio-engine.{sh,ps1}`) that pins every package to `@latest` in lockstep, plus VS Code task wiring for it.

## The agent angle

Because the engine repo is public, AI coding agents have full visibility into it during setup. They can read the architecture docs, inspect the schemas, and reason about overrides without needing access to your private content. The setup-with-Claude flow leans on this: the agent operates on the public engine docs from the consumer repo, with read-only knowledge of what the engine can do.
