@echo off
setlocal enabledelayedexpansion

REM Cambiar al directorio donde están los microservicios
cd /d %~dp0

echo ============================================
echo Iniciando microservicios con Node.js...
echo ============================================

REM Recorre todas las carpetas en el directorio actual
for /d %%D in (*) do (
    if exist "%%D\src\index.js" (
        echo Iniciando microservicio en: %%D\src
        start "Microservicio - %%D" cmd /k "cd /d %%D\src && node index.js"
    )
)

echo ============================================
echo Todos los microservicios encontrados fueron lanzados.
echo Nota: Cada uno corre en una ventana separada de CMD.
echo Para detenerlos: Cierra la ventana o usa taskkill /F /IM node.exe
echo ============================================

endlocal
pause