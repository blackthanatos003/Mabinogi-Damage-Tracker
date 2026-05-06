@echo off
setlocal enabledelayedexpansion

REM Read version from VERSION file
set /p VERSION=<VERSION
if "%VERSION%"=="" (
    echo ERROR: VERSION file is empty or missing
    exit /b 1
)

echo ========================================
echo Building %VERSION%
echo ========================================

REM 1. Build React client
echo [1/4] Building React client...
cd Mabinogi_Damage_Tracker.client
call npm install --silent
call npm run build
if %ERRORLEVEL% neq 0 exit /b 1
cd ..

REM 2. Copy client build to wwwroot
echo [2/4] Copying static files to wwwroot...
if exist Mabinogi_Damage_Tracker.Server\wwwroot rmdir /s /q Mabinogi_Damage_Tracker.Server\wwwroot
mkdir Mabinogi_Damage_Tracker.Server\wwwroot
xcopy /e /q Mabinogi_Damage_Tracker.client\build\* Mabinogi_Damage_Tracker.Server\wwwroot\

REM 3. Build .NET server
echo [3/4] Building .NET server...
cd Mabinogi_Damage_Tracker.Server
dotnet build -c Release
if %ERRORLEVEL% neq 0 exit /b 1
cd ..

REM 4. Package release
echo [4/4] Packaging release...
set RELEASE_DIR=Release\release-%VERSION%
if exist "%RELEASE_DIR%" rmdir /s /q "%RELEASE_DIR%"
mkdir "%RELEASE_DIR%"
mkdir "%RELEASE_DIR%\wwwroot"

copy Mabinogi_Damage_Tracker.Server\bin\Release\net8.0\*.exe "%RELEASE_DIR%\" >nul
copy Mabinogi_Damage_Tracker.Server\bin\Release\net8.0\*.dll "%RELEASE_DIR%\" >nul
copy Mabinogi_Damage_Tracker.Server\bin\Release\net8.0\*.json "%RELEASE_DIR%\" >nul
copy VERSION "%RELEASE_DIR%\" >nul
xcopy /e /q Mabinogi_Damage_Tracker.Server\wwwroot\* "%RELEASE_DIR%\wwwroot\"

echo.
echo ========================================
echo Release %VERSION% ready:
echo   %RELEASE_DIR%
echo ========================================
endlocal
