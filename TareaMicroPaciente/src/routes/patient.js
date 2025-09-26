const express = require('express');
const patientService = require('../services/patientService');
const { errorHandler } = require('../middleware/errorHandler');

const router = express.Router();

// GET /patient/:patientId/licenses
router.get('/:patientId/licenses', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const result = await patientService.getPatientWithLicenses(patientId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /patient/:patientId (información básica del paciente)
router.get('/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    if (!patientService.validatePatientId(patientId)) {
      return res.status(400).json({
        error: 'INVALID_PATIENT_ID',
        message: 'Patient ID must be in format 12345678-9'
      });
    }

    const patient = await database.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({
        error: 'PATIENT_NOT_FOUND',
        message: 'Patient not found in our system'
      });
    }

    res.json({
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;