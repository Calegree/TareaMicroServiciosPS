const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

// Configuración del mock server
const provider = new Pact({
  consumer: 'Validador Aseguradora',
  provider: 'Licencias',
  port: 3004,
  host: '0.0.0.0',
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO',
  spec: 2
});

describe('Validador Aseguradora - Licencias API', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('GET /licenses/{folio}/verify', () => {
    describe('when license exists and is valid', () => {
      beforeEach(() => {
        return provider
          .addInteraction({
            state: 'patient 11111111-1 has issued license folio L-1001',
            uponReceiving: 'a request to verify an existing license',
            withRequest: {
              method: 'GET',
              path: '/licenses/L-1001/verify'
            },
            willRespondWith: {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              },
              body: {
                valid: true
              }
            }
          });
      });

      it('should return valid true for existing license', async () => {
        const response = await axios.get('http://0.0.0.0:3004/licenses/L-1001/verify');
        
        expect(response.status).toBe(200);
        expect(response.data).toMatchObject({
          valid: true
        });
      });
    });

    describe('when license does not exist', () => {
      beforeEach(() => {
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
              headers: {
                'Content-Type': 'application/json'
              },
              body: {
                valid: false
              }
            }
          });
      });

      it('should return valid false for non-existing license', async () => {
        try {
          await axios.get('http://0.0.0.0:3004/licenses/L-404/verify');
        } catch (error) {
          expect(error.response.status).toBe(404);
          expect(error.response.data).toMatchObject({
            valid: false
          });
        }
      });
    });
  });

  describe('GET /licenses?patientId={id}', () => {
    describe('when patient has licenses', () => {
      beforeEach(() => {
        return provider
          .addInteraction({
            state: 'patient 11111111-1 has issued license folio L-1001',
            uponReceiving: 'a request for patient licenses from insurer',
            withRequest: {
              method: 'GET',
              path: '/licenses',
              query: {
                patientId: '11111111-1'
              }
            },
            willRespondWith: {
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
            }
          });
      });

      it('should return patient licenses for insurer', async () => {
        const response = await axios.get('http://0.0.0.0:3004/licenses?patientId=11111111-1');
        
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
          .addInteraction({
            state: 'no licenses for patient 22222222-2',
            uponReceiving: 'a request for patient with no licenses from insurer',
            withRequest: {
              method: 'GET',
              path: '/licenses',
              query: {
                patientId: '22222222-2'
              }
            },
            willRespondWith: {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              },
              body: []
            }
          });
      });

      it('should return empty array for patient with no licenses', async () => {
        const response = await axios.get('http://0.0.0.0:3004/licenses?patientId=22222222-2');
        
        expect(response.status).toBe(200);
        expect(response.data).toEqual([]);
      });
    });
  });
});
