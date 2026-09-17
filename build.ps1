param()

$root = $PSScriptRoot

Write-Host "========================================"
Write-Host "Building Portfolio Site (HTML + JS)"
Write-Host "========================================"

# 1. Build index.html from src/html/
& (Join-Path $root "src\html\build.ps1")
if (-not $?) {
    Write-Error "HTML build failed"
    exit 1
}

# 2. Build src/bundle.js from src/bundle/
& (Join-Path $root "src\bundle\build.ps1")
if (-not $?) {
    Write-Error "Bundle JS build failed"
    exit 1
}

Write-Host ""
Write-Host "Site build complete. 100% offline-ready." -ForegroundColor Green
