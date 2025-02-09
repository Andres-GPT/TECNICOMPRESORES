@echo off
REM Esperar 15 segundos para asegurarse de que MySQL esté en ejecución
timeout /t 15 /nobreak >nul

REM Entrar a la carpeta del backend y ejecutar el comando start
cd backend
start cmd /k "npm run start"

REM Salir a la raíz y ejecutar el servidor front-end
cd ..
start cmd /k "node server.js"
