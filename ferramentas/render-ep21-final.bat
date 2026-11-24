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
cd projeto
if not exist out mkdir out
for /d %%T in (rpar_*) do rd /s /q "%%T" 2>nul
echo [2/3] Guardando o final anterior (se houver) como video_anterior.mp4...
for /d %%D in ("out\Video 21 - *") do if exist "%%~D\video.mp4" (
  if exist "%%~D\video_anterior.mp4" del "%%~D\video_anterior.mp4"
  ren "%%~D\video.mp4" video_anterior.mp4
)
cd /d "%REPO%"
echo [3/3] Renderizando o EP21 FINAL (demora alguns minutos)...
rem rodar.bat detecta a placa (GPU/NVENC). 3 Chromes em paralelo: com 6 a placa disputava e um pedaco falhava (EP18/EP19/EP21).
set NOPAUSE=1
if "%RENDER_JOBS%"=="" set RENDER_JOBS=3
call ferramentas\rodar.bat 21
if errorlevel 1 (
  echo.
  echo ===== ERRO no render. Logs dos pedacos: =====
  for /d %%T in ("%REPO%\projeto\rpar_*") do for %%L in ("%%T\p*.log") do (echo ---- %%~nxL & type "%%L")
  echo Copie tudo desta janela e mande para o Claude.
  pause & exit /b 1
)
cd /d "%REPO%\projeto"
for /d %%D in ("out\Video 21 - *") do set "PASTA=%%~fD"
if not exist "%PASTA%\video.mp4" (
  echo ERRO: o render terminou sem video.mp4. Copie esta janela e mande para o Claude.
  pause & exit /b 1
)
start "" explorer "%PASTA%"
exit
:erro
echo ERRO no git. Rode "git status" na pasta do repo e chame o Claude.
pause
exit /b 1
