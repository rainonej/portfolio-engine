# Reddit and community posts

Repo: https://github.com/rainonej/portfolio-engine  
Demo: https://portfolio-engine-demo-site.vercel.app

## r/opensource / general OSS

**Title:** I’m building an open-source Astro/Tailwind backbone for agent-native personal websites

I’m building an Apache-2.0 project called **Portfolio Engine**:

https://github.com/rainonej/portfolio-engine

Live demo:

https://portfolio-engine-demo-site.vercel.app

The immediate use case is personal/professional websites: portfolios, consulting sites, researcher sites, writing pages, project galleries, case studies, service pages, resume-driven sites, etc.

But the more interesting part is the workflow.

My thesis is that AI coding agents have made small implementation tasks much cheaper, but cheap code is not the same thing as good software. If every person vibe-codes a website from scratch, we get thousands of brittle one-off codebases.

So Portfolio Engine tries to provide a shared foundation:

- Astro/Tailwind packages
- typed content/config schemas
- reusable routes and layouts
- stable override surfaces
- design tokens
- visual QA prompts
- CI checks
- downstream consumer repos
- issue/PR workflows intended for human-reviewed agent contributions

The model is:

- site owners contribute needs, examples, feedback, and acceptance criteria
- AI agents implement scoped issues
- humans review architecture, accessibility, design, and maintainability
- reusable improvements flow back into the shared engine

I’m looking for feedback from open-source maintainers, Astro/Tailwind people, accessibility reviewers, design-system people, and AI-agent users.

Specific questions:

- Is the engine/consumer-site split sane?
- What should be safe for an AI agent to attempt?
- What should always require human review?
- What would make you trust or distrust this as an open-source contribution model?
- What is missing before strangers could actually use or contribute to it?

This is early, but real. I’m trying to make the foundation solid before encouraging more people to build on it.

---

## r/astrojs

**Title:** I’m building an Astro engine for personal sites where AI agents can make scoped PRs — architecture feedback wanted

I’m building **Portfolio Engine**, an Apache-2.0 Astro/Tailwind backbone for personal and professional websites:

https://github.com/rainonej/portfolio-engine

Demo:

https://portfolio-engine-demo-site.vercel.app

The technical architecture is:

- `@portfolio-engine/schema`: Zod schemas for config/content contracts
- `@portfolio-engine/engine-core`: Astro integration, config loading, route registry, virtual modules
- `@portfolio-engine/editorial-theme`: layouts, routes, components, theme defaults
- downstream consumer site: content, brand, config, local pages, overrides

The reason I’m building it this way is that AI coding agents are becoming good enough to implement small website features, but only if the repo has strong boundaries. I want a site owner to be able to request “add a publications page” or “fix this mobile layout,” have an agent produce a scoped PR, and still keep the shared engine reviewable and maintainable.

I’d love Astro-specific feedback:

- Is this package/consumer split idiomatic?
- Should this be a theme, template, integration, monorepo, or something else?
- Where should route ownership live?
- Where should consumer customization stop and engine code begin?
- What would make you comfortable reviewing PRs from AI-assisted contributors?
- What conventions should be fixed before inviting outside users?

I’m especially interested in blunt feedback about over-abstraction, route injection, content collections, config boundaries, and whether this is a sane Astro foundation.

---

## r/tailwindcss

**Title:** How would you design Tailwind guardrails for AI-generated UI PRs?

I’m building an open-source Astro/Tailwind project called **Portfolio Engine**:

https://github.com/rainonej/portfolio-engine

Demo:

https://portfolio-engine-demo-site.vercel.app

The project is a shared backbone for personal/professional websites. The idea is that site owners can describe a need, AI agents can implement scoped issues, and humans review the shared foundation before changes land.

The Tailwind/design-system problem is what I’m worried about.

Without strong rules, AI-generated UI can quickly become:

- random spacing
- inconsistent colors
- one-off component styles
- inaccessible markup
- fragile responsive behavior
- “Tailwind soup” that technically works but is impossible to maintain

Right now the engine uses theme config, semantic colors, typography config, named override surfaces, and downstream style overrides. I’m trying to make customization possible without letting every consumer fork the design system into chaos.

I’d love feedback from Tailwind/design-system people:

- What should be a token?
- What should be a component prop?
- What should be a local override?
- How strict should reusable section styles be?
- What rules should go in `AGENTS.md` for AI-generated UI?
- What visual QA checks would you require before merging?

