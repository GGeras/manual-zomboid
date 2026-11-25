@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
rem Manual Zomboid - rascunhos v5 do EP22 ao EP25 (ajustes do Bruno de 25/11 ja na main, PR #38). Pode rodar de qualquer pasta.
rem Faz tudo sozinho: atualiza a branch, gera a voz provisoria (Piper) de cada episodio e renderiza a previa + inspecao.
rem Saida: projeto\out\Video NN - Nome\previa.mp4 (+ inspecao\relatorio.txt)  e resumo em projeto\out\rascunhos-22-25-v5.txt
rem Quando a voz do ElevenLabs chegar: salve em projeto\audio\nNN.mp3, rode check_vo.py e troque o T/END do cfg (a voz Piper e so para o rascunho).
rem acha a pasta do repositorio: 1) o .bat dentro de ferramentas\ do repo; 2) lugares comuns; 3) pergunta
set "REPO="
if exist "%~dp0..\.git" set "REPO=%~dp0.."
if not defined REPO for %%D in ("C:\Projetos\manual-zomboid" "%USERPROFILE%\manual-zomboid" "%USERPROFILE%\Documents\manual-zomboid" "%USERPROFILE%\Desktop\manual-zomboid" "%USERPROFILE%\source\repos\manual-zomboid" "D:\manual-zomboid" "D:\Projetos\manual-zomboid") do if not defined REPO if exist "%%~D\.git" set "REPO=%%~D"
if not defined REPO (
  echo Nao achei a pasta do repositorio manual-zomboid.
  set /p "REPO=Cole aqui o caminho da pasta manual-zomboid e aperte Enter: "
)
set "REPO=%REPO:"=%"
if not exist "%REPO%\.git" (echo ERRO: "%REPO%" nao e o repositorio manual-zomboid. & pause & exit /b 1)
cd /d "%REPO%"
echo Repositorio: %CD%
set PYTHONUTF8=1
set NOPAUSE=1
if "%RENDER_JOBS%"=="" set RENDER_JOBS=3
set PY=python
where py >nul 2>nul && set PY=py -3

echo [1/3] Atualizando o repo na main (os ajustes v5 ja foram juntados: PR #38)...
git fetch origin || goto :erro_git
git switch main || goto :erro_git
git pull --ff-only || goto :erro_git
git lfs pull

echo [2/3] Sons do personagem (vozes B42: suspiros, gemidos, sono)...
set "SONS=projeto\assets\sfx\Personagem"
if not exist "%SONS%\JL_MalePlayer_ExerciseGrunts_01.ogg" (
  if exist "%USERPROFILE%\Downloads\sons-personagem-b42.zip" (
    powershell -NoProfile -Command "Expand-Archive -Force '%USERPROFILE%\Downloads\sons-personagem-b42.zip' '%SONS%'"
  )
)
if not exist "%SONS%\JL_MalePlayer_ExerciseGrunts_01.ogg" (
  echo ERRO: faltam os sons do personagem em %SONS%. Salve sons-personagem-b42.zip na pasta Downloads e rode de novo.
  pause
  exit /b 1
)

echo [3/3] Gerando os 4 rascunhos (voz Piper + previa + inspecao). Pode deixar rodando.
if not exist projeto\out mkdir projeto\out
set "RES=projeto\out\rascunhos-22-25-v5.txt"
echo Rascunhos v5 EP22-25 - inicio %date% %time%> "%RES%"
for %%N in (22 23 24 25) do (
  echo.
  echo ===== EP %%N =====
  if exist "projeto\audio\n%%N.mp3" copy /y "projeto\audio\n%%N.mp3" "projeto\audio\n%%N_antes.mp3" >nul
  pushd projeto
  %PY% pipeline\tts_rascunho.py %%N > "out\rascunho%%N-v5.log" 2>&1
  popd
  call ferramentas\rodar.bat %%N rascunho >> "projeto\out\rascunho%%N-v5.log" 2>&1
  if !errorlevel! equ 0 (
    echo EP%%N: OK>> "%RES%"
    echo EP%%N ok
  ) else (
    echo EP%%N: ERRO - veja projeto\out\rascunho%%N-v5.log>> "%RES%"
    echo EP%%N com erro - veja projeto\out\rascunho%%N-v5.log
  )
)
echo Fim %date% %time%>> "%RES%"
echo.
type "%RES%"
echo.
echo Pronto. Confira projeto\out\Video NN - Nome\inspecao\relatorio.txt de cada um.
echo Depois avise o Claude: "rascunhos 22-25 v5 rodaram" (ele publica no Drive e posta no #links-rascunho).
pause
exit /b 0

:erro_git
echo ERRO no git (tem alteracao local nao salva?). Rode "git status" e chame o Claude.
pause
exit /b 1
