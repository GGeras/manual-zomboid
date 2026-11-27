@echo off
chcp 65001 >nul
rem Manual Zomboid - PREVIA do EP31 (Agricultura). Saida: projeto\out\Video 31 - Agricultura\previa.mp4
cd /d "%~dp0.."
set "SKILL=%~dp0motionmaxxing"
set PZ_GPU=1
set PYTHONUTF8=1
for /f "usebackq delims=" %%G in (`powershell -NoProfile -Command "(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' + '" 2^>nul`) do set "PLACA=%%G"
echo %PLACA%| findstr /i "NVIDIA" >nul
if not errorlevel 1 set "PZ_NVENC=1"
if "%RENDER_JOBS%"=="" set RENDER_JOBS=6
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_PATH%" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
set "PZ_CHROME=%CHROME_PATH%"
set PY=python
where py >nul 2>nul && set PY=py -3

echo [1/2] Branch main atualizada...
git fetch origin
git switch main || goto :erro
git pull --ff-only || goto :erro

echo [2/2] Previa do EP31 (fatos + audio + inspecao + previa)...
cd projeto
%PY% -m pip install -q scipy >nul 2>nul
%PY% pipeline/build.py 31 rascunho || goto :erro
echo.
echo PRONTO: projeto\out\Video 31 - Agricultura\previa.mp4
start "" "%~dp0..\projeto\out\Video 31 - Agricultura"
pause
exit /b 0
:erro
echo.
echo ERRO - copie a mensagem acima para o Claude.
pause
exit /b 1
