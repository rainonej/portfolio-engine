$ErrorActionPreference = 'Stop'
Write-Host '[6/6] Ensuring .gitignore contains local/build artifacts'
if (-not (Test-Path '.gitignore')) { New-Item -ItemType File -Path '.gitignore' | Out-Null }
$content = Get-Content '.gitignore' -Raw
if ($content -notmatch '(?m)^\.portfolio-engine/$') { Add-Content '.gitignore' '.portfolio-engine/' }
if ($content -notmatch '(?m)^\.vercel/$') { Add-Content '.gitignore' '.vercel/' }
