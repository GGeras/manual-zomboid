@echo off
chcp 65001 >nul
setlocal
rem Manual Zomboid - renderiza as previas novas do EP20 e EP21 (ajustes de codigo ja aplicados pelo Claude
rem na branch bruno/ep20-21-ajustes) e publica no Drive + Slack pelo fluxo da secao 8 do CLAUDE.md.
rem RENDER_JOBS=3: EP18/EP19 tiveram disputa de GPU com 6-8 Chromes em paralelo (um render chegou a falhar).
cd /d "%~dp0.."
set PYTHONUTF8=1
set RENDER_JOBS=3

where git >nul 2>nul || (echo ERRO: git nao encontrado.& pause & exit /b 1)
git branch --show-current | findstr /c:"bruno/ep20-21-ajustes" >nul
if errorlevel 1 (echo AVISO: voce nao esta na branch bruno/ep20-21-ajustes. Rode: git switch bruno/ep20-21-ajustes & pause)

echo [1/4] Renderizando previa do EP20 (Sono)...
call ferramentas\rodar.bat 20 previa
if errorlevel 1 goto erro

echo [2/4] Renderizando previa do EP21 (Coleta)...
call ferramentas\rodar.bat 21 previa
if errorlevel 1 goto erro

echo [3/4] Veja a inspecao de cada video antes de publicar:
echo   projeto\out\Video 20 - Sono\inspecao\
echo   projeto\out\Video 21 - Coleta\inspecao\
echo Relatorio tem que dar 0 avisos. Corrija e rode de novo se nao der.
pause

echo [4/4] Abrindo o Claude para publicar as duas previas (Drive + Slack, secao 8 do CLAUDE.md)...
claude "Publique as previas novas do EP20 e EP21 que acabei de renderizar (projeto/out/Video 20 - Sono/previa.mp4 e projeto/out/Video 21 - Coleta/previa.mp4), pelo fluxo da secao 8 do CLAUDE.md: link publico no Drive, mensagem no #links-rascunho. Responda em poucas palavras."
pause
exit /b 0

:erro
echo ERRO no render. Veja o log acima e chame o Claude com a saida completa.
pause
exit /b 1
