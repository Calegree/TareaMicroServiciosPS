const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '../../portal_paciente.db');
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error connecting to database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeTables().then(resolve).catch(reject);
        }
      });
    });
  }

  initializeTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Crear tabla de pacientes
        this.db.run(`CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error('Error creating patients table:', err.message);
            reject(err);
          } else {
            console.log('Patients table ready');
            this.seedData().then(resolve).catch(reject);
          }
        });
      });
    });
  }

  seedData() {
    return new Promise((resolve, reject) => {
      this.db.run(`INSERT OR IGNORE INTO patients (id, name, email) VALUES 
        ('11111111-1', 'Juan Pérez', 'juan.perez@email.com'),
        ('22222222-2', 'María García', 'maria.garcia@email.com'),
        ('33333333-3', 'Carlos López', 'carlos.lopez@email.com')`, (err) => {
        if (err) {
          console.error('Error seeding data:', err.message);
          reject(err);
        } else {
          console.log('Database seeded with initial data');
          resolve();
        }
      });
    });
  }

  getPatientById(patientId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM patients WHERE id = ?', [patientId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = new Database();
