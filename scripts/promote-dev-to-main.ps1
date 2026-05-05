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

Write-Host 'Done. main should update shortly; Release runs on push to main.'
