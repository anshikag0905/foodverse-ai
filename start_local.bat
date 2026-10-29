@echo off
title FoodVerse AI - Local Launcher
echo ===================================================
echo           Starting FoodVerse AI Locally
echo ===================================================
echo.

cd /d "%~dp0"

:: Detect Python executable
set "PYTHON_EXE=python"
if exist "C:\Users\Ashutoshpandey\AppData\Local\Programs\Python\Python311\python.exe" (
    set "PYTHON_EXE=C:\Users\Ashutoshpandey\AppData\Local\Programs\Python\Python311\python.exe"
) else (
    where py >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON_EXE=py -3"
    )
)

echo [1/2] Launching Python FastAPI Backend on http://127.0.0.1:8000 ...
start "FoodVerse AI - Backend Server" cmd /k "cd /d %~dp0backend && "%PYTHON_EXE%" run_server.py"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Vite Frontend on http://localhost:5173 ...
start "FoodVerse AI - Frontend Dev Server" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 4 /nobreak >nul

echo.
echo Opening FoodVerse AI in your default web browser...
start http://localhost:5173

echo.
echo ===================================================
echo   FoodVerse AI is now running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://127.0.0.1:8000
echo   API Docs : http://127.0.0.1:8000/docs
echo ===================================================
echo.
pause
