@echo off
title ADB Reverse Loop

echo ==============================
echo Iniciando loop do ADB Reverse
echo ==============================
echo.

:: Tenta navegar para a pasta padrao do SDK usando o perfil do usuario atual
cd /d "%USERPROFILE%\AppData\Local\Android\Sdk\platform-tools"

:: Se der erro ao entrar na pasta, avisa e tenta rodar mesmo assim (caso esteja no PATH global)
if %errorlevel% neq 0 (
  echo [AVISO] Nao foi possivel acessar a pasta padrao do SDK.
  echo Tentando executar o ADB caso ele esteja nas variaveis de ambiente...
  echo.
)

:loop
echo Rodando adb reverse...
adb.exe reverse tcp:3334 tcp:3334

if %errorlevel% neq 0 (
  echo [ERRO] Falha ao rodar o comando adb. Verifique:
  echo 1. Se o celular esta conectado via USB.
  echo 2. Se a depuracao USB esta ativada no celular.
  echo 3. Se o Android Studio/SDK esta instalado corretamente.
) else (
  echo [OK] adb reverse ativo. Porta 3334 conectada.
)

:: Espera 5 segundos antes de tentar de novo
timeout /t 5 /nobreak >nul
goto loop