# Community launch plan

## Do not post everywhere at once

The goal is not raw traffic. The goal is useful contribution.

Sequence:

1. Stack-specific architecture review.
2. Design-system review.
3. Agent-workflow review.
4. Open-source governance review.
5. Broader user/side-project launch.

## Wave 1: technical foundation

### Astro Discord / r/astrojs

Goal: architecture critique.

Ask:

- Is the package/consumer split sane?
- Are route ownership and injection handled idiomatically?
- What should change before inviting contributors?

### r/tailwindcss

Goal: styling and design-system critique.

Ask:

- How should Tailwind guardrails work for AI-generated UI PRs?
- What should be tokens vs props vs overrides?

### r/DesignSystems

Goal: component governance.

Ask:

- How should override surfaces evolve?
- How should reusable components avoid becoming ad hoc?

## Wave 2: workflow/governance

### GitHub Community / r/github

Goal: issue/PR/Actions/project-board critique.

Ask:

- How should labels and templates route agent-safe tasks?
- What should be mandatory before agent PRs?

### Vercel Community

Goal: preview-feedback loop critique.

Ask:

- How should preview comments become GitHub issues?
- What metadata should be captured for agents and reviewers?

### r/opensource

Goal: governance and contributor model critique.

Ask:

- Is this a coherent open-source contribution model?
- What docs or policies are missing?

## Wave 3: AI-agent communities

### r/AI_Agents, r/ChatGPTCoding, r/ClaudeAI, r/cursor, r/vibecoding

Goal: stress-test the agent workflow.

Ask:

- What makes an issue safe for an agent?
- What belongs in AGENTS.md?
- What prevents broad rewrites?

## Wave 4: broad launch

### r/SideProject, DEV.to, Show HN, Product Hunt

Goal: users, forks, stars, setup friction reports.

Only post here after:

- README leads with the open-source/agent-native story;
- VISION.md exists;
- AGENTS.md exists;
- ARCHITECTURE.md exists;
- demo-site no longer looks like a personal resume site;
- a few starter issues are open and labeled.
