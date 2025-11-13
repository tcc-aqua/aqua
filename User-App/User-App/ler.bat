@echo off
REM Script para listar todos os conteudos em UMA UNICA JANELA, sem pausas.

REM --- CONFIGURACAO DAS PASTAS ---
set "FOLDER_MAIN=C:\Users\24250553\Documents\3mdR\aqua"
set "FOLDER_1=C:\Users\24250553\Documents\3mdR\aqua\backend-mobile"
set "FOLDER_2=C:\Users\24250553\Documents\3mdR\aqua\User-App\User-App"

REM --- PASTAS ALVO (para o recursivo /S) ---
set "BACKEND_TARGET_FOLDER=%FOLDER_1%\src"
set "MOBILE_TARGET_FOLDER=%FOLDER_2%\screens"
REM ---------------------------------------------

REM 1. Abre a pasta principal no Windows Explorer
echo Abrindo pasta principal no Explorer: %FOLDER_MAIN%
start "" "%FOLDER_MAIN%"
echo.
echo ====================================================================
echo.

REM --- ETAPA 1.1: Conteudo (simples) de Backend-Mobile ---
echo --- Conteudo (simples) de %FOLDER_1% ---
echo ====================================================================
cd /d %FOLDER_1%
DIR
echo.
echo.

REM --- ETAPA 1.2: Conteudo (simples) de User-App ---
echo --- Conteudo (simples) de %FOLDER_2% ---
echo ====================================================================
cd /d %FOLDER_2%
DIR
echo.
echo.

REM --- ETAPA 2.1: Conteudo (RECURSIVO /S) de Backend SRC ---
echo --- Conteudo (RECURSIVO /S) de %BACKEND_TARGET_FOLDER% ---
echo ====================================================================
cd /d %BACKEND_TARGET_FOLDER%
DIR /S
echo.
echo.

REM --- ETAPA 2.2: Conteudo (RECURSIVO /S) de Mobile Screens ---
echo --- Conteudo (RECURSIVO /S) de %MOBILE_TARGET_FOLDER% ---
echo ====================================================================
cd /d %MOBILE_TARGET_FOLDER%
DIR /S
echo.
echo.

echo ====================================================================
echo --- SCRIPT CONCLUIDO ---
echo Todas as listagens foram exibidas.
echo A janela permanecera aberta. Pressione qualquer tecla para fechar.
pause >nul