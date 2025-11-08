@echo off
echo ========================================
echo Starting Portfolio Backend Server
echo ========================================
echo.

cd /d "%~dp0backend"

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Make sure you're running this from the SnapFolio folder
    pause
    exit /b 1
)

echo Starting server...
echo.
echo Server will run on: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start

pause

