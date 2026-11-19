@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "SKILL=%~dp0motionmaxxing"
set PYTHONUTF8=1
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_PATH%" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
set "PZ_CHROME=%CHROME_PATH%"
set PY=python
where py >nul 2>nul && set PY=py -3

rem ---------- placa de video: detecta sozinho (funciona no PC com ou sem placa dedicada) ----------
rem Forcar: set PZ_GPU=1 (usa a placa) ou set PZ_GPU=0 (so processador) antes de rodar. RENDER_JOBS = renders em paralelo.
set "PLACA="
for /f "usebackq delims=" %%G in (`powershell -NoProfile -Command "(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' + '" 2^>nul`) do set "PLACA=%%G"
set "JOBS_AUTO=1"
if defined NUMBER_OF_PROCESSORS set /a JOBS_AUTO=%NUMBER_OF_PROCESSORS%/2
if %JOBS_AUTO% LSS 1 set JOBS_AUTO=1
if defined PZ_GPU goto gpu_forcado
echo %PLACA%| findstr /i "NVIDIA AMD Radeon Arc" >nul
if not errorlevel 1 (set PZ_GPU=1& set "MODO=placa dedicada"& set JOBS_AUTO=6& goto gpu_ok)
echo %PLACA%| findstr /i "Intel Iris UHD" >nul
if not errorlevel 1 (set PZ_GPU=1& set "MODO=placa integrada"& set JOBS_AUTO=3& goto gpu_ok)
set "MODO=processador"
goto gpu_ok
:gpu_forcado
if "%PZ_GPU%"=="0" (set "PZ_GPU="& set "MODO=processador, forcado") else (set PZ_GPU=1& set "MODO=placa, forcado")
:gpu_ok
if "%RENDER_JOBS%"=="" set RENDER_JOBS=%JOBS_AUTO%
echo Render: %MODO% · %RENDER_JOBS% em paralelo · %PLACA%

cd /d "%~dp0..\projeto"
if "%1"=="" (
  echo Uso:  rodar.bat NN [etapas]     ex.: rodar.bat 13 inspecao previa
  echo       rodar.bat teste           mede a velocidade do render nesta maquina
  echo Etapas: fatos audio inspecao previa render final check capa post   ^(sem etapas = video final completo^)
  if not "%NOPAUSE%"=="1" pause
  exit /b 0
)
if /i "%1"=="teste" (
  echo Renderizando 4 s de teste do EP13...
  node "%SKILL%\scripts\render.mjs" ep13.html out\teste_gpu.mp4 --from 10 --to 14 --scale 0.5 --fps 15 --preset veryfast --crf 28
  echo Compare o "fps render speed" acima: na nuvem era 0.9 fps.
  if not "%NOPAUSE%"=="1" pause
  exit /b 0
)
%PY% pipeline\build.py %*
set ERRO=%ERRORLEVEL%
echo.
echo Fim. Arquivos em projeto\out\
if not "%NOPAUSE%"=="1" pause
exit /b %ERRO%
