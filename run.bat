@echo off
REM DataSense AI - Quick Launch Script for Windows
REM Usage: run.bat

cls
echo.
echo ============================================
echo   DataSense AI - Seaborn Dashboard
echo ============================================
echo.

echo 1. Checking prerequisites...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.9+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VER=%%i
echo   [OK] %PYTHON_VER%

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo   [OK] Node.js %NODE_VER%

echo.
echo 2. Installing dependencies...
echo.

REM Install backend deps
cd backend
echo   Installing Python packages...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo   [OK] Backend dependencies installed
cd ..

REM Install frontend deps
echo   Installing Node packages...
call npm install -q
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo   [OK] Frontend dependencies installed

echo.
echo ============================================
echo READY TO LAUNCH!
echo ============================================
echo.
echo Open TWO separate Command Prompt windows:
echo.
echo WINDOW 1 (Backend - Port 5000):
echo   cd backend
echo   python run.py
echo.
echo WINDOW 2 (Frontend - Port 5173):
echo   npm run dev
echo.
echo Then open in browser: http://localhost:5173
echo.
echo Test data: sample_data.csv
echo.
echo Documentation:
echo   - QUICK_START.md
echo   - README_SEABORN.md
echo   - FULL_STACK_DEPLOYMENT.md
echo.
pause
