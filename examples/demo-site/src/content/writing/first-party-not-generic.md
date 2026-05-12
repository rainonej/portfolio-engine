---
title: 'First-party, not generic'
date: 2026-03-15
description: 'Why portfolio-engine is built for one consumer at a time, and why being open-source is about transparency — not extensibility.'
tags: ['Philosophy', 'Design']
---

## The temptation

Every successful open-source project eventually hears the same request: "Could it support **\_**?" Plugin systems. Theme variants. Configuration knobs. Abstract base classes. Each request is reasonable on its own. Together they collapse into the same shape: an extensibility surface so wide that no one — not the maintainers, not the consumers, not anyone — can keep the whole picture in their head.

We chose not to build that.

## What "first-party" means here

`portfolio-engine` is built first for a single consumer (the author's own portfolio). When a second consumer comes along, we don't add a plugin system. We extract the part the second consumer needs into a named, contract-stable surface — and if the contract conflicts with the first consumer, we have a real, blunt conversation about which one wins.

This means three things in practice:

1. **There is no plugin marketplace.** There never will be.
2. **There is one theme.** Editorial. If a different visual identity is needed, that's a fork — and we'll cheerfully maintain the fork if the use case is real.
3. **Configuration surfaces are explicit.** Four JSON files, one Zod schema package, five named override surfaces. If something can't be expressed within those, the answer is "open a PR or fork", not "I'll add a config option".

## What "open-source" means here

Open-source on this project is about transparency. The code is public, the architecture is documented, the changelog is real, the issue tracker is open. That's not the same thing as "everyone can extend it in arbitrary ways".

Why state it this loudly? Because the implicit promise of most open-source is "use it however you want, and we'll support you". That promise is impossible to keep. Stating the boundary up front is more honest, and it lets the project actually move.

## The result

Three reference consumers (the author's site, the demo site you're reading, and the SSR demo) exercise the entire public surface area on every commit. When something breaks, it breaks loudly. When something needs to change, the impact is bounded. The product is small. That's the point.
