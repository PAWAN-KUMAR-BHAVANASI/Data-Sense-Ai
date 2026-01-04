@echo off
REM DataSense AI - Local Testing Script
REM Opens both backend and frontend in new windows

setlocal enabledelayedexpansion

cd /d "C:\Users\A s u s\OneDrive\Desktop\Data Sense Ai\Data-Sense-Ai"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║    DataSense AI - Local Testing                        ║
echo ║    Starting both backend and frontend                  ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Start Backend in new window
echo Starting Flask backend on port 5000...
start "DataSense Backend" cmd /k "cd backend && python run.py"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend in new window
echo Starting React frontend on port 5173...
start "DataSense Frontend" cmd /k "npm run dev"

REM Wait a moment
timeout /t 2 /nobreak

echo.
echo ═══════════════════════════════════════════════════════════
echo ✅ Both services are starting...
echo.
echo Backend:   http://localhost:5000
echo Frontend:  http://localhost:5173
echo.
echo 💡 Two new windows should have opened:
echo    1. Backend (Flask) - port 5000
echo    2. Frontend (React) - port 5173
echo.
echo 📊 Test Steps:
echo    1. Wait for frontend to compile (30-60 sec)
echo    2. Browser should open http://localhost:5173
echo    3. Upload sample_data.csv
echo    4. Try all dashboard features
echo    5. Test Seaborn plots in "Seaborn Stats" tab
echo.
echo ⏹️  To stop:
echo    Close both windows or Ctrl+C in each
echo.
echo ═══════════════════════════════════════════════════════════
echo.
