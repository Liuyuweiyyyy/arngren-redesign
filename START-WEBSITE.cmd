@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 goto missing
node scripts\preview.cjs
goto end
:missing
echo Please install Node.js LTS, then run this file again.
echo Download: https://nodejs.org/
:end
pause
