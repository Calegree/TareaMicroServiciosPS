const axios = require('axios');

class LicensesService {
  constructor() {
    this.baseURL = process.env.LICENSES_SERVICE_URL || 'http://licencias:3000';
    this.timeout = 5000;
  }

  async getLicensesByPatientId(patientId) {
    try {
      console.log(`Calling licenses service for patient: ${patientId}`);
      
      const response = await axios.get(`${this.baseURL}/licenses?patientId=${patientId}`, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Licenses service response: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error('Error calling licenses service:', error.message);
      
      // Clasificar el tipo de error
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('LICENSES_SERVICE_UNAVAILABLE');
      } else if (error.response) {
        // El servicio respondió pero con error
        throw new Error(`LICENSES_SERVICE_ERROR: ${error.response.status}`);
      } else {
        // Error de timeout u otro
        throw new Error('LICENSES_SERVICE_TIMEOUT');
      }
    }
  }

  async verifyLicense(folio) {
    try {
      console.log(`Verifying license: ${folio}`);
      
      const response = await axios.get(`${this.baseURL}/licenses/${folio}/verify`, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error verifying license:', error.message);
      throw error;
    }
  }
}

module.exports = new LicensesService();
