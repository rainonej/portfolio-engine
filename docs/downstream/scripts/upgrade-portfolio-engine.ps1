<#
Upgrade all @portfolio-engine/* packages in the consumer repo to their latest
published version.

Run from your consumer repo root:
  ./docs/downstream/scripts/upgrade-portfolio-engine.ps1

To upgrade to the @next pre-release dist-tag instead of @latest, set:
  ./docs/downstream/scripts/upgrade-portfolio-engine.ps1 -DistTag next
#>

param(
  [string]$DistTag = 'latest'
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

Write-Host "[upgrade] Done. Run 'pnpm build' to verify no breaking changes."
