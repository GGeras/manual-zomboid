@echo off
chcp 65001 >nul
set PYTHONUTF8=1
set PY=python
where py >nul 2>nul && set PY=py -3
echo Pasta: %~dp0..
%PY% "%~dp0renumerar\renumerar.py" --simular || goto fim
echo.
set /p OK="Confirmar renumeracao? (S/N) "
if /i not "%OK%"=="S" goto fim
%PY% "%~dp0renumerar\renumerar.py"
:fim
pause
