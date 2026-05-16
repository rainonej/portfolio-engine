# Vision

Portfolio Engine is an experiment in open-source software after the cost of small implementation tasks has collapsed.

The immediate product is an Astro/Tailwind backbone for personal and professional websites. The larger goal is a shared commons for agent-native website development.

## The problem

Most people can now describe the website feature they want. They may not know Astro, Tailwind, TypeScript, accessibility, deployment, or GitHub workflows, but they often know the need clearly:

- “I need a publications page.”
- “This mobile layout is wrong.”
- “I need a case-study format.”
- “This preview comment should become a fix.”
- “This project gallery should be reusable.”
- “This section belongs in every site like mine.”

AI agents can now implement many of these small tasks. But without architecture, constraints, and review, cheap code becomes fragile software.

If every person prompts a site from scratch, the ecosystem gets thousands of brittle one-off websites.

## The model

Portfolio Engine tries to create a better loop:

1. Site owners contribute needs, examples, feedback, taste, and acceptance criteria.
2. Maintainers classify requests by layer, risk, and generality.
3. AI agents or human contributors implement scoped issues.
4. CI, build checks, visual QA, and review gates run.
5. Humans review architecture, accessibility, design, and maintainability.
6. Reusable improvements land in the shared engine.
7. Consumer sites keep their own content, identity, brand, and local overrides.

## What “consumer-contributor” means

A consumer-contributor is a person who may not write framework code but still improves the project by contributing a real need.

Good consumer contributions include:

- feature requests with concrete examples;
- screenshots or preview comments;
- accessibility problems;
- setup friction reports;
- content-model needs;
- examples of recurring site structures;
- acceptance criteria for a useful capability.

Users do not need to become framework experts to shape the tools they rely on.

## What AI agents are for

Agents are useful when the task is narrow, the boundaries are explicit, and the result is reviewable.

Good agent tasks:

- docs improvements;
- small layout fixes;
- adding examples;
- implementing a scoped component variant;
- writing tests or checks;
- converting a well-specified feature request into a PR;
- updating a downstream site through supported content/config/override surfaces.

Bad agent tasks without human architecture review:

- broad rewrites;
- dependency changes;
- schema redesigns;
- route-system changes;
- governance changes;
- security-sensitive automation;
- public API changes;
- any change that affects all consumer sites without review.

## What humans are for

Humans keep the commons sane.

Human contributors should focus on:

- architecture;
- design systems;
- accessibility;
- maintainability;
- security;
- review;
- release discipline;
- governance;
- deciding whether a feature belongs downstream or upstream.

The goal is not to remove human judgment. The goal is to make it more valuable.

## The first use case

The first use case is serious personal/professional websites:

- portfolios;
- consulting sites;
- researcher sites;
- writing pages;
- work/project galleries;
- case studies;
- service pages;
- resume or CV-driven sites.

That is the wedge. The deeper experiment is a model of open-source collaboration where user needs, agent implementation, and human review can compound in public.

## Non-goals

Portfolio Engine is not:

- a no-code SaaS website builder;
- a generic theme marketplace;
- a fully autonomous AI-maintained repo;
- a promise that AI can safely merge anything;
- a replacement for human frontend/design/accessibility expertise.

## Guiding sentence

Portfolio Engine is an Apache-2.0 Astro/Tailwind backbone for agent-native websites: site owners contribute needs, AI agents implement scoped issues, and humans review the shared foundation.
