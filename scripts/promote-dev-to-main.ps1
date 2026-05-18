$ErrorActionPreference = 'Stop'

function Ensure-Gh {
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error 'GitHub CLI (gh) is not installed or not on PATH. Install from https://cli.github.com/'
    exit 1
  }
}

Ensure-Gh

function Verify-MainPublishedVersions {
  param(
    [string]$RunUrl
  )

  Write-Host ''
  Write-Host 'Verifying npm registry matches origin/main package versions...'
  git fetch origin main --tags | Out-Null

  $packages = @(
    @{ Name = '@portfolio-engine/schema'; Path = 'packages/schema/package.json' },
    @{ Name = '@portfolio-engine/engine-core'; Path = 'packages/engine-core/package.json' },
    @{ Name = '@portfolio-engine/editorial-theme'; Path = 'packages/editorial-theme/package.json' },
    @{ Name = '@portfolio-engine/admin-tools'; Path = 'packages/admin-tools/package.json' }
  )

  $mismatches = @()
  foreach ($pkg in $packages) {
    $mainVersion = (git show "origin/main:$($pkg.Path)").Trim() | ConvertFrom-Json | Select-Object -ExpandProperty version
    $npmVersion = ''
    try {
      $npmVersion = (npm view $pkg.Name version 2>$null).Trim()
    } catch {
      $npmVersion = '<lookup failed>'
    }
    if ([string]::IsNullOrWhiteSpace($npmVersion)) { $npmVersion = '<lookup failed>' }
    if ($mainVersion -ne $npmVersion) {
      $mismatches += "$($pkg.Name): main=$mainVersion, npm=$npmVersion"
    }
  }

  if ($mismatches.Count -gt 0) {
    Write-Host ''
    Write-Error @"
Release finished but npm does not match origin/main versions.
Mismatched packages:
 - $($mismatches -join "`n - ")

Release run: $RunUrl

This indicates publish did not apply the latest version commit (or npm publish failed/no-op unexpectedly).
Inspect the Release run logs (Publish to npm job) before retrying.
"@
    exit 1
  }

  Write-Host 'Registry verification passed: npm versions match origin/main.'
}

# gh -q filter: build in a variable so PowerShell does not parse ".[0]" as member access.
$prNumberQuery = '.[0].number'

git fetch origin dev main

$dev = (git rev-parse origin/dev).Trim()
$main = (git rev-parse origin/main).Trim()
if ($dev -eq $main) {
  Write-Host 'origin/dev and origin/main already match - nothing to promote.'
  exit 0
}

$pr = (gh pr list --base main --head dev --state open --json number -q $prNumberQuery).Trim()
if ([string]::IsNullOrWhiteSpace($pr)) {
  Write-Host 'Creating promotion PR dev -> main...'
  gh pr create --base main --head dev `
    --title 'chore(release): promote dev -> main' `
    --body 'Promotion via VS Code task Promote dev -> main (scripts/promote-dev-to-main.ps1).'
  $pr = (gh pr list --base main --head dev --state open --json number -q $prNumberQuery).Trim()
}

if ([string]::IsNullOrWhiteSpace($pr)) {
  Write-Error 'Could not create or find an open promotion PR.'
  exit 1
}

Write-Host "PR #$pr - waiting for checks (Ctrl+C to stop)..."
gh pr checks $pr --watch

Write-Host "Merging PR #$pr ..."
gh pr merge $pr --merge --delete-branch=false

# The merge push starts Release (changeset version when .changeset/*.md exist). That job
# pushes the RELEASING commit with GITHUB_TOKEN, which does not trigger a second workflow,
# so npm publish would not run until another Release trigger. Always queue a follow-up
# Release (waits behind the in-flight run due to workflow concurrency on main).
Write-Host ''
Write-Host 'Queuing follow-up Release on main (workflow_dispatch)...'
$dispatchAfter = [datetime]::UtcNow.AddSeconds(-30)
gh workflow run Release --ref main

Write-Host 'Waiting for the workflow_dispatch Release run to finish...'
$runId = $null
for ($k = 0; $k -lt 120; $k++) {
  $rows = gh run list --workflow Release --branch main --limit 15 --json databaseId,event,status,createdAt | ConvertFrom-Json
  $candidates = @()
  foreach ($row in $rows) {
    if ($row.event -ne 'workflow_dispatch') { continue }
    try {
      $created = [datetime]::Parse($row.createdAt, $null, [System.Globalization.DateTimeStyles]::RoundtripKind)
    } catch {
      continue
    }
    if ($created -ge $dispatchAfter) {
      $candidates += [pscustomobject]@{ Id = $row.databaseId; Created = $created }
    }
  }
  if ($candidates.Count -gt 0) {
    $runId = ($candidates | Sort-Object Created -Descending | Select-Object -First 1).Id
    break
  }
  Start-Sleep -Seconds 3
}

if ($null -eq $runId) {
  Write-Error 'Could not resolve the workflow_dispatch Release run. Check Actions -> Release on main and verify workflow_dispatch was accepted.'
  exit 1
}

gh run watch $runId --exit-status
Write-Host "Release run $runId completed."
Write-Host 'Tip: git fetch origin main --tags  (then refresh Git Graph)'

$repoName = (gh repo view --json nameWithOwner -q .nameWithOwner).Trim()
$verifyRunId = $runId

# When changesets are pending the version job pushes a bump commit (via PAT) and sets
# skip_publish=true. That push event triggers a second Release run which does the actual
# npm publish. Detect this and wait for the follow-up run before verifying npm.
$dispatchJobs = (gh run view $runId --json jobs | ConvertFrom-Json).jobs
$publishJob = $dispatchJobs | Where-Object { $_.name -eq 'Publish to npm' }
if ($publishJob -and $publishJob.conclusion -eq 'skipped') {
  Write-Host ''
  Write-Host 'Publish job skipped (version-bump commit was pushed). Waiting for the follow-up push-triggered publish run...'
  $followUpId = $null
  for ($k = 0; $k -lt 60; $k++) {
    $rows = gh run list --workflow Release --branch main --limit 10 --json databaseId,event,createdAt | ConvertFrom-Json
    foreach ($row in $rows) {
      if ($row.event -ne 'push') { continue }
      try {
        $created = [datetime]::Parse($row.createdAt, $null, [System.Globalization.DateTimeStyles]::RoundtripKind)
      } catch { continue }
      if ($created -ge $dispatchAfter) { $followUpId = $row.databaseId; break }
    }
    if ($null -ne $followUpId) { break }
    Start-Sleep -Seconds 5
  }
  if ($null -ne $followUpId) {
    gh run watch $followUpId --exit-status
    Write-Host "Publish run $followUpId completed."
    $verifyRunId = $followUpId
  } else {
    Write-Warning 'Could not find the follow-up publish run within timeout. Verifying npm anyway.'
  }
}

$runUrl = "https://github.com/$repoName/actions/runs/$verifyRunId"
Verify-MainPublishedVersions -RunUrl $runUrl
