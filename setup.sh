#!/bin/bash
# Script de instalación rápida

echo "🚀 WEBLEU - Setup inicial"
echo ""

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Crear archivo .env.local
echo "⚙️  Configurando Firebase..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado - por favor completa tus credenciales Firebase"
else
    echo "✅ .env.local ya existe"
fi

# 3. Iniciar servidor de desarrollo
echo ""
echo "✨ ¡Listo! Iniciando servidor..."
npm run dev
