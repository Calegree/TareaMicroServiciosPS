const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());
const generateFolio = () => `L-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

let db;

async function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database('./db/licencias.db', (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database');
      
      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS licenses (
            folio TEXT PRIMARY KEY,
            patientId TEXT NOT NULL,
            doctorId TEXT NOT NULL,
            diagnosis TEXT NOT NULL,
            startDate TEXT NOT NULL,
            days INTEGER NOT NULL,
            status TEXT NOT NULL
          );
        `, (err) => {
          if (err) {
            console.error('Error creating table:', err.message);
            reject(err);
            return;
          }
          
          console.log('Database initialized successfully');
          resolve();
        });
      });
    });
  });
}


app.get('/health', (req, res) => res.json({ ok: true }));

// POST /licenses
app.post('/licenses', (req, res) => {
  const { patientId, doctorId, diagnosis, startDate, days } = req.body;
  if (typeof days !== 'number' || days <= 0) {
    return res.status(400).json({ error: "INVALID_DAYS" });
  }

  const folio = generateFolio();
  const stmt = db.prepare(`
    INSERT INTO licenses (folio, patientId, doctorId, diagnosis, startDate, days, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run([folio, patientId, doctorId, diagnosis, startDate, days, "issued"], function(err) {
    if (err) {
      console.error('Error inserting license:', err.message);
      return res.status(500).json({ error: "DATABASE_ERROR" });
    }
    
    const license = { folio, patientId, doctorId, diagnosis, startDate, days, status: "issued" };
    res.status(201).json(license);
  });
});

// GET /licenses/{folio}
app.get('/licenses/:folio', (req, res) => {
  const { folio } = req.params;
  const stmt = db.prepare(`SELECT * FROM licenses WHERE folio = ?`);
  
  stmt.get([folio], (err, row) => {
    if (err) {
      console.error('Error getting license:', err.message);
      return res.status(500).json({ error: "DATABASE_ERROR" });
    }
    
    if (!row) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(row);
  });
});

// GET /licenses?patientId=...
app.get('/licenses', (req, res) => {
  const { patientId } = req.query;
  
  if (patientId) {
    const stmt = db.prepare(`SELECT * FROM licenses WHERE patientId = ?`);
    stmt.all([patientId], (err, rows) => {
      if (err) {
        console.error('Error getting licenses by patient:', err.message);
        return res.status(500).json({ error: "DATABASE_ERROR" });
      }
      res.json(rows);
    });
  } else {
    const stmt = db.prepare(`SELECT * FROM licenses`);
    stmt.all([], (err, rows) => {
      if (err) {
        console.error('Error getting all licenses:', err.message);
        return res.status(500).json({ error: "DATABASE_ERROR" });
      }
      res.json(rows);
    });
  }
});

// GET /licenses/{folio}/verify
app.get('/licenses/:folio/verify', (req, res) => {
  const { folio } = req.params;
  const stmt = db.prepare(`SELECT * FROM licenses WHERE folio = ?`);
  
  stmt.get([folio], (err, row) => {
    if (err) {
      console.error('Error verifying license:', err.message);
      return res.status(500).json({ error: "DATABASE_ERROR" });
    }
    
    if (!row) return res.status(404).json({ valid: false });
    const valid = row.status === 'issued' && row.days > 0;
    res.json({ valid });
  });
});

// Provider States para Pact
app.post('/_pactState', (req, res) => {
  const { state } = req.body || {};

  if (state === "patient 11111111-1 has issued license folio L-1001") {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO licenses (folio, patientId, doctorId, diagnosis, startDate, days, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(['L-1001', '11111111-1', 'DR-1', 'Gripe', '2025-09-01', 7, 'issued'], (err) => {
      if (err) console.error('Error setting pact state:', err.message);
    });
  } else if (state === "no licenses for patient 22222222-2") {
    const stmt = db.prepare(`DELETE FROM licenses WHERE patientId = ?`);
    stmt.run(['22222222-2'], (err) => {
      if (err) console.error('Error setting pact state:', err.message);
    });
  } else if (state === "license L-404 does not exist") {
    const stmt = db.prepare(`DELETE FROM licenses WHERE folio = ?`);
    stmt.run(['L-404'], (err) => {
      if (err) console.error('Error setting pact state:', err.message);
    });
  } else if (state === "issued license days>0 is creatable") {
    // No action needed
  }

  res.json({ ok: true });
});

// Inicializar base de datos y servidor
async function startServer() {
  try {
    await initDatabase();
    
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log('tareatmicroproveedor (Licencias) escuchando en puerto', PORT);
    });
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('Cerrando servicio de Licencias...');
  try {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database closed successfully');
        }
      });
    }
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error cerrando servidor:', error.message);
    process.exit(1);
  }
});

// Iniciar servidor
startServer();



