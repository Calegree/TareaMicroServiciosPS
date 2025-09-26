#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Verificando proveedor (Licencias)...\n');

try {
  // Verificar que el servicio de Licencias esté funcionando
  execSync('curl -f http://localhost:3000/health', { stdio: 'inherit' });
  console.log('✅ Servicio de Licencias está funcionando\n');
  
  // Aquí podrías agregar más verificaciones específicas del proveedor
  console.log('🎉 Verificación del proveedor completada');
} catch (error) {
  console.error('❌ Error verificando el proveedor:', error.message);
  console.log('💡 Asegúrate de que el servicio de Licencias esté ejecutándose');
}
