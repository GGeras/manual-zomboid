@echo off
chcp 65001 >nul
title Manual Zomboid - instalar
cd /d "%~dp0.."
echo === Manual Zomboid: instalacao ===
where winget >nul 2>nul || (echo ERRO: winget nao encontrado. Atualize o "Instalador de Aplicativo" na Microsoft Store. & pause & exit /b 1)
set FALTOU=0
where node >nul 2>nul || (echo Instalando Node.js LTS... & winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements & set FALTOU=1)
where py >nul 2>nul || where python >nul 2>nul || (echo Instalando Python 3.12... & winget install -e --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements & set FALTOU=1)
where git >nul 2>nul || (echo Instalando Git for Windows ^(Git Bash, usado pelo Claude Code^)... & winget install -e --id Git.Git --silent --accept-package-agreements --accept-source-agreements & set FALTOU=1)
where ffmpeg >nul 2>nul || (echo Instalando ffmpeg... & winget install -e --id Gyan.FFmpeg --silent --accept-package-agreements --accept-source-agreements & set FALTOU=1)
if not exist "C:\Program Files\Google\Chrome\Application\chrome.exe" if not exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (echo Instalando Google Chrome... & winget install -e --id Google.Chrome --silent --accept-package-agreements --accept-source-agreements & set FALTOU=1)
if "%FALTOU%"=="1" (echo. & echo Programas instalados. FECHE esta janela e rode instalar.bat DE NOVO para terminar. & pause & exit /b 0)
set PY=python
where py >nul 2>nul && set PY=py -3
git lfs install >nul 2>nul
echo Instalando bibliotecas Python...
%PY% -m pip install --upgrade pip >nul
%PY% -m pip install -r requirements.txt || (echo AVISO: piper-tts falhou - so a voz de rascunho fica sem funcionar. & %PY% -m pip install numpy pillow)
echo Instalando bibliotecas Node...
call npm install --no-audit --no-fund || (echo ERRO no npm install & pause & exit /b 1)
echo.
echo === Pronto! Teste a velocidade com:  ferramentas\rodar.bat teste ===
pause
