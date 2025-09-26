const express = require('express');
const cors = require('cors');
const database = require('./src/database/database');
const patientRoutes = require('./src/routes/patient');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/patient', patientRoutes);

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'portal-paciente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Endpoint de información del servicio
app.get('/', (req, res) => {
  res.json({
    service: 'Portal Paciente',
    version: '1.0.0',
    description: 'Microservicio para consultar licencias médicas de pacientes',
    endpoints: {
      'GET /patient/:patientId/licenses': 'Obtener licencias de un paciente',
      'GET /patient/:patientId': 'Obtener información básica de un paciente',
      'GET /health': 'Estado del servicio'
    }
  });
});

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializar base de datos y servidor
async function startServer() {
  try {
    await database.connect();
    
    app.listen(PORT, () => {
      console.log(`Portal Paciente escuchando en http://localhost:${PORT}`);
      console.log(`Conectando a servicio de Licencias en: ${process.env.LICENSES_SERVICE_URL || 'http://licencias:3000'}`);
    });
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('Cerrando Portal Paciente...');
  try {
    await database.close();
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error cerrando servidor:', error.message);
    process.exit(1);
  }
});

// Iniciar servidor
startServer();

module.exports = app;
