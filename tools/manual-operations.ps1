param(
  [ValidateSet('Status','Collect','Deploy')]
  [string]$Action = 'Status'
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeNode = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
if (!(Test-Path -LiteralPath $runtimeNode)) { throw 'Bundled Node runtime missing.' }
Push-Location $projectRoot
try {
  switch ($Action) {
    'Status' {
      $health = Invoke-RestMethod 'https://akkigo-boja.ansqhd5774.workers.dev/health'
      [pscustomobject]@{Status=$health.status;OAuthConfigured=$health.oauthConfigured;Publishing=$health.publishing}
    }
    'Collect' {
      $tokenPath = Join-Path $projectRoot '.admin-token'
      if (!(Test-Path -LiteralPath $tokenPath)) { throw 'Local admin credential missing.' }
      $adminCredential = (Get-Content -LiteralPath $tokenPath -Raw).Trim()
      try {
        $result = Invoke-RestMethod 'https://akkigo-boja.ansqhd5774.workers.dev/internal/collect' -Method Post -Headers @{Authorization="Bearer $adminCredential"}
        $result.observations | Select-Object id,httpStatus,status
      } catch { throw 'Manual collection did not complete. Inspect the existing D1 checkpoint before retrying.' }
      finally { $adminCredential=$null }
    }
    'Deploy' {
      & $runtimeNode --test
      if ($LASTEXITCODE -ne 0) { throw 'Tests failed; deployment stopped.' }
      & $runtimeNode node_modules/wrangler/bin/wrangler.js deploy
      if ($LASTEXITCODE -ne 0) { throw 'Deployment not confirmed; inspect remote version before retrying.' }
    }
  }
} finally { Pop-Location }
