const Database = require('better-sqlite3');
const path = require('path');

class DB {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        const dbPath = path.join(__dirname, '../../portal_paciente.db');
        this.db = new Database(dbPath);
        this.initializeTables();
        console.log('Connected to better-sqlite3 database');
        resolve();
      } catch (err) {
        console.error('Error connecting to database:', err.message);
        reject(err);
      }
    });
  }

  initializeTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    this.seedData();
  }

  seedData() {
    const stmt = this.db.prepare(
      `INSERT OR IGNORE INTO patients (id, name, email) VALUES
       ('11111111-1','Juan Pérez','juan.perez@email.com'),
       ('22222222-2','María García','maria.garcia@email.com'),
       ('33333333-3','Carlos López','carlos.lopez@email.com')`
    );
    stmt.run();
  }

  getPatientById(patientId) {
    const stmt = this.db.prepare('SELECT * FROM patients WHERE id = ?');
    return Promise.resolve(stmt.get(patientId));
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) this.db.close();
      resolve();
    });
  }
}

module.exports = new DB();