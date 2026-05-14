// @portfolio-engine/workflow-kit
// Reusable downstream tooling: boundary-check scripts, AI prompts,
// GitHub Actions templates, and VS Code/Cursor setup.
//
// Templates live under packages/workflow-kit/templates/.
// Copy them into your downstream repo intentionally; do not auto-overwrite.

export const WORKFLOW_KIT_VERSION = '0.0.2';

export const TEMPLATE_PATHS = {
  agent: {
    claudeMd: 'templates/agent/CLAUDE.md',
    copilotInstructions: 'templates/agent/copilot-instructions.md',
  },
  github: {
    ci: 'templates/github/ci.yml',
    pullRequestTemplate: 'templates/github/pull_request_template.md',
    issueTemplate: 'templates/github/issue_template.md',
  },
  vscode: {
    extensions: 'templates/vscode/extensions.json',
    settings: 'templates/vscode/settings.json',
    tasks: 'templates/vscode/tasks.json',
  },
  cursor: {
    mcpExample: 'templates/cursor/mcp.example.json',
    boundaryRules: 'templates/cursor/rules/portfolio-engine-boundaries.md',
    agentRules: 'templates/cursor/rules/downstream-agent-rules.md',
  },
  prompts: {
    architectureReview: 'templates/prompts/architecture-review.prompt.md',
    downstreamUpgrade: 'templates/prompts/downstream-upgrade.prompt.md',
    contentBoundaryReview: 'templates/prompts/content-boundary-review.prompt.md',
    visualReview: 'templates/prompts/visual-review.prompt.md',
  },
  scripts: {
    checkContentBoundaries: 'templates/scripts/check-content-boundaries.mjs',
    checkRenderedLinks: 'templates/scripts/check-rendered-links.mjs',
    checkSchemaStrictness: 'templates/scripts/check-schema-strictness.mjs',
    checkUnused: 'templates/scripts/check-unused.mjs',
    checkToolingVersion: 'templates/scripts/check-tooling-version.mjs',
  },
} as const;
