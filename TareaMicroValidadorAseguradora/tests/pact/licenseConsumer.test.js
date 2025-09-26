const { Pact } = require('@pact-foundation/pact');
const { Matchers } = require('@pact-foundation/pact');
const axios = require('axios');

const { like, eachLike } = Matchers;

describe('Validador Aseguradora - Consumer Tests', () => {
  let provider;
  let baseURL;

  beforeAll(() => {
    provider = new Pact({
      consumer: 'Validador Aseguradora',
      provider: 'Licencias',
      port: 3001,
      log: './pacts/logs/license-consumer.log',
      dir: './pacts',
      logLevel: 'INFO',
      spec: 2
    });

    return provider.setup().then(() => {
      baseURL = `http://localhost:${provider.mockService.port}`;
    });
  });

  afterAll(() => {
    return provider.finalize();
  });

  describe('Verificar licencia existente', () => {
    beforeAll(() => {
      return provider
        .addInteraction({
          state: 'issued license L-1001 exists',
          uponReceiving: 'a request to verify an existing license',
          withRequest: {
            method: 'GET',
            path: '/licenses/L-1001/verify'
          },
          willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {
              valid: true
            }
          }
        });
    });

    it('should return valid: true for existing issued license', async () => {
      const response = await axios.get(`${baseURL}/licenses/L-1001/verify`);
      expect(response.status).toBe(200);
      expect(response.data.valid).toBe(true);
    });
  });

  describe('Verificar licencia inexistente', () => {
    beforeAll(() => {
      return provider
        .addInteraction({
          state: 'license L-404 does not exist',
          uponReceiving: 'a request to verify a non-existing license',
          withRequest: {
            method: 'GET',
            path: '/licenses/L-404/verify'
          },
          willRespondWith: {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
            body: {
              valid: false
            }
          }
        });
    });

    it('should return valid: false for non-existing license', async () => {
      try {
        await axios.get(`${baseURL}/licenses/L-404/verify`);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.valid).toBe(false);
      }
    });
  });

  describe('Obtener licencias de paciente con licencias', () => {
    beforeAll(() => {
      return provider
        .addInteraction({
          state: 'patient 11111111-1 has issued license folio L-1001',
          uponReceiving: 'a request for patient licenses',
          withRequest: {
            method: 'GET',
            path: '/licenses',
            query: { patientId: '11111111-1' }
          },
          willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: eachLike({
              folio: like('L-1001'),
              patientId: like('11111111-1'),
              doctorId: like('D-001'),
              diagnosis: like('Gripe'),
              startDate: like('2024-01-01'),
              days: like(7),
              status: like('issued')
            })
          }
        });
    });

    it('should return list of licenses for patient', async () => {
      const response = await axios.get(`${baseURL}/licenses?patientId=11111111-1`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0]).toHaveProperty('folio');
      expect(response.data[0]).toHaveProperty('patientId', '11111111-1');
    });
  });

  describe('Obtener licencias de paciente sin licencias', () => {
    beforeAll(() => {
      return provider
        .addInteraction({
          state: 'no licenses for patient 22222222-2',
          uponReceiving: 'a request for patient with no licenses',
          withRequest: {
            method: 'GET',
            path: '/licenses',
            query: { patientId: '22222222-2' }
          },
          willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: []
          }
        });
    });

    it('should return empty list for patient with no licenses', async () => {
      const response = await axios.get(`${baseURL}/licenses?patientId=22222222-2`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });
  });
});
