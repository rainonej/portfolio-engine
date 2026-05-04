$ErrorActionPreference = 'Stop'
Write-Host '[4/6] Removing scaffold src/pages/index.astro if present'
if (Test-Path 'src/pages/index.astro') { Remove-Item 'src/pages/index.astro' -Force; Write-Host 'Removed src/pages/index.astro' } else { Write-Host 'No scaffold index route found' }
