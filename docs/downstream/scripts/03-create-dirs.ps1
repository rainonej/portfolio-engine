$ErrorActionPreference = 'Stop'
Write-Host '[3/6] Creating required source directories'
$dirs = @('src/config','src/content/projects','src/content/writing','src/content/profile','src/content/testimonials','src/context','src/overrides','src/docs')
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
