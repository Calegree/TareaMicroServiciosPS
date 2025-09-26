#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando pruebas de contrato Pact en Docker...\n');

// Crear directorio pacts si no existe
try {
  execSync('mkdir -p pacts', { stdio: 'inherit' });
  console.log('✅ Directorio pacts creado\n');
} catch (error) {
  console.log('ℹ️  Directorio pacts ya existe\n');
}

// Crear directorio logs si no existe
try {
  execSync('mkdir -p logs', { stdio: 'inherit' });
  console.log('✅ Directorio logs creado\n');
} catch (error) {
  console.log('ℹ️  Directorio logs ya existe\n');
}

// Verificar que los servicios estén ejecutándose
console.log('🔍 Verificando servicios...');
try {
  execSync('docker compose ps', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Algunos servicios pueden no estar ejecutándose');
}

// Ejecutar pruebas del Portal Paciente
console.log('📋 Ejecutando pruebas del Portal Paciente...');
try {
  execSync('docker compose run --rm consumer-tests npm run test:pact', { stdio: 'inherit' });
  console.log('✅ Pruebas del Portal Paciente completadas\n');
} catch (error) {
  console.error('❌ Error en pruebas del Portal Paciente:', error.message);
}

console.log('🎉 Pruebas de contrato completadas');
console.log('📄 Los contratos se han generado en el directorio ./pacts/');
