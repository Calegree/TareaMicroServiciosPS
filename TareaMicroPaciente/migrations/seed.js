const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../portal_paciente.db');
const db = new sqlite3.Database(dbPath);

console.log('Seeding database...');

db.serialize(() => {
  // Crear tabla de pacientes
  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insertar datos de prueba
  db.run(`INSERT OR IGNORE INTO patients (id, name, email) VALUES 
    ('11111111-1', 'Juan Pérez', 'juan.perez@email.com'),
    ('22222222-2', 'María García', 'maria.garcia@email.com'),
    ('33333333-3', 'Carlos López', 'carlos.lopez@email.com'),
    ('44444444-4', 'Ana Martínez', 'ana.martinez@email.com')`, (err) => {
    if (err) {
      console.error('Error seeding data:', err.message);
    } else {
      console.log('Database seeded successfully');
    }
    db.close();
  });
});
