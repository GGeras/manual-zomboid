@echo off
chcp 65001 >nul
setlocal
rem Manual Zomboid - ajustes EP20 (Sono) e EP21 (Coleta) a partir das previas atuais.
rem Atualiza o repo, cria a branch bruno/ep20-21-ajustes e abre o Claude com o pedido.
rem O pedido completo esta em ferramentas\ajustes\ep20-21-v3.md
cd /d "%~dp0.."
set PYTHONUTF8=1

where git >nul 2>nul || (echo ERRO: git nao encontrado. Rode ferramentas\instalar.bat primeiro.& pause & exit /b 1)
where claude >nul 2>nul || (echo ERRO: Claude Code nao encontrado. Instale o Claude Code e tente de novo.& pause & exit /b 1)

echo [1/3] Atualizando o repo...
git fetch origin || goto :erro_git
git switch main || goto :erro_git
git pull --ff-only || goto :erro_git

echo [2/3] Entrando na branch bruno/ep20-21-ajustes...
git switch bruno/ep20-21-ajustes 2>nul
if errorlevel 1 (
  git switch -c bruno/ep20-21-ajustes || goto :erro_git
) else (
  git merge origin/main --no-edit || goto :erro_git
)

if not exist "ferramentas\ajustes\ep20-21-v3.md" (
  echo ERRO: falta ferramentas\ajustes\ep20-21-v3.md. O PR com este arquivo ja entrou na main?
  pause
  exit /b 1
)

echo [3/3] Abrindo o Claude. Ele aplica os ajustes, renderiza as 2 previas e publica no Drive e no Slack.
claude "Leia CLAUDE.md, COLABORACAO.md e ferramentas/ajustes/ep20-21-v3.md. Aplique os ajustes do EP20 e do EP21 neste repo, renderize as duas previas e publique pelo fluxo da secao 8 do CLAUDE.md. Responda em poucas palavras."
echo.
echo Fim. Se o Claude abriu o PR, confira o aviso no #atualizacoes-projeto.
pause
exit /b 0

:erro_git
echo ERRO no git. Tem alteracao local nao salva? Rode "git status" e chame o Claude.
pause
exit /b 1
