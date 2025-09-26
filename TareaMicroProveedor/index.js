const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');


const app = express();
app.use(bodyParser.json());
const generateFolio = () => `L-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;


const db = new Database('./db/licencias.db');


db.exec(`
  CREATE TABLE IF NOT EXISTS licenses (
    folio TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    doctorId TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    startDate TEXT NOT NULL,
    days INTEGER NOT NULL,
    status TEXT NOT NULL
  );
`);


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
  stmt.run(folio, patientId, doctorId, diagnosis, startDate, days, "issued");

  const license = { folio, patientId, doctorId, diagnosis, startDate, days, status: "issued" };
  res.status(201).json(license);
});

// GET /licenses/{folio}
app.get('/licenses/:folio', (req, res) => {
  const { folio } = req.params;
  const stmt = db.prepare(`SELECT * FROM licenses WHERE folio = ?`);
  const lic = stmt.get(folio);

  if (!lic) return res.status(404).json({ error: "NOT_FOUND" });
  res.json(lic);
});

// GET /licenses?patientId=...
app.get('/licenses', (req, res) => {
  const { patientId } = req.query;
  let rows;
  if (patientId) {
    const stmt = db.prepare(`SELECT * FROM licenses WHERE patientId = ?`);
    rows = stmt.all(patientId);
  } else {
    rows = db.prepare(`SELECT * FROM licenses`).all();
  }
  res.json(rows);
});

// GET /licenses/{folio}/verify
app.get('/licenses/:folio/verify', (req, res) => {
  const { folio } = req.params;
  const stmt = db.prepare(`SELECT * FROM licenses WHERE folio = ?`);
  const lic = stmt.get(folio);

  if (!lic) return res.status(404).json({ valid: false });
  const valid = lic.status === 'issued' && lic.days > 0;
  res.json({ valid });
});

// Provider States para Pact
app.post('/_pactState', (req, res) => {
  const { state } = req.body || {};

  if (state === "patient 11111111-1 has issued license folio L-1001") {
    db.prepare(`
      INSERT OR REPLACE INTO licenses (folio, patientId, doctorId, diagnosis, startDate, days, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'L-1001',
      '11111111-1',
      'DR-1',
      'Gripe',
      '2025-09-01',
      7,
      'issued'
    );
  } else if (state === "no licenses for patient 22222222-2") {
    db.prepare(`DELETE FROM licenses WHERE patientId = ?`).run('22222222-2');
  } else if (state === "license L-404 does not exist") {
    db.prepare(`DELETE FROM licenses WHERE folio = ?`).run('L-404');
  } else if (state === "issued license days>0 is creatable") {
    
  }

  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('tareatmicroproveedor (Licencias) escuchando en puerto', PORT);
});



