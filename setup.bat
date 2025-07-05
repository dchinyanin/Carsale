@echo off
:: CarSale Setup Script для Windows
:: Этот скрипт автоматически установит зависимости и запустит проект

echo 🚗 Добро пожаловать в CarSale!
echo =================================

:: Проверяем наличие Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js не найден. Пожалуйста, установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

:: Проверяем наличие npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm не найден. Пожалуйста, установите npm
    pause
    exit /b 1
)

:: Показываем версии
echo ✅ Node.js версия:
node --version
echo ✅ npm версия:
npm --version
echo.

:: Устанавливаем зависимости
echo 📦 Устанавливаем зависимости...
npm install

if %errorlevel% equ 0 (
    echo ✅ Зависимости успешно установлены!
    echo.
    echo 🚀 Запускаем проект...
    echo Откройте браузер и перейдите по адресу: http://localhost:3000
    echo.
    npm start
) else (
    echo ❌ Ошибка при установке зависимостей
    echo Попробуйте выполнить команды вручную:
    echo   npm install
    echo   npm start
    pause
    exit /b 1
)