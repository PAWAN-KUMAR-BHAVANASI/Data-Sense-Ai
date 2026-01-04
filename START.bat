@echo off
REM DataSense AI - Full Stack Startup Script
REM Starts both Frontend and Backend servers

setlocal enabledelayedexpansion

echo.
echo ======================================
echo     DataSense AI - Startup
echo ======================================
echo.

REM Get the directory of this script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Kill any existing processes
echo Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Start Backend
echo.
echo [1/2] Starting Flask Backend on port 5000...
start "DataSense Backend" cmd /k python -c "import os; os.chdir('backend'); from app import app; print('\n=== Flask Backend Started ===\nAPI: http://127.0.0.1:5000\nPress Ctrl+C to stop\n'); app.run(host='127.0.0.1', port=5000, debug=False)"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [2/2] Starting React Frontend on port 3000...
start "DataSense Frontend" cmd /k "node node_modules/vite/bin/vite.js --port 3000"

echo.
echo ======================================
echo     Services Starting...
echo ======================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Both windows should open in new terminals.
echo Press Ctrl+C in either window to stop that service.
echo.
pause
