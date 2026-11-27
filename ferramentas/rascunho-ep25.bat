@echo off
chcp 65001 >nul
rem Manual Zomboid - rascunho do EP25 (Agricultura). Gera voz provisoria (Piper) e a previa. Saida: projeto\out\Video 25 - Agricultura\previa.mp4
set "REPO=%~dp0.."
if not exist "%REPO%\.git" set "REPO=C:\Projetos\manual-zomboid"
cd /d "%REPO%"
set PYTHONUTF8=1
set NOPAUSE=1
set PY=python
where py >nul 2>nul && set PY=py -3
echo [1/2] Atualizando a branch jose/ep25-agricultura...
git fetch origin || goto :erro
git switch jose/ep25-agricultura || goto :erro
git pull --ff-only || goto :erro
echo [2/2] Gerando voz provisoria e previa do EP25...
cd /d "%REPO%\projeto"
%PY% pipeline\tts_rascunho.py 25 || goto :erro
%PY% pipeline\build.py 25 fatos audio previa
echo.
echo Pronto. Previa em projeto\out\
pause
exit /b 0
:erro
echo ERRO. Veja a mensagem acima e chame o Claude.
pause
exit /b 1
