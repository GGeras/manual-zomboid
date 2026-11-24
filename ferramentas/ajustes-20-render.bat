@echo off
chcp 65001 >nul
setlocal
rem Manual Zomboid - renderiza so a previa do EP20 (Sono) e publica no Drive + Slack (secao 8 do CLAUDE.md).
rem RENDER_JOBS=3: EP18/EP19 tiveram disputa de GPU com 6-8 Chromes em paralelo (um render chegou a falhar).
cd /d "%~dp0.."
set PYTHONUTF8=1
set RENDER_JOBS=3

where git >nul 2>nul || (echo ERRO: git nao encontrado.& pause & exit /b 1)

echo [1/3] Renderizando previa do EP20 (Sono)...
call ferramentas\rodar.bat 20 previa
if errorlevel 1 goto erro

echo [2/3] Veja a inspecao antes de publicar:
echo   projeto\out\Video 20 - Sono\inspecao\
echo Relatorio tem que dar 0 avisos. Corrija e rode de novo se nao der.
pause

echo [3/3] Abrindo o Claude para publicar a previa (Drive + Slack, secao 8 do CLAUDE.md)...
claude "Publique a previa nova do EP20 (projeto/out/Video 20 - Sono/previa.mp4) pelo fluxo da secao 8 do CLAUDE.md: link publico no Drive, mensagem no #links-rascunho. Responda em poucas palavras."
pause
exit /b 0

:erro
echo ERRO no render. Copie a saida completa acima (do inicio ao fim) e mande para o Claude.
pause
exit /b 1
