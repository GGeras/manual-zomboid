@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
rem Manual Zomboid - EP21 (Coleta) FINAL v5: so RENDERIZA (voz ElevenLabs + floresta v5 ja estao na main).
rem Ao terminar, abre a pasta do video e fecha esta janela. Funciona de qualquer pasta.
set "REPO="
if exist "%~dp0..\.git" set "REPO=%~dp0.."
for %%R in ("%USERPROFILE%\manual-zomboid" "%USERPROFILE%\Documents\manual-zomboid" "%USERPROFILE%\Desktop\manual-zomboid" "C:\manual-zomboid" "D:\manual-zomboid") do (
  if not defined REPO if exist "%%~R\.git" set "REPO=%%~R"
)
if not defined REPO (
  echo ERRO: nao achei a pasta manual-zomboid. Coloque este .bat dentro de manual-zomboid\ferramentas e rode de novo.
  pause & exit /b 1
)
cd /d "%REPO%"
echo Repo: %CD%
echo [1/3] Atualizando o repo (main)...
git fetch origin || goto :erro
git checkout -- projeto/ep2?.cfg.js projeto/ep30.cfg.js projeto/ep19.cfg.js 2>nul
git switch main || goto :erro
git pull --ff-only || goto :erro
git lfs pull || goto :erro
set "SKILL=%REPO%\ferramentas\motionmaxxing"
set PZ_GPU=1
set PYTHONUTF8=1
if "%RENDER_JOBS%"=="" set RENDER_JOBS=6
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_PATH%" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
set "PZ_CHROME=%CHROME_PATH%"
set PY=python
where py >nul 2>nul && set PY=py -3
cd projeto
if not exist out mkdir out
echo [2/3] Guardando o final anterior (se houver) como video_anterior.mp4...
for /d %%D in ("out\Video 21 - *") do if exist "%%~D\video.mp4" (
  if exist "%%~D\video_anterior.mp4" del "%%~D\video_anterior.mp4"
  ren "%%~D\video.mp4" video_anterior.mp4
)
echo [3/3] Renderizando o EP21 FINAL (demora alguns minutos)...
%PY% pipeline\build.py 21 > out\ep21-final.log 2>&1
if errorlevel 1 (
  echo ERRO no render. Veja projeto\out\ep21-final.log
  pause & exit /b 1
)
for /d %%D in ("out\Video 21 - *") do set "PASTA=%%~fD"
if not exist "%PASTA%\video.mp4" (
  echo ERRO: o render terminou sem video.mp4. Veja projeto\out\ep21-final.log
  pause & exit /b 1
)
start "" explorer "%PASTA%"
exit
:erro
echo ERRO no git. Rode "git status" na pasta do repo e chame o Claude.
pause
exit /b 1
