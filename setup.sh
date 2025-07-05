#!/bin/bash

# CarSale Setup Script
# Этот скрипт автоматически установит зависимости и запустит проект

echo "🚗 Добро пожаловать в CarSale!"
echo "================================="

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Пожалуйста, установите Node.js с https://nodejs.org/"
    exit 1
fi

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Пожалуйста, установите npm"
    exit 1
fi

echo "✅ Node.js версия: $(node --version)"
echo "✅ npm версия: $(npm --version)"
echo ""

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Зависимости успешно установлены!"
    echo ""
    echo "🚀 Запускаем проект..."
    echo "Откройте браузер и перейдите по адресу: http://localhost:3000"
    echo ""
    npm start
else
    echo "❌ Ошибка при установке зависимостей"
    echo "Попробуйте выполнить команды вручную:"
    echo "  npm install"
    echo "  npm start"
    exit 1
fi