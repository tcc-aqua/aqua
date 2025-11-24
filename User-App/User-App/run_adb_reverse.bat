@echo off
title ADB Reverse Loop

echo ==============================
echo Iniciando loop do ADB Reverse
echo ==============================
echo.

cd /d "C:\Users\24250399\AppData\Local\Android\Sdk\platform-tools" || (
  echo ERRO: Nao foi possivel acessar o diretorio do adb.
  pause
  exit /b
)

:loop
echo Rodando adb reverse...
adb.exe reverse tcp:3334 tcp:3334

if %errorlevel% neq 0 (
  echo [ERRO] Falha ao rodar o comando adb.
) else (
  echo [OK] adb reverse ativo.
)

timeout /t 5 /nobreak >nul
goto loop
