Write-Host "Starting AuraFit ML FastAPI Backend Server..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
& "venv\Scripts\uvicorn.exe" app.main:app --host 127.0.0.1 --port 8000 --reload
