Write-Host "Starting AuraFit ML React Frontend..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\frontend"
cmd /c "npm run dev -- --host"
