const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const licenseRoutes = require('./routes/licenses');
const patientRoutes = require('./routes/patients');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas
app.use('/insurer', licenseRoutes);
app.use('/insurer', patientRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    service: 'Validador Aseguradora',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Validador Aseguradora escuchando en http://localhost:${PORT}`);
});

module.exports = app;