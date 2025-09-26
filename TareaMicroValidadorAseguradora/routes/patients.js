const express = require('express');
const licenseService = require('../services/licenseService');
const router = express.Router();

// GET /insurer/patients/{patientId}/licenses
router.get('/patients/:patientId/licenses', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    if (!patientId) {
      return res.status(400).json({ 
        error: 'PATIENT_ID_REQUIRED',
        message: 'El ID del paciente es requerido' 
      });
    }

    const result = await licenseService.getPatientLicenses(patientId);
    
    if (!result.success) {
      return res.status(500).json({ 
        error: 'SERVICE_UNAVAILABLE',
        message: 'Error al conectar con el servicio de licencias' 
      });
    }

    res.json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
