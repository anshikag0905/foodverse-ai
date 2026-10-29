@echo off
title FoodVerse AI - Local Launcher
echo ===================================================
echo           Starting FoodVerse AI Locally
echo ===================================================
echo.

cd /d "%~dp0"

set "PY_CMD=python"
if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set "PY_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
)

echo [1/2] Launching Python FastAPI Backend on http://127.0.0.1:8000 ...
start "FoodVerse AI - Backend Server" cmd /k "cd /d %~dp0backend && \"%PY_CMD%\" run_server.py"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Vite Frontend on http://localhost:5173 ...
start "FoodVerse AI - Frontend Dev Server" cmd /k "cd /d %~dp0frontend && npm run dev"

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
