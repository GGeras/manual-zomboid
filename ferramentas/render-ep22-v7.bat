@echo off
chcp 65001 >nul
rem Manual Zomboid - previa do EP22 v7 (machado, cozinha, remedio, quarto). Dois cliques.
rem Nao faz git pull nem troca de branch: renderiza os arquivos que estao na pasta.
set "REPO=%~dp0.."
if not exist "%REPO%\projeto\ep22.js" set "REPO=C:\Projetos\manual-zomboid"
for %%I in ("%REPO%") do set "REPO=%%~fI"
if not exist "%REPO%\projeto\empunhar.js" goto falta
if not exist "%REPO%\projeto\tomar.js" goto falta
cd /d "%REPO%"
echo Repositorio: %REPO%

rem guarda a previa anterior em versoes\ (nunca sobrescreve)
set "PASTA=%REPO%\projeto\out\Video 22 - Fadiga Muscular"
if not exist "%PASTA%\previa.mp4" goto preparar
if not exist "%PASTA%\versoes" mkdir "%PASTA%\versoes"
set N=1
:numero
if exist "%PASTA%\versoes\previa_v%N%.mp4" (set /a N+=1 & goto numero)
move "%PASTA%\previa.mp4" "%PASTA%\versoes\previa_v%N%.mp4" >nul
if exist "%PASTA%\previa.mp4" goto aberto
echo Previa anterior guardada em versoes\previa_v%N%.mp4

:preparar
if not exist "%REPO%\projeto\assets\sfx\Personagem\JL_MalePlayer_ExerciseGrunts_01.ogg" set PZ_FALTA_SOM_OK=1
if not exist "%REPO%\node_modules\playwright-core" call npm install --no-audit --no-fund
set PYTHONUTF8=1
set NOPAUSE=1
echo.
echo Renderizando o EP22. A tela fica parada por alguns minutos, e normal.
echo.
call "%REPO%\ferramentas\rodar.bat" 22 fatos audio previa inspecao
if errorlevel 1 goto erro
if not exist "%PASTA%\previa.mp4" goto erro
echo.
echo PRONTO: "%PASTA%\previa.mp4"
start "" explorer "%PASTA%"
pause
exit /b 0

:falta
echo ERRO: faltam os arquivos novos do EP22 em "%REPO%\projeto". Chame o Claude.
pause
exit /b 1

:aberto
echo ERRO: o video previa.mp4 esta aberto. Feche o player e rode de novo.
pause
exit /b 1

:erro
echo.
echo ERRO no render. Veja projeto\log22_previa.txt e a mensagem acima, e mande para o Claude.
pause
exit /b 1
