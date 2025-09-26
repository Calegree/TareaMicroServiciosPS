// Setup file para pruebas de Médico App (Licencias)
// Este archivo se ejecuta antes de cada test

// Configuración global para las pruebas
global.console = {
  ...console,
  // Suprimir logs innecesarios durante las pruebas
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Timeout para las pruebas
jest.setTimeout(10000);
