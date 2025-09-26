const database = require('../database/database');
const licensesService = require('./licensesService');

class PatientService {
  validatePatientId(patientId) {
    // Validar formato del RUT chileno (básico)
    const rutRegex = /^\d{8}-\d$/;
    return rutRegex.test(patientId);
  }

  async getPatientWithLicenses(patientId) {
    try {
      // Validar formato del patientId
      if (!this.validatePatientId(patientId)) {
        throw new Error('INVALID_PATIENT_ID');
      }

      // Buscar paciente en la base de datos local
      const patient = await database.getPatientById(patientId);
      if (!patient) {
        throw new Error('PATIENT_NOT_FOUND');
      }

      // Obtener licencias del servicio de Licencias
      const licenses = await licensesService.getLicensesByPatientId(patientId);

      return {
        patient: {
          id: patient.id,
          name: patient.name,
          email: patient.email
        },
        licenses: licenses || [],
        total: licenses ? licenses.length : 0
      };
    } catch (error) {
      console.error('Error in getPatientWithLicenses:', error.message);
      throw error;
    }
  }
}

module.exports = new PatientService();
