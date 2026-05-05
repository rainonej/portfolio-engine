$ErrorActionPreference = 'Stop'
Write-Host '[5/6] Seeding setup feedback log'
New-Item -ItemType Directory -Force -Path 'src/docs' | Out-Null
if (-not (Test-Path 'src/docs/setup-feedback.md')) {
@'
# Setup Feedback Log

Capture friction, missing steps, and confusion encountered during setup.
Please remove personal information and secrets before sharing publicly.
'@ | Set-Content 'src/docs/setup-feedback.md'
} else {
  Write-Host 'setup-feedback.md already exists; leaving as-is'
}
