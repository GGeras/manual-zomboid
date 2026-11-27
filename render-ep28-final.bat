@echo off
chcp 65001 >nul
rem Manual Zomboid - EP28 FINAL (v9, Tedio e Tristeza; era o EP25). Dois cliques.
rem Nao faz git pull nem troca de branch: renderiza os arquivos que estao na pasta.
set "REPO=%~dp0.."
if not exist "%REPO%\projeto\ep28.js" set "REPO=C:\Projetos\manual-zomboid"
for %%I in ("%REPO%") do set "REPO=%%~fI"
findstr /c:"v9 FINAL" "%REPO%\projeto\ep28.js" >nul 2>nul || goto falta
findstr /c:"v9 FINAL" "%REPO%\projeto\ep28.cfg.js" >nul 2>nul || goto falta
findstr /c:"progressiva" "%REPO%\projeto\cenarios.js" >nul 2>nul || goto falta
findstr /c:"__POS" "%REPO%\projeto\ep3d.js" >nul 2>nul || goto falta
if not exist "%REPO%\projeto\ep28-poses.js" goto falta
if not exist "%REPO%\projeto\assets\estante_cheia.png" goto falta
if not exist "%REPO%\projeto\audio\n28.mp3" goto falta
cd /d "%REPO%"
echo Repositorio: %REPO%
set PYTHONUTF8=1
set PY=python
where py >nul 2>nul && set PY=py -3
%PY% ferramentas\arquivar_ep28.py
set "PASTA=%REPO%\projeto\out\Video 28 - Tédio e Tristeza"
if exist "%PASTA%\video.mp4" (
  if not exist "%PASTA%\versoes" mkdir "%PASTA%\versoes"
  move /y "%PASTA%\video.mp4" "%PASTA%\versoes\video-anterior-%RANDOM%.mp4" >nul
)
if not exist "%REPO%\node_modules\playwright-core" call npm install --no-audit --no-fund
for /d %%T in ("%REPO%\projeto\rpar_*") do rd /s /q "%%T" 2>nul
set PZ_FALTA_SOM_OK=
set NOPAUSE=1
if "%RENDER_JOBS%"=="" set RENDER_JOBS=3
echo.
echo Renderizando o EP28 FINAL. Demora bastante e a tela fica parada, e normal.
echo.
call "%REPO%\ferramentas\rodar.bat" 28
if errorlevel 1 goto erro
if not exist "%PASTA%\video.mp4" goto erro
echo.
echo Conferindo as cenas (relatorio em inspecao\relatorio.txt)...
call "%REPO%\ferramentas\rodar.bat" 28 inspecao
echo.
echo PRONTO: "%PASTA%\video.mp4"
start "" explorer "%PASTA%"
pause
exit /b 0

:falta
echo ERRO: faltam os arquivos novos do EP28 em "%REPO%\projeto". Chame o Claude.
pause
exit /b 1

:erro
echo.
echo ERRO no render. Veja projeto\log28.txt e a mensagem acima, e mande para o Claude.
pause
exit /b 1
