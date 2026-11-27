@echo off
chcp 65001 >nul
rem Manual Zomboid - EP22 v8 FINAL. Dois cliques.
rem Nao faz git pull nem troca de branch: renderiza os arquivos que estao na pasta.
set "REPO=%~dp0.."
if not exist "%REPO%\projeto\ep22.js" set "REPO=C:\Projetos\manual-zomboid"
for %%I in ("%REPO%") do set "REPO=%%~fI"
findstr /c:"machadoNaMao" "%REPO%\projeto\empunhar.js" >nul 2>nul
if errorlevel 1 goto falta
findstr /c:"machadoNaMao" "%REPO%\projeto\ep22.js" >nul 2>nul
if errorlevel 1 goto falta
cd /d "%REPO%"
echo Repositorio: %REPO%

rem voz provisoria (Piper) = arquivo de 845367 bytes
for %%A in ("%REPO%\projeto\audio\n22.mp3") do if "%%~zA"=="845367" (
  echo.
  echo ATENCAO: a voz ainda e a PROVISORIA. O final sai com ela.
  echo Para a voz do ElevenLabs: feche esta janela e mande o audio para o Claude.
  echo Para renderizar assim mesmo: aperte uma tecla.
  pause >nul
)

set "PASTA=%REPO%\projeto\out\Video 22 - Fadiga Muscular"
if not exist "%REPO%\node_modules\playwright-core" call npm install --no-audit --no-fund
for /d %%T in ("%REPO%\projeto\rpar_*") do rd /s /q "%%T" 2>nul
set PZ_FALTA_SOM_OK=
set PYTHONUTF8=1
set NOPAUSE=1
if "%RENDER_JOBS%"=="" set RENDER_JOBS=3
echo.
echo Renderizando o EP22 FINAL. Demora bastante e a tela fica parada, e normal.
echo.
call "%REPO%\ferramentas\rodar.bat" 22
if errorlevel 1 goto erro
if not exist "%PASTA%\video.mp4" goto erro
echo.
echo PRONTO: "%PASTA%\video.mp4"
start "" explorer "%PASTA%"
pause
exit /b 0

:falta
echo ERRO: faltam os arquivos novos do EP22 em "%REPO%\projeto". Chame o Claude.
pause
exit /b 1

:erro
echo.
echo ERRO no render. Veja projeto\log22.txt e a mensagem acima, e mande para o Claude.
pause
exit /b 1
