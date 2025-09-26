#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando pruebas de contrato Pact...\n');

// Crear directorio pacts si no existe
try {
  execSync('mkdir -p pacts', { stdio: 'inherit' });
  console.log('✅ Directorio pacts creado\n');
} catch (error) {
  console.log('ℹ️  Directorio pacts ya existe\n');
}

// Ejecutar pruebas del Portal Paciente
console.log('📋 Ejecutando pruebas del Portal Paciente...');
try {
  execSync('cd TareaMicroPaciente && npm run test:pact', { stdio: 'inherit' });
  console.log('✅ Pruebas del Portal Paciente completadas\n');
} catch (error) {
  console.error('❌ Error en pruebas del Portal Paciente:', error.message);
}

// Ejecutar pruebas del Validador Aseguradora
console.log('🏥 Ejecutando pruebas del Validador Aseguradora...');
try {
  execSync('cd TareaMicroValidadorAseguradora && npm run test:pact', { stdio: 'inherit' });
  console.log('✅ Pruebas del Validador Aseguradora completadas\n');
} catch (error) {
  console.error('❌ Error en pruebas del Validador Aseguradora:', error.message);
}

// Ejecutar pruebas del servicio de Licencias (Médico App)
console.log('👨‍⚕️ Ejecutando pruebas del servicio de Licencias...');
try {
  execSync('cd TareaMicroProveedor && npm run test:pact', { stdio: 'inherit' });
  console.log('✅ Pruebas del servicio de Licencias completadas\n');
} catch (error) {
  console.error('❌ Error en pruebas del servicio de Licencias:', error.message);
}

console.log('🎉 Todas las pruebas de contrato han sido ejecutadas');
console.log('📄 Los contratos se han generado en el directorio ./pacts/');
