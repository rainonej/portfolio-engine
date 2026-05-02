# Downstream-originated contributions

Portfolio Engine is designed so consumers can become contributors.

A consumer might ask an AI agent to add a feature to their own site. If the feature is not possible through local content, config, context, registry, or override layers, the request may become an upstream feature proposal.

## Escalation ladder

1. `src/content`
2. `src/config`
3. `src/context`
4. `src/overrides`
5. `src/registry`
6. temporary downstream workaround
7. upstream feature request
8. upstream pull request

## Good upstream candidates

A downstream request is a good upstream candidate when it solves a reusable problem, is not specific to one site owner, can be configured by consumers, fits a known package boundary, has a clean API, and can be documented and tested.

## Bad upstream candidates

A request should stay downstream when it hardcodes a person's name/brand/content, only solves a one-off design preference, contains private assets/data, bypasses the layer model, or makes the shared engine harder to maintain.

## What to include in the upstream issue

Include downstream context, original request, attempted local solution, why local layers were insufficient, proposed general capability, affected package, non-goals, and privacy review.

## Temporary patches

If a downstream repo uses a temporary patch, track reason, affected package, local patch location, upstream issue/PR, removal condition, and owner.
