@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
rem Manual Zomboid - rascunhos iniciais EP20 a EP30 (voz provisoria Piper). Deixe rodando a noite.
rem Saida: projeto\out\Video NN - Nome\previa.mp4  +  resumo em projeto\out\rascunhos-20-30.txt
cd /d "%~dp0.."
set "SKILL=%~dp0motionmaxxing"
set PZ_GPU=1
set PYTHONUTF8=1
if "%RENDER_JOBS%"=="" set RENDER_JOBS=6
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_PATH%" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
set "PZ_CHROME=%CHROME_PATH%"
set PY=python
where py >nul 2>nul && set PY=py -3

echo [1/3] Atualizando o repo na branch jose/roteiros-20-30...
git fetch origin || goto :erro_git
git switch jose/roteiros-20-30 2>nul || git switch -c jose/roteiros-20-30 --track origin/jose/roteiros-20-30 || goto :erro_git
git pull --ff-only || goto :erro_git

echo [2/3] Conferindo os sons novos do personagem...
set "SONS=projeto\assets\sfx\Personagem"
if not exist "%SONS%\JL_MalePlayer_SneezingHeavy_01.ogg" (
  if exist "%USERPROFILE%\Downloads\sons-personagem-b42.zip" (
    powershell -NoProfile -Command "Expand-Archive -Force '%USERPROFILE%\Downloads\sons-personagem-b42.zip' '%SONS%'"
  )
)
if not exist "%SONS%\JL_MalePlayer_SneezingHeavy_01.ogg" (
  echo ERRO: faltam os sons novos. Salve sons-personagem-b42.zip na pasta Downloads e rode de novo.
  pause
  exit /b 1
)

echo [3/3] Gerando os rascunhos. Pode ir dormir.
cd projeto
if not exist out mkdir out
set "RES=out\rascunhos-20-30.txt"
echo Rascunhos EP20-30 - inicio %date% %time%> "%RES%"
for /L %%N in (20,1,30) do (
  echo.
  echo ===== EP %%N =====
  %PY% pipeline\rascunho_auto.py %%N > "out\rascunho%%N.log" 2>&1
  if !errorlevel! equ 0 (
    echo EP%%N: OK>> "%RES%"
    echo EP%%N ok
    pushd ..
    %PY% ferramentas\publicar.py %%N previa >> "projeto\out\rascunho%%N.log" 2>&1
    popd
  ) else (
    echo EP%%N: ERRO - veja out\rascunho%%N.log>> "%RES%"
    echo EP%%N com erro - veja out\rascunho%%N.log
  )
)
echo Fim %date% %time%>> "%RES%"
echo.
type "%RES%"
echo.
echo Pronto. De manha, avise o Claude: "rascunhos 20-30 rodaram" (ele posta os links no Slack).
pause
exit /b 0

:erro_git
echo ERRO no git (tem alteracao local nao salva?). Rode "git status" e chame o Claude.
pause
exit /b 1
