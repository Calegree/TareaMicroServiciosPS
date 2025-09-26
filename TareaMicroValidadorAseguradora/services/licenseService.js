const axios = require('axios');

class LicenseService {
  constructor() {
    this.baseURL = process.env.LICENSES_SERVICE_URL || 'http://localhost:3001';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async verifyLicense(folio) {
    try {
      const response = await this.client.get(`/licenses/${folio}/verify`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: { valid: false }
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPatientLicenses(patientId) {
    try {
      const response = await this.client.get(`/licenses?patientId=${patientId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new LicenseService();
