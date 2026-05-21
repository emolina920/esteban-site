@echo off
cd /d "%~dp0"
echo Iniciando servidor...
start "" "http://localhost:3000"
timeout /t 2 /noisy >nul
npm run dev
