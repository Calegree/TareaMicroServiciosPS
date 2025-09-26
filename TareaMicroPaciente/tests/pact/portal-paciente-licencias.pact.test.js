const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

// Configuración del mock server
const provider = new Pact({
  consumer: 'Portal Paciente',
  provider: 'Licencias',
  port: 3002,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO',
  spec: 2
});

describe('Portal Paciente - Licencias API', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('GET /licenses?patientId={id}', () => {
    describe('when patient has licenses', () => {
      beforeEach(() => {
        return provider
          .given('patient 11111111-1 has issued license folio L-1001')
          .uponReceiving('a request for patient licenses')
          .withRequest({
            method: 'GET',
            path: '/licenses',
            query: 'patientId=11111111-1'
          })
          .willRespondWith({
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: [
              {
                folio: 'L-1001',
                patientId: '11111111-1',
                doctorId: 'D-001',
                diagnosis: 'Gripe común',
                startDate: '2024-01-15',
                days: 7,
                status: 'issued'
              }
            ]
          });
      });

      it('should return patient licenses', async () => {
        const response = await axios.get('http://localhost:3002/licenses?patientId=11111111-1');
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
        expect(response.data[0]).toMatchObject({
          folio: 'L-1001',
          patientId: '11111111-1',
          status: 'issued'
        });
      });
    });

    describe('when patient has no licenses', () => {
      beforeEach(() => {
        return provider
          .given('no licenses for patient 22222222-2')
          .uponReceiving('a request for patient with no licenses')
          .withRequest({
            method: 'GET',
            path: '/licenses',
            query: 'patientId=22222222-2'
          })
          .willRespondWith({
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: []
          });
      });

      it('should return empty array', async () => {
        const response = await axios.get('http://localhost:3002/licenses?patientId=22222222-2');
        
        expect(response.status).toBe(200);
        expect(response.data).toEqual([]);
      });
    });
  });
});
