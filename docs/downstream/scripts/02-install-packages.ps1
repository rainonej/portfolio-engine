$ErrorActionPreference = 'Stop'
Write-Host '[2/7] Installing required packages'
if (-not (Test-Path 'package.json')) { throw 'package.json not found. Run from scaffolded repo root.' }
pnpm add @portfolio-engine/editorial-theme @astrojs/vercel
Write-Host 'NOTE: @portfolio-engine/admin-tools is currently private/unpublished.'
Write-Host 'Skip installing it in standalone consumer repos until it is published.'
