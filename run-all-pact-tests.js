#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Ejecutando TODAS las pruebas de contrato Pact...\n');

// Crear directorios necesarios
try {
  execSync('mkdir -p pacts logs', { stdio: 'inherit' });
  console.log('✅ Directorios creados\n');
} catch (error) {
  console.log('ℹ️  Directorios ya existen\n');
}

// Función para ejecutar pruebas en un microservicio
function runPactTests(serviceName, servicePath) {
  console.log(`📋 Ejecutando pruebas de ${serviceName}...`);
  try {
    // Usar node directamente con el archivo jest - CORREGIDO: no duplicar el path
    const jestPath = path.join('node_modules', 'jest', 'bin', 'jest.js');
    execSync(`cd ${servicePath} && node ${jestPath} --testPathPattern=pact`, { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    });
    console.log(`✅ Pruebas de ${serviceName} completadas\n`);
    return true;
  } catch (error) {
    console.error(`❌ Error en pruebas de ${serviceName}:`, error.message);
    return false;
  }
}

// Ejecutar todas las pruebas
const results = [];

// 1. Portal Paciente
results.push(runPactTests('Portal Paciente', 'TareaMicroPaciente'));

// 2. Validador Aseguradora  
results.push(runPactTests('Validador Aseguradora', 'TareaMicroValidadorAseguradora'));

// 3. Médico App (servicio de Licencias)
results.push(runPactTests('Médico App', 'TareaMicroProveedor'));

// Resumen
const successCount = results.filter(r => r).length;
const totalCount = results.length;

console.log('🎉 Resumen de pruebas:');
console.log(`✅ Exitosas: ${successCount}/${totalCount}`);

if (successCount === totalCount) {
  console.log('🎊 ¡Todas las pruebas de contrato completadas exitosamente!');
} else {
  console.log('⚠️  Algunas pruebas fallaron');
}

console.log('📄 Los contratos se han generado en ./pacts/');
console.log('📋 Archivos generados:');
try {
  execSync('ls -la pacts/', { stdio: 'inherit' });
} catch (error) {
  console.log('No se pudieron listar los archivos de contratos');
}
