@echo off
echo Customer Success Plan - Local Server Launcher
echo =============================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting server with Python...
    python server.py
    pause
    exit
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python not found. Starting server with Node.js...
    node server.js
    pause
    exit
)

echo ERROR: Neither Python nor Node.js was found on your system.
echo Please install Python 3 or Node.js to run the local server.
echo.
echo Visit:
echo - Python: https://www.python.org/downloads/
echo - Node.js: https://nodejs.org/
echo.
pause