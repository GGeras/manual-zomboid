@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "SKILL=%~dp0motionmaxxing"
set PZ_GPU=1
set PYTHONUTF8=1
if "%RENDER_JOBS%"=="" set RENDER_JOBS=6
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_PATH%" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
set "PZ_CHROME=%CHROME_PATH%"
set PY=python
where py >nul 2>nul && set PY=py -3
cd /d "%~dp0..\projeto"
if "%1"=="" (
  echo Uso:  rodar.bat NN [etapas]     ex.: rodar.bat 13 inspecao previa
  echo       rodar.bat teste           mede a velocidade do render nesta maquina
  echo Etapas: fatos audio inspecao previa render final check capa post   ^(sem etapas = video final completo^)
  if not "%NOPAUSE%"=="1" pause
  exit /b 0
)
if /i "%1"=="teste" (
  echo Renderizando 4 s de teste do EP13 com GPU...
  node "%SKILL%\scripts\render.mjs" ep13.html out\teste_gpu.mp4 --from 10 --to 14 --scale 0.5 --fps 15 --preset veryfast --crf 28
  echo Compare o "fps render speed" acima: na nuvem era 0.9 fps.
  if not "%NOPAUSE%"=="1" pause
  exit /b 0
)
%PY% pipeline\build.py %*
echo.
echo Fim. Arquivos em projeto\out\
if not "%NOPAUSE%"=="1" pause
