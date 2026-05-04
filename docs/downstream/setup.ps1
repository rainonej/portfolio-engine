<#
Portfolio Engine downstream setup orchestrator (Windows)
Safe to read before running.
Use switches to skip phases, e.g.:
  ./docs/downstream/setup.ps1 -DryRun -SkipInstall -SkipGitignore
#>

param(
  [switch]$SkipPreflight,
  [switch]$SkipInstall,
  [switch]$SkipDirs,
  [switch]$SkipRouteFix,
  [switch]$SkipFeedback,
  [switch]$SkipGitignore,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$StepsDir = Join-Path $ScriptDir 'scripts'
if (-not (Test-Path $StepsDir)) { throw "Missing scripts directory: $StepsDir" }

function Step($kind, $msg) { Write-Host "`n[$kind] $msg" }
function Run-Step($name, $scriptPath, $skip) {
  if ($skip) { Step 'SKIP' $name; return }
  if ($DryRun) { Step 'DRY' "$name -> $scriptPath"; return }
  Step 'RUN' $name
  & $scriptPath
  Step 'OK' $name
}

Step 'INFO' "Starting downstream bootstrap in $(Get-Location)"
if ($DryRun) { Step 'INFO' 'DryRun enabled: no files will be modified' }
Run-Step 'Preflight checks' (Join-Path $StepsDir '01-preflight.ps1') $SkipPreflight
Run-Step 'Install packages' (Join-Path $StepsDir '02-install-packages.ps1') $SkipInstall
Run-Step 'Create directories' (Join-Path $StepsDir '03-create-dirs.ps1') $SkipDirs
Run-Step 'Remove scaffold route collision' (Join-Path $StepsDir '04-remove-index-route.ps1') $SkipRouteFix
Run-Step 'Seed setup feedback doc' (Join-Path $StepsDir '05-seed-feedback-log.ps1') $SkipFeedback
Run-Step 'Patch .gitignore' (Join-Path $StepsDir '06-patch-gitignore.ps1') $SkipGitignore

Step 'DONE' 'Bootstrap complete. Continue with docs/downstream/new-site-setup.md'
