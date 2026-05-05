$ErrorActionPreference = 'Stop'

function Ensure-Gh {
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error 'GitHub CLI (gh) is not installed or not on PATH. Install from https://cli.github.com/'
    exit 1
  }
}

Ensure-Gh

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
  Write-Warning 'Could not resolve the workflow_dispatch Release run. Check Actions -> Release on main.'
  exit 0
}

gh run watch $runId --exit-status
Write-Host "Release run $runId completed."
Write-Host 'Tip: git fetch origin main --tags  (then refresh Git Graph)'
