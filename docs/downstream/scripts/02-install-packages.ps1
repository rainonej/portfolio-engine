$ErrorActionPreference = 'Stop'
Write-Host '[2/6] Installing required packages'
if (-not (Test-Path 'package.json')) { throw 'package.json not found. Run from scaffolded repo root.' }
pnpm add @portfolio-engine/editorial-theme @portfolio-engine/admin-tools @astrojs/vercel