I’m not looking for generic “AI bad” or “AI good” takes. I’m trying to design the rails that make AI-assisted UI work reviewable.

---

## r/AI_Agents / r/ChatGPTCoding / r/ClaudeAI / r/cursor

**Title:** I’m experimenting with an open-source workflow where site owners create issues and AI agents make scoped PRs

I’m building **Portfolio Engine**, an Apache-2.0 Astro/Tailwind backbone for personal/professional websites:

https://github.com/rainonej/portfolio-engine

Demo:

https://portfolio-engine-demo-site.vercel.app

The product is a website engine, but the workflow is the part I’m most interested in.

The loop I want:

1. A site owner reviews their site or preview deployment.
2. They open an issue describing a need or visual problem.
3. A maintainer classifies it: site-specific, reusable engine feature, design review, accessibility review, safe for agent, or human-only.
4. An AI agent or human contributor opens a scoped PR.
5. CI, build checks, and visual review run.
6. A human reviews before merge.
7. Reusable improvements go back into the shared engine.

The point is not “AI merges whatever it writes.” The point is that implementation is getting cheaper, so human judgment should move upward: architecture, review, accessibility, design systems, package boundaries, governance.

I’d love feedback from people using Copilot, Claude Code, Cursor, ChatGPT, Codex-style tools, or other coding agents:

- What makes an issue safe for an agent?
- What should never be assigned to an agent?
- How should `AGENTS.md` be structured?
- What issue template fields actually help?
- How do you stop agents from broad rewrites?
- What CI or visual QA gates matter most?
- Would you contribute to a repo designed this way?

I’m trying to build a boring, reviewable agent workflow — not a fully autonomous repo.

---

## r/SideProject / r/vibecoding

**Title:** What if personal websites shared an open-source engine instead of everyone vibe-coding from scratch?

I’m building **Portfolio Engine**:

https://github.com/rainonej/portfolio-engine

Live demo:

https://portfolio-engine-demo-site.vercel.app

It is an open-source Astro/Tailwind backbone for personal and professional websites.

The idea is that most people can now describe the website feature they want:

- add a project gallery
- add a publications page
- add a case-study layout
- embed a scheduling or demo tool
- fix a mobile layout issue
- change a section’s structure
- add a reusable content type

AI agents can often implement a first pass. But if everyone starts from scratch, everyone gets a different brittle codebase.

Portfolio Engine tries to make the useful parts shared:

- reusable sections
- typed content/config
- theme tokens
- stable override surfaces
- visual QA prompts
- GitHub issues and PRs
- human review before reusable changes land upstream

Site owners do not need to become framework experts. They can contribute needs, examples, feedback, and acceptance criteria. Developers and designers can improve the shared foundation. AI agents can handle narrow implementation tasks.

I’m looking for early users and contributors. Useful help could be:

- try the setup flow
- open a friction report
- review the design system
- review the Astro architecture
- suggest a reusable site feature
- test whether an AI agent can follow the docs
- point out what would make this too confusing to use

This is early, but the demo and repo are public.

---

## Hacker News / Show HN

**Title:** Show HN: Portfolio Engine — an open-source Astro/Tailwind backbone for agent-native websites

I built **Portfolio Engine**, an Apache-2.0 Astro/Tailwind engine for personal and professional websites.

Repo: https://github.com/rainonej/portfolio-engine  
Demo: https://portfolio-engine-demo-site.vercel.app

The core idea: AI coding agents have made small implementation tasks cheaper, but they have not made architecture, review, accessibility, or maintainability optional.

Portfolio Engine tries to create a shared backbone instead of having every person generate a one-off website from scratch.

It includes:

- Astro/Tailwind packages
- typed content/config schemas
- theme-injected routes
- consumer-local routes
- named override surfaces
- semantic theme config
- visual QA prompts
- design review checklist
- CI and smoke tests
- downstream setup docs
- early workflow tooling for agent-assisted contributions

The contribution model I’m aiming for:

- site owners contribute needs and acceptance criteria
- AI agents implement scoped issues
- humans review the shared foundation
- reusable improvements go back into the engine

The project is early. I’m especially interested in criticism of the architecture and contribution model: where this will break, what should be simplified, and what would make it trustworthy enough for outside contributors.
