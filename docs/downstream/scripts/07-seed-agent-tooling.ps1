$ErrorActionPreference = 'Stop'

Write-Host '[7/7] Seeding optional agent tooling files'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DownstreamDir = Split-Path -Parent $ScriptDir
$TemplateDir = Join-Path $DownstreamDir 'templates/agent'
$VscodeTemplateDir = Join-Path $DownstreamDir 'templates/vscode'

function Install-IfMissing($src, $dest) {
  $parent = Split-Path -Parent $dest
  if ($parent -and -not (Test-Path $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }

  if (Test-Path $dest) {
    Write-Host "Exists: $dest; leaving as-is"
    return
  }

  Copy-Item $src $dest
  Write-Host "Created: $dest"
}

if (-not (Test-Path $TemplateDir)) {
  throw "Missing template directory: $TemplateDir. Copy the full docs/downstream directory before running setup."
}

Install-IfMissing (Join-Path $TemplateDir 'mcp.example.json') '.cursor/mcp.example.json'
Install-IfMissing (Join-Path $TemplateDir 'CLAUDE.md') 'CLAUDE.md'
Install-IfMissing (Join-Path $TemplateDir 'copilot-instructions.md') '.github/copilot-instructions.md'
Install-IfMissing (Join-Path $VscodeTemplateDir 'tasks.json') '.vscode/tasks.json'

if (-not (Test-Path '.gitignore')) {
  New-Item -ItemType File -Path '.gitignore' | Out-Null
}

$content = Get-Content '.gitignore' -Raw
if ($content -notmatch '(?m)^\.cursor/mcp\.json$') {
  Add-Content '.gitignore' "`n.cursor/mcp.json"
}

Write-Host 'Agent tooling seed complete.'
Write-Host 'Next: copy .cursor/mcp.example.json to .cursor/mcp.json if you want project-local Cursor MCP config.'
