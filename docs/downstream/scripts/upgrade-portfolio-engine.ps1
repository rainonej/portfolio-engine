<#
Upgrade all @portfolio-engine/* packages in the consumer repo to the selected
dist-tag.

Run from your consumer repo root:
  ./docs/downstream/scripts/upgrade-portfolio-engine.ps1

To upgrade to the @next pre-release dist-tag instead of @latest, set:
  ./docs/downstream/scripts/upgrade-portfolio-engine.ps1 -DistTag next

To also run verification and generate an agent handoff prompt:
  ./docs/downstream/scripts/upgrade-portfolio-engine.ps1 -AgentHandoff
#>

param(
  [string]$DistTag = 'latest',
  [switch]$AgentHandoff
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path 'package.json')) {
  throw 'package.json not found. Run from your consumer repo root.'
}

Write-Host '[upgrade] Discovering @portfolio-engine/* packages in package.json...'

$pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json
$deps = @{}
if ($pkg.PSObject.Properties['dependencies']) {
  $pkg.dependencies.PSObject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value }
}
if ($pkg.PSObject.Properties['devDependencies']) {
  $pkg.devDependencies.PSObject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value }
}

$pe = @($deps.Keys | Where-Object { $_ -like '@portfolio-engine/*' })
if ($pe.Count -eq 0) {
  throw 'No @portfolio-engine/* packages found in package.json.'
}

$pkgArgs = $pe | ForEach-Object { "${_}@${DistTag}" }

Write-Host "[upgrade] Upgrading to @${DistTag}: $($pkgArgs -join ' ')"
& pnpm add @pkgArgs

if (-not $AgentHandoff) {
  Write-Host "[upgrade] Done. Run 'pnpm check' and 'pnpm build' to verify no breaking changes."
  exit 0
}

$handoffDir = Join-Path '.portfolio-engine' 'upgrade-handoff'
New-Item -ItemType Directory -Path $handoffDir -Force | Out-Null
$checkLog = Join-Path $handoffDir 'pnpm-check.log'
$buildLog = Join-Path $handoffDir 'pnpm-build.log'
$promptFile = Join-Path $handoffDir 'agent-upgrade-prompt.md'

Write-Host '[upgrade] -AgentHandoff -> running pnpm check...'
& pnpm check *>&1 | Tee-Object -FilePath $checkLog
$checkStatus = $LASTEXITCODE

Write-Host '[upgrade] -AgentHandoff -> running pnpm build...'
& pnpm build *>&1 | Tee-Object -FilePath $buildLog
$buildStatus = $LASTEXITCODE

$prompt = @"
# Package upgrade agent handoff

Use this prompt in Copilot/Claude after upgrading `@portfolio-engine/*`.

## Context

- Dist tag used: `$DistTag`
- Upgraded packages: `$($pe -join ' ')`
- Check exit code: `$checkStatus`
- Build exit code: `$buildStatus`
- Check log: `$checkLog`
- Build log: `$buildLog`

## Task

Create a new branch from the current branch to handle any issues introduced by this upgrade.

1. Read `docs/downstream/upgrade-path.md` in this repo and follow the **AI / coding agents** section.
2. For each upgraded package, read `CHANGELOG.md` and merge every `#### Agent migration` block in the semver window into one checklist.
3. Resolve issues surfaced by `pnpm check` and `pnpm build` logs.
4. Re-run `pnpm check` and `pnpm build` until both pass.
5. Open a PR into `origin/dev` that summarizes:
   - package versions upgraded
   - applied Agent migration steps
   - resolved warnings/errors
"@

Set-Content -Path $promptFile -Value $prompt -Encoding UTF8

Write-Host "[upgrade] Agent handoff prompt written: $promptFile"
Write-Host '[upgrade] Next step: paste that prompt into Copilot/Claude.'
