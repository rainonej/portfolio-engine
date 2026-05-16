# Roadmap

Portfolio Engine is early. This roadmap is intended to make the project legible to users and contributors.

## Alpha: shared foundation

Status: in progress.

Goals:

- publish core `@portfolio-engine/*` packages;
- maintain a canonical demo-site;
- document downstream setup;
- support typed config/content;
- support theme routes;
- support consumer-local routes;
- support named override surfaces;
- provide visual QA prompts;
- provide design review checklist;
- run CI and smoke tests.

Exit criteria:

- a new downstream site can be scaffolded from the docs;
- demo-site builds reliably;
- package boundaries are documented;
- README explains the vision without over-centering a single AI tool.

## Beta: agent-native contribution loop

Goals:

- root `AGENTS.md`;
- root `VISION.md`;
- root `ARCHITECTURE.md`;
- issue templates for agent tasks, preview feedback, accessibility review, architecture review, and design-system review;
- documented label taxonomy;
- documented project-board workflow;
- workflow-kit scaffolding for downstream repos;
- first external setup friction reports;
- first external contributor PR.

Exit criteria:

- a stranger can open a useful issue without knowing the internal repo history;
- an AI agent can follow a scoped issue and produce a reviewable PR;
- a maintainer can tell which changes are safe for agents and which require human judgment.

## Beta+: Vercel/GitHub feedback loop

Goals:

- document manual preview-feedback-to-issue flow;
- document semi-automated import path;
- explore Vercel Comments / GitHub Issues integration;
- define metadata needed for agent-ready issues;
- add workflow-kit helpers where useful.

Exit criteria:

- visual feedback can become a well-scoped GitHub issue;
- labels and templates route feedback correctly;
- no claims of full automation unless actually wired and tested.

## 1.0: stable engine contracts

Goals:

- stable public package APIs;
- migration guide;
- compatibility policy;
- documented breaking-change process;
- stable override-surface contracts;
- reference downstream site gallery;
- starter downstream template;
- expanded accessibility checks.

Exit criteria:

- downstream sites can upgrade with documented expectations;
- maintainers know what changes require major/minor/patch releases;
- external contributors understand how to propose new engine capabilities.

## Long-term ideas

- reusable gallery of site sections;
- richer visual QA automation;
- optional admin/reviewer UI improvements;
- starter templates for researchers, consultants, designers, educators, and founders;
- project-board automations;
- better downstream-to-upstream promotion tooling;
- examples of successful consumer-contributor issues.
