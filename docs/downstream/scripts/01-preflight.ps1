$ErrorActionPreference = 'Stop'
Write-Host '[1/6] Preflight: verifying tools'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'node not found' }
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { throw 'pnpm not found' }
Write-Host "Node: $(node -v)"
Write-Host "pnpm: $(pnpm -v)"
